import BottomNavigation from "@/components/BottomNavigation";
import FloatingNavbar from "@/components/FloatingNavbar";
import Footer from "@/components/Footer";
import { verifySession } from "@/lib/auth";

export default async function DetailLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await verifySession();
  return (
    <>
      <FloatingNavbar />
      {children}
      <BottomNavigation />
      <Footer />
    </>
  );
}
