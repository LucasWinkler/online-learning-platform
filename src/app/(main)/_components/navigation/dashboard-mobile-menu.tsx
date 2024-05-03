import { MenuIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

export const DashboardMobileMenu = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="shrink-0 md:hidden" variant="outline" size="icon">
          <span className="sr-only">Toggle navigation menu</span>
          <MenuIcon className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Acme</SheetTitle>
          <SheetDescription>Work in progress</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
