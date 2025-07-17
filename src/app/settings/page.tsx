"use client";
import {
  Avatar,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Chip,
  addToast,
} from "@heroui/react";
import {
  Camera,
  Loader2,
  Plus,
  X,
  Check,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useProfile,
  useUpdateMyProfile,
  useUpdateUsername,
  useUserDetails,
  useUpdateUserDetails,
  useCheckUsername,
  useUsernameSuggestions,
} from "@/hooks/useApi";
import { useRouter } from "nextjs-toploader/app";
import ImageCropModal from "@/components/ImageCropModal";
import AvatarPreviewModal from "@/components/AvatarPreviewModal";
import { useDebounce } from "@/hooks/use-debounce";
import { logout } from "@/actions/logout";
import useUser from "@/store/useUser";

// Zod schema for form validation
const settingsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  email: z.string().email(),
  image: z.string().url().optional().or(z.literal("")),
  socialLinks: z
    .array(
      z.object({
        platform: z.enum(["instagram", "tiktok", "website"]),
        url: z.string(),
        username: z.string().optional(),
      })
    )
    .max(3, "Maximum 3 social links allowed"),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

const SOCIAL_PLATFORMS = [
  { value: "instagram", label: "📷 Instagram" },
  { value: "tiktok", label: "🎵 TikTok" },
  { value: "website", label: "🌐 Website" },
];

