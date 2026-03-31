import { clsx } from "clsx";
import { type HTMLAttributes } from "react";

type BadgeColor =
  | "zinc"
  | "red"
  | "orange"
  | "amber"
  | "green"
  | "blue"
  | "purple";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  color?: BadgeColor;
}

const colorClasses: Record<BadgeColor, string> = {
  zinc: "bg-zinc-100 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300",
  red: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  orange:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  amber:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  green:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  purple:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

export function Badge({
  className,
  color = "zinc",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        colorClasses[color],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
