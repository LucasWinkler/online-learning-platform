import { Header } from "~/components/header";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex h-full flex-row pt-[80px]">
        <aside className="fixed inset-y-0 z-[9] hidden h-full shrink-0 flex-col border-r border-border bg-background pt-[80px] md:flex md:w-[240px]">
          <nav className="p-6">
            <ul>
              <li>
                <a>Link</a>
              </li>
              <li>
                <a>Link</a>
              </li>
              <li>
                <a>Link</a>
              </li>
            </ul>
          </nav>
        </aside>
        <main className="flex-1 p-6 md:ml-[240px]">{children}</main>
      </div>
    </>
  );
}
