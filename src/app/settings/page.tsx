"use client";
import { Avatar, Button, Input, Textarea } from "@heroui/react";
import { Camera, Loader2 } from "lucide-react";
import React, { useState } from "react";

const SettingsPage = () => {
  // TODO: Replace with actual user data from auth
  const [formData, setFormData] = useState({
    name: "John Doe",
    username: "john_doe",
    bio: "Food enthusiast and culinary explorer. Love to share great food spots!",
    email: "john.doe@gmail.com", // from Google, not editable
    image: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Implement image upload
      console.log("Image upload:", file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implement update profile
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      console.log("Form submitted:", formData);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-[1024px] mx-auto sm:px-6 min-h-screen">
      <div className="p-4 sm:p-6">
        <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar src={formData.image} className="w-24 h-24" isBordered />
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
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your full name"
              variant="bordered"
            />
          </div>

          {/* Username */}
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Your username"
              variant="bordered"
              startContent={<span className="text-gray-400">@</span>}
            />
            <p className="text-xs text-gray-500">
              This will be your unique identifier on Rekkoku
            </p>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <label htmlFor="bio" className="text-sm font-medium">
              Bio
            </label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself"
              variant="bordered"
              maxRows={4}
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
            <Input
              id="email"
              value={formData.email}
              isReadOnly
              variant="bordered"
              description="Email is managed through your Google account"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full bg-[#EA7B26] text-white"
              isLoading={isLoading}
              spinner={<Loader2 className="animate-spin" />}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default SettingsPage;
