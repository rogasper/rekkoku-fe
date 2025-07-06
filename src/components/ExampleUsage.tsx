"use client";
import { useAuth } from "@/hooks/useAuth";
import { usePosts } from "@/hooks/useApi";
import { Button } from "@heroui/react";

export default function ExampleUsage() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { data: posts, isLoading, error } = usePosts();

  if (isLoading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-4">
      <h2>Auth Status</h2>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.name}!</p>
          <p>Email: {user?.email}</p>
          <p>Role: {user?.role}</p>
          {isAdmin && <p>🔑 Admin Access</p>}
          <Button onClick={logout} color="danger">
            Logout
          </Button>
        </div>
      ) : (
        <p>Not authenticated</p>
      )}

      <h2>Posts</h2>
      <pre>{JSON.stringify(posts, null, 2)}</pre>
    </div>
  );
}
