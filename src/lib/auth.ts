"use server";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt } from "./cookies";
import { Role } from "@/constants/enums";

// Types for authentication
export interface AuthSession {
  userId: string;
  name: string;
  email: string;
  username: string;
  role: Role;
  avatar: string;
  exp?: number;
}

export interface AuthResult {
  isAuthenticated: boolean;
  user: AuthSession | null;
}

/**
 * Verify and get the current user session
 * Uses React cache to prevent multiple calls during a single request
 */
export const verifySession = cache(async (): Promise<AuthResult> => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) {
    return { isAuthenticated: false, user: null };
  }

  const session = await decrypt(sessionCookie);

  if (!session || !session.userId) {
    return { isAuthenticated: false, user: null };
  }

  return {
    isAuthenticated: true,
    user: {
      userId: session.userId,
      name: session.name as string,
      email: session.email as string,
      username: session.username as string,
      role: session.role as Role,
      exp: session.exp,
      avatar: session.avatar as string,
    },
  };
});

/**
 * Check if user is authenticated, redirect to login if not
 */
export async function requireAuth(): Promise<AuthSession> {
  const { isAuthenticated, user } = await verifySession();

  if (!isAuthenticated || !user) {
    redirect("/login");
  }

  return user;
}

/**
 * Check if user is authenticated without redirecting
 */
export async function checkSession(): Promise<AuthSession | null> {
  const { isAuthenticated, user } = await verifySession();
  return isAuthenticated && user ? user : null;
}

/**
 * Check if user has admin role
 */
export async function checkAdmin(): Promise<boolean> {
  const { isAuthenticated, user } = await verifySession();
  return isAuthenticated && user?.role === Role.ADMIN;
}

/**
 * Require admin role, redirect if not authorized
 */
export async function requireAdmin(): Promise<AuthSession> {
  const { isAuthenticated, user } = await verifySession();

  if (!isAuthenticated || !user) {
    redirect("/login");
  }

  if (user.role !== Role.ADMIN) {
    redirect("/unauthorized");
  }

  return user;
}

/**
 * Check if user owns a resource (by userId)
 */
export async function checkOwnership(resourceUserId: string): Promise<boolean> {
  const { isAuthenticated, user } = await verifySession();
  return isAuthenticated && user?.userId === resourceUserId;
}

/**
 * Require ownership of a resource
 */
export async function requireOwnership(
  resourceUserId: string
): Promise<AuthSession> {
  const { isAuthenticated, user } = await verifySession();

  if (!isAuthenticated || !user) {
    redirect("/login");
  }

  if (user.userId !== resourceUserId) {
    redirect("/unauthorized");
  }

  return user;
}

/**
 * Check if user has admin role OR owns the resource
 */
export async function checkAdminOrOwnership(
  resourceUserId: string
): Promise<boolean> {
  const { isAuthenticated, user } = await verifySession();

  if (!isAuthenticated || !user) {
    return false;
  }

  return user.role === Role.ADMIN || user.userId === resourceUserId;
}

/**
 * Require admin role OR ownership of the resource
 */
export async function requireAdminOrOwnership(
  resourceUserId: string
): Promise<AuthSession> {
  const { isAuthenticated, user } = await verifySession();

  if (!isAuthenticated || !user) {
    redirect("/login");
  }

  if (user.role !== Role.ADMIN && user.userId !== resourceUserId) {
    redirect("/unauthorized");
  }

  return user;
}

/**
 * Get current user without authentication requirement
 * Useful for optional authentication scenarios
 */
export async function getCurrentUser(): Promise<AuthSession | null> {
  const { isAuthenticated, user } = await verifySession();
  return isAuthenticated && user ? user : null;
}

/**
 * Check if user has specific role
 */
export async function hasRole(role: Role): Promise<boolean> {
  const { isAuthenticated, user } = await verifySession();
  return isAuthenticated && user?.role === role;
}

/**
 * Require specific role
 */
export async function requireRole(role: Role): Promise<AuthSession> {
  const { isAuthenticated, user } = await verifySession();

  if (!isAuthenticated || !user) {
    redirect("/login");
  }

  if (user.role !== role) {
    redirect("/unauthorized");
  }

  return user;
}

/**
 * Delete session cookie and redirect to login
 */
export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/login");
}

/**
 * Check if session is expired
 */
export async function isSessionExpired(): Promise<boolean> {
  const { isAuthenticated, user } = await verifySession();

  if (!isAuthenticated || !user?.exp) {
    return true;
  }

  return Date.now() >= user.exp * 1000;
}
