import React from "react"

// ステータス値と色のマッピング
const statusColorMap: Record<string, string> = {
  // チェックリストステータス
  '未作成': '#ef4444',    // 赤
  '完了': '#f59e0b',      // 黄色に変更
  '不要': '#6b7280',      // グレー
  '精査済': '#10b981',    // 緑
  'not_created': '#ef4444',
  'completed': '#f59e0b',  // 黄色に変更
  'not_required': '#6b7280',
  'is_examined': '#10b981',
  // 反社会的勢力チェックステータス
  '未確認': '#ef4444',    // 赤
  '確認済': '#10b981',    // 緑
  '省略先': '#4b5563',    // ダークグレー
  'モニター済': '#3b82f6', // 青に変更
  'unchecked': '#ef4444',
  'checked': '#10b981',
  'check_exception': '#4b5563',
  'monitor_checked': '#3b82f6', // 青に変更
  // デフォルト
  'default': '#e5e7eb'
}

export function Badge({ value }: { value: string }) {
  // 値から色を取得（見つからない場合はデフォルトのグレー）
  const color = statusColorMap[value] || statusColorMap['default']
  
  // 絵文字風のスタイル
  const emojiStyle = {
    display: 'inline-block',
    width: '1.2em',
    height: '1.2em',
    borderRadius: '50%',
    backgroundColor: color,
    boxShadow: '0 0 1px rgba(0,0,0,0.3)',
    position: 'relative',
    overflow: 'hidden',
  } as const;

  // 光沢のための疑似要素
  const highlightStyle = {
    content: '""',
    position: 'absolute',
    top: '15%',
    left: '20%',
    width: '30%',
    height: '30%',
    background: 'rgba(255, 255, 255, 0.5)',
    borderRadius: '50%',
    transform: 'rotate(30deg)',
  } as const;

  return (
    <span style={emojiStyle}>
      <span style={highlightStyle} />
    </span>
  )
}
