import EditPostContent from "@/components/EditPostContent";
import { requireAuth } from "@/lib/auth";
import { API_ENDPOINTS } from "@/constants/endpoints";
import { notFound, redirect } from "next/navigation";
import { getCookie } from "@/lib/cookies";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/app/get-query-client";
import { queryKeys } from "@/lib/queryKeys";

interface EditPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ from?: string }>;
}

const getPost = async (slug: string, token: string) => {
  const post = await fetch(
    process.env.NEXT_PUBLIC_API_BASE_URL +
      API_ENDPOINTS.POSTS.GET_BY_SLUG(slug),
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  const data = await post.json();
  return data;
};

export default async function EditPage({
  params,
  searchParams,
}: EditPageProps) {
  await requireAuth();
  const queryClient = getQueryClient();
  const token = await getCookie("session");
  const { slug } = await params;
  const { from } = await searchParams;

  await queryClient.prefetchQuery({
    queryKey: queryKeys.posts.bySlug(slug),
    queryFn: () => getPost(slug, token || ""),
  });

  const post = await getPost(slug, token || "").catch(() => notFound());

  console.log("POST?:", post.data);

  // Route protection: hanya bisa diakses dari review page
  if (from !== "review") {
    redirect(`/review/${slug}`);
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <EditPostContent slug={slug} post={post.data} />
      </HydrationBoundary>
    </div>
  );
}
