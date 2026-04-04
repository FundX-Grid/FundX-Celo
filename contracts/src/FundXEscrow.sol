// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

// ================================================================
// FUNDX ESCROW CONTRACT
// Network  : Celo Mainnet / Alfajores Testnet
// Tokens   : cUSD, USDC
// Version  : 1.0.0
// ================================================================

contract FundXEscrow {
    using SafeERC20 for IERC20;

    // -------------------------------------------------------
    // CONSTANTS
    // -------------------------------------------------------

    address public immutable owner;

    uint8 public constant FLEXIBLE       = 0;
    uint8 public constant ALL_OR_NOTHING = 1;

    uint256 public constant PLATFORM_FEE_BPS = 200;
    uint256 public constant BPS_DENOMINATOR  = 10000;

    address public constant CUSD_ADDRESS = 0x765DE816845861e75A25fCA122bb6898B8B1282a;
    address public constant USDC_ADDRESS = 0xcebA9300f2b948710d2653dD7B07f33A8B32118C;

    // -------------------------------------------------------
    // ERRORS
    // -------------------------------------------------------

    error NotFound();
    error NotCreator();
    error Inactive();
    error Expired();
    error StillActive();
    error GoalNotReached();
    error AlreadyWithdrawn();
    error InvalidAmount();
    error RefundNotAllowed();
    error NotDonor();
    error TransferFailed();
    error NotOwner();
    error TokenNotAllowed();
    error InvalidModel();

    // -------------------------------------------------------
    // EVENTS
    // -------------------------------------------------------

    event CampaignCreated(
        uint256 indexed campaignId,
        address indexed creator,
        address token,
        uint256 goal,
        uint256 deadline,
        uint8 fundingModel
    );

    event DonationReceived(
        uint256 indexed campaignId,
        address indexed donor,
        uint256 amount
    );

    event FundsWithdrawn(
        uint256 indexed campaignId,
        address indexed creator,
        uint256 net,
        uint256 fee
    );

    event RefundClaimed(
        uint256 indexed campaignId,
        address indexed donor,
        uint256 amount
    );

    event CampaignDeactivated(uint256 indexed campaignId);

    // -------------------------------------------------------
    // DATA MODEL
    // -------------------------------------------------------

    struct Campaign {
        address creator;
        address token;
        uint256 goal;
        uint256 deadline;
        uint256 totalRaised;
        bool withdrawn;
        bool active;
        uint8 fundingModel;
    }

    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => mapping(address => uint256)) public donations;
    mapping(address => bool) public allowedTokens;

    uint256 public campaignCount;

    // -------------------------------------------------------
    // CONSTRUCTOR
    // -------------------------------------------------------

    constructor() {
        owner = msg.sender;
        allowedTokens[CUSD_ADDRESS] = true;
        allowedTokens[USDC_ADDRESS] = true;
    }

    // -------------------------------------------------------
    // MODIFIERS
    // -------------------------------------------------------

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    modifier campaignExists(uint256 id) {
        if (id == 0 || id > campaignCount) revert NotFound();
        _;
    }

    // -------------------------------------------------------
    // READ FUNCTIONS
    // -------------------------------------------------------

    function getCampaign(uint256 id) external view returns (Campaign memory) {
        if (id == 0 || id > campaignCount) revert NotFound();
        return campaigns[id];
    }

    function getDonation(uint256 campaignId, address donor)
        external
        view
        returns (uint256)
    {
        return donations[campaignId][donor];
    }

    function calculateFee(uint256 amount) public pure returns (uint256) {
        return (amount * PLATFORM_FEE_BPS) / BPS_DENOMINATOR;
    }

    function calculateNet(uint256 amount) public pure returns (uint256) {
        return amount - calculateFee(amount);
    }

    function isPastDeadline(uint256 id) external view campaignExists(id) returns (bool) {
        return block.timestamp >= campaigns[id].deadline;
    }

    function isGoalReached(uint256 id) external view campaignExists(id) returns (bool) {
        Campaign memory c = campaigns[id];
        return c.totalRaised >= c.goal;
    }

    // -------------------------------------------------------
    // CREATE CAMPAIGN
    // -------------------------------------------------------

    function createCampaign(
        address token,
        uint256 goal,
        uint256 duration,
        uint8 fundingModel
    ) external returns (uint256 id) {
        if (!allowedTokens[token])                            revert TokenNotAllowed();
        if (goal == 0)                                        revert InvalidAmount();
        if (duration == 0)                                    revert InvalidAmount();
        if (fundingModel != FLEXIBLE && fundingModel != ALL_OR_NOTHING)
                                                              revert InvalidModel();

        campaignCount++;
        id = campaignCount;

        campaigns[id] = Campaign({
            creator:      msg.sender,
            token:        token,
            goal:         goal,
            deadline:     block.timestamp + duration,
            totalRaised:  0,
            withdrawn:    false,
            active:       true,
            fundingModel: fundingModel
        });

        emit CampaignCreated(id, msg.sender, token, goal, block.timestamp + duration, fundingModel);
    }

    // -------------------------------------------------------
    // DONATE
    // -------------------------------------------------------

    function donate(uint256 id, uint256 amount) external campaignExists(id) {
        Campaign storage c = campaigns[id];

        if (!c.active)                           revert Inactive();
        if (block.timestamp >= c.deadline)       revert Expired();
        if (amount == 0)                         revert InvalidAmount();

        IERC20(c.token).safeTransferFrom(msg.sender, address(this), amount);

        donations[id][msg.sender] += amount;
        c.totalRaised += amount;

        emit DonationReceived(id, msg.sender, amount);
    }

    // -------------------------------------------------------
    // WITHDRAW
    // -------------------------------------------------------

    function withdraw(uint256 id) external campaignExists(id) {
        Campaign storage c = campaigns[id];

        if (msg.sender != c.creator)             revert NotCreator();
        if (c.withdrawn)                         revert AlreadyWithdrawn();
        if (block.timestamp < c.deadline)        revert StillActive();

        if (
            c.fundingModel == ALL_OR_NOTHING &&
            c.totalRaised < c.goal
        ) revert GoalNotReached();

        uint256 raised = c.totalRaised;
        uint256 fee    = calculateFee(raised);
        uint256 net    = raised - fee;

        c.withdrawn = true;
        c.active    = false;

        IERC20(c.token).safeTransfer(owner, fee);
        IERC20(c.token).safeTransfer(c.creator, net);

        emit FundsWithdrawn(id, c.creator, net, fee);
    }

    // -------------------------------------------------------
    // CLAIM REFUND
    // -------------------------------------------------------

    function claimRefund(uint256 id) external campaignExists(id) {
        Campaign storage c = campaigns[id];

        uint256 amount = donations[id][msg.sender];

        if (c.fundingModel != ALL_OR_NOTHING)    revert RefundNotAllowed();
        if (block.timestamp < c.deadline)        revert StillActive();
        if (c.totalRaised >= c.goal)             revert RefundNotAllowed();
        if (amount == 0)                         revert NotDonor();

        donations[id][msg.sender] = 0;

        IERC20(c.token).safeTransfer(msg.sender, amount);

        emit RefundClaimed(id, msg.sender, amount);
    }

    // -------------------------------------------------------
    // ADMIN
    // -------------------------------------------------------

    function deactivateCampaign(uint256 id) external onlyOwner campaignExists(id) {
        campaigns[id].active = false;
        emit CampaignDeactivated(id);
    }

    function setAllowedToken(address token, bool allowed) external onlyOwner {
        allowedTokens[token] = allowed;
    }
}