const SettingsPage = () => {
  const { data: profile, isLoading: isLoadingProfile } = useProfile();
  const { data: userDetails, isLoading: isLoadingDetails } = useUserDetails();
  const router = useRouter();

  const updateProfileMutation = useUpdateMyProfile();
  const updateUsernameMutation = useUpdateUsername();
  const updateUserDetailsMutation = useUpdateUserDetails();

  const [usernameError, setUsernameError] = useState("");
  const [showUsernameSuggestions, setShowUsernameSuggestions] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [avatarPreviewOpen, setAvatarPreviewOpen] = useState(false);

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: "",
      username: "",
      bio: "",
      email: "",
      image: "",
      socialLinks: [],
    },
  });

  // Watch username for real-time validation
  const watchedUsername = watch("username");

  const debouncedUsername = useDebounce(watchedUsername, 1000);

  // Field array for social links
  const {
    fields: socialLinksFields,
    append: appendSocialLink,
    remove: removeSocialLink,
    update: updateSocialLink,
  } = useFieldArray({
    control,
    name: "socialLinks",
  });

  // Check username availability with debouncing
  const { data: usernameCheck, isLoading: isCheckingUsername } =
    useCheckUsername(
      debouncedUsername,
      profile?.data?.username !== debouncedUsername
    );

  // Get username suggestions if current username is taken
  const { data: usernameSuggestions } = useUsernameSuggestions(
    profile?.data?.name
  );

  // Load user data when profile/details are fetched
  useEffect(() => {
    if (profile?.data && userDetails?.data) {
      // Process social links to extract username from URL for Instagram/TikTok
      const processedSocialLinks = (userDetails.data.socialLinks || []).map(
        (link: any) => {
          if (link.platform === "website") {
            return link;
          } else {
            // Extract username from URL
            let username = "";
            if (link.platform === "instagram" && link.url) {
              const match = link.url.match(/instagram\.com\/([^\/\?]+)/);
              username = match ? match[1] : "";
            } else if (link.platform === "tiktok" && link.url) {
              const match = link.url.match(/tiktok\.com\/@([^\/\?]+)/);
              username = match ? match[1] : "";
            }

            return {
              ...link,
              username,
            };
          }
        }
      );

      reset({
        name: profile.data.name || "",
        username: profile.data.username || "",
        bio: userDetails.data.bio || "",
        email: profile.data.email || "",
        image: profile.data.avatar || "",
        socialLinks: processedSocialLinks,
      });
    }
  }, [profile, userDetails, reset]);

  // Username validation
  useEffect(() => {
    if (watchedUsername && watchedUsername !== profile?.data?.username) {
      if (usernameCheck?.data?.available === false) {
        setUsernameError("Username is already taken");
        setShowUsernameSuggestions(true);
      } else if (usernameCheck?.data?.available === true) {
        setUsernameError("");
        setShowUsernameSuggestions(false);
      }
    } else {
      setUsernameError("");
      setShowUsernameSuggestions(false);
    }
  }, [usernameCheck, watchedUsername, profile?.data?.username]);

  // Cleanup selected image on component unmount
  useEffect(() => {
    return () => {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage);
      }
    };
  }, [selectedImage]);

  const isLoading =
    isLoadingProfile ||
    isLoadingDetails ||
    updateProfileMutation.isPending ||
    updateUsernameMutation.isPending ||
    updateUserDetailsMutation.isPending ||
    isSubmitting;

  // PENDING: Add back in
  // const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     // Check if file is an image
  //     if (!file.type.startsWith("image/")) {
  //       addToast({
  //         title: "Invalid file type",
  //         description: "Please select an image file",
  //         color: "danger",
  //       });
  //       return;
  //     }

  //     // Check file size (max 5MB)
  //     if (file.size > 5 * 1024 * 1024) {
  //       addToast({
  //         title: "File too large",
  //         description: "Please select an image smaller than 5MB",
  //         color: "danger",
  //       });
  //       return;
  //     }

  //     // Create object URL for preview
  //     const imageUrl = URL.createObjectURL(file);
  //     setSelectedImage(imageUrl);
  //     setCropModalOpen(true);
  //   }
  //   // Clear input value to allow selecting the same file again
  //   e.target.value = "";
  // };

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    try {
      // Convert blob to base64 for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setValue("image", base64String);
      };
      reader.readAsDataURL(croppedImageBlob);

      // Close modal and cleanup
      setCropModalOpen(false);
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage);
      }
      setSelectedImage(null);

      addToast({
        title: "Image cropped successfully",
        description: "Your profile picture has been updated",
        color: "success",
      });
    } catch (error) {
      console.error("Error processing cropped image:", error);
      addToast({
        title: "Error processing image",
        description: "Please try again",
        color: "danger",
      });
    }
  };

  const handleCropCancel = () => {
    setCropModalOpen(false);
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
    }
    setSelectedImage(null);
  };

  const handleAvatarClick = () => {
    setAvatarPreviewOpen(true);
  };

  const handleChangePhotoFromPreview = () => {
    // Trigger file input click
    const fileInput = document.getElementById(
      "profile-picture"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const addSocialLink = () => {
    if (socialLinksFields.length < 3) {
      appendSocialLink({ platform: "instagram", url: "", username: "" });
    }
  };

  const handleSocialLinkChange = (
    index: number,
    field: string,
    value: string
  ) => {
    // Use setValue instead of updateSocialLink to avoid re-render focus issues
    if (field === "platform") {
      setValue(`socialLinks.${index}.platform` as any, value);
      // Clear username and URL when platform changes
      setValue(`socialLinks.${index}.username` as any, "");
      setValue(`socialLinks.${index}.url` as any, "");
    } else if (field === "username") {
      setValue(`socialLinks.${index}.username` as any, value);
      // Get current platform from the form state
      const currentLinks = watch("socialLinks");
      const currentPlatform = currentLinks[index]?.platform;

      // Auto-generate URL for Instagram and TikTok based on username
      if (currentPlatform === "instagram") {
        setValue(
          `socialLinks.${index}.url` as any,
          value ? `https://instagram.com/${value}` : ""
        );
      } else if (currentPlatform === "tiktok") {
        setValue(
          `socialLinks.${index}.url` as any,
          value ? `https://tiktok.com/@${value}` : ""
        );
      }
    } else if (field === "url") {
      setValue(`socialLinks.${index}.url` as any, value);
    }
  };

  const getPlaceholderText = (platform: string) => {
    switch (platform) {
      case "instagram":
        return "username (without @)";
      case "tiktok":
        return "username (without @)";
      case "website":
        return "https://your-website.com";
      default:
        return "Enter value";
    }
  };

  const getInputValue = (link: any, index: number) => {
    // Get current platform from form state to ensure accuracy
    const currentLinks = watch("socialLinks");
    const currentPlatform = currentLinks[index]?.platform || link.platform;

    if (currentPlatform === "website") {
      return currentLinks[index]?.url || link.url || "";
    }
    return currentLinks[index]?.username || link.username || "";
  };

  const validateSocialInput = (platform: string, value: string) => {
    if (!value) return true; // Empty is valid

    switch (platform) {
      case "instagram":
      case "tiktok":
        // Username validation: alphanumeric, dots, underscores
        return (
          /^[a-zA-Z0-9._]+$/.test(value) &&
          !value.startsWith(".") &&
          !value.endsWith(".")
        );
      case "website":
        // URL validation
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      default:
        return true;
    }
  };

  const onSubmit = async (data: SettingsFormData) => {
    try {
      const promises = [];

      // Update profile (name, avatar)
      if (
        data.name !== profile?.data?.name ||
        data.image !== profile?.data?.avatar
      ) {
        promises.push(
          updateProfileMutation.mutateAsync({
            name: data.name,
            avatar: data.image,
          })
        );
      }

      // Update username (if changed)
      if (data.username !== profile?.data?.username) {
        promises.push(
          updateUsernameMutation.mutateAsync({
            username: data.username,
          })
        );
      }

      // Update user details (bio, socialLinks)
      const hasUserDetailsChanges =
        data.bio !== userDetails?.data?.bio ||
        JSON.stringify(data.socialLinks) !==
          JSON.stringify(userDetails?.data?.socialLinks || []);

      if (hasUserDetailsChanges) {
        // Ensure socialLinks have proper structure before saving
        const processedSocialLinks = data.socialLinks
          .map((link) => {
            if (link.platform === "website") {
              return {
                platform: link.platform,
                url: link.url,
              };
            } else {
              return {
                platform: link.platform,
                url: link.url,
                username: link.username,
              };
            }
          })
          .filter((link) => link.url); // Only include links with URLs

        promises.push(
          updateUserDetailsMutation.mutateAsync({
            bio: data.bio,
            socialLinks: processedSocialLinks,
          })
        );
      }

      // Execute all updates
      if (promises.length > 0) {
        await Promise.all(promises);
        console.log("Profile updated successfully!");
        addToast({
          title: "Profile updated successfully!",
          description: "Your profile has been updated successfully.",
          color: "success",
        });
      } else {
        console.log("No changes to save");
        addToast({
          title: "No changes to save",
          description: "Your profile has not been updated.",
          color: "warning",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      addToast({
        title: "Error updating profile",
        description: "Please try again.",
        color: "danger",
      });
    }
  };

  return (
    <main className="max-w-[1024px] mx-auto sm:px-6 min-h-screen">
      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-center">
          <Button
            variant="light"
            onPress={() => router.push("/")}
            className="w-fit sm:w-auto bg-transparent flex items-center gap-2 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <h1 className="text-lg sm:text-2xl font-bold">
              Account Settings
            </h1>{" "}
          </Button>
          <Button
            type="button"
            className="w-fit"
            variant="solid"
            color="danger"
            onPress={() => {
              const { clearAuth } = useUser.getState();
              clearAuth();
              logout();
              window.location.href = "/";
            }}
          >
            Logout
          </Button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 [&_*:focus]:outline-none [&_*:focus-visible]:outline-none [&_input:focus]:ring-0 [&_select:focus]:ring-0 [&_textarea:focus]:ring-0"
        >
          {/* Profile Picture */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <div
                    className="relative cursor-pointer transition-all duration-200 hover:scale-105"
                    onClick={handleAvatarClick}
                  >
                    <Avatar
                      src={field.value}
                      className="w-24 h-24 ring-2 ring-transparent hover:ring-[#EA7B26]/50 transition-all duration-200"
                      isBordered
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <p className="text-white text-xs font-medium">View</p>
                    </div>
                  </div>
                )}
              />
              {/* PENDING: Add back in */}
              {/* <label
                htmlFor="profile-picture"
                className="absolute bottom-0 right-0 p-2 bg-[#EA7B26] rounded-full cursor-pointer hover:bg-[#EA7B26]/80 transition-colors z-10"
              >
                <Camera className="w-4 h-4 text-white" />
                <input
                  type="file"
                  id="profile-picture"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label> */}
            </div>
            <p className="text-sm text-gray-500">
              Click avatar to preview or camera icon to change picture
            </p>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="name"
                  placeholder="Your full name"
                  variant="bordered"
                  isInvalid={!!errors.name}
                  errorMessage={errors.name?.message}
                />
              )}
            />
          </div>

          {/* Username */}
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="username"
                  placeholder="Your username"
                  variant="bordered"
                  startContent={<span className="text-gray-400">@</span>}
                  isInvalid={!!usernameError || !!errors.username}
                  errorMessage={usernameError || errors.username?.message}
                  endContent={
                    watchedUsername &&
                    watchedUsername !== profile?.data?.username ? (
                      isCheckingUsername ? (
                        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                      ) : usernameCheck?.data?.available === true ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : usernameCheck?.data?.available === false ? (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      ) : null
                    ) : null
                  }
                />
              )}
            />

            {/* Username Status */}
            {watchedUsername &&
              watchedUsername !== profile?.data?.username &&
              !isCheckingUsername && (
                <div className="flex items-center gap-2 text-xs">
                  {usernameCheck?.data?.available === true && (
                    <span className="text-green-600 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Username is available
                    </span>
                  )}
                  {usernameCheck?.data?.available === false && (
                    <span className="text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Username is taken
                    </span>
                  )}
                </div>
              )}

            {/* Username Suggestions */}
            {showUsernameSuggestions &&
              usernameSuggestions?.data?.suggestions && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-600">
                    Try these available usernames:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {usernameSuggestions.data.suggestions
                      .slice(0, 5)
                      .map((suggestion: string) => (
                        <Chip
                          key={suggestion}
                          size="sm"
                          variant="flat"
                          color="primary"
                          className="cursor-pointer hover:bg-primary/20"
                          onClick={() => {
                            setValue("username", suggestion);
                            setShowUsernameSuggestions(false);
                          }}
                        >
                          @{suggestion}
                        </Chip>
                      ))}
                  </div>
                </div>
              )}

            <p className="text-xs text-gray-500">
              This will be your unique identifier on Rekkoku
            </p>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <label htmlFor="bio" className="text-sm font-medium">
              Bio
            </label>
            <Controller
              name="bio"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="bio"
                  placeholder="Tell us about yourself"
                  variant="bordered"
                  maxRows={4}
                  isInvalid={!!errors.bio}
                  errorMessage={errors.bio?.message}
                />
              )}
            />
            <p className="text-xs text-gray-500">
              Brief description that appears on your profile
            </p>
          </div>

          {/* Email (Non-editable) */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="email"
                  isReadOnly
                  isDisabled
                  variant="bordered"
                  description="Email is managed through your Google account"
                />
              )}
            />
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Social Links</label>
              <Button
                type="button"
                size="sm"
                variant="light"
                color="primary"
                startContent={<Plus className="w-4 h-4" />}
                onPress={addSocialLink}
                isDisabled={socialLinksFields.length >= 3}
              >
                Add Link
              </Button>
            </div>

            {socialLinksFields.length === 0 ? (
              <p className="text-sm text-gray-500">
                No social links added yet. You can add up to 3 social links.
              </p>
            ) : (
              <div className="space-y-3">
                {socialLinksFields.map((field, index) => {
                  const currentLinks = watch("socialLinks");
                  const currentPlatform =
                    currentLinks[index]?.platform || field.platform;
                  const inputValue = getInputValue(field, index);
                  const isValidInput = validateSocialInput(
                    currentPlatform,
                    inputValue
                  );

                  return (
                    <div key={field.id} className="space-y-2">
                      <div className="flex gap-3 items-start">
                        <Controller
                          name={`socialLinks.${index}.platform`}
                          control={control}
                          render={({ field: platformField }) => (
                            <Select
                              key={`${field.id}-platform-select`}
                              placeholder="Platform"
                              selectedKeys={
                                platformField.value
                                  ? new Set([platformField.value])
                                  : new Set()
                              }
                              onSelectionChange={(keys) => {
                                const platform = Array.from(keys)[0] as string;
                                handleSocialLinkChange(
                                  index,
                                  "platform",
                                  platform
                                );
                              }}
                              className="w-32"
                              variant="bordered"
                              size="sm"
                              disallowEmptySelection
                            >
                              {SOCIAL_PLATFORMS.map((platform) => {
                                return (
                                  <SelectItem key={platform.value}>
                                    {platform.label}
                                  </SelectItem>
                                );
                              })}
                            </Select>
                          )}
                        />

                        <Controller
                          name={
                            currentPlatform === "website"
                              ? `socialLinks.${index}.url`
                              : `socialLinks.${index}.username`
                          }
                          control={control}
                          render={({ field: inputField }) => (
                            <Input
                              key={`${field.id}-${currentPlatform}-input`}
                              value={inputField.value || ""}
                              placeholder={getPlaceholderText(currentPlatform)}
                              variant="bordered"
                              size="sm"
                              className="flex-1"
                              isInvalid={!isValidInput}
                              errorMessage={
                                !isValidInput
                                  ? currentPlatform === "website"
                                    ? "Enter a valid URL"
                                    : "Username can only contain letters, numbers, dots, and underscores"
                                  : undefined
                              }
                              startContent={
                                currentPlatform !== "website" ? (
                                  <span className="text-gray-400">@</span>
                                ) : (
                                  <span className="text-gray-400">🔗</span>
                                )
                              }
                              onChange={(e) => {
                                const fieldName =
                                  currentPlatform === "website"
                                    ? "url"
                                    : "username";
                                handleSocialLinkChange(
                                  index,
                                  fieldName,
                                  e.target.value
                                );
                              }}
                            />
                          )}
                        />

                        <Button
                          type="button"
                          isIconOnly
                          size="sm"
                          variant="light"
                          color="danger"
                          onPress={() => removeSocialLink(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Show generated URL for preview */}
                      {currentPlatform !== "website" &&
                        currentLinks[index]?.username &&
                        isValidInput && (
                          <div className="ml-[8.5rem] text-xs text-gray-500">
                            Preview: {currentLinks[index]?.url}
                          </div>
                        )}
                    </div>
                  );
                })}
              </div>
            )}
            <p className="text-xs text-gray-500">
              Add your social media profiles to help others connect with you
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4 space-y-2">
            <Button
              type="submit"
              className="w-full bg-[#EA7B26] text-white"
              isLoading={isLoading}
              isDisabled={!!usernameError || isCheckingUsername}
              spinner={<Loader2 className="animate-spin" />}
            >
              Save Changes
            </Button>
            {usernameError && (
              <p className="text-xs text-red-500 mt-2 text-center">
                Please fix username error before saving
              </p>
            )}
          </div>
        </form>

        {/* Image Crop Modal */}
        {selectedImage && (
          <ImageCropModal
            isOpen={cropModalOpen}
            onOpenChange={setCropModalOpen}
            imageSrc={selectedImage}
            onCropComplete={handleCropComplete}
            onCancel={handleCropCancel}
          />
        )}

        {/* Avatar Preview Modal */}
        <AvatarPreviewModal
          isOpen={avatarPreviewOpen}
          onOpenChange={setAvatarPreviewOpen}
          avatarSrc={watch("image") || profile?.data?.avatar || ""}
          userName={watch("name") || profile?.data?.name || "User"}
          onChangePhoto={handleChangePhotoFromPreview}
        />
      </div>
    </main>
  );
};

export default SettingsPage;
