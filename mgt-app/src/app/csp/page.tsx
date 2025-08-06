import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import type { Client, Csp, CspService } from "@prisma/client"
import { Plus } from "lucide-react"

export const dynamic = "force-dynamic"

// SummaryVendorServiceCspService, SummaryOutsourcingServiceCspService 用

type Tuple = { clientId: number; cspId: number; cspServiceId: number }

export default async function CspPage() {
  let summaryA: Tuple[] = []
  let summaryB: Tuple[] = []
  let clients: Client[] = []
  let csps: Csp[] = []
  let cspServices: CspService[] = []
  try {
    summaryA = await prisma.summaryVendorServiceCspService.findMany({
      select: { clientId: true, cspId: true, cspServiceId: true },
    })
    summaryB = await prisma.summaryOutsourcingServiceCspService.findMany({
      select: { clientId: true, cspId: true, cspServiceId: true },
    })
    clients = await prisma.client.findMany()
    csps = await prisma.csp.findMany()
    cspServices = await prisma.cspService.findMany()
  } catch {
    summaryA = []
    summaryB = []
    clients = []
    csps = []
    cspServices = []
  }

  const tuples: Tuple[] = [...summaryA, ...summaryB]
  const cspIdMap: Record<
    number,
    { clientIds: Set<number>; cspServiceIds: Set<number> }
  > = {}
  for (const t of tuples) {
    if (!cspIdMap[t.cspId]) {
      cspIdMap[t.cspId] = { clientIds: new Set(), cspServiceIds: new Set() }
    }
    cspIdMap[t.cspId].clientIds.add(t.clientId)
    cspIdMap[t.cspId].cspServiceIds.add(t.cspServiceId)
  }

  const cspRows = csps
    .map((csp) => {
      const group = cspIdMap[csp.id]
      const clientNames = group
        ? Array.from(group.clientIds)
            .map((cid) => clients.find((c) => c.id === cid)?.name || "")
            .filter(Boolean)
        : []
      const serviceNames = group
        ? Array.from(group.cspServiceIds)
            .map((sid) => cspServices.find((s) => s.id === sid)?.name || "")
            .filter(Boolean)
        : []
      return {
        cspId: csp.id,
        cspName: csp.name,
        clientsArr: Array.from(new Set(clientNames)),
        clients: Array.from(new Set(clientNames)).join(", "),
        services: Array.from(new Set(serviceNames)).join(", "),
      }
    })
    .sort((a, b) => {
      const aClient = a.clientsArr[0] || "~"
      const bClient = b.clientsArr[0] || "~"
      if (aClient < bClient) return -1
      if (aClient > bClient) return 1
      return a.cspId - b.cspId
    })

  return (
    <main className="flex-1 p-8 bg-[#f8fafc] min-h-screen">
      <section className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">CSP</h1>
        <p className="text-gray-500">List of registered CSPs.</p>
      </section>
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100 max-w-[1200px]">
        <div className="flex justify-end items-center mb-6">
          <Button asChild>
            <Link href="/csp/new">
              <Plus className="w-4 h-4 mr-2" />
              New CSP
            </Link>
          </Button>
        </div>
        <Table className="text-gray-900">
          <TableHeader>
            <TableRow>
              <TableHead className="w-56 truncate">Clients</TableHead>
              <TableHead className="w-20 text-center">ID</TableHead>
              <TableHead className="w-48 truncate">Name</TableHead>
              <TableHead className="w-64 truncate">Services</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cspRows.map((row) => (
              <TableRow key={row.cspId} className="hover:bg-blue-50 transition">
                <TableCell className="w-56 truncate">{row.clients}</TableCell>
                <TableCell className="w-20 text-center">{row.cspId}</TableCell>
                <TableCell className="w-48 truncate">{row.cspName}</TableCell>
                <TableCell className="w-64 truncate">{row.services}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  )
}
