import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function NewVendorPage() {
  async function createVendor(formData: FormData) {
    "use server"
    const vendor_name = formData.get("vendor_name") as string
    if (!vendor_name) {
      return
    }
    await prisma.vendor.create({
      data: { name: vendor_name },
    })
    redirect("/vendor?success=created")
  }

  return (
    <main className="flex justify-center items-start pt-16 min-h-screen bg-gray-50">
      <Card className="w-full max-w-2xl">
        <form action={createVendor}>
          <CardHeader>
            <CardTitle>Register New Vendor</CardTitle>
            <CardDescription>
              Please enter the new vendor information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            <div className="space-y-3">
              <Label htmlFor="vendor_name" className="text-base">
                Vendor Name
              </Label>
              <Input
                id="vendor_name"
                name="vendor_name"
                placeholder="e.g. ABC Corporation"
                required
                className="text-base"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-6 pt-8">
            <Button
              type="submit"
              className="bg-slate-700 hover:bg-slate-800 text-white"
            >
              Register
            </Button>
            <Button variant="outline" asChild>
              <Link href="/vendor">Cancel</Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}
