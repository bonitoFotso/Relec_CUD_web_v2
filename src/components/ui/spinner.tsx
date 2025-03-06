// components/ui/spinner.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

const Spinner = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative", className)}
    {...props}
  >
    <div className="h-full w-full rounded-full border-2 border-slate-200 border-t-slate-800 animate-spin" />
  </div>
));
Spinner.displayName = "Spinner";

export { Spinner };