import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

// Fire-and-forget click logger. Always returns quickly; never blocks the
// client's WhatsApp navigation. Failures are swallowed by design.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const productId = typeof body?.productId === "string" ? body.productId : null;
    const size = typeof body?.size === "string" ? body.size : null;
    if (productId && size) {
      await prisma.clickEvent.create({ data: { productId, size } });
    }
  } catch {
    // ignore — tracking must never surface an error to the visitor
  }
  return NextResponse.json({ ok: true });
}
