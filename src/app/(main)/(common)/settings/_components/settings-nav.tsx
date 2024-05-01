import ActiveLink from "~/components/active-link";
import { settingsNavigationLinks } from "~/lib/links";

export const SettingsNav = () => {
  return (
    <nav
      className="z-5 sticky top-[90px] w-full rounded-lg border border-border p-0 backdrop-blur supports-[backdrop-blur]:bg-background/95 lg:bg-background lg:p-3 lg:backdrop-blur-none"
      aria-label="User settings"
    >
      <ul className="flex flex-row justify-center gap-0 text-3xl lg:flex-col lg:gap-2">
        {settingsNavigationLinks.map((link) => (
          <li className="w-full" key={link.label}>
            <ActiveLink
              className="flex w-full flex-col items-center justify-center rounded-md px-3 py-3 text-sm transition-all duration-200 hover:bg-neutral-100 xs:text-base lg:flex-row lg:justify-start lg:px-5 lg:py-3"
              activeClassName="hover:bg-blue-700 text-primary-foreground bg-primary"
              href={link.href}
            >
              <link.Icon className="mb-1 size-4 shrink-0 xs:size-5 lg:mb-0 lg:mr-2" />
              {link.label}
            </ActiveLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};
