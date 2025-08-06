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
import type {
  OutsourcingPartner,
  OutsourcingService,
  Client,
} from "@prisma/client"
import { Plus } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function OutsourcingPartnerPage() {
  let partners: OutsourcingPartner[] = []
  let services: OutsourcingService[] = []
  let clients: Client[] = []
  let summary: { clientId: number; outsourcingPartnerId: number }[] = []
  try {
    partners = await prisma.outsourcingPartner.findMany()
    services = await prisma.outsourcingService.findMany()
    clients = await prisma.client.findMany()
    summary = await prisma.summaryOutsourcingServiceCspService.findMany({
      select: { clientId: true, outsourcingPartnerId: true },
    })
  } catch {
    partners = []
    services = []
    clients = []
    summary = []
  }

  // Outsourcing Partnerごとにサービス名とクライアント名を集約
  const partnerRows = partners.map((partner) => {
    const partnerServices = services
      .filter((s) => s.outsourcingPartnerId === partner.id)
      .map((s) => s.name)
    const clientIds = summary
      .filter((s) => s.outsourcingPartnerId === partner.id)
      .map((s) => s.clientId)
    const clientNames = Array.from(
      new Set(
        clientIds
          .map((cid) => clients.find((c) => c.id === cid)?.name)
          .filter(Boolean)
      )
    )
    return {
      id: partner.id,
      name: partner.name,
      clients: clientNames.join(", ") || "",
      services: partnerServices.join(", "),
    }
  })

  return (
    <main className="flex-1 p-8 bg-[#f8fafc] min-h-screen">
      <section className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Outsourcing Partners
        </h1>
        <p className="text-gray-500">
          List of registered outsourcing partners.
        </p>
      </section>
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100 max-w-[1200px]">
        <div className="flex justify-end items-center mb-6">
          <Button asChild>
            <Link href="/outsourcing-partner/new">
              <Plus className="w-4 h-4 mr-2" />
              New Outsourcing Partner
            </Link>
          </Button>
        </div>
        <Table className="text-gray-900">
          <TableHeader>
            <TableRow>
              <TableHead className="w-20 truncate">Clients</TableHead>
              <TableHead className="w-20 text-center">ID</TableHead>
              <TableHead className="w-48 truncate">Name</TableHead>
              <TableHead className="w-64 truncate">Services</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {partnerRows.map((row) => (
              <TableRow key={row.id} className="hover:bg-blue-50 transition">
                <TableCell className="w-20 truncate">{row.clients}</TableCell>
                <TableCell className="w-20 text-center">{row.id}</TableCell>
                <TableCell className="w-48 truncate">{row.name}</TableCell>
                <TableCell className="w-64 truncate">{row.services}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  )
}
