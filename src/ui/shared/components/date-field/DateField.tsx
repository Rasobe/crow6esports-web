import "./date-field.scss";
import { type ChangeEvent, type Ref, useId, useState } from "react";
import { classNames } from "@/ui/shared/lib/class-names";

export interface DateFieldProps {
  label: string;
  /** Fecha en formato YYYY-MM-DD, o "" mientras esté incompleta. */
  value: string;
  onChange: (value: string) => void;
  /** Locale BCP 47 para los nombres de los meses. */
  locale: string;
  minYear: number;
  maxYear: number;
  partLabels: { day: string; month: string; year: string };
  error?: string;
  hint?: string;
  required?: boolean;
  /** Recibe el selector del día, para que el formulario pueda llevar el foco al campo. */
  ref?: Ref<HTMLSelectElement>;
  className?: string;
}

interface DateParts {
  day: string;
  month: string;
  year: string;
}

const pad = (value: number) => String(value).padStart(2, "0");

const toParts = (value: string): DateParts => {
  const [year = "", month = "", day = ""] = value ? value.split("-") : [];
  return { day, month, year };
};

const daysInMonth = (month: string, year: string) =>
  month ? new Date(Date.UTC(Number(year) || 2000, Number(month), 0)).getUTCDate() : 31;

const monthNames = (locale: string) => {
  const format = new Intl.DateTimeFormat(locale, { month: "long", timeZone: "UTC" });
  return Array.from({ length: 12 }, (_, index) => {
    const name = format.format(new Date(Date.UTC(2000, index, 1)));
    return name.charAt(0).toLocaleUpperCase(locale) + name.slice(1);
  });
};

const Chevron = () => (
  <span className="date-field__chevron" aria-hidden>
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  </span>
);

/** Date picker made of day, month and year selects. Suited to dates far from today. */
export function DateField({
  label,
  value,
  onChange,
  locale,
  minYear,
  maxYear,
  partLabels,
  error,
  hint,
  required,
  ref,
  className,
}: DateFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  // Las partes viven en estado local: una fecha a medio elegir no es un valor válido
  const [parts, setParts] = useState<DateParts>(() => toParts(value));

  const hasError = Boolean(error);
  const describedBy = [hasError && errorId, hint && hintId].filter(Boolean).join(" ") || undefined;
  const maxDay = daysInMonth(parts.month, parts.year);
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, index) => maxYear - index);

  const update = (part: keyof DateParts, partValue: string) => {
    const next = { ...parts, [part]: partValue };
    // Si el mes o el año nuevos no tienen ese día (31 de abril), el día se vacía
    if (next.day && Number(next.day) > daysInMonth(next.month, next.year)) next.day = "";
    setParts(next);
    onChange(next.day && next.month && next.year ? `${next.year}-${next.month}-${next.day}` : "");
  };

  const selectProps = (part: keyof DateParts) => ({
    id: `${id}-${part}`,
    className: "date-field__select",
    value: parts[part],
    required,
    "aria-invalid": hasError,
    "aria-describedby": describedBy,
    onChange: (event: ChangeEvent<HTMLSelectElement>) => update(part, event.target.value),
  });

  return (
    <fieldset className={classNames("date-field", hasError && "date-field--error", className)}>
      <legend className="date-field__label">
        {label}
        {required && (
          <span className="date-field__required" aria-hidden>
            *
          </span>
        )}
      </legend>

      <div className="date-field__parts">
        <div className="date-field__part date-field__part--day">
          <label className="date-field__part-label" htmlFor={`${id}-day`}>
            {partLabels.day}
          </label>
          <select ref={ref} {...selectProps("day")}>
            <option value="" disabled>
              --
            </option>
            {Array.from({ length: maxDay }, (_, index) => (
              <option key={index} value={pad(index + 1)}>
                {index + 1}
              </option>
            ))}
          </select>
          <Chevron />
        </div>

        <div className="date-field__part date-field__part--month">
          <label className="date-field__part-label" htmlFor={`${id}-month`}>
            {partLabels.month}
          </label>
          <select {...selectProps("month")}>
            <option value="" disabled>
              --
            </option>
            {monthNames(locale).map((name, index) => (
              <option key={name} value={pad(index + 1)}>
                {name}
              </option>
            ))}
          </select>
          <Chevron />
        </div>

        <div className="date-field__part date-field__part--year">
          <label className="date-field__part-label" htmlFor={`${id}-year`}>
            {partLabels.year}
          </label>
          <select {...selectProps("year")}>
            <option value="" disabled>
              --
            </option>
            {years.map((year) => (
              <option key={year} value={String(year)}>
                {year}
              </option>
            ))}
          </select>
          <Chevron />
        </div>
      </div>

      {hint && !hasError && (
        <p id={hintId} className="date-field__hint">
          {hint}
        </p>
      )}

      {hasError && (
        <p id={errorId} className="date-field__error" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}
