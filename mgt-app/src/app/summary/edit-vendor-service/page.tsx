import { prisma } from "@/lib/prisma"
import EditVendorServiceSummaryClient from "./EditVendorServiceSummaryClient"
import { fetchVendorOptions, fetchClientOptions, fetchServiceOptions } from "./fetchOptions.server"

export default async function EditVendorServiceSummaryPage() {
  // 既存データ取得
  const summaryRows = await prisma.summaryVendorService.findMany({
    select: {
      id: true,
      clientId: true,
      vendorId: true,
      vendorServiceId: true,
      vendorAntisocialCheckStatus: true,
      vendorCommonChecklistStatus: true,
      vendorDetailChecklistStatus: true,
      client: { select: { name: true } },
      vendor: { select: { name: true } },
      vendorService: { select: { name: true } },
    },
    orderBy: { id: "asc" },
  })
  const initialRows = summaryRows.map(row => ({
    id: row.id,
    client: row.client?.name ?? "",
    vendor: row.vendor?.name ?? "",
    service: row.vendorService?.name ?? "",
    antisocial: row.vendorAntisocialCheckStatus,
    common: row.vendorCommonChecklistStatus,
    detail: row.vendorDetailChecklistStatus,
  }))

  const vendorOptions = await fetchVendorOptions()
  const clientOptions = await fetchClientOptions()
  const serviceOptions = await fetchServiceOptions()

  return (
    <EditVendorServiceSummaryClient
      vendorOptions={vendorOptions}
      clientOptions={clientOptions}
      serviceOptions={serviceOptions}
      initialRows={initialRows}
    />
  )
}
