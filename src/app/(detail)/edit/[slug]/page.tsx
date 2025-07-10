import EditPostContent from "@/components/EditPostContent";
import { notFound, redirect } from "next/navigation";

interface EditPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ from?: string }>;
}

export default async function EditPage({
  params,
  searchParams,
}: EditPageProps) {
  const { slug } = await params;
  const { from } = await searchParams;

  // Route protection: hanya bisa diakses dari review page
  if (from !== "review") {
    redirect(`/review/${slug}`);
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <EditPostContent slug={slug} />
    </div>
  );
}
