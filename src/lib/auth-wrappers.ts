"use server";

import { redirect } from "next/navigation";
import {
  verifySession,
  requireAuth,
  requireAdmin,
  requireOwnership,
  requireAdminOrOwnership,
  requireRole,
  AuthSession,
} from "./auth";
import { Role } from "@/constants/enums";

// Type for server action function
type ServerAction<T extends any[], R> = (...args: T) => Promise<R>;
type AuthenticatedServerAction<T extends any[], R> = (
  user: AuthSession,
  ...args: T
) => Promise<R>;

/**
 * Wrapper for server actions that require authentication
 */
export function withAuth<T extends any[], R>(
  action: AuthenticatedServerAction<T, R>
): ServerAction<T, R> {
  return async (...args: T): Promise<R> => {
    const user = await requireAuth();
    return action(user, ...args);
  };
}

/**
 * Wrapper for server actions that require admin role
 */
export function withAdmin<T extends any[], R>(
  action: AuthenticatedServerAction<T, R>
): ServerAction<T, R> {
  return async (...args: T): Promise<R> => {
    const user = await requireAdmin();
    return action(user, ...args);
  };
}

/**
 * Wrapper for server actions that require specific role
 */
export function withRole<T extends any[], R>(
  role: Role,
  action: AuthenticatedServerAction<T, R>
): ServerAction<T, R> {
  return async (...args: T): Promise<R> => {
    const user = await requireRole(role);
    return action(user, ...args);
  };
}

/**
 * Wrapper for server actions that require ownership of a resource
 * The resourceUserId should be the first argument of the wrapped action
 */
export function withOwnership<T extends any[], R>(
  action: AuthenticatedServerAction<T, R>
): ServerAction<[string, ...T], R> {
  return async (resourceUserId: string, ...args: T): Promise<R> => {
    const user = await requireOwnership(resourceUserId);
    return action(user, ...args);
  };
}

/**
 * Wrapper for server actions that require admin role OR ownership
 * The resourceUserId should be the first argument of the wrapped action
 */
export function withAdminOrOwnership<T extends any[], R>(
  action: AuthenticatedServerAction<T, R>
): ServerAction<[string, ...T], R> {
  return async (resourceUserId: string, ...args: T): Promise<R> => {
    const user = await requireAdminOrOwnership(resourceUserId);
    return action(user, ...args);
  };
}

/**
 * Wrapper for server actions with optional authentication
 * Passes null if not authenticated, user if authenticated
 */
export function withOptionalAuth<T extends any[], R>(
  action: (user: AuthSession | null, ...args: T) => Promise<R>
): ServerAction<T, R> {
  return async (...args: T): Promise<R> => {
    const { isAuthenticated, user } = await verifySession();
    return action(isAuthenticated ? user! : null, ...args);
  };
}

/**
 * Wrapper that returns early with error if not authenticated
 * Useful for API-style responses
 */
export function withAuthOrError<T extends any[], R>(
  action: AuthenticatedServerAction<T, R>,
  errorResponse?: R
): ServerAction<T, R> {
  return async (...args: T): Promise<R> => {
    const { isAuthenticated, user } = await verifySession();

    if (!isAuthenticated || !user) {
      if (errorResponse !== undefined) {
        return errorResponse;
      }
      throw new Error("Authentication required");
    }

    return action(user, ...args);
  };
}

/**
 * Wrapper that returns early with error if not admin
 */
export function withAdminOrError<T extends any[], R>(
  action: AuthenticatedServerAction<T, R>,
  errorResponse?: R
): ServerAction<T, R> {
  return async (...args: T): Promise<R> => {
    const { isAuthenticated, user } = await verifySession();

    if (!isAuthenticated || !user) {
      if (errorResponse !== undefined) {
        return errorResponse;
      }
      throw new Error("Authentication required");
    }

    if (user.role !== Role.ADMIN) {
      if (errorResponse !== undefined) {
        return errorResponse;
      }
      throw new Error("Admin access required");
    }

    return action(user, ...args);
  };
}

/**
 * Wrapper for form actions that need authentication
 * Automatically handles FormData as the last parameter
 */
export function withAuthForm<R>(
  action: (user: AuthSession, formData: FormData) => Promise<R>
): (formData: FormData) => Promise<R> {
  return async (formData: FormData): Promise<R> => {
    const user = await requireAuth();
    return action(user, formData);
  };
}

/**
 * Wrapper for form actions that need admin role
 */
export function withAdminForm<R>(
  action: (user: AuthSession, formData: FormData) => Promise<R>
): (formData: FormData) => Promise<R> {
  return async (formData: FormData): Promise<R> => {
    const user = await requireAdmin();
    return action(user, formData);
  };
}

// Example usage patterns:

/*
// Basic authenticated action
export const updateProfile = withAuth(async (user, profileData) => {
  // user is guaranteed to be authenticated
  // Update user profile logic
})

// Admin only action
export const deleteUser = withAdmin(async (user, userId) => {
  // user is guaranteed to be admin
  // Delete user logic
})

// Ownership required action
export const updatePost = withOwnership(async (user, postData) => {
  // user is guaranteed to own the resource (first parameter)
  // Update post logic
})

// Form action with authentication
export const submitForm = withAuthForm(async (user, formData) => {
  // Handle authenticated form submission
})

// Optional authentication
export const getPublicPosts = withOptionalAuth(async (user, filters) => {
  // user can be null or authenticated user
  // Show different data based on authentication
})

// API-style error handling
export const apiAction = withAuthOrError(async (user, data) => {
  // Return data or handle business logic
}, { error: 'Unauthorized' })
*/
