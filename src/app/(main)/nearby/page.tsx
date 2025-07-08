import NearbyContent from "@/components/NearbyContent";
import React from "react";

interface NearbyProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const Nearby = async ({ searchParams }: NearbyProps) => {
  const params = await searchParams;
  const { page = "1", limit = "10" } = params;

  const initialPage = Math.max(1, parseInt(page as string) || 1);
  const initialLimit = Math.min(
    10,
    Math.max(1, parseInt(limit as string) || 10)
  );

  const filters = {
    cityId: params.cityId as string,
    search: params.search as string,
    longitude: params.longitude as string,
    latitude: params.latitude as string,
  };

  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value !== undefined)
  );

  return (
    <NearbyContent
      initialPage={initialPage}
      initialLimit={initialLimit}
      initialFilters={cleanFilters}
      initialSearchParams={params}
    />
  );
};

export default Nearby;
