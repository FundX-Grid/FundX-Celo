use client
export function ChainToggleSwitch({ isStacksMode, onToggle }: { isStacksMode: boolean; onToggle: () => void }) {
  const getBackgroundStyle = (isStacksMode: boolean) => ({
    transition: "background 700ms ease",
    background: isStacksMode ? "linear-gradient(to right, #FCFF52, #FACC15)" : "linear-gradient(to right, #60A5FA, #3B82F6)"
  })

  const getToggleStyle = (isStacksMode: boolean) => ({
    transition: "transform 650ms cubic-bezier(0.4, 0, 0.2, 1)",
    transform: isStacksMode ? "translateX(48px)" : "translateX(0px)",
    boxShadow: "0 2px 10px 0 rgba(0,0,0,0.12)"
  })

  return (
    <span className="inline-flex align-middle ml-2">
      <button onClick={onToggle} aria-label="Toggle between MiniPay and Celo" className="relative inline-flex items-center cursor-pointer focus:outline-none" style={{ WebkitTapHighlightColor: "transparent" }}>
        <div style={getBackgroundStyle(isStacksMode)} className="w-24 h-12 rounded-full p-1">
          <div style={getToggleStyle(isStacksMode)} className="w-10 h-10 bg-white rounded-full" />
        </div>
      </button>
    </span>
  )
}