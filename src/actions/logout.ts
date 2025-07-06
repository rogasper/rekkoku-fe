"use server";

import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  await verifySession();
}
