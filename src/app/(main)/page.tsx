import HomeContent from "@/components/HomeContent";

interface HomePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  // You can add session handling here
  // For example:
  // const session = await verifySession();
  // if (!session) {
  //   redirect('/login');
  // }

  const params = await searchParams;
  const { page = "1", limit = "10" } = params;

  // Validate and sanitize parameters
  const initialPage = Math.max(1, parseInt(page as string) || 1);
  const initialLimit = Math.min(
    10,
    Math.max(1, parseInt(limit as string) || 10)
  );

  // Extract other possible search parameters for posts filtering
  const filters = {
    cityId: params.cityId as string,
    search: params.search as string,
    status: params.status as string,
  };

  // Remove undefined values
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value !== undefined)
  );

  return (
    <HomeContent
      initialPage={initialPage}
      initialLimit={initialLimit}
      initialFilters={cleanFilters}
      initialSearchParams={params}
    />
  );
}
