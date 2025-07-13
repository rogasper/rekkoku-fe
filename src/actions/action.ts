"use server";

import { API_ENDPOINTS } from "@/constants/endpoints";
import { getCookie } from "@/lib/cookies";
import { redirect } from "next/navigation";

export const searchAction = async (search: string) => {
  redirect(`/search?${search}`);
};

export const updatePostAction = async (slug: string) => {
  redirect(`/review/${slug}`);
};

export const editPostAction = async (slug: string) => {
  redirect(`/edit/${slug}?from=review`);
};

interface UpdatePostData {
  title: string;
  cityId: string;
  gmapsLinks: string[];
}

export const updatePostSlugAction = async (
  id: string,
  data: UpdatePostData
) => {
  const token = await getCookie("session");

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_BASE_URL + API_ENDPOINTS.POSTS.UPDATE(id),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      let errorMessage = "Failed to update post";

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // If JSON parsing fails, use default message
      }

      throw new Error(errorMessage);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error updating post:", error);

    // Re-throw the error so it can be handled by the calling component
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("An unexpected error occurred while updating the post");
  }
};
