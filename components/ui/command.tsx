import * as React from "react";
import { cn } from "@/lib/utils";

export interface CommandProps extends React.ComponentPropsWithoutRef<"div"> {}

export function Command({ className, ...props }: CommandProps) {
  return <div className={cn("overflow-hidden rounded-md border bg-white text-sm shadow-sm", className)} {...props} />;
}

export interface CommandInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onValueChange?: (value: string) => void;
}

export const CommandInput = React.forwardRef<HTMLInputElement, CommandInputProps>(
  ({ className, onChange, onValueChange, ...props }, ref) => (
    <div className="flex items-center border-b px-3">
      <input
        ref={ref}
        className={cn("h-10 w-full bg-transparent text-sm outline-none placeholder:text-gray-400", className)}
        onChange={(event) => {
          onChange?.(event);
          onValueChange?.(event.target.value);
        }}
        {...props}
      />
    </div>
  )
);
CommandInput.displayName = "CommandInput";

export function CommandList({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return <div className={cn("max-h-64 overflow-auto p-1", className)} {...props} />;
}

export function CommandEmpty({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return <div className={cn("px-3 py-4 text-sm text-gray-500", className)} {...props} />;
}

export function CommandGroup({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return <div className={cn("space-y-1 p-1", className)} {...props} />;
}

export interface CommandItemProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onSelect" | "children"> {
  onSelect?: (value: string) => void;
  value: string;
  children?: React.ReactNode;
}

export const CommandItem = React.forwardRef<HTMLButtonElement, CommandItemProps>(
  ({ className, onSelect, value, onClick, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        "flex w-full items-center justify-start rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none",
        className
      )}
      onClick={(event) => {
        onClick?.(event);
        onSelect?.(value);
      }}
      {...props}
    />
  )
);
CommandItem.displayName = "CommandItem";
