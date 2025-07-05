import FloatingNavbar from "@/components/FloatingNavbar";
import TabsNavbar from "@/components/TabsNavbar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <FloatingNavbar />
      <TabsNavbar className="max-w-[1024px] mt-4 mx-auto px-4 sm:px-0" />
      {children}
    </>
  );
}
