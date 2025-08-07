import { fetchClientOptions, fetchOutsourcingPartnerOptions, fetchOutsourcingServiceOptions, fetchCspOptions, fetchCspServiceOptions } from "./fetchOptions.server"
import { prisma } from "@/lib/prisma"
import EditOutsourcingCspServiceSummaryClient from "./EditOutsourcingCspServiceSummaryClient"


export default async function EditOutsourcingCspServiceSummaryPage() {
  type Option = { id: number; name: string }
  const [clients, partners, services, csps, cspServices, summaryRows] = await Promise.all([
    fetchClientOptions(),
    fetchOutsourcingPartnerOptions(),
    fetchOutsourcingServiceOptions(),
    fetchCspOptions(),
    fetchCspServiceOptions(),
    prisma.summaryOutsourcingServiceCspService.findMany({
      select: {
        id: true,
        clientId: true,
        outsourcingPartnerId: true,
        outsourcingServiceId: true,
        cspId: true,
        cspServiceId: true,
        outsourcingPartner: { select: { name: true } },
        outsourcingService: { select: { name: true } },
        csp: { select: { name: true } },
        cspService: { select: { name: true } },
        outsourcingPartnerAntisocialCheckStatus: true,
        cspAntisocialCheckStatus: true,
        cspServiceCommonChecklistStatus: true,
        cspServiceDetailChecklistStatus: true,
      },
      orderBy: { id: "asc" },
    }),
  ])

  const initialRows = summaryRows.map(row => ({
    id: row.id,
    client: clients.find(c => c.id === row.clientId)?.name ?? "",
    partner: row.outsourcingPartner?.name ?? "",
    service: row.outsourcingService?.name ?? "",
    csp: row.csp?.name ?? "",
    cspService: row.cspService?.name ?? "",
    partnerAntisocial: row.outsourcingPartnerAntisocialCheckStatus,
    partnerCommon: row.cspServiceCommonChecklistStatus,
    partnerDetail: row.cspServiceDetailChecklistStatus,
    cspAntisocial: row.cspAntisocialCheckStatus,
    cspCommon: row.cspServiceCommonChecklistStatus,
    cspDetail: row.cspServiceDetailChecklistStatus,
  }))

  return <EditOutsourcingCspServiceSummaryClient
    clientOptions={clients}
    partnerOptions={partners}
    serviceOptions={services}
    cspOptions={csps}
    cspServiceOptions={cspServices}
    initialRows={initialRows}
  />
}
