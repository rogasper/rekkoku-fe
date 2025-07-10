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
import { Camera, Loader2, Plus, X, Check, AlertCircle } from "lucide-react";
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

const SettingsPage = () => {
  const { data: profile, isLoading: isLoadingProfile } = useProfile();
  const { data: userDetails, isLoading: isLoadingDetails } = useUserDetails();

  const updateProfileMutation = useUpdateMyProfile();
  const updateUsernameMutation = useUpdateUsername();
  const updateUserDetailsMutation = useUpdateUserDetails();

  const [usernameError, setUsernameError] = useState("");
  const [showUsernameSuggestions, setShowUsernameSuggestions] = useState(false);

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
    useCheckUsername(watchedUsername);

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

  const isLoading =
    isLoadingProfile ||
    isLoadingDetails ||
    updateProfileMutation.isPending ||
    updateUsernameMutation.isPending ||
    updateUserDetailsMutation.isPending ||
    isSubmitting;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Implement image upload
      console.log("Image upload:", file);
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
      // Clear username when platform changes to website
      if (value === "website") {
        setValue(`socialLinks.${index}.username` as any, "");
        setValue(`socialLinks.${index}.url` as any, "");
      }
    } else if (field === "username") {
      setValue(`socialLinks.${index}.username` as any, value);
      // Auto-generate URL for Instagram and TikTok based on username
      const platform = socialLinksFields[index].platform;
      if (platform === "instagram") {
        setValue(
          `socialLinks.${index}.url` as any,
          value ? `https://instagram.com/${value}` : ""
        );
      } else if (platform === "tiktok") {
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

  const getInputValue = (link: any) => {
    if (link.platform === "website") {
      return link.url || "";
    }
    return link.username || "";
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
        <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 [&_*:focus]:outline-none [&_*:focus-visible]:outline-none [&_input:focus]:ring-0 [&_select:focus]:ring-0 [&_textarea:focus]:ring-0"
        >
          {/* Profile Picture */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <Avatar src={field.value} className="w-24 h-24" isBordered />
                )}
              />
              <label
                htmlFor="profile-picture"
                className="absolute bottom-0 right-0 p-2 bg-[#EA7B26] rounded-full cursor-pointer hover:bg-[#EA7B26]/80 transition-colors"
              >
                <Camera className="w-4 h-4 text-white" />
                <input
                  type="file"
                  id="profile-picture"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
            <p className="text-sm text-gray-500">
              Click the camera icon to update your profile picture
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
                  const inputValue = getInputValue(field);
                  const isValidInput = validateSocialInput(
                    field.platform,
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
                              selectedKeys={[platformField.value]}
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
                            >
                              <SelectItem key="instagram">
                                <div className="flex items-center gap-2">
                                  <span>📷</span>
                                  <span>Instagram</span>
                                </div>
                              </SelectItem>
                              <SelectItem key="tiktok">
                                <div className="flex items-center gap-2">
                                  <span>🎵</span>
                                  <span>TikTok</span>
                                </div>
                              </SelectItem>
                              <SelectItem key="website">
                                <div className="flex items-center gap-2">
                                  <span>🌐</span>
                                  <span>Website</span>
                                </div>
                              </SelectItem>
                            </Select>
                          )}
                        />

                        <Controller
                          name={
                            field.platform === "website"
                              ? `socialLinks.${index}.url`
                              : `socialLinks.${index}.username`
                          }
                          control={control}
                          render={({ field: inputField }) => (
                            <Input
                              key={`${field.id}-${field.platform}-input`}
                              value={inputField.value || ""}
                              placeholder={getPlaceholderText(field.platform)}
                              variant="bordered"
                              size="sm"
                              className="flex-1"
                              isInvalid={!isValidInput}
                              errorMessage={
                                !isValidInput
                                  ? field.platform === "website"
                                    ? "Enter a valid URL"
                                    : "Username can only contain letters, numbers, dots, and underscores"
                                  : undefined
                              }
                              startContent={
                                field.platform !== "website" ? (
                                  <span className="text-gray-400">@</span>
                                ) : (
                                  <span className="text-gray-400">🔗</span>
                                )
                              }
                              onChange={(e) => {
                                const fieldName =
                                  field.platform === "website"
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
                      {field.platform !== "website" &&
                        field.username &&
                        isValidInput && (
                          <div className="ml-[8.5rem] text-xs text-gray-500">
                            Preview: {field.url}
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
          <div className="pt-4">
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
      </div>
    </main>
  );
};

export default SettingsPage;
