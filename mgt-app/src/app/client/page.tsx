// クライアント一覧ページ（schema.prismaに準拠）
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
import DeleteClientButton from "@/components/ui/DeleteClientButton"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

async function deleteClient(formData: FormData) {
  "use server"
  const id = Number(formData.get("targetId"))
  await prisma.client.delete({ where: { id } })
  redirect("/client?success=deleted")
}

import type { Client } from "@prisma/client"

export default async function ClientsPage() {
  let clients: Client[] = []
  try {
    clients = await prisma.client.findMany()
  } catch {
    clients = []
  }
  return (
    <main className="flex-1 p-8 bg-[#f8fafc] min-h-screen">
      <section className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Clients</h1>
        <p className="text-gray-500">List of registered clients.</p>
      </section>
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100 max-w-[800px]">
        <div className="flex justify-end items-center mb-6">
          <Button asChild>
            <Link href="/client/new">
              <Plus className="w-4 h-4 mr-2" />
              New Client
            </Link>
          </Button>
        </div>
        <Table className="text-gray-900">
          <TableHeader>
            <TableRow>
              <TableHead className="w-32">Actions</TableHead>
              <TableHead className="w-14 text-center">ID</TableHead>
              <TableHead className="w-48 truncate">Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id} className="hover:bg-blue-50 transition">
                <TableCell className="w-32 flex gap-2 justify-center items-center">
                  <Link href={`/client/${client.id}/edit`}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    >
                      Edit
                    </Button>
                  </Link>
                  <DeleteClientButton
                    clientId={client.id}
                    action={deleteClient}
                  />
                </TableCell>
                <TableCell className="w-14 text-center">{client.id}</TableCell>
                <TableCell className="w-48 truncate">{client.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  )
}
