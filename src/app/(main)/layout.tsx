import Footer from "@/components/Footer";
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
  const { isAuthenticated } = await verifySession();
  return (
    <>
      <FloatingNavbar isAuthenticated={isAuthenticated} />
      <TabsNavbar className="max-w-[1024px] sm:mt-0 mt-1 mx-auto px-4 sm:px-0" />
      {children}
      <FloatingCreateButton />
      <BottomNavigation isAuthenticated={isAuthenticated} />
      <Footer />
    </>
  );
}
