import "./chip-group-field.scss";
import { type ReactNode, type Ref, useId } from "react";
import { classNames } from "@/ui/shared/lib/class-names";

export interface ChipOption {
  value: string;
  label: string;
  /** Nombre completo para lectores de pantalla cuando la etiqueta visible es una abreviatura. */
  ariaLabel?: string;
}

export interface ChipGroupFieldProps {
  label: string;
  name: string;
  options: ChipOption[];
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
  required?: boolean;
  /** Acciones junto a la etiqueta (atajos de selección, por ejemplo). */
  actions?: ReactNode;
  /** Recibe el primer chip, para que el formulario pueda llevar el foco al grupo. */
  ref?: Ref<HTMLInputElement>;
  className?: string;
}

/** Multi-select rendered as toggle chips. Controlled: pair it with a form Controller. */
export function ChipGroupField({
  label,
  name,
  options,
  value,
  onChange,
  error,
  required,
  actions,
  ref,
  className,
}: ChipGroupFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;

  const hasError = Boolean(error);

  // Mantiene el orden de las opciones, no el orden en que se marcaron
  const toggle = (optionValue: string, checked: boolean) => {
    const next = new Set(value);
    if (checked) next.add(optionValue);
    else next.delete(optionValue);
    onChange(options.map((option) => option.value).filter((option) => next.has(option)));
  };

  return (
    <fieldset
      className={classNames("chip-group-field", hasError && "chip-group-field--error", className)}
      aria-describedby={hasError ? errorId : undefined}
    >
      {/* El legend debe ser hijo directo del fieldset para dar nombre al grupo */}
      <legend className="chip-group-field__label">
        {label}
        {required && (
          <span className="chip-group-field__required" aria-hidden>
            *
          </span>
        )}
      </legend>

      {actions && <div className="chip-group-field__actions">{actions}</div>}

      <div className="chip-group-field__options">
        {options.map((option, index) => (
          <label key={option.value} className="chip-group-field__chip">
            <input
              ref={index === 0 ? ref : undefined}
              type="checkbox"
              className="chip-group-field__input"
              name={name}
              value={option.value}
              checked={value.includes(option.value)}
              aria-label={option.ariaLabel}
              aria-invalid={hasError}
              onChange={(event) => toggle(option.value, event.target.checked)}
            />
            <span className="chip-group-field__text">{option.label}</span>
          </label>
        ))}
      </div>

      {hasError && (
        <p id={errorId} className="chip-group-field__error" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}
