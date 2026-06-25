"use client";

import { useTranslations } from "next-intl";
import { useTryoutsForm } from "./useTryoutsForm";
import { FormProvider } from "react-hook-form";
import { StepMindset, StepProfile, StepTechnical } from "../steps";
import { Button } from "@/components/ui";
import clsx from "clsx";
import "./tryouts-form.scss";

export function TryoutsForm() {
    const t = useTranslations("tryouts.open.form");
    const {
        form,
        currentStep,
        isLoading,
        totalSteps,
        goNext,
        goPrev,
        onSubmit
    } = useTryoutsForm();

    return (
        <FormProvider {...form}>
            <form onSubmit={onSubmit} noValidate className="tryouts-form">

                {/* Barra de progreso */}
                <div className="tryouts-progress" role="progressbar" aria-valuenow={currentStep + 1} aria-valuemax={totalSteps}>
                    {(["steps.profile", "steps.technical", "steps.mindset"] as const).map((key, i) => (
                        <div
                            key={i}
                            className={clsx("tryouts-progress__step", {
                                "tryouts-progress__step--done": i < currentStep,
                                "tryouts-progress__step--active": i === currentStep,
                            })}
                        >
                            <span className="tryouts-progress__label">{t(key)}</span>
                            <div className="tryouts-progress__bar" />
                        </div>
                    ))}
                </div>

                {/* Steps */}
                <div key={currentStep} className="tryouts-step-wrapper">
                    {currentStep === 0 && <StepProfile />}
                    {currentStep === 1 && <StepTechnical />}
                    {currentStep === 2 && <StepMindset />}
                </div>

                {/* Navegación */}
                <div className="tryouts-form__nav">
                    {currentStep > 0 && (
                        <Button variant="ghost" onClick={goPrev} type="button">
                            {t("back")}
                        </Button>
                    )}

                    {currentStep < totalSteps - 1 ? (
                        <Button variant="primary" onClick={goNext} type="button">
                            {t("next")}
                        </Button>
                    ) : (
                        <Button variant="primary" type="submit" disabled={isLoading}>
                            {isLoading ? t("submitting") : t("submit")}
                        </Button>
                    )}
                </div>

            </form>
        </FormProvider>
    );
}