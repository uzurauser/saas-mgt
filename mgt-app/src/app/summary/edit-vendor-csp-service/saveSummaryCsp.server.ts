"use server"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { AntisocialCheckStatus, ChecklistStatusEnum } from "@prisma/client"

function toAntisocialEnum(val: string): AntisocialCheckStatus {
  if (["unchecked", "checked", "check_exception", "monitor_checked"].includes(val)) {
    return val as AntisocialCheckStatus
  }
  return AntisocialCheckStatus.unchecked
}
function toChecklistEnum(val: string): ChecklistStatusEnum {
  if (["not_created", "completed", "not_required", "is_examined"].includes(val)) {
    return val as ChecklistStatusEnum
  }
  return ChecklistStatusEnum.not_created
}

export async function saveVendorCspServiceSummary(formData: FormData) {
  const rowsRaw = formData.get("rows")
  let rows: any[] = []
  try {
    rows = JSON.parse(rowsRaw as string)
  } catch (e) {
    console.error('JSON parse error', e)
    throw new Error('JSON parse error: ' + e)
  }

  // 必須バリデーション
  for (const row of rows) {
    if (!row.client || !row.vendor || !row.service || !row.csp || !row.cspService) {
      console.error('必須項目未入力:', row)
      throw new Error('必須項目未入力')
    }
  }

  // DB参照でname→id変換
  const clients = await prisma.client.findMany()
  const vendors = await prisma.vendor.findMany()
  const vendorServices = await prisma.vendorService.findMany()
  const csps = await prisma.csp.findMany()
  const cspServices = await prisma.cspService.findMany()

  // 既存データ取得
  const existing = await prisma.summaryVendorServiceCspService.findMany()

  // トランザクション
  await prisma.$transaction(async (tx) => {
    // 削除
    for (const ex of existing) {
      if (!rows.some(r => r.id === ex.id)) {
        await tx.summaryVendorServiceCspService.delete({ where: { id: ex.id } })
      }
    }
    // 追加・更新
    for (const row of rows) {
      const client = clients.find(c => c.name === row.client)
      const vendorName = row.vendor
      let vendor = vendors.find(v => v.name === vendorName)
      if (!vendor && vendorName) {
        vendor = await tx.vendor.create({ data: { name: vendorName } })
        vendors.push(vendor)
      }
      const vendorServiceName = row.service
      let vendorService = vendorServices.find(s => s.name === vendorServiceName)
      if (!vendorService && vendorServiceName && vendor) {
        vendorService = await tx.vendorService.create({ data: { name: vendorServiceName, vendorId: vendor.id } })
        vendorServices.push(vendorService)
      }
      const cspName = row.csp
      let csp = csps.find(c => c.name === cspName)
      if (!csp && cspName) {
        csp = await tx.csp.create({ data: { name: cspName } })
        csps.push(csp)
      }
      const cspServiceName = row.cspService
      let cspService = cspServices.find(s => s.name === cspServiceName)
      if (!cspService && cspServiceName && csp) {
        cspService = await tx.cspService.create({ data: { name: cspServiceName, cspId: csp.id } })
        cspServices.push(cspService)
      }
      const clientId = client?.id
      const vendorId = vendor?.id
      const vendorServiceId = vendorService?.id
      const cspId = csp?.id
      const cspServiceId = cspService?.id
      if (!clientId || !vendorId || !vendorServiceId || !cspId || !cspServiceId) {
        console.error('ID解決失敗:', { row, clientId, vendorId, vendorServiceId, cspId, cspServiceId })
        throw new Error('ID解決失敗: 必須のIDが見つかりません')
      }
      const data = {
        cycleId: 1, // TODO: 必要に応じてUIや他ロジックから取得
        clientId,
        vendorId,
        vendorServiceId,
        cspId,
        cspServiceId,
        vendorAntisocialCheckStatus: toAntisocialEnum(row.vendorAntisocial),
        vendorCommonChecklistStatus: toChecklistEnum(row.vendorCommon),
        vendorDetailChecklistStatus: toChecklistEnum(row.vendorDetail),
        cspAntisocialCheckStatus: toAntisocialEnum(row.cspAntisocial),
        cspCommonChecklistStatus: toChecklistEnum(row.cspCommon),
        cspDetailChecklistStatus: toChecklistEnum(row.cspDetail),
      }
      if (row.id) {
        await tx.summaryVendorServiceCspService.update({ where: { id: row.id }, data })
      } else {
        await tx.summaryVendorServiceCspService.create({ data })
      }
    }
  })
  redirect("/summary")
}
