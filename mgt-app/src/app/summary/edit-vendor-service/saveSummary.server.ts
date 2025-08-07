"use server"
import { prisma } from "@/lib/prisma"
import { ChecklistStatusEnum, AntisocialCheckStatus } from "./EditVendorServiceSummaryClient"

export type SaveSummaryRow = {
  id?: number
  client: string
  vendor: string
  service: string
  antisocial: AntisocialCheckStatus | ""
  common: ChecklistStatusEnum | ""
  detail: ChecklistStatusEnum | ""
  _action?: "delete" | undefined
}

function toAntisocialEnum(val: string): AntisocialCheckStatus | undefined {
  if (!val) return undefined
  if ([
    "unchecked",
    "checked",
    "check_exception",
    "monitor_checked",
  ].includes(val)) return val as AntisocialCheckStatus
  return undefined
}
function toChecklistEnum(val: string): ChecklistStatusEnum | undefined {
  if (!val) return undefined
  if ([
    "not_created",
    "completed",
    "not_required",
    "is_examined",
  ].includes(val)) return val as ChecklistStatusEnum
  return undefined
}

export async function saveVendorServiceSummary(formData: FormData) {
  const rowsJson = formData.get("rows") as string
  if (!rowsJson) throw new Error("No data")
  const rows: SaveSummaryRow[] = JSON.parse(rowsJson)

  // 1. すべての行をバリデーション。1つでも不備があればDB処理しない
  for (const row of rows) {
    if (row._action !== "delete" && (!row.client || !row.vendor || !row.service)) {
      throw new Error("Client, Vendor, Service are required.")
    }
  }

  // トランザクションでまとめて処理
  await prisma.$transaction(async (tx) => {
    // 2. 削除処理
    for (const row of rows) {
      if (row._action === "delete" && row.id) {
        await tx.summaryVendorService.delete({ where: { id: row.id } })
      }
    }
    // 3. insert or update
    for (const row of rows) {
      if (row._action === "delete") continue
      // Clientは既存のみ選択なので、必ず存在する
      const client = await tx.client.findUnique({ where: { name: row.client } })
      if (!client) throw new Error(`Client not found: ${row.client}`)

      // Vendor: なければ作成
      let vendor = await tx.vendor.findUnique({ where: { name: row.vendor } })
      if (!vendor) {
        vendor = await tx.vendor.create({ data: { name: row.vendor } })
      }
      // Service: なければ作成
      let service = await tx.vendorService.findUnique({ where: { name: row.service } })
      if (!service) {
        service = await tx.vendorService.create({ data: { name: row.service, vendorId: vendor.id } })
      }
      // SummaryVendorService: clientId+vendorServiceId組が既にあればupdate、なければinsert
      const summary = await tx.summaryVendorService.findUnique({
        where: {
          clientId_vendorServiceId: {
            clientId: client.id,
            vendorServiceId: service.id,
          },
        },
      })
      if (!summary) {
        await tx.summaryVendorService.create({
          data: {
            clientId: client.id,
            vendorId: vendor.id,
            vendorServiceId: service.id,
            vendorAntisocialCheckStatus: toAntisocialEnum(row.antisocial),
            vendorCommonChecklistStatus: toChecklistEnum(row.common),
            vendorDetailChecklistStatus: toChecklistEnum(row.detail),
            cycleId: 1,
          },
        })
      } else {
        await tx.summaryVendorService.update({
          where: { id: summary.id },
          data: {
            vendorAntisocialCheckStatus: toAntisocialEnum(row.antisocial),
            vendorCommonChecklistStatus: toChecklistEnum(row.common),
            vendorDetailChecklistStatus: toChecklistEnum(row.detail),
          },
        })
      }
    }
  })
  return { ok: true }
}
