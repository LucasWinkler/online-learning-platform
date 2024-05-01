import type { InputProps } from "~/components/ui/input";

import React from "react";

import { FormControl, FormLabel } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

type FloatingLabelInputProps = {
  label: string;
} & Omit<InputProps, "placeholder">;

export const FloatingLabelInput = React.forwardRef<
  HTMLInputElement,
  FloatingLabelInputProps
>(({ label, className, ...props }, ref) => {
  return (
    <div className="relative">
      <FormControl>
        <Input
          className={cn("peer", className)}
          placeholder=" "
          ref={ref}
          {...props}
        />
      </FormControl>
      <FormLabel className="pointer-events-none absolute left-0 top-0 z-[2] mx-2.5 my-2.5 origin-top-left bg-background text-neutral-500 transition-all duration-200 ease-out peer-focus-within:-translate-y-4 peer-focus-within:scale-[0.85] peer-focus-within:text-foreground peer-disabled:opacity-75 peer-[:not(:placeholder-shown)]:-translate-y-4 peer-[:not(:placeholder-shown)]:scale-[0.85]">
        {label}
      </FormLabel>
    </div>
  );
});

FloatingLabelInput.displayName = "FloatingLabelInput";
