import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

async function updateClient(formData: FormData) {
  "use server"
  const id = Number(formData.get("targetId"))
  const client_name = formData.get("client_name") as string
  await prisma.client.update({
    where: { id },
    data: { name: client_name },
  })
  redirect("/client?success=updated")
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function EditClientPage(props: any) {
  const { params } = props
  const id = Number(params.id)
  const client = await prisma.client.findUnique({ where: { id } })
  if (!client) return <div>Client not found</div>

  return (
    <main className="p-6 max-w-xl mx-auto bg-white rounded shadow-md mt-16">
      <h1 className="text-xl font-bold mb-4">Edit Client</h1>
      <form action={updateClient} className="space-y-4">
        <Input
          name="client_name"
          defaultValue={client.name}
          required
          className="input input-bordered w-full"
        />
        <input type="hidden" name="targetId" value={client.id} />
        <div className="flex gap-4">
          <Button type="submit">Save</Button>
          <Link href="/client">
            <Button variant="outline">Cancel</Button>
          </Link>
        </div>
      </form>
    </main>
  )
}
