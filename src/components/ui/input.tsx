"use client";

import * as React from "react";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, disabled, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisible = () => setShowPassword(!showPassword);
    const inputType = type === "password" && showPassword ? "text" : type;

    return (
      <>
        <input
          type={inputType}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          disabled={disabled}
          ref={ref}
          {...props}
        />
        {type === "password" && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2"
            type="button"
            onClick={togglePasswordVisible}
            disabled={disabled}
          >
            {showPassword ? (
              <EyeIcon className="h-4 w-4 text-neutral-500" />
            ) : (
              <EyeOffIcon className="h-4 w-4 text-neutral-500" />
            )}
            <span className="sr-only">
              {showPassword ? "Hide" : "Show"} password
            </span>
          </Button>
        )}
      </>
    );
  },
);
Input.displayName = "Input";

export { Input };
