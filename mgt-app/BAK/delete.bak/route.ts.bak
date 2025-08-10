import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!id) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  await prisma.cycle.delete({ where: { id } });
  return NextResponse.redirect(new URL("/check-cycle", req.url));
}
