import ReviewContent from "@/components/ReviewContent";

interface ReviewPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { slug } = await params;

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <ReviewContent slug={slug} />
    </div>
  );
}
