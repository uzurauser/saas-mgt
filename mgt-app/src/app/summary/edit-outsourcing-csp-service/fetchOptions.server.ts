import { prisma } from "@/lib/prisma"

export async function fetchClientOptions() {
  return prisma.client.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  })
}

export async function fetchOutsourcingPartnerOptions() {
  return prisma.outsourcingPartner.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } })
}
export async function fetchOutsourcingServiceOptions() {
  return prisma.outsourcingService.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } })
}
export async function fetchCspOptions() {
  return prisma.csp.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } })
}
export async function fetchCspServiceOptions() {
  return prisma.cspService.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } })
}
