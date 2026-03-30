import NavbarMain from "@/components/shares/Navbar/NavbarMain";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavbarMain />
      <main>{children}</main>
    </>
  );
}