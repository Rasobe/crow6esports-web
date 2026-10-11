import "./button.scss";
import type { ButtonHTMLAttributes } from "react";
import { classNames } from "@/ui/shared/lib/class-names";

type FormButtonVariant = "primary" | "outline" | "ghost";

interface FormButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: FormButtonVariant;
}

/** React counterpart of Button.astro, for client islands. Shares its markup and styles. */
export function FormButton({
  variant = "primary",
  type = "button",
  className,
  ...props
}: FormButtonProps) {
  return (
    <button
      type={type}
      className={classNames("btn", `btn--${variant}`, "btn--md", className)}
      {...props}
    />
  );
}
