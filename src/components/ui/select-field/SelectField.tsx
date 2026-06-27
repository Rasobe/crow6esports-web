"use client";

import "./select-field.scss";
import { type SelectHTMLAttributes, useId } from "react";
import clsx from "clsx";

export type SelectFieldSize = "sm" | "md" | "lg";

export interface SelectOption {
    value: string;
    label: string;
}

export interface SelectFieldProps
    extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
    label: string;
    options: SelectOption[];
    error?: string;
    hint?: string;
    size?: SelectFieldSize;
    className?: string;
    placeholder?: string;
}

export function SelectField({
    label,
    options,
    error,
    hint,
    size = "md",
    className,
    required,
    disabled,
    placeholder,
    id: externalId,
    ...props
}: SelectFieldProps) {
    const generatedId = useId();
    const id = externalId ?? generatedId;
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;

    const hasError = Boolean(error);

    return (
        <div
            className={clsx(
                "select-field",
                `select-field--${size}`,
                hasError && "select-field--error",
                disabled && "select-field--disabled",
                className
            )}
        >
            <label className="select-field__label" htmlFor={id}>
                {label}
                {required && (
                    <span className="select-field__required" aria-hidden>
                        *
                    </span>
                )}
            </label>

            <div className="select-field__wrapper">
                <select
                    id={id}
                    className="select-field__input"
                    disabled={disabled}
                    required={required}
                    aria-invalid={hasError}
                    aria-describedby={
                        [hasError && errorId, hint && hintId]
                            .filter(Boolean)
                            .join(" ") || undefined
                    }
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map(({ value, label: optionLabel }) => (
                        <option key={value} value={value}>
                            {optionLabel}
                        </option>
                    ))}
                </select>

                {/* Icono chevron */}
                <span className="select-field__chevron" aria-hidden>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9l6 6 6-6" />
                    </svg>
                </span>
            </div>

            {hint && !hasError && (
                <p id={hintId} className="select-field__hint">
                    {hint}
                </p>
            )}

            {hasError && (
                <p id={errorId} className="select-field__error" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}