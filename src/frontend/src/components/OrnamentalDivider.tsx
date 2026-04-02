export default function OrnamentalDivider({
  className = "",
}: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 my-8 ${className}`}>
      <div
        className="flex-1 h-px"
        style={{
          background: "linear-gradient(to right, transparent, #C9A46A)",
        }}
      />
      <div className="flex items-center gap-2">
        <span className="text-xl" style={{ color: "#C9A46A" }}>
          ✦
        </span>
        <span className="text-2xl" style={{ color: "#C9A46A" }}>
          ❋
        </span>
        <span className="text-xl" style={{ color: "#C9A46A" }}>
          ✦
        </span>
      </div>
      <div
        className="flex-1 h-px"
        style={{ background: "linear-gradient(to left, transparent, #C9A46A)" }}
      />
    </div>
  );
}
