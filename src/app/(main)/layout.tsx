export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header>header</header>
      <aside>sidebar</aside>
      <main>{children}</main>
    </>
  );
}
