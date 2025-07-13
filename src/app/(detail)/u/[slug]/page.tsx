import { getQueryClient } from "@/app/get-query-client";
import ProfileContent from "@/components/ProfileContent";
import { API_ENDPOINTS } from "@/constants/endpoints";
import { useUserBookmarkedPosts } from "@/hooks/useApi";
import { checkOwnership } from "@/lib/auth";
import { getCookie } from "@/lib/cookies";
import { queryKeys } from "@/lib/queryKeys";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface ProfilePageProps {
  params: Promise<{ slug: string }>;
}

const getUserByUsername = async (username: string, token: string) => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_BASE_URL +
      API_ENDPOINTS.USERS.GET_BY_USERNAME(username),
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  return data;
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const queryClient = getQueryClient();
  const token = await getCookie("session");
  const { slug: username } = await params;
  const user = await getUserByUsername(username, token || "");
  const isOwnProfile = await checkOwnership(user.data.id);

  await queryClient.prefetchQuery({
    queryKey: queryKeys.users.byUsername(username),
    queryFn: () => getUserByUsername(username, token || ""),
  });

  await queryClient.prefetchQuery({
    queryKey: queryKeys.posts.userBookmarked(user.data.id, {}),
    queryFn: () => useUserBookmarkedPosts(user.data.id, {}, isOwnProfile),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileContent username={username} isOwnProfile={isOwnProfile} />
    </HydrationBoundary>
  );
}
