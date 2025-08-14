import NotificationsContent from "@/components/NotificationsContent";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const { isAuthenticated } = await verifySession();

  if (!isAuthenticated) {
    redirect("/");
  }

  return <NotificationsContent />;
};

export default page;
