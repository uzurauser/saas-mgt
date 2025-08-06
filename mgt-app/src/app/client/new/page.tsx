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

export default function NewClientPage() {
  async function createClient(formData: FormData) {
    "use server"
    const client_name = formData.get("client_name") as string
    if (!client_name) {
      // 簡単なバリデーション
      return
    }
    await prisma.client.create({
      data: {
        name: client_name,
      },
    })
    redirect("/client?success=created")
  }

  return (
    <main className="flex justify-center items-start pt-16 min-h-screen bg-gray-50">
      <Card className="w-full max-w-2xl">
        <form action={createClient}>
          <CardHeader>
            <CardTitle>Register New Client</CardTitle>
            <CardDescription>
              Please enter the new client information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            <div className="space-y-3">
              <Label htmlFor="client_name" className="text-base">
                Client Name
              </Label>
              <Input
                id="client_name"
                name="client_name"
                placeholder="e.g. Marketing Dept."
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
              <Link href="/client">Cancel</Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}
