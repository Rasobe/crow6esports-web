"use client";

import { useTranslations } from "next-intl";
import { useTryoutsForm } from "./useTryoutsForm";
import { FormProvider } from "react-hook-form";
import { StepMindset, StepProfile, StepTechnical } from "../steps";

export function TryoutsForm() {
    const t = useTranslations("tryouts.open");

    const { form, currentStep, goNext, goPrev, isLoading, onSubmit, totalSteps, isError, isSubmitted } = useTryoutsForm();

    return (
        <FormProvider {...form}>
            <form onSubmit={onSubmit} noValidate className="tryouts-form">

                {/* Barra de progreso */}
                <div className="tryouts-progress" role="progressbar" aria-valuenow={currentStep + 1} aria-valuemax={totalSteps}>
                    {Array.from({ length: totalSteps }).map((_, i) => (
                        <div
                            key={i}
                            className={[
                                "tryouts-progress__step",
                                i < currentStep && "tryouts-progress__step--done",
                                i === currentStep && "tryouts-progress__step--active",
                            ].filter(Boolean).join(" ")}
                        />
                    ))}
                </div>

                {/* Steps */}
                {currentStep === 0 && <StepProfile />}
                {currentStep === 1 && <StepTechnical />}
                {currentStep === 2 && <StepMindset />}

                {/* Navegación */}
                <div className="tryouts-form__nav">
                    {currentStep > 0 && (
                        <button
                            type="button"
                            className="btn btn--ghost btn--md"
                            onClick={goPrev}
                        >
                            {t("back")}
                        </button>
                    )}

                    {currentStep < totalSteps - 1 ? (
                        <button
                            type="button"
                            className="btn btn--primary btn--md"
                            onClick={goNext}
                        >
                            {t("next")}
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="btn btn--primary btn--md"
                            disabled={isLoading}
                        >
                            {isLoading ? t("submitting") : t("submit")}
                        </button>
                    )}
                </div>

            </form>
        </FormProvider>
    )
}