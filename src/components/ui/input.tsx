import { clsx } from "clsx";
import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={clsx(
            "block w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition-colors",
            "placeholder:text-zinc-400",
            "focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent dark:focus:ring-white",
            error
              ? "border-red-500 text-red-900 dark:text-red-400"
              : "border-zinc-300 text-zinc-900 dark:border-zinc-600 dark:text-white dark:bg-zinc-800",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
