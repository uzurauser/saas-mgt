import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

async function updateVendor(formData: FormData) {
  "use server"
  const id = Number(formData.get("targetId"))
  const vendor_name = formData.get("vendor_name") as string
  await prisma.vendor.update({
    where: { id },
    data: { name: vendor_name },
  })
  redirect("/vendor?success=updated")
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function EditVendorPage(props: any) {
  const { params } = props
  const id = Number(params.id)
  const vendor = await prisma.vendor.findUnique({ where: { id } })
  if (!vendor) return <div>Vendor not found</div>

  return (
    <main className="p-6 max-w-xl mx-auto bg-white rounded shadow-md mt-16">
      <h1 className="text-xl font-bold mb-4">Edit Vendor</h1>
      <form action={updateVendor} className="space-y-4">
        <Input
          name="vendor_name"
          defaultValue={vendor.name}
          required
          className="input input-bordered w-full"
        />
        <input type="hidden" name="targetId" value={vendor.id} />
        <div className="flex gap-4">
          <Button type="submit">Save</Button>
          <Link href="/vendor">
            <Button variant="outline">Cancel</Button>
          </Link>
        </div>
      </form>
    </main>
  )
}
