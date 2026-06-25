"use client";

import "./text-field.scss";
import { type InputHTMLAttributes, type ReactNode, useId } from "react";
import clsx from "clsx";

export type TextFieldSize = "sm" | "md" | "lg";

export interface TextFieldProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
    label: string;
    error?: string;
    hint?: string;
    icon?: ReactNode;
    size?: TextFieldSize;
    className?: string;
}

export function TextField({
    label,
    error,
    hint,
    icon,
    size = "md",
    className,
    required,
    disabled,
    id: externalId,
    ...props
}: TextFieldProps) {
    const generatedId = useId();
    const id = externalId ?? generatedId;
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;

    const hasError = Boolean(error);

    return (
        <div
            className={clsx(
                "text-field",
                `text-field--${size}`,
                hasError && "text-field--error",
                disabled && "text-field--disabled",
                className
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

            <div className="text-field__wrapper">
                {icon && (
                    <span className="text-field__icon" aria-hidden>
                        {icon}
                    </span>
                )}
                <input
                    id={id}
                    className="text-field__input"
                    disabled={disabled}
                    required={required}
                    aria-invalid={hasError}
                    aria-describedby={
                        [hasError && errorId, hint && hintId]
                            .filter(Boolean)
                            .join(" ") || undefined
                    }
                    {...props}
                />
            </div>

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