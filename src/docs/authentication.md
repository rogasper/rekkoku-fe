# Authentication System Documentation

## Overview

This authentication system provides comprehensive JWT-based session management for both server and client side in Next.js 15. It includes cookie-based authentication, role-based authorization, ownership checks, and middleware protection.

## Architecture

### JWT Token Structure

The JWT token contains the following data:

```typescript
{
  userId: string;
  name: string;
  email: string;
  username: string;
  role: "USER" | "ADMIN";
  exp: number; // expiration timestamp
}
```

### Key Components

1. **JWT Decryption** (`src/lib/cookies.ts`)
2. **Server-side Auth Utilities** (`src/lib/auth.ts`)
3. **Client-side Auth Context** (`src/contexts/AuthContext.tsx`)
4. **Auth Wrappers for Server Actions** (`src/lib/auth-wrappers.ts`)
5. **Middleware Protection** (`src/middleware.ts`)

## Server-Side Authentication

### Basic Functions

```typescript
import {
  checkSession,
  requireAuth,
  requireAdmin,
  checkOwnership,
  requireOwnership,
  requireAdminOrOwnership,
} from "@/lib/auth";

// Check session without redirecting
const user = await checkSession(); // returns AuthSession | null

// Require authentication (redirects to /login if not authenticated)
const user = await requireAuth(); // returns AuthSession or redirects

// Require admin role (redirects if not admin)
const user = await requireAdmin(); // returns AuthSession or redirects

// Check if user owns a resource
const canEdit = await checkOwnership(resourceUserId); // returns boolean

// Require ownership (redirects if not owner)
const user = await requireOwnership(resourceUserId); // returns AuthSession or redirects

// Require admin OR ownership
const user = await requireAdminOrOwnership(resourceUserId); // returns AuthSession or redirects
```

### Server Action Wrappers

```typescript
import {
  withAuth,
  withAdmin,
  withOwnership,
  withAuthForm,
} from "@/lib/auth-wrappers";

// Basic authenticated action
export const updateProfile = withAuth(async (user, profileData) => {
  // user is guaranteed to be authenticated
  console.log(`Updating profile for ${user.userId}`);
});

// Admin only action
export const deleteUser = withAdmin(async (user, userId: string) => {
  // user is guaranteed to be admin
  console.log(`Admin ${user.userId} deleting user ${userId}`);
});

// Ownership required action
export const updatePost = withOwnership(async (user, postData) => {
  // user is guaranteed to own the resource (resourceUserId is first parameter)
  console.log(`User ${user.userId} updating their post`);
});

// Form action with authentication
export const submitForm = withAuthForm(async (user, formData) => {
  const title = formData.get("title") as string;
  // Handle authenticated form submission
});
```

### Manual Authentication in Server Actions

```typescript
"use server";

import { requireAuth, checkAdmin } from "@/lib/auth";

export async function createPost(formData: FormData) {
  // Require authentication
  const user = await requireAuth();

  // Optional: Check specific permissions
  if (someCondition && !(await checkAdmin())) {
    redirect("/unauthorized");
  }

  // Proceed with authenticated logic
  console.log(`Creating post for user ${user.userId}`);
}
```

## Client-Side Authentication

### Auth Context with React Query

The authentication system now uses TanStack Query for better caching, automatic refetching, and optimistic updates.

```typescript
import {
  useAuth,
  useAuthUser,
  useIsAdmin,
  useHasRole,
  useOwnership,
} from "@/contexts/AuthContext";

function MyComponent() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  // For components that require authentication
  const user = useAuthUser(); // throws error if not authenticated

  // Check admin status
  const isAdmin = useIsAdmin();

  // Check specific role
  const hasAdminRole = useHasRole(Role.ADMIN);

  // Check ownership
  const canEdit = useOwnership(resourceUserId);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user.name}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <a href="/login">Login</a>
      )}
    </div>
  );
}
```

### Advanced React Query Auth Hooks

```typescript
import {
  useUserProfile,
  useLogout,
  useRefreshSession,
  useAuthCheck,
  useOptimisticAuth,
  useAuthDependentQuery,
  useAuthInvalidation,
  useAuthSync,
} from "@/hooks/useAuthQuery";

function AdvancedAuthComponent() {
  // Direct user profile query
  const { data: user, isLoading, error } = useUserProfile();

  // Logout mutation
  const logoutMutation = useLogout();

  // Session refresh
  const refreshMutation = useRefreshSession();

  // Auth checks
  const { isAuthenticated, isAdmin, checkOwnership } = useAuthCheck();

  // Optimistic updates
  const { updateUserOptimistically, revertOptimisticUpdate } =
    useOptimisticAuth();

  // Auth-dependent query
  const { data: userPosts } = useAuthDependentQuery(["user-posts"], (user) =>
    fetchUserPosts(user.userId)
  );

  // Cache invalidation
  const { invalidateAuth, clearAuthCache } = useAuthInvalidation();

  // Background sync
  const { syncAuth, checkSessionExpiry } = useAuthSync();

  return (
    <div>
      <button onClick={() => logoutMutation.mutate()}>
        Logout {logoutMutation.isPending && "..."}
      </button>
      <button onClick={() => refreshMutation.mutate()}>Refresh Session</button>
      <button onClick={syncAuth}>Sync Auth</button>
    </div>
  );
}
```

### Conditional Rendering

```typescript
function PostActions({ post }) {
  const { isAdmin } = useAuth();
  const canEdit = useOwnership(post.userId);
  const canDelete = useAdminOrOwnership(post.userId);

  return (
    <div>
      {canEdit && <button>Edit</button>}
      {canDelete && <button>Delete</button>}
      {isAdmin && <button>Admin Action</button>}
    </div>
  );
}
```

