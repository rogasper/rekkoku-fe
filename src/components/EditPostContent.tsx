"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button, Card, CardBody, Input, Image, addToast } from "@heroui/react";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { ArrowLeft, Save, X, Loader2 } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCities, useUpdatePost } from "@/hooks/useApi";
import type { Post, City } from "@/types/api";
import { useDebounce } from "@/hooks/use-debounce";
import { getDefaultPostImage } from "@/utils/ui";
import { UI_CONSTANTS, DEFAULTS } from "@/utils/constants";
import { isValidGmapsLink } from "@/utils";

const MAX_GMAPS_LINKS = UI_CONSTANTS.MAX_GMAPS_LINKS;

// Edit post schema
const editPostSchema = z.object({
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

interface EditPostContentProps {
  slug: string;
  post: Post;
}

const EditPostContent = ({ slug, post }: EditPostContentProps) => {
  const router = useRouter();
  // const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState(post.city?.name || "");
  const debouncedSearch = useDebounce(search, 500);
  const [existingPlaces, setExistingPlaces] = useState<any[]>(post.postPlaces);
  const [newGmapsUrls, setNewGmapsUrls] = useState<string[]>([]);
  const [isLoadingSave, setIsLoadingSave] = useState(false);

  // Cities data for autocomplete
  const { data: cities, isLoading: isLoadingCities } = useCities({
    limit: UI_CONSTANTS.DEFAULT_PAGE_SIZE,
    page: 1,
    q: debouncedSearch || DEFAULTS.CITY_SEARCH,
  });

  const citiesData = cities?.data as City[];

  // Update post mutation (disable auto-invalidation to prevent DOM errors)
  const { mutate: updatePost } = useUpdatePost(post?.id || "");

  // Form for editing
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(editPostSchema),
    defaultValues: {
      title: post.title,
      cityId: post.cityId,
      gmapsLinks: post.postPlaces?.map((p) => p.place.gmapsLink) || [],
    },
  });

  const selectedCityId = watch("cityId");

  const handleBack = () => {
    router.push(`/review/${slug}`);
  };

  const handleSave = async (data: any) => {
    // Prevent multiple submissions using ref (no state updates)
    // if (isSubmitting || isLoadingSave) return;

    setIsLoadingSave(true);
    try {
      // Use direct API call to avoid any React Query state changes
      const existingLinks = existingPlaces.map((p) => p.place.gmapsLink);
      const newLinks = newGmapsUrls.filter((url) => url.trim() !== "");
      const allLinks = [...existingLinks, ...newLinks];

      const submitData = {
        title: data.title,
        cityId: data.cityId,
        gmapsLinks: allLinks,
      };

      // Direct API call without mutation to avoid state updates
      // await apiClient.put(`/posts/${postResponse?.id}`, submitData);
      updatePost(submitData, {
        onSuccess: async () => {
          addToast({
            title: "Post updated",
            description: "Redirecting to review page...",
            color: "success",
          });
          setIsLoadingSave(false);
          // updatePostAction(slug);
          router.push(`/review/${slug}`);
        },
        onError: (error) => {
          addToast({
            title: "Error",
            description: error.message,
            color: "danger",
          });
          setIsLoadingSave(false);
        },
      });
    } catch (error) {
      console.error("Error updating post:", error);
      // Handle error here - could show toast notification
      setIsLoadingSave(false);
    }
  };

  const addGmapsUrl = () => {
    if (isLoadingSave) return;

    const totalPlaces = existingPlaces.length + newGmapsUrls.length;
    if (totalPlaces < MAX_GMAPS_LINKS) {
      setNewGmapsUrls([...newGmapsUrls, ""]);
    }
  };

  const removeGmapsUrl = (index: number) => {
    if (isLoadingSave) return;

    const newUrls = newGmapsUrls.filter((_, i) => i !== index);
    setNewGmapsUrls(newUrls);
    setValue("gmapsLinks", [
      ...existingPlaces.map((p) => p.place.gmapsLink),
      ...newUrls.filter((url) => url.trim() !== ""),
    ]);
  };

  const updateGmapsUrl = (index: number, value: string) => {
    if (isLoadingSave) return;

    const newUrls = [...newGmapsUrls];
    newUrls[index] = value;
    setNewGmapsUrls(newUrls);
    setValue("gmapsLinks", [
      ...existingPlaces.map((p) => p.place.gmapsLink),
      ...newUrls.filter((url) => url.trim() !== ""),
    ]);
  };

  const moveExistingPlace = (index: number, direction: "up" | "down") => {
    if (isLoadingSave) return;

    const newPlaces = [...existingPlaces];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex >= 0 && targetIndex < newPlaces.length) {
      [newPlaces[index], newPlaces[targetIndex]] = [
        newPlaces[targetIndex],
        newPlaces[index],
      ];
      setExistingPlaces(newPlaces);

      // Update form value to reflect new order
      const newUrls = newPlaces.map((p) => p.place.gmapsLink);
      setValue("gmapsLinks", [
        ...newUrls,
        ...newGmapsUrls.filter((url) => url.trim() !== ""),
      ]);
    }
  };

  const removeExistingPlace = (index: number) => {
    if (isLoadingSave) return;

    const newPlaces = existingPlaces.filter((_, i) => i !== index);
    setExistingPlaces(newPlaces);

    // Update form value
    const newUrls = newPlaces.map((p) => p.place.gmapsLink);
    setValue("gmapsLinks", [
      ...newUrls,
      ...newGmapsUrls.filter((url) => url.trim() !== ""),
    ]);
  };

  // Initialize form when post data is available
  // useEffect(() => {
  //   if (post) {
  //     reset({
  //       title: post.title,
  //       cityId: post.cityId,
  //       gmapsLinks: [],
  //     });
  //     setSearch(post.city?.name || "");

  //     // Initialize existing places for management
  //     const places = post.postPlaces?.sort((a, b) => a.order - b.order) || [];
  //     setExistingPlaces(places);

  //     // Get current gmaps links from existing places
  //     const existingLinks = places.map((p) => p.place.gmapsLink);
  //     setGmapsUrls(existingLinks);
  //     setValue("gmapsLinks", existingLinks);
  //   }
  // }, [post, reset, setValue]);

  if (!post) {
    return <div className="text-center py-8">Post not found</div>;
  }

  return (
    <div className="space-y-6 notranslate">
      {/* Header */}
      <div className="relative h-48 bg-gradient-to-r from-orange-200 to-amber-200 rounded-lg overflow-hidden">
        <Image
          src={post.postPlaces[0]?.place?.image || getDefaultPostImage()}
          alt={post.title}
          width={1000}
          height={667}
          className="w-full h-full object-cover absolute top-0 left-0"
        />
        <Button
          variant="light"
          size="sm"
          className="hover:bg-orange-50 absolute top-4 left-4 z-20 text-white text-lg"
          onPress={handleBack}
          isDisabled={isLoadingSave}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Review
        </Button>
        <div className="absolute inset-0 bg-black/30 z-10 w-full h-full" />
        <div className="absolute bottom-6 left-6 right-6 z-20">
          <h1 className="text-2xl font-bold text-white mb-2">
            Edit Post: {post.title}
          </h1>
        </div>
      </div>

      {/* Edit Form */}
      <Card>
        <CardBody className="p-6">
          <h2 className="text-xl font-semibold mb-6">Edit Post Details</h2>

          <form
            onSubmit={(e) => {
              // Prevent any form submission during loading
              if (isLoadingSave) {
                e.preventDefault();
                return;
              }
              handleSubmit(handleSave)(e);
            }}
            className={`space-y-6 notranslate ${
              isLoadingSave ? "pointer-events-none opacity-75" : ""
            }`}
            translate="no"
          >
            {/* Title and City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Post Title
                </label>
                <Input
                  aria-label="Post Title"
                  placeholder="Enter post title"
                  variant="bordered"
                  {...register("title")}
                  errorMessage={errors.title?.message}
                  classNames={{
                    input: "focus:outline-none",
                  }}
                  isInvalid={!!errors.title}
                  isDisabled={isLoadingSave}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  City
                </label>
                <Autocomplete
                  aria-label="City"
                  placeholder="Search and select a city"
                  variant="bordered"
                  key={`autocomplete-${selectedCityId}`}
                  selectedKey={selectedCityId || null}
                  onSelectionChange={(key: string | number | null) => {
                    if (!isLoadingSave) {
                      setValue("cityId", key as string);
                      const selectedCity = citiesData?.find(
                        (city) => city.id === key
                      );
                      if (selectedCity) {
                        setSearch(selectedCity.name);
                      }
                    }
                  }}
                  onInputChange={(value: string) => {
                    if (!isLoadingSave) {
                      setSearch(value);
                    }
                  }}
                  listboxProps={{
                    emptyContent: isLoadingCities
                      ? "Loading..."
                      : "No cities found",
                  }}
                  errorMessage={errors.cityId?.message}
                  isInvalid={!!errors.cityId}
                  items={citiesData || []}
                  isLoading={isLoadingCities}
                  inputValue={search}
                  allowsCustomValue={false}
                  menuTrigger="input"
                  isDisabled={isLoadingSave}
                >
                  {(city: City) => (
                    <AutocompleteItem key={city.id}>
                      {city.name}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              </div>
            </div>

            {/* Existing Places Management */}
            {existingPlaces?.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Existing Places</h3>
                {existingPlaces?.map((place, index) => (
                  <Card key={`place-${place.id}`} className="p-4">
                    {/* Desktop Layout */}
                    <div className="hidden md:flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Image
                          src={place.place.image || getDefaultPostImage()}
                          alt={place.place.title}
                          key={`image-${place.place.image}`}
                          width={80}
                          height={80}
                          className="rounded-lg object-cover"
                        />
                        <div className="self-start flex flex-col gap-1">
                          <h4 className="font-medium">
                            {place.place.title.split("·")[0]}
                          </h4>
                          <p className="text-sm text-gray-500 truncate max-w-xs">
                            {place.place.title.split("·")[1]}
                          </p>
                          <p className="text-sm text-gray-500 truncate max-w-xs">
                            {place.place.gmapsLink}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="light"
                          onPress={() => moveExistingPlace(index, "up")}
                          isDisabled={index === 0 || isLoadingSave}
                        >
                          ↑
                        </Button>
                        <Button
                          size="sm"
                          variant="light"
                          onPress={() => moveExistingPlace(index, "down")}
                          isDisabled={
                            index === existingPlaces.length - 1 || isLoadingSave
                          }
                        >
                          ↓
                        </Button>
                        {existingPlaces.length > 1 && (
                          <Button
                            size="sm"
                            color="danger"
                            variant="light"
                            onPress={() => removeExistingPlace(index)}
                            isDisabled={isLoadingSave}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="md:hidden space-y-3">
                      {/* Place Info */}
                      <div className="flex items-start gap-3">
                        <Image
                          src={place.place.image || getDefaultPostImage()}
                          alt={place.place.title}
                          width={80}
                          height={80}
                          className="rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm leading-tight">
                            {place.place.title.split("·")[0]}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {place.place.title.split("·")[1]}
                          </p>
                        </div>
                      </div>

                      {/* Control Buttons */}
                      <div className="flex gap-2">
                        <Button
                          size="md"
                          variant="flat"
                          color="default"
                          onPress={() => moveExistingPlace(index, "up")}
                          isDisabled={index === 0 || isLoadingSave}
                          className="flex-1 min-h-[44px]"
                        >
                          <span className="text-lg">↑</span>
                          <span className="text-xs">Move Up</span>
                        </Button>
                        <Button
                          size="md"
                          variant="flat"
                          color="default"
                          onPress={() => moveExistingPlace(index, "down")}
                          isDisabled={
                            index === existingPlaces.length - 1 || isLoadingSave
                          }
                          className="flex-1 min-h-[44px]"
                        >
                          <span className="text-lg">↓</span>
                          <span className="text-xs">Move Down</span>
                        </Button>
                        {existingPlaces.length > 1 && (
                          <Button
                            size="md"
                            color="danger"
                            variant="flat"
                            onPress={() => removeExistingPlace(index)}
                            isDisabled={isLoadingSave}
                            className="min-h-[44px] px-4"
                          >
                            <X className="w-5 h-5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Add New Places */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Add New Places</h3>
                <Button
                  type="button"
                  color="primary"
                  variant="light"
                  onPress={addGmapsUrl}
                  isDisabled={
                    existingPlaces.length + newGmapsUrls.length >=
                      MAX_GMAPS_LINKS || isLoadingSave
                  }
                  size="sm"
                >
                  + Add Place
                </Button>
              </div>

              {newGmapsUrls.map((url, index) => {
                return (
                  <div key={`new-${index}`} className="flex gap-2">
                    <Input
                      aria-label="Google Maps URL"
                      placeholder="https://maps.google.com/..."
                      variant="bordered"
                      value={url}
                      onChange={(e) => updateGmapsUrl(index, e.target.value)}
                      className="flex-1"
                      classNames={{
                        input: "focus:outline-none",
                      }}
                      isDisabled={isLoadingSave}
                    />
                    <Button
                      isIconOnly
                      color="danger"
                      variant="light"
                      onPress={() => removeGmapsUrl(index)}
                      isDisabled={isLoadingSave}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button
                color="danger"
                variant="light"
                onPress={handleBack}
                isDisabled={isLoadingSave}
              >
                Cancel
              </Button>
              <Button
                color="success"
                type="submit"
                isLoading={isLoadingSave}
                startContent={<Save className="w-4 h-4" />}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default EditPostContent;
