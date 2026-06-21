// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/FundXEscrow.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSD is ERC20 {
    constructor() ERC20("Mock USD", "mUSD") {}
    function mint(address to, uint256 amt) external { _mint(to, amt); }
}

contract FundXEscrowTest is Test {
    FundXEscrow esc;
    MockUSD token;

    address owner   = address(this);
    address creator = makeAddr("creator");
    address donorA  = makeAddr("donorA");
    address donorB  = makeAddr("donorB");

    uint8 constant FLEXIBLE = 0;
    uint8 constant AON      = 1;
    uint256 constant DAY    = 1 days;

    function setUp() public {
        esc = new FundXEscrow();           // owner == this test contract
        token = new MockUSD();
        esc.setAllowedToken(address(token), true);

        token.mint(donorA, 1_000 ether);
        token.mint(donorB, 1_000 ether);
        vm.deal(donorA, 100 ether);
        vm.deal(donorB, 100 ether);
    }

    // ---------- helpers ----------
    function _createNative(uint256 goal, uint8 model) internal returns (uint256 id) {
        vm.prank(creator);
        id = esc.createCampaign(address(0), goal, DAY, model);
    }
    function _createErc20(uint256 goal, uint8 model) internal returns (uint256 id) {
        vm.prank(creator);
        id = esc.createCampaign(address(token), goal, DAY, model);
    }

    // ---------- NATIVE RAIL ----------
    function test_native_flexible_withdraw() public {
        uint256 id = _createNative(10 ether, FLEXIBLE);
        assertTrue(esc.isNative(id));

        vm.prank(donorA);
        esc.donate{value: 4 ether}(id, 4 ether);
        vm.prank(donorB);
        esc.donate{value: 3 ether}(id, 3 ether);

        vm.warp(block.timestamp + DAY + 1);

        uint256 raised = 7 ether;
        uint256 fee = esc.calculateFee(raised);
        uint256 ownerBefore = owner.balance;
        uint256 creatorBefore = creator.balance;

        vm.prank(creator);
        esc.withdraw(id);

        assertEq(owner.balance - ownerBefore, fee);
        assertEq(creator.balance - creatorBefore, raised - fee);
    }

    function test_native_aon_refund_when_goal_missed() public {
        uint256 id = _createNative(100 ether, AON);
        vm.prank(donorA);
        esc.donate{value: 5 ether}(id, 5 ether);

        vm.warp(block.timestamp + DAY + 1);

        // creator cannot withdraw (goal missed)
        vm.prank(creator);
        vm.expectRevert(FundXEscrow.GoalNotReached.selector);
        esc.withdraw(id);

        // donor refunds full amount, no fee
        uint256 before = donorA.balance;
        vm.prank(donorA);
        esc.claimRefund(id);
        assertEq(donorA.balance - before, 5 ether);

        // double refund blocked
        vm.prank(donorA);
        vm.expectRevert(FundXEscrow.NotDonor.selector);
        esc.claimRefund(id);
    }

    function test_native_wrong_value_reverts() public {
        uint256 id = _createNative(10 ether, FLEXIBLE);
        vm.prank(donorA);
        vm.expectRevert(FundXEscrow.WrongAsset.selector);
        esc.donate{value: 3 ether}(id, 4 ether); // mismatch
    }

    // ---------- ERC20 RAIL ----------
    function test_erc20_aon_success_withdraw() public {
        uint256 id = _createErc20(10 ether, AON);
        assertFalse(esc.isNative(id));

        vm.startPrank(donorA);
        token.approve(address(esc), 10 ether);
        esc.donate(id, 10 ether);
        vm.stopPrank();

        vm.warp(block.timestamp + DAY + 1);

        uint256 fee = esc.calculateFee(10 ether);
        vm.prank(creator);
        esc.withdraw(id);

        assertEq(token.balanceOf(owner), fee);
        assertEq(token.balanceOf(creator), 10 ether - fee);
    }

    function test_erc20_rejects_value() public {
        uint256 id = _createErc20(10 ether, FLEXIBLE);
        vm.startPrank(donorA);
        token.approve(address(esc), 5 ether);
        vm.expectRevert(FundXEscrow.WrongAsset.selector);
        esc.donate{value: 1 ether}(id, 5 ether);
        vm.stopPrank();
    }

    function test_disallowed_token_reverts() public {
        MockUSD bad = new MockUSD();
        vm.prank(creator);
        vm.expectRevert(FundXEscrow.TokenNotAllowed.selector);
        esc.createCampaign(address(bad), 10 ether, DAY, FLEXIBLE);
    }

    // ---------- GUARD RAILS ----------
    function test_withdraw_before_deadline_reverts() public {
        uint256 id = _createNative(1 ether, FLEXIBLE);
        vm.prank(donorA);
        esc.donate{value: 1 ether}(id, 1 ether);
        vm.prank(creator);
        vm.expectRevert(FundXEscrow.StillActive.selector);
        esc.withdraw(id);
    }

    function test_non_creator_cannot_withdraw() public {
        uint256 id = _createNative(1 ether, FLEXIBLE);
        vm.prank(donorA);
        esc.donate{value: 1 ether}(id, 1 ether);
        vm.warp(block.timestamp + DAY + 1);
        vm.prank(donorB);
        vm.expectRevert(FundXEscrow.NotCreator.selector);
        esc.withdraw(id);
    }

    function test_only_owner_admin() public {
        vm.prank(creator);
        vm.expectRevert(FundXEscrow.NotOwner.selector);
        esc.setAllowedToken(address(token), false);
    }

    function test_double_withdraw_reverts() public {
        uint256 id = _createNative(1 ether, FLEXIBLE);
        vm.prank(donorA);
        esc.donate{value: 1 ether}(id, 1 ether);
        vm.warp(block.timestamp + DAY + 1);
        vm.startPrank(creator);
        esc.withdraw(id);
        vm.expectRevert(FundXEscrow.AlreadyWithdrawn.selector);
        esc.withdraw(id);
        vm.stopPrank();
    }

    receive() external payable {} // owner receives native fees
}
