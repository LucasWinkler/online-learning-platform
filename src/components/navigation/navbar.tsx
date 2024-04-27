"use client";

import NavItem from "~/components/navigation/nav-item";
import { mainNavigationLinks } from "~/lib/links";

const Navbar = () => {
  return (
    <nav className="" aria-label="Main">
      <ul className="flex flex-wrap gap-2">
        {mainNavigationLinks.map(({ title, href, target }) => (
          <NavItem key={title} href={href} target={target}>
            {title}
          </NavItem>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
