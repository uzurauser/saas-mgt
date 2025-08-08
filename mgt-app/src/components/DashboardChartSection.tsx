"use client"
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts"

// not_created: 赤, completed: 青, not_required: グレー, is_examined: 緑
// Enum値に対応した色マップ
const STATUS_COLORS: Record<string, string> = {
  not_created: "#ef4444", // 赤
  completed: "#3b82f6", // 青
  not_required: "#a3a3a3", // グレー
  is_examined: "#22c55e", // 緑
}

export type DashboardChartSectionProps = {
  completed: number
  notCreated: number
  notRequired: number
  isExamined: number
}

export default function DashboardChartSection({
  completed,
  notCreated,
  notRequired,
  isExamined,
}: DashboardChartSectionProps) {
  const pieData = [
    { key: "not_created", name: "Not Created", value: notCreated },
    { key: "completed", name: "Completed", value: completed },
    { key: "not_required", name: "Not Required", value: notRequired },
    { key: "is_examined", name: "Examined", value: isExamined },
  ]
  return (
    <div className="w-full flex flex-col items-center">
      <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
        Checklist Monitoring Progress
      </h3>
      <div className="flex w-full justify-center">
        <ResponsiveContainer width={700} height={400}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
              }
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry) => (
                <Cell key={entry.key} fill={STATUS_COLORS[entry.key]} />
              ))}
            </Pie>
            <Legend verticalAlign="bottom" align="center" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
