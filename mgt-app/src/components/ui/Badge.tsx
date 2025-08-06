import React from "react"

const iconMap: Record<string, string> = {
  unchecked: "🔴",
  checked: "🟢",
  not_created: "🟠",
  in_progress: "🟡",
  completed: "🟢",
  failed: "⚫️",
  not_required: "⚪️",
  unnecessary: "⚪️",
  monitor: "🟢👁️",
  warning: "🟠",
  error: "🔴",
  done: "🟢",
  pending: "🟡",
  unknown: "⚪️",
}

function getIcon(value: string): string {
  if (value.toLowerCase().includes("monitor")) return "🟢👁️"
  return iconMap[value] || "⚪️"
}

export function Badge({ value }: { value: string }) {
  const icon = getIcon(value)
  // オレンジ系（not_created, warning）は赤みを10%増すフィルター
  const isOrange = ["not_created", "warning"].includes(value)
  const filter = isOrange
    ? "brightness(1.15) saturate(0.6) hue-rotate(-10deg)"
    : "brightness(1.15) saturate(0.6)"
  return (
    <span
      className="inline-flex items-center justify-center"
      style={{ width: 25.3, height: 25.3, minWidth: 25.3, minHeight: 25.3, textAlign: "center", fontSize: 18, background: "none", border: "none", boxShadow: "none", filter }}
    >
      {icon}
    </span>
  )
}
