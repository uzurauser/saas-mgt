import { prisma } from "@/lib/prisma"
import Link from "next/link"
import {
  getAntisocialStatusLabel,
  getChecklistStatusLabel,
} from "@/types/checklist"
import DebugStatus from "./DebugStatus"
import type {
  SummaryVendorService,
  SummaryVendorServiceCspService,
  SummaryOutsourcingServiceCspService,
  Client,
  Vendor,
  VendorService,
  Csp,
  CspService,
  OutsourcingPartner,
  OutsourcingService,
} from "@prisma/client"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

export default async function SummaryPage() {
  // 1. fetch summary data
  let summary: SummaryVendorService[] = []
  let clients: Client[] = []
  let vendors: Vendor[] = []
  let vendorServices: VendorService[] = []
  let summaryCsp: SummaryVendorServiceCspService[] = []
  let summaryOutsourcing: SummaryOutsourcingServiceCspService[] = []
  let csps: Csp[] = []
  let cspServices: CspService[] = []
  let outsourcingPartners: OutsourcingPartner[] = []
  let outsourcingServices: OutsourcingService[] = []
  try {
    summary = await prisma.summaryVendorService.findMany()
    summaryCsp = await prisma.summaryVendorServiceCspService.findMany()
    summaryOutsourcing =
      await prisma.summaryOutsourcingServiceCspService.findMany()
    clients = await prisma.client.findMany()
    vendors = await prisma.vendor.findMany()
    vendorServices = await prisma.vendorService.findMany()
    csps = await prisma.csp.findMany()
    cspServices = await prisma.cspService.findMany()
    outsourcingPartners = await prisma.outsourcingPartner.findMany()
    outsourcingServices = await prisma.outsourcingService.findMany()
  } catch {
    // エラー時は空配列のまま
  }

  // 1st card
  const summaryRows = summary.map((row) => {
    const clientName = clients.find((c) => c.id === row.clientId)?.name || ""
    const vendorName = vendors.find((v) => v.id === row.vendorId)?.name || ""
    const vendorServiceName =
      vendorServices.find((s) => s.id === row.vendorServiceId)?.name || ""
    return {
      ...row,
      clientName,
      vendorName,
      vendorServiceName,
    }
  })
  // 2nd card
  const summaryCspRows = summaryCsp.map((row) => {
    const clientName = clients.find((c) => c.id === row.clientId)?.name || ""
    const vendorName = vendors.find((v) => v.id === row.vendorId)?.name || ""
    const vendorServiceName =
      vendorServices.find((s) => s.id === row.vendorServiceId)?.name || ""
    const cspName = csps.find((c) => c.id === row.cspId)?.name || ""
    const cspServiceName =
      cspServices.find((s) => s.id === row.cspServiceId)?.name || ""
    return {
      ...row,
      clientName,
      vendorName,
      vendorServiceName,
      cspName,
      cspServiceName,
    }
  })
  // 3rd card
  const summaryOutsourcingRows = summaryOutsourcing.map((row) => {
    const clientName = clients.find((c) => c.id === row.clientId)?.name || ""
    const outsourcingPartnerName =
      outsourcingPartners.find((p) => p.id === row.outsourcingPartnerId)
        ?.name || ""
    const outsourcingServiceName =
      outsourcingServices.find((s) => s.id === row.outsourcingServiceId)
        ?.name || ""
    const cspName = csps.find((c) => c.id === row.cspId)?.name || ""
    const cspServiceName =
      cspServices.find((s) => s.id === row.cspServiceId)?.name || ""
    return {
      ...row,
      clientName,
      outsourcingPartnerName,
      outsourcingServiceName,
      cspName,
      cspServiceName,
    }
  })

  return (
    <main className="flex-1 p-8 bg-[#f8fafc] min-h-screen">
      <section className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Summary</h1>
        <p className="text-gray-500">Summary of Check Status</p>
      </section>
      <div className="flex flex-col gap-8">
        {/* 1st Card: SummaryVendorService */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 max-w-[1200px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Vendor Service Summary</h2>
            <Link href="/summary/edit-vendor-service">
              <Button variant="default">Edit</Button>
            </Link>
          </div>
          <Table className="text-gray-900">
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead className="min-w-[140px] w-[140px]">
                  Client
                </TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Vendor Service</TableHead>
                <TableHead>Antisocial</TableHead>
                <TableHead>Common</TableHead>
                <TableHead>Detail</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summaryRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell className="min-w-[140px] w-[140px]">
                    {row.clientName}
                  </TableCell>
                  <TableCell>{row.vendorName}</TableCell>
                  <TableCell>{row.vendorServiceName}</TableCell>
                  <TableCell>
                    <Badge value={String(row.vendorAntisocialCheckStatus)} />
                  </TableCell>
                  <TableCell>
                    <Badge value={String(row.vendorCommonChecklistStatus)} />
                  </TableCell>
                  <TableCell>
                    <Badge value={String(row.vendorDetailChecklistStatus)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {/* 2nd Card: SummaryVendorServiceCspService */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Vendor Service CSP Summary</h2>
            <Link href="/summary/edit-vendor-csp-service">
              <Button variant="default">Edit</Button>
            </Link>
          </div>
          <Table className="text-gray-900">
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead className="min-w-[140px] w-[140px]">
                  Client
                </TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Vendor Service</TableHead>
                <TableHead>Antisocial</TableHead>
                <TableHead>Common</TableHead>
                <TableHead>Detail</TableHead>
                <TableHead className="min-w-[48px] px-8" />
                <TableHead>CSP</TableHead>
                <TableHead>CSP Service</TableHead>
                <TableHead>Antisocial</TableHead>
                <TableHead>Common</TableHead>
                <TableHead>Detail</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summaryCspRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell className="min-w-[140px] w-[140px]">
                    {row.clientName}
                  </TableCell>
                  <TableCell>{row.vendorName}</TableCell>
                  <TableCell>{row.vendorServiceName}</TableCell>
                  <TableCell>
                    <Badge
                      value={getAntisocialStatusLabel(
                        row.vendorAntisocialCheckStatus
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <Badge
                      value={getChecklistStatusLabel(
                        row.vendorCommonChecklistStatus
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <Badge
                      value={getChecklistStatusLabel(
                        row.vendorDetailChecklistStatus
                      )}
                    />
                  </TableCell>
                  <TableCell className="min-w-[48px] px-8" />
                  <TableCell>{row.cspName}</TableCell>
                  <TableCell>{row.cspServiceName}</TableCell>
                  <TableCell>
                    <Badge
                      value={getAntisocialStatusLabel(
                        row.cspAntisocialCheckStatus
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <Badge
                      value={getChecklistStatusLabel(
                        row.cspCommonChecklistStatus
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <Badge
                      value={getChecklistStatusLabel(
                        row.cspDetailChecklistStatus
                      )}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {/* 3rd Card: SummaryOutsourcingServiceCspService */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">
              Outsourcing Service CSP Summary
            </h2>
            <Link href="/summary/edit-outsourcing-csp-service">
              <Button variant="default">Edit</Button>
            </Link>
          </div>
          <Table className="text-gray-900">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px] text-center">ID</TableHead>
                <TableHead className="min-w-[140px] w-[140px]">
                  Client
                </TableHead>
                <TableHead>Outsourcing Partner</TableHead>
                <TableHead>Outsourcing Service</TableHead>
                <TableHead>Antisocial</TableHead>
                <TableHead>CSP</TableHead>
                <TableHead>CSP Service</TableHead>
                <TableHead>Antisocial</TableHead>
                <TableHead>Common</TableHead>
                <TableHead>Detail</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summaryOutsourcingRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.clientName}</TableCell>
                  <TableCell>{row.outsourcingPartnerName}</TableCell>
                  <TableCell>{row.outsourcingServiceName}</TableCell>
                  <TableCell>
                    <Badge
                      value={String(
                        row.outsourcingPartnerAntisocialCheckStatus
                      )}
                    />
                  </TableCell>
                  <TableCell>{row.cspName}</TableCell>
                  <TableCell>{row.cspServiceName}</TableCell>
                  <TableCell>
                    <Badge value={String(row.cspAntisocialCheckStatus)} />
                  </TableCell>
                  <TableCell>
                    <Badge
                      value={String(row.cspServiceCommonChecklistStatus)}
                    />
                  </TableCell>
                  <TableCell>
                    <Badge
                      value={String(row.cspServiceDetailChecklistStatus)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <DebugStatus />
    </main>
  )
}
