"use server"
import { prisma } from "@/lib/prisma"
import { ChecklistStatusEnum } from "./EditVendorServiceSummaryClient"

export type SaveSummaryRow = {
  id?: number
  client: string
  vendor: string
  service: string
  antisocial: string
  common: ChecklistStatusEnum | ""
  detail: ChecklistStatusEnum | ""
  _action?: "delete" | undefined
}

export async function saveVendorServiceSummary(formData: FormData) {
  const rowsJson = formData.get("rows") as string
  if (!rowsJson) throw new Error("No data")
  const rows: SaveSummaryRow[] = JSON.parse(rowsJson)

  for (const row of rows) {
    if (row._action !== "delete" && (!row.client || !row.vendor || !row.service)) {
      throw new Error("Client, Vendor, Service are required.")
    }
  }
  // 1. 削除処理
  for (const row of rows) {
    if (row._action === "delete" && row.id) {
      await prisma.summaryVendorService.delete({ where: { id: row.id } })
    }
  }
  // 2. insertのみ許可（重複は何もしない）
  for (const row of rows) {
    if (row._action === "delete") continue
    // Clientは既存のみ選択なので、必ず存在する
    const client = await prisma.client.findUnique({ where: { name: row.client } })
    if (!client) throw new Error(`Client not found: ${row.client}`)

    // Vendor: なければ作成
    let vendor = await prisma.vendor.findUnique({ where: { name: row.vendor } })
    if (!vendor) {
      vendor = await prisma.vendor.create({ data: { name: row.vendor } })
    }
    // Service: なければ作成
    let service = await prisma.vendorService.findUnique({ where: { name: row.service } })
    if (!service) {
      service = await prisma.vendorService.create({ data: { name: row.service, vendorId: vendor.id } })
    }
    // SummaryVendorService: clientId+vendorServiceId組が既にあればスキップ、なければinsert
    const summary = await prisma.summaryVendorService.findUnique({
      where: {
        clientId_vendorServiceId: {
          clientId: client.id,
          vendorServiceId: service.id,
        },
      },
    })
    if (!summary) {
      await prisma.summaryVendorService.create({
        data: {
          clientId: client.id,
          vendorId: vendor.id,
          vendorServiceId: service.id,
          vendorAntisocialCheckStatus: row.antisocial,
          vendorCommonChecklistStatus: row.common || null,
          vendorDetailChecklistStatus: row.detail || null,
          cycleId: 1, // TODO: 必要に応じてcycleIdを指定
        },
      })
    }
    // 既存の場合は何もしない
  }
  return { ok: true }
}