## Middleware Protection

The middleware automatically handles:

1. **Protected Routes**: Redirects unauthenticated users to home
2. **Admin Routes**: Redirects non-admin users to `/unauthorized`
3. **Public Routes**: Redirects authenticated users to home
4. **Session Expiration**: Automatically clears expired sessions

### Configuration

```typescript
// src/middleware.ts
const protectedRoutes = ["/settings", "/u/"];
const publicRoutes = ["/login", "/register"];
const adminRoutes = ["/admin"];
```

## Route Protection Patterns

### Server Components

```typescript
// app/settings/page.tsx
import { requireAuth } from "@/lib/auth";

export default async function SettingsPage() {
  const user = await requireAuth(); // Redirects if not authenticated

  return (
    <div>
      <h1>Settings for {user.name}</h1>
    </div>
  );
}
```

### Admin Pages

```typescript
// app/admin/page.tsx
import { requireAdmin } from "@/lib/auth";

export default async function AdminPage() {
  const user = await requireAdmin(); // Redirects if not admin

  return (
    <div>
      <h1>Admin Dashboard</h1>
    </div>
  );
}
```

### Ownership-based Pages

```typescript
// app/posts/[id]/edit/page.tsx
import { requireOwnership } from "@/lib/auth";

export default async function EditPostPage({ params }) {
  // Get post data first
  const post = await getPost(params.id);

  // Require ownership of the post
  const user = await requireOwnership(post.userId);

  return (
    <div>
      <h1>Edit Post</h1>
    </div>
  );
}
```

## API Route Protection

```typescript
// app/api/posts/route.ts
import { verifySession } from "@/lib/auth";

export async function POST(request: Request) {
  const { isAuthenticated, user } = await verifySession();

  if (!isAuthenticated || !user) {
    return new Response(null, { status: 401 });
  }

  // Handle authenticated request
  return new Response(JSON.stringify({ success: true }));
}
```

## Error Handling

### Unauthorized Access

- Unauthenticated users are redirected to `/login` or home page
- Unauthorized users are redirected to `/unauthorized`
- API endpoints return appropriate HTTP status codes

### Session Expiration

- Middleware automatically clears expired cookies
- Client-side context handles automatic logout on expiration
- Server-side functions check expiration in `verifySession`

## Best Practices

### Server Actions

1. Use wrapper functions for consistent authentication
2. Always validate permissions before database operations
3. Use `revalidatePath` after mutations
4. Handle errors gracefully with proper user feedback

### Client Components

1. Use auth context hooks for reactive authentication state
2. Handle loading states appropriately
3. Provide fallbacks for unauthenticated users
4. Use conditional rendering for protected UI elements

### Security

1. Never trust client-side authentication state for security decisions
2. Always verify permissions on the server
3. Use HTTPS in production
4. Implement proper CSRF protection
5. Validate all inputs server-side

## Environment Variables

```env
JWT_SECRET=your-secret-key-here
NEXT_PUBLIC_API_BASE_URL=http://localhost:3030
```

## Example Usage Patterns

### Complete Form with Authentication

```typescript
// Server Action
export const updateProfileAction = withAuthForm(async (user, formData) => {
  const name = formData.get("name") as string;

  // Update user profile
  await updateUser(user.userId, { name });

  revalidatePath("/settings");
  return { success: true };
});

// Client Component
function ProfileForm() {
  const { user } = useAuthUser();

  return (
    <form action={updateProfileAction}>
      <input name="name" defaultValue={user.name} />
      <button type="submit">Update</button>
    </form>
  );
}
```

### Conditional API Calls

```typescript
function PostsList() {
  const { user, isAuthenticated } = useAuth();

  // Different queries based on authentication
  const { data: posts } = useQuery({
    queryKey: ["posts", isAuthenticated ? "personal" : "public"],
    queryFn: () =>
      isAuthenticated ? getPersonalizedPosts() : getPublicPosts(),
  });

  return <div>{/* Render posts */}</div>;
}
```

## React Query Integration Benefits

### Automatic Caching

- User profile data is cached for 5 minutes by default
- Reduces unnecessary API calls
- Provides instant loading for cached data

### Background Refetching

- Automatically refetches user data when the window regains focus
- Keeps authentication state fresh
- Handles network reconnection gracefully

### Optimistic Updates

- Update UI immediately for better user experience
- Automatically rollback on failure
- Seamless profile updates

### Error Handling

- Automatic retry logic with exponential backoff
- Proper 401 handling (no retries for unauthorized)
- Graceful error states

### Query Invalidation

- Smart cache invalidation when user data changes
- Efficient data synchronization across components
- Prevents stale data issues

### Usage Examples

```typescript
// Optimistic profile update
function ProfileEditor() {
  const { updateUserOptimistically, revertOptimisticUpdate } =
    useOptimisticAuth();
  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onMutate: (newData) => {
      // Optimistically update UI
      updateUserOptimistically(newData);
    },
    onError: () => {
      // Revert on error
      revertOptimisticUpdate();
    },
  });
}

// Auth-dependent data fetching
function UserDashboard() {
  const { data: posts } = useAuthDependentQuery(
    ["user-posts"],
    (user) => fetchUserPosts(user.userId),
    { enabled: true }
  );

  // Posts will only be fetched when user is authenticated
  // Query key includes user ID for proper cache separation
}

// Background session management
function App() {
  const { checkSessionExpiry } = useAuthSync();

  useEffect(() => {
    // Check session expiry every minute
    const interval = setInterval(checkSessionExpiry, 60000);
    return () => clearInterval(interval);
  }, []);
}
```

This authentication system provides a robust, type-safe foundation for managing authentication and authorization in your Next.js 15 application with the power of React Query for optimal performance and user experience.
