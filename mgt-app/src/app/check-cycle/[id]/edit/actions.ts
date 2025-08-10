"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function updateCheckCycle(formData: FormData) {
  const id = Number(formData.get("id"));
  const name = formData.get("name") as string;
  const startDate = formData.get("startDate") as string;
  const endDate = formData.get("endDate") as string;
  const isActive = !!formData.get("isActive");

  if (!id || !name || !startDate || !endDate) {
    throw new Error("Missing required fields");
  }

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
