import FloatingNavbar from "@/components/FloatingNavbar";

export default function DetailLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <FloatingNavbar />
      {children}
    </>
  );
}
