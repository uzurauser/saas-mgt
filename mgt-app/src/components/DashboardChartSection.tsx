"use client"
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts"

const COLORS = ["#22c55e", "#ef4444", "#f59e42", "#a3a3a3"]

export type DashboardChartSectionProps = {
  completed: number
  notCreated: number
  notRequired: number
  isExamined: number
}

export default function DashboardChartSection({ completed, notCreated, notRequired, isExamined }: DashboardChartSectionProps) {
  const pieData = [
    { name: "Completed", value: completed },
    { name: "Not Created", value: notCreated },
    { name: "Not Required", value: notRequired },
    { name: "Examined", value: isExamined },
  ]
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
          outerRadius={90}
          fill="#8884d8"
          dataKey="value"
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
