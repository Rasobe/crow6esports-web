import "./choice-field.scss";
import { type InputHTMLAttributes, useId } from "react";
import { classNames } from "@/ui/shared/lib/class-names";

export interface ChoiceOption {
  value: string;
  label: string;
}

export interface ChoiceFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "size"
> {
  label: string;
  options: ChoiceOption[];
  error?: string;
  hint?: string;
  className?: string;
}

/** Radio group rendered as selectable tiles. Spread `register(name)` on it like any input. */
export function ChoiceField({
  label,
  options,
  error,
  hint,
  className,
  required,
  disabled,
  ...inputProps
}: ChoiceFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  const hasError = Boolean(error);

  return (
    <fieldset
      className={classNames("choice-field", hasError && "choice-field--error", className)}
      disabled={disabled}
      aria-describedby={
        [hasError && errorId, hint && hintId].filter(Boolean).join(" ") || undefined
      }
    >
      <legend className="choice-field__label">
        {label}
        {required && (
          <span className="choice-field__required" aria-hidden>
            *
          </span>
        )}
      </legend>

      <div className="choice-field__options">
        {options.map(({ value, label: optionLabel }) => (
          <label key={value} className="choice-field__option">
            <input
              type="radio"
              className="choice-field__input"
              value={value}
              required={required}
              aria-invalid={hasError}
              {...inputProps}
            />
            <span className="choice-field__mark" aria-hidden />
            <span className="choice-field__text">{optionLabel}</span>
          </label>
        ))}
      </div>

      {hint && !hasError && (
        <p id={hintId} className="choice-field__hint">
          {hint}
        </p>
      )}

      {hasError && (
        <p id={errorId} className="choice-field__error" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}
