// Vendor list page
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
import { Plus } from "lucide-react"
import DeleteVendorButton from "@/components/ui/DeleteVendorButton"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

import type { Client, Vendor, VendorService } from "@prisma/client"

async function deleteVendor(formData: FormData) {
  "use server"
  const id = Number(formData.get("targetId"))
  await prisma.vendor.delete({ where: { id } })
  redirect("/vendor?success=deleted")
}

export default async function VendorsPage() {
  // 1. Fetch all tuples from both summary tables
  type Tuple = { clientId: number; vendorId: number; vendorServiceId: number }
  let summaryA: Tuple[] = []
  let summaryB: Tuple[] = []
  // 2. Fetch all master tables
  let clients: Client[] = []
  let vendors: Vendor[] = []
  let vendorServices: VendorService[] = []
  try {
    summaryA = await prisma.summaryVendorService.findMany({
      select: { clientId: true, vendorId: true, vendorServiceId: true },
    })
    summaryB = await prisma.summaryVendorServiceCspService.findMany({
      select: { clientId: true, vendorId: true, vendorServiceId: true },
    })
    clients = await prisma.client.findMany()
    vendors = await prisma.vendor.findMany()
    vendorServices = await prisma.vendorService.findMany()
  } catch {
    summaryA = []
    summaryB = []
    clients = []
    vendors = []
    vendorServices = []
  }

  // 3. Combine and aggregate by vendorId
  const tuples: Tuple[] = [...summaryA, ...summaryB]

  // vendorIdごとに集約
  const vendorIdMap: Record<
    number,
    { clientIds: Set<number>; vendorServiceIds: Set<number> }
  > = {}
  for (const t of tuples) {
    if (!vendorIdMap[t.vendorId]) {
      vendorIdMap[t.vendorId] = {
        clientIds: new Set(),
        vendorServiceIds: new Set(),
      }
    }
    vendorIdMap[t.vendorId].clientIds.add(t.clientId)
    vendorIdMap[t.vendorId].vendorServiceIds.add(t.vendorServiceId)
  }

  // 4. Build rows with name lookups
  const vendorRows = vendors
    .map((vendor) => {
      const group = vendorIdMap[vendor.id]
      const clientNames = group
        ? Array.from(group.clientIds)
            .map((cid) => clients.find((c) => c.id === cid)?.name || "")
            .filter(Boolean)
        : []
      const serviceNames = group
        ? Array.from(group.vendorServiceIds)
            .map((vid) => vendorServices.find((s) => s.id === vid)?.name || "")
            .filter(Boolean)
        : []
      return {
        vendorId: vendor.id,
        vendorName: vendor.name,
        clientsArr: Array.from(new Set(clientNames)),
        clients: Array.from(new Set(clientNames)).join(", "),
        services: Array.from(new Set(serviceNames)).join(", "),
      }
    })
    .sort((a, b) => {
      // sort by first client name (alphabetically, empty string last), then vendorId
      const aClient = a.clientsArr[0] || "~" // tilde sorts after all normal strings
      const bClient = b.clientsArr[0] || "~"
      if (aClient < bClient) return -1
      if (aClient > bClient) return 1
      return a.vendorId - b.vendorId
    })

  return (
    <main className="flex-1 p-8 bg-[#f8fafc] min-h-screen">
      <section className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Vendors</h1>
        <p className="text-gray-500">List of registered vendors.</p>
      </section>
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100 max-w-[1200px]">
        <div className="flex justify-end items-center mb-6">
          <Button asChild>
            <Link href="/vendor/new">
              <Plus className="w-4 h-4 mr-2" />
              New Vendor
            </Link>
          </Button>
        </div>
        <Table className="text-gray-900">
          <TableHeader>
            <TableRow>
              <TableHead className="w-32">Actions</TableHead>
              <TableHead className="w-20 truncate">Clients</TableHead>
              <TableHead className="w-20 text-center">ID</TableHead>
              <TableHead className="w-48 truncate">Name</TableHead>
              <TableHead className="w-64 truncate">Services</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendorRows.map((row) => (
              <TableRow
                key={row.vendorId}
                className="hover:bg-blue-50 transition"
              >
                <TableCell className="w-32 flex gap-2 justify-center items-center">
                  <Link href={`/vendor/${row.vendorId}/edit`}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    >
                      Edit
                    </Button>
                  </Link>
                  <DeleteVendorButton vendorId={row.vendorId} action={deleteVendor} />
                </TableCell>
                <TableCell className="w-20 truncate">{row.clients}</TableCell>
                <TableCell className="w-20 text-center">
                  {row.vendorId}
                </TableCell>
                <TableCell className="w-48 truncate">
                  {row.vendorName}
                </TableCell>
                <TableCell className="w-64 truncate">{row.services}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  )
}
