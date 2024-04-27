import Link from "next/link";

import { mobileMenuLinks } from "~/lib/links";

const MobileNav = () => {
  return (
    <nav className="" aria-label="Mobile">
      <button className="md:hidden">Menu</button>
      <ul className="">
        {mobileMenuLinks.map(({ title, href }) => (
          <li className="" key={title}>
            <Link className="" href={href}>
              {title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MobileNav;
