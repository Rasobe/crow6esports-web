import "../text-field/text-field.scss";
import "./textarea-field.scss";
import { type TextareaHTMLAttributes, useId } from "react";
import { classNames } from "@/ui/shared/lib/class-names";

export interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
  className?: string;
}

/** Multi-line counterpart of TextField. Shares its markup and styles. */
export function TextareaField({
  label,
  error,
  hint,
  className,
  required,
  disabled,
  rows = 4,
  id: externalId,
  ...props
}: TextareaFieldProps) {
  const generatedId = useId();
  const id = externalId ?? generatedId;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  const hasError = Boolean(error);

  return (
    <div
      className={classNames(
        "text-field",
        "text-field--md",
        hasError && "text-field--error",
        disabled && "text-field--disabled",
        className,
      )}
    >
      <label className="text-field__label" htmlFor={id}>
        {label}
        {required && (
          <span className="text-field__required" aria-hidden>
            *
          </span>
        )}
      </label>

      <textarea
        id={id}
        className="text-field__input textarea-field__input"
        rows={rows}
        disabled={disabled}
        required={required}
        aria-invalid={hasError}
        aria-describedby={
          [hasError && errorId, hint && hintId].filter(Boolean).join(" ") || undefined
        }
        {...props}
      />

      {hint && !hasError && (
        <p id={hintId} className="text-field__hint">
          {hint}
        </p>
      )}

      {hasError && (
        <p id={errorId} className="text-field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
