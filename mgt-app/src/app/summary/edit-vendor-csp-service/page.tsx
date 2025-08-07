import {
  fetchClientOptions,
  fetchVendorOptions,
  fetchServiceOptions,
  fetchCspOptions,
  fetchCspServiceOptions,
} from "./fetchOptions.server"
import { prisma } from "@/lib/prisma"
import EditVendorCspServiceSummaryClient from "./EditVendorCspServiceSummaryClient"

export default async function EditVendorCspServiceSummaryPage() {
  // 初期データ取得
  const [clients, vendors, services, csps, cspServices, summaryRows] = await Promise.all([
    fetchClientOptions(),
    fetchVendorOptions(),
    fetchServiceOptions(),
    fetchCspOptions(),
    fetchCspServiceOptions(),
    prisma.summaryVendorServiceCspService.findMany({
      select: {
        id: true,
        clientId: true,
        vendorId: true,
        vendorServiceId: true,
        cspId: true,
        cspServiceId: true,
        client: { select: { name: true } },
        vendor: { select: { name: true } },
        vendorService: { select: { name: true } },
        csp: { select: { name: true } },
        cspService: { select: { name: true } },
        vendorAntisocialCheckStatus: true,
        vendorCommonChecklistStatus: true,
        vendorDetailChecklistStatus: true,
        cspAntisocialCheckStatus: true,
        cspCommonChecklistStatus: true,
        cspDetailChecklistStatus: true,
      },
      orderBy: { id: "asc" },
    }),
  ])

  const initialRows = summaryRows.map(row => ({
    id: row.id,
    client: row.client?.name ?? "",
    vendor: row.vendor?.name ?? "",
    service: row.vendorService?.name ?? "",
    csp: row.csp?.name ?? "",
    cspService: row.cspService?.name ?? "",
    vendorAntisocial: row.vendorAntisocialCheckStatus,
    vendorCommon: row.vendorCommonChecklistStatus,
    vendorDetail: row.vendorDetailChecklistStatus,
    cspAntisocial: row.cspAntisocialCheckStatus,
    cspCommon: row.cspCommonChecklistStatus,
    cspDetail: row.cspDetailChecklistStatus,
  }))


  return <EditVendorCspServiceSummaryClient
    clientOptions={clients}
    vendorOptions={vendors}
    serviceOptions={services}
    cspOptions={csps}
    cspServiceOptions={cspServices}
    initialRows={initialRows}
  />
}
