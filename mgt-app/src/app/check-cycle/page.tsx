import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import DeleteCycleButton from "@/components/ui/DeleteCycleButton"

export default async function CheckCyclePage() {
  const cycles = await prisma.cycle.findMany({
    orderBy: { startDate: "desc" },
  })
  type Cycle = (typeof cycles)[number]

  return (
    <main className="flex-1 p-8 bg-[#f8fafc] min-h-screen">
      <section className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Check Cycle</h1>
        <p className="text-gray-500 mb-4">
          List of compliance/reporting cycles.
        </p>
        <div className="bg-white rounded-2xl shadow-lg p-16 border border-gray-100 max-w-7xl ml-0">
          <div className="flex justify-end items-center mb-4">
            <Button asChild>
              <Link href="/check-cycle/new">Add Cycle</Link>
            </Button>
          </div>
          <table className="min-w-full border text-base">
            <thead className="bg-slate-100">
              <tr>
                <th className="border px-4 py-2 text-left">ID</th>
                <th className="border px-4 py-2 text-left">Name</th>
                <th className="border px-4 py-2 text-left">Start Date</th>
                <th className="border px-4 py-2 text-left">End Date</th>
                <th className="border px-4 py-2">Active</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cycles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-400">
                    No cycles found.
                  </td>
                </tr>
              ) : (
                cycles.map((cycle: Cycle) => (
                  <tr key={cycle.id} className="hover:bg-blue-50 transition">
                    <td className="border px-4 py-2 text-left">{cycle.id}</td>
                    <td className="border px-4 py-2 text-left">
                      {cycle.name}
                    </td>
                    <td className="border px-4 py-2 text-left">
                      {format(new Date(cycle.startDate), "yyyy-MM-dd")}
                    </td>
                    <td className="border px-4 py-2 text-left">
                      {format(new Date(cycle.endDate), "yyyy-MM-dd")}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {cycle.isActive ? (
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                          Active
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="mr-2 bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      >
                        <Link href={`/check-cycle/${cycle.id}/edit`}>Edit</Link>
                      </Button>
                      <DeleteCycleButton
                        cycleId={cycle.id}
                        action={async (formData) => {
                          "use server"
                          const id = Number(formData.get("targetId"))
                          if (!id) return
                          await prisma.cycle.delete({ where: { id } })
                        }}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
