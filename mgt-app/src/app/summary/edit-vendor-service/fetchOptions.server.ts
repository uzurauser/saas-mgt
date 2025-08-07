import { prisma } from "@/lib/prisma"

export async function fetchVendorOptions() {
  const vendors = await prisma.vendor.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  })
  return vendors
}

export async function fetchClientOptions() {
  const clients = await prisma.client.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  })
  return clients
}

export async function fetchServiceOptions() {
  const services = await prisma.vendorService.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  })
  return services
}
