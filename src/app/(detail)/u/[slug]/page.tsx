"use client";
import { use } from "react";
import ProfileContent from "@/components/ProfileContent";

interface ProfilePageProps {
  params: Promise<{ slug: string }>;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { slug: username } = use(params);

  return <ProfileContent username={username} />;
}
