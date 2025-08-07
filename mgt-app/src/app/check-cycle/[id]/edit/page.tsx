import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { Button } from "@/components/ui/button";

async function updateCycle(formData: FormData) {
  "use server";
  const id = Number(formData.get("id"));
  const name = formData.get("name") as string;
  const startDate = formData.get("startDate") as string;
  const endDate = formData.get("endDate") as string;
  const isActive = !!formData.get("isActive");
  if (!id || !name || !startDate || !endDate) return;
  await prisma.cycle.update({
    where: { id },
    data: {
      name,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      isActive,
    },
  });
  redirect("/check-cycle");
}

export default async function EditCyclePage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const cycle = await prisma.cycle.findUnique({ where: { id } });
  if (!cycle) return notFound();
  return (
    <main className="flex justify-center items-start pt-16 min-h-screen bg-gray-50">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <h1 className="text-xl font-bold mb-6">Edit Cycle</h1>
        <form action={updateCycle} className="space-y-6">
          <input type="hidden" name="id" value={cycle.id} />
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input name="name" type="text" required className="w-full border rounded px-3 py-2" defaultValue={cycle.name} />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1 font-medium">Start Date</label>
              <input name="startDate" type="date" required className="w-full border rounded px-3 py-2" defaultValue={cycle.startDate.toISOString().slice(0,10)} />
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-medium">End Date</label>
              <input name="endDate" type="date" required className="w-full border rounded px-3 py-2" defaultValue={cycle.endDate.toISOString().slice(0,10)} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input name="isActive" type="checkbox" id="isActive" className="h-4 w-4" defaultChecked={cycle.isActive} />
            <label htmlFor="isActive" className="text-sm">Active</label>
          </div>
          <div className="flex gap-4 justify-end">
            <Button type="submit" className="bg-slate-700 hover:bg-slate-800 text-white">Save</Button>
            <Button variant="outline" asChild><a href="/check-cycle">Cancel</a></Button>
          </div>
        </form>
      </div>
    </main>
  );
}
