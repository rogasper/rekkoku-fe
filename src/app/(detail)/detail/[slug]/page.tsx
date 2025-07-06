import DetailContent from "@/components/DetailContent";
import React from "react";

const DetailPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = await params;

  return (
    <div className="max-w-[1024px] mx-auto sm:px-6 min-h-screen">
      <main className="mx-auto pb-24">
        <DetailContent slug={slug} />
      </main>
    </div>
  );
};

export default DetailPage;
