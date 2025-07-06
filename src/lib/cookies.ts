"use server";

import { JWTPayload, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const getCookie = async (name: string) => {
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value;
};

export const setCookie = async (name: string, value: string) => {
  const cookieStore = await cookies();
  cookieStore.set(name, value);
};

export const deleteCookie = async (name: string) => {
  const cookieStore = await cookies();
  cookieStore.delete(name);
};

const secret = new TextEncoder().encode(process.env.JWT_SECRET);
export async function decrypt(
  session: string | undefined = ""
): Promise<(JWTPayload & { userId: string; role: string }) | null> {
  try {
    const { payload } = await jwtVerify(session, secret);

    return payload as JWTPayload & { userId: string; role: string };
  } catch (error) {
    console.log(error);
    return null;
  }
}
