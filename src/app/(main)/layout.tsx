import FloatingNavbar from "@/components/FloatingNavbar";
import TabsNavbar from "@/components/TabsNavbar";
import FloatingCreateButton from "@/components/FloatingCreateButton";
import BottomNavigation from "@/components/BottomNavigation";
import { verifySession } from "@/lib/auth";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await verifySession();
  return (
    <>
      <FloatingNavbar user={user} />
      <TabsNavbar className="max-w-[1024px] sm:mt-4 mt-1 mx-auto px-4 sm:px-0" />
      {children}
      <FloatingCreateButton />
      <BottomNavigation user={user} />
    </>
  );
}
