import { decrypt } from "@/lib/cookies";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const accessToken = searchParams.get("token");

  if (!accessToken) {
    const host = request.headers.get("host");
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    return NextResponse.redirect(
      new URL(`${protocol}://${host}/login?error=Authentication failed`)
    );
  }

  const cookieStore = await cookies();
  const decode = await decrypt(accessToken);

  if (!decode) {
    const host = request.headers.get("host");
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    return NextResponse.redirect(
      new URL(`${protocol}://${host}/login?error=Authentication failed`)
    );
  }

  cookieStore.set("session", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: decode?.exp ? new Date(decode.exp * 1000) : undefined,
  });

  const host = request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "http";
  return NextResponse.redirect(new URL(`${protocol}://${host}/`));
}
