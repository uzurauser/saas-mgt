import { prisma } from "@/lib/prisma"

export async function fetchClientOptions() {
  return prisma.client.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  })
}

export async function fetchVendorOptions() {
  return prisma.vendor.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  })
}

export async function fetchServiceOptions() {
  return prisma.vendorService.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  })
}

export async function fetchCspOptions() {
  return prisma.csp.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  })
}

export async function fetchCspServiceOptions() {
  return prisma.cspService.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  })
}
