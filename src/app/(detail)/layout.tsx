import BottomNavigation from "@/components/BottomNavigation";
import FloatingNavbar from "@/components/FloatingNavbar";
import Footer from "@/components/Footer";
import { verifySession } from "@/lib/auth";

export default async function DetailLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated } = await verifySession();
  return (
    <>
      <FloatingNavbar isAuthenticated={isAuthenticated} />
      {children}
      <BottomNavigation isAuthenticated={isAuthenticated} />
      <Footer />
    </>
  );
}
