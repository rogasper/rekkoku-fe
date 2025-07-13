import ExploreContent from "@/components/ExploreContent";
import React from "react";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    cityId?: string;
  }>;
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const params = await searchParams;

  return <ExploreContent searchQuery={params.q} cityId={params.cityId} />;
};

export default SearchPage;
