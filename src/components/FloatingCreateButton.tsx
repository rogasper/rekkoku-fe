"use client";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  addToast,
} from "@heroui/react";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Input } from "@heroui/input";
import { PlusIcon, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useCities, useCreatePost } from "@/hooks/useApi";
import { City } from "@/types/api";
import { useDebounce } from "@/hooks/use-debounce";
import { usePathname, useRouter } from "next/navigation";
import { UI_CONSTANTS, POST_STATUS, DEFAULTS } from "@/utils/constants";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useAuth } from "@/hooks/useAuth";

// Helper function to validate Google Maps links
const isValidGmapsLink = (url: string): boolean => {
  const gmapsPattern =
    /(https?:\/\/(www\.)?(google\.com\/maps|goo\.gl\/maps|maps\.app\.goo\.gl)\/[^\s]+)/;
  return gmapsPattern.test(url);
};

const MAX_GMAPS_LINKS = UI_CONSTANTS.MAX_GMAPS_LINKS;

// Create post schema matching backend
const createPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  cityId: z.string().min(1, "City ID is required"),
  gmapsLinks: z
    .array(
      z
        .string()
        .url("Invalid URL format")
        .refine(isValidGmapsLink, "Must be a valid Google Maps URL")
    )
    .max(
      MAX_GMAPS_LINKS,
      `Maximum ${MAX_GMAPS_LINKS} Google Maps links allowed`
    )
    .optional()
    .default([]),
});

// Mock cities data - you can replace this with actual API call

export default function FloatingCreateButton() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [gmapsUrls, setGmapsUrls] = useState<string[]>([""]);
  const { withAuth } = useAuthGuard();
  const { isAuthenticated } = useAuth();
  // search debounce
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const router = useRouter();
  const pathname = usePathname();
  const accessList = ["/", "/nearby", "/top-places"];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: "",
      cityId: "",
      gmapsLinks: [],
    },
  });

  const { mutate: createPost } = useCreatePost();

  const { data: cities, isLoading: isLoadingCities } = useCities({
    limit: UI_CONSTANTS.DEFAULT_PAGE_SIZE,
    page: 1,
    q: debouncedSearch || DEFAULTS.CITY_SEARCH,
  });

  const citiesData = cities?.data as City[];

  const selectedCityId = watch("cityId");

  const onSubmit = async (data: any) => {
    try {
      // Filter out empty URLs
      const filteredUrls = gmapsUrls.filter((url: string) => url.trim() !== "");
      const submitData = {
        ...data,
        gmapsLinks: filteredUrls,
      };

      console.log("Creating post:", submitData);
      await createPost(submitData, {
        onSuccess: (response) => {
          addToast({
            title: "Post created",
            description: "Your post has been created",
            color: "success",
          });
          reset();
          setGmapsUrls([""]);
          onOpenChange();

          // Redirect to review page with the post slug
          const postSlug = response?.data?.slug;
          if (postSlug) {
            router.push(`/review/${postSlug}`);
          }
        },
        onError: (error) => {
          addToast({
            title: "Error",
            description: error.message,
            color: "danger",
          });
        },
      });
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const addGmapsUrl = () => {
    setGmapsUrls([...gmapsUrls, ""]);
  };

  const removeGmapsUrl = (index: number) => {
    const newUrls = gmapsUrls.filter((_: string, i: number) => i !== index);
    setGmapsUrls(newUrls);
    setValue("gmapsLinks", newUrls);
  };

  const updateGmapsUrl = (index: number, value: string) => {
    const newUrls = [...gmapsUrls];
    newUrls[index] = value;
    setGmapsUrls(newUrls);
    setValue("gmapsLinks", newUrls);
  };

  return (
    <>
      {/* Floating Create Button - Desktop Only */}
      {accessList.includes(pathname) && isAuthenticated && (
        <Button
          isIconOnly
          className="fixed bottom-6 right-6 z-50 bg-[#EA7B26] text-white shadow-lg hover:bg-[#EA7B26]/90 hidden lg:flex w-[82px] h-[82px]"
          radius="full"
          onPress={() => {
            withAuth(() => {
              onOpen();
            });
          }}
          aria-label="Create new post"
        >
          <PlusIcon size={32} />
        </Button>
      )}

      {/* Create Post Modal */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        backdrop="blur"
        size="2xl"
        scrollBehavior="outside"
        placement="center"
      >
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalHeader className="flex gap-2 py-6 items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                  <Send className="w-4 h-4 text-white" />
                </div>
                <span>Create New Recommendation</span>
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  {/* Title Input */}
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    placeholder="Enter post title"
                    variant="bordered"
                    isRequired
                    {...register("title")}
                    errorMessage={errors.title?.message}
                    isInvalid={!!errors.title}
                  />

                  {/* City Autocomplete */}
                  <label className="text-sm font-medium">City</label>
                  <Autocomplete
                    placeholder="Search and select a city"
                    variant="bordered"
                    isRequired
                    selectedKey={selectedCityId || null}
                    onSelectionChange={(key: string | number | null) => {
                      setValue("cityId", key as string);
                      // Update search text to show selected city name
                      const selectedCity = citiesData?.find(
                        (city) => city.id === key
                      );
                      if (selectedCity) {
                        setSearch(selectedCity.name);
                      }
                    }}
                    onInputChange={(value: string) => {
                      setSearch(value);
                    }}
                    errorMessage={errors.cityId?.message}
                    isInvalid={!!errors.cityId}
                    items={citiesData || []}
                    isLoading={isLoadingCities}
                    inputValue={search}
                    allowsCustomValue={false}
                    menuTrigger="input"
                  >
                    {(city: City) => (
                      <AutocompleteItem key={city.id}>
                        {city.name}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>

                  {/* Google Maps URLs */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">
                      Google Maps URLs
                    </label>
                    {gmapsUrls.map((url: string, index: number) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="https://maps.google.com/..."
                          variant="bordered"
                          value={url}
                          onChange={(e) =>
                            updateGmapsUrl(index, e.target.value)
                          }
                          className="flex-1"
                        />
                        {gmapsUrls.length > 1 && (
                          <Button
                            isIconOnly
                            color="danger"
                            variant="light"
                            onPress={() => removeGmapsUrl(index)}
                            aria-label="Remove URL"
                          >
                            ×
                          </Button>
                        )}
                      </div>
                    ))}
                    {gmapsUrls.length < MAX_GMAPS_LINKS && (
                      <Button
                        color="primary"
                        variant="light"
                        onPress={addGmapsUrl}
                        className="self-start"
                      >
                        + Add Google Maps URL
                      </Button>
                    )}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  isLoading={isSubmitting}
                  className="bg-[#EA7B26] text-white"
                >
                  Create Post
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
