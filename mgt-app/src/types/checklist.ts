import { AntisocialCheckStatus, ChecklistStatusEnum } from "@prisma/client"

// チェックリストのステータスオプション
export const checklistStatusOptions = [
  { value: ChecklistStatusEnum.not_created, label: "未作成", color: "#ef4444" },
  { value: ChecklistStatusEnum.completed, label: "完了", color: "#10b981" },
  { value: ChecklistStatusEnum.not_required, label: "不要", color: "#6b7280" },
  { value: ChecklistStatusEnum.is_examined, label: "精査済", color: "#10b981" },
] as const

// 反社会的勢力チェックのステータスオプション
export const antisocialStatusOptions = [
  { value: AntisocialCheckStatus.unchecked, label: "未確認", color: "#ef4444" },
  { value: AntisocialCheckStatus.checked, label: "確認済", color: "#10b981" },
  { value: AntisocialCheckStatus.check_exception, label: "省略先", color: "#4b5563" },
  { value: AntisocialCheckStatus.monitor_checked, label: "モニター済", color: "#f59e0b" },
] as const

// 型エクスポート
export { AntisocialCheckStatus, ChecklistStatusEnum }

// ユーティリティ関数
export function getChecklistStatusLabel(value: ChecklistStatusEnum): string {
  return checklistStatusOptions.find(opt => opt.value === value)?.label || String(value)
}

export function getAntisocialStatusLabel(value: AntisocialCheckStatus): string {
  return antisocialStatusOptions.find(opt => opt.value === value)?.label || String(value)
}

export function getChecklistStatusColor(value: ChecklistStatusEnum): string {
  return checklistStatusOptions.find(opt => opt.value === value)?.color || "#6b7280"
}

export function getAntisocialStatusColor(value: AntisocialCheckStatus): string {
  return antisocialStatusOptions.find(opt => opt.value === value)?.color || "#6b7280"
}
