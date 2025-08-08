"use client"
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts"

const COLORS = ["#22c55e", "#ef4444", "#f59e42"]

export type CompliancePieChartProps = {
  checked: number
  unchecked: number
  checkException: number
}

export default function CompliancePieChart({ checked, unchecked, checkException }: CompliancePieChartProps) {
  const pieData = [
    { name: "Checked", value: checked },
    { name: "Unchecked", value: unchecked },
    { name: "Exception", value: checkException },
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
