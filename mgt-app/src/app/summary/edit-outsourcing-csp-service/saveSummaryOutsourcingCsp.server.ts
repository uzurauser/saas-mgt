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

export async function saveOutsourcingCspServiceSummary(formData: FormData) {
  const rowsRaw = formData.get("rows")
  type Row = {
  id?: number
  client: string
  partner: string
  service: string
  csp: string
  cspService: string
  partnerAntisocial: string
  partnerCommon: string
  partnerDetail: string
  cspAntisocial: string
  cspCommon: string
  cspDetail: string
  isNew?: boolean
  _action?: "delete"
}
let rows: Row[] = []
  try {
    rows = JSON.parse(rowsRaw as string)
  } catch (e) {
    console.error('JSON parse error', e)
    throw new Error('JSON parse error: ' + e)
  }

  // 必須バリデーション
  for (const row of rows) {
    if (!row.partner || !row.service || !row.csp || !row.cspService) {
      console.error('必須項目未入力:', row)
      throw new Error('必須項目未入力')
    }
  }

  // DB参照でname→id変換
  const clients = await prisma.client.findMany()
  const partners = await prisma.outsourcingPartner.findMany()
  const services = await prisma.outsourcingService.findMany()
  const csps = await prisma.csp.findMany()
  const cspServices = await prisma.cspService.findMany()

  // 既存データ取得
  const existing = await prisma.summaryOutsourcingServiceCspService.findMany()

  // トランザクション
  await prisma.$transaction(async (tx) => {
    // 削除
    for (const ex of existing) {
      if (!rows.some(r => r.id === ex.id)) {
        await tx.summaryOutsourcingServiceCspService.delete({ where: { id: ex.id } })
      }
    }
    // 追加・更新
    for (const row of rows) {
      let partner = partners.find(p => p.name === row.partner)
      if (!partner && row.partner) {
        partner = await tx.outsourcingPartner.create({ data: { name: row.partner } })
        partners.push(partner)
      }
      let service = services.find(s => s.name === row.service)
      if (!service && row.service && partner) {
        service = await tx.outsourcingService.create({ data: { name: row.service, outsourcingPartnerId: partner.id } })
        services.push(service)
      }
      let csp = csps.find(c => c.name === row.csp)
      if (!csp && row.csp) {
        csp = await tx.csp.create({ data: { name: row.csp } })
        csps.push(csp)
      }
      let cspService = cspServices.find(s => s.name === row.cspService)
      if (!cspService && row.cspService && csp) {
        cspService = await tx.cspService.create({ data: { name: row.cspService, cspId: csp.id } })
        cspServices.push(cspService)
      }
      const partnerId = partner?.id
      const serviceId = service?.id
      const cspId = csp?.id
      const cspServiceId = cspService?.id
      // clientIdをname→id変換
      const client = clients.find(c => c.name === row.client)
      const clientId = client?.id
      if (!partnerId || !serviceId || !cspId || !cspServiceId || !clientId) {
        console.error('ID解決失敗:', { row, partnerId, serviceId, cspId, cspServiceId })
        throw new Error('ID解決失敗: 必須のIDが見つかりません')
      }
      // create時はcycleId必須、update時はcycleIdを除外
      const createData = {
        cycleId: 1, // TODO: 必要ならUIや他ロジックから取得
        clientId,
        outsourcingPartnerId: partnerId,
        outsourcingServiceId: serviceId,
        cspId,
        cspServiceId,
        outsourcingPartnerAntisocialCheckStatus: toAntisocialEnum(row.partnerAntisocial),
        cspAntisocialCheckStatus: toAntisocialEnum(row.cspAntisocial),
        cspServiceCommonChecklistStatus: toChecklistEnum(row.cspCommon),
        cspServiceDetailChecklistStatus: toChecklistEnum(row.cspDetail),
      }
      const updateData = {
        cycle: { connect: { id: 1 } },
        client: { connect: { id: clientId } },
        outsourcingPartner: { connect: { id: partnerId } },
        outsourcingService: { connect: { id: serviceId } },
        csp: { connect: { id: cspId } },
        cspService: { connect: { id: cspServiceId } },
        outsourcingPartnerAntisocialCheckStatus: toAntisocialEnum(row.partnerAntisocial),
        cspAntisocialCheckStatus: toAntisocialEnum(row.cspAntisocial),
        cspServiceCommonChecklistStatus: toChecklistEnum(row.cspCommon),
        cspServiceDetailChecklistStatus: toChecklistEnum(row.cspDetail),
      }
      // cycleIdをoptionalにしてdelete演算子の型エラーを回避
      if (row.id) {
        await tx.summaryOutsourcingServiceCspService.update({ where: { id: row.id }, data: updateData })
      } else {
        await tx.summaryOutsourcingServiceCspService.create({ data: createData })
      }
    }
  })
  redirect("/summary")
}
