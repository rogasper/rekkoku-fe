"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  withAuth,
  withAdmin,
  withOwnership,
  withAdminOrOwnership,
  withAuthForm,
  withOptionalAuth,
  withAuthOrError,
} from "@/lib/auth-wrappers";
import {
  checkSession,
  requireAuth,
  requireAdmin,
  checkOwnership,
  getCurrentUser,
} from "@/lib/auth";

// ===== BASIC AUTHENTICATION EXAMPLES =====

// Example: Update user profile (requires authentication)
export const updateProfile = withAuthForm(async (user, formData) => {
  const name = formData.get("name") as string;
  const bio = formData.get("bio") as string;

  // user is guaranteed to be authenticated
  console.log(`Updating profile for user ${user.userId}`);

  // Call your API or database update logic here
  // await updateUserProfile(user.userId, { name, bio })

  revalidatePath("/settings");
  return { success: true, message: "Profile updated successfully" };
});

// Example: Delete user (admin only)
export const deleteUser = withAdmin(async (user, userId: string) => {
  // user is guaranteed to be admin
  console.log(`Admin ${user.userId} deleting user ${userId}`);

  // Call your API or database delete logic here
  // await deleteUserById(userId)

  revalidatePath("/admin/users");
  return { success: true, message: "User deleted successfully" };
});

// Example: Update post (requires ownership)
export const updatePost = withOwnership(async (user, postData: any) => {
  // user is guaranteed to own the resource
  console.log(`User ${user.userId} updating their post`);

  // Update post logic here
  // await updatePostById(postData.id, postData)

  revalidatePath("/posts");
  return { success: true, message: "Post updated successfully" };
});

// Example: Delete post (admin or owner)
export const deletePost = withAdminOrOwnership(async (user, postId: string) => {
  // user is either admin or owns the post
  console.log(`User ${user.userId} (${user.role}) deleting post ${postId}`);

  // Delete post logic here
  // await deletePostById(postId)

  revalidatePath("/posts");
  return { success: true, message: "Post deleted successfully" };
});

// ===== OPTIONAL AUTHENTICATION EXAMPLES =====

// Example: Get posts with optional authentication (shows different data)
export const getPosts = withOptionalAuth(async (user, filters: any) => {
  console.log(user ? `Authenticated user ${user.userId}` : "Anonymous user");

  // Return different data based on authentication
  if (user) {
    // Return personalized posts for authenticated users
    // return await getPersonalizedPosts(user.userId, filters)
    return { posts: [], personalized: true };
  } else {
    // Return public posts for anonymous users
    // return await getPublicPosts(filters)
    return { posts: [], personalized: false };
  }
});

// ===== ERROR HANDLING EXAMPLES =====

// Example: API-style action with error response
export const apiCreatePost = withAuthOrError(
  async (user, postData: any) => {
    // Create post logic
    console.log(`Creating post for user ${user.userId}`);

    // Simulate validation error
    if (!postData.title) {
      return { error: "Title is required", success: false };
    }

    // await createPost({ ...postData, userId: user.userId })

    return { success: true, postId: "new-post-id" };
  },
  { error: "Authentication required", success: false } // Error response for unauthenticated users
);

// ===== MANUAL AUTHENTICATION CHECKS =====

// Example: Manual authentication check in server action
export async function manualAuthExample(data: any) {
  // Manual authentication check
  const user = await checkSession();

  if (!user) {
    redirect("/login");
  }

  // Check specific permissions
  if (user.role !== "ADMIN" && !(await checkOwnership(data.resourceUserId))) {
    redirect("/unauthorized");
  }

  // Proceed with action
  console.log(`User ${user.userId} performing action`);
  return { success: true };
}

// Example: Optional authentication with manual checks
export async function optionalAuthExample() {
  const user = await getCurrentUser();

  if (user) {
    console.log(`Authenticated user: ${user.email}`);
    // Return authenticated user data
    return {
      data: "authenticated-data",
      user: {
        id: user.userId,
        name: user.name,
        role: user.role,
      },
    };
  } else {
    console.log("Anonymous user");
    // Return public data
    return {
      data: "public-data",
      user: null,
    };
  }
}

// ===== FORM ACTION EXAMPLES =====

// Example: Create post form action
export const createPostAction = withAuthForm(async (user, formData) => {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const cityId = formData.get("cityId") as string;

  // Validate form data
  if (!title || !content || !cityId) {
    return { error: "All fields are required" };
  }

  // Create post
  console.log(`Creating post "${title}" for user ${user.userId}`);

  // await createPost({
  //   title,
  //   content,
  //   cityId,
  //   userId: user.userId
  // })

  revalidatePath("/posts");
  redirect("/posts");
});

// Example: Admin settings form action
export const updateSiteSettings = withAuthForm(async (user, formData) => {
  // Check if user is admin
  if (user.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  const siteName = formData.get("siteName") as string;
  const maintenance = formData.get("maintenance") === "on";

  console.log(`Admin ${user.userId} updating site settings`);

  // Update settings logic
  // await updateSettings({ siteName, maintenance })

  revalidatePath("/admin/settings");
  return { success: true, message: "Settings updated successfully" };
});

// ===== OWNERSHIP CHECK EXAMPLES =====

// Example: Check ownership before allowing action
export async function updateUserPost(postId: string, postData: any) {
  const user = await requireAuth();

  // Get post to check ownership
  // const post = await getPostById(postId)
  // if (!post) {
  //   throw new Error('Post not found')
  // }

  // Check if user owns the post or is admin
  // if (post.userId !== user.userId && user.role !== 'ADMIN') {
  //   redirect('/unauthorized')
  // }

  console.log(`User ${user.userId} updating post ${postId}`);

  // Update post
  // await updatePostById(postId, postData)

  revalidatePath(`/posts/${postId}`);
  return { success: true };
}

// Example: Bulk action with ownership checks
export async function bulkDeletePosts(postIds: string[]) {
  const user = await requireAuth();

  // If admin, allow all deletions
  if (user.role === "ADMIN") {
    console.log(`Admin ${user.userId} bulk deleting ${postIds.length} posts`);
    // await bulkDeletePostsByIds(postIds)
    revalidatePath("/posts");
    return { success: true, deleted: postIds.length };
  }

  // For regular users, check ownership of each post
  const ownedPosts = [];
  for (const postId of postIds) {
    // const post = await getPostById(postId)
    // if (post && post.userId === user.userId) {
    //   ownedPosts.push(postId)
    // }
  }

  if (ownedPosts.length === 0) {
    return { error: "No posts found that you own" };
  }

  console.log(
    `User ${user.userId} bulk deleting ${ownedPosts.length} of their posts`
  );
  // await bulkDeletePostsByIds(ownedPosts)

  revalidatePath("/posts");
  return {
    success: true,
    deleted: ownedPosts.length,
    skipped: postIds.length - ownedPosts.length,
  };
}
