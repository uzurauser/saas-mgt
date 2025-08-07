"use server"
import { prisma } from "@/lib/prisma"

export type VendorServiceSummaryInput = {
  id?: number | string // 既存はnumber, 新規は"New"やstring可
  client: string
  vendor: string
  service: string
  antisocial: string
  common: string
  detail: string
}

export async function saveVendorServiceSummary(
  allRows: VendorServiceSummaryInput[]
) {
  // TODO: バリデーション
  // TODO: 既存レコード更新、新規レコード追加、不要レコード削除
  // TODO: Vendor/Service/Clientの新規作成 or 既存参照
  // 仮実装: 受け取ったデータをそのまま返す
  return { success: true, data: allRows }
}
