import ReviewContent from "@/components/ReviewContent";
import { verifySession } from "@/lib/auth";
import { getPostBySlugForMetadata } from "@/lib/server-api";
import { redirect } from "next/navigation";

interface ReviewPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { slug } = await params;
  const { user } = await verifySession();

  const post = await getPostBySlugForMetadata(slug);
  const isOwner = user?.userId === post?.userId;

  if (!isOwner) {
    redirect(`/detail/${slug}`);
  }

  return (
    <div className="max-w-[1024px] mx-auto sm:px-6 min-h-screen">
      <main className="mx-auto pb-24">
        <ReviewContent slug={slug} />
      </main>
    </div>
  );
}
