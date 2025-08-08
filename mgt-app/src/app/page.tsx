import { prisma } from "@/lib/prisma"
import { format } from "date-fns"
import DashboardChartSection from "@/components/DashboardChartSection"

export default async function DashboardPage() {
  const [
    clientCount,
    vendorCount,
    vendorServiceCount,
    cspCount,
    cspServiceCount,
    outsourcingPartnerCount,
    outsourcingServiceCount,
    completed,
    notCreated,
    notRequired,
    isExamined,
    latestUpdate,
  ] = await Promise.all([
    prisma.client.count(),
    prisma.vendor.count(),
    prisma.vendorService.count(),
    prisma.csp.count(),
    prisma.cspService.count(),
    prisma.outsourcingPartner.count(),
    prisma.outsourcingService.count(),
    prisma.summaryVendorService.count({ where: { vendorCommonChecklistStatus: "completed" } }),
    prisma.summaryVendorService.count({ where: { vendorCommonChecklistStatus: "not_created" } }),
    prisma.summaryVendorService.count({ where: { vendorCommonChecklistStatus: "not_required" } }),
    prisma.summaryVendorService.count({ where: { vendorCommonChecklistStatus: "is_examined" } }),
    prisma.summaryVendorService.findFirst({ orderBy: { updatedAt: "desc" }, select: { updatedAt: true } }),
  ])

  const lastUpdated = latestUpdate?.updatedAt ? format(new Date(latestUpdate.updatedAt), "yyyy-MM-dd HH:mm") : "-"

  return (
    <main className="flex-1 p-8 bg-[#f8fafc] min-h-screen">
      <div className="w-[95%] mx-auto">
        <section className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-500">System summary</p>
          </div>
          <div className="text-gray-400 text-sm mt-2 md:mt-0">Last updated: {lastUpdated}</div>
        </section>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10 mb-12">
          <SummaryCard label="Clients" value={clientCount} />
          <SummaryCard label="Vendors" value={vendorCount} />
          <SummaryCard label="Vendor Services" value={vendorServiceCount} />
          <SummaryCard label="Providers" value={cspCount} />
          <SummaryCard label="Provider Services" value={cspServiceCount} />
          <SummaryCard
            label="Outsourcing Partners"
            value={outsourcingPartnerCount}
          />
          <SummaryCard
            label="Outsourcing Services"
            value={outsourcingServiceCount}
          />
        </div>
        <section className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 max-w-xl mx-auto mb-12">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Compliance Check Progress</h2>
          <DashboardChartSection completed={completed} notCreated={notCreated} notRequired={notRequired} isExamined={isExamined} />
        </section>
      </div>
    </main>
  )
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
      <div className="text-gray-500 mb-2">{label}</div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  )
}
