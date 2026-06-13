"use client"

interface StatPillProps {
  label: string
  value: string
  variant?: "default" | "dark" | "accent"
}

export function StatPill({ label, value, variant = "default" }: StatPillProps) {
  const variants = {
    default: "bg-white text-[#1d1d1f]",
    dark: "bg-[#1d1d1f] text-white",
    accent: "bg-[#f5c542] text-[#1d1d1f]",
  }

  return (
    <div
      className={`flex flex-col px-5 py-3 rounded-2xl shadow-sm ${variants[variant]}`}
    >
      <span className="text-xs opacity-70">{label}</span>
      <span className="text-lg font-semibold">{value}</span>
    </div>
  )
}
