import FloatingNavbar from "@/components/FloatingNavbar";
import { verifySession } from "@/lib/auth";

export default async function DetailLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await verifySession();
  return (
    <>
      <FloatingNavbar user={user} />
      {children}
    </>
  );
}
