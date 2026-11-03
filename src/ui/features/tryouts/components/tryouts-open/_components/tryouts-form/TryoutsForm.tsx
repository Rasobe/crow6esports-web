import "./tryouts-form.scss";
import { useEffect, useRef } from "react";
import { FormProvider } from "react-hook-form";
import { createMessageTranslator, type Locale, type Messages } from "@/ui/i18n";
import { HONEYPOT_FIELD } from "@/ui/features/tryouts/api/submit-tryout-application";
import { FormButton } from "@/ui/shared/components/button/FormButton";
import { classNames } from "@/ui/shared/lib/class-names";
import { StepMindset, StepProfile, StepTechnical } from "../steps";
import { TryoutsSuccess } from "../tryouts-success";
import { useTryoutsForm } from "./use-tryouts-form";

interface TryoutsFormProps {
  messages: Messages;
  locale: Locale;
}

const STEP_KEYS = ["profile", "technical", "mindset"] as const;

const formatStepNumber = (index: number) => String(index + 1).padStart(2, "0");

export function TryoutsForm({ messages, locale }: TryoutsFormProps) {
  const tOpen = createMessageTranslator(messages);
  const tForm = createMessageTranslator(messages, "form");
  const { form, currentStep, totalSteps, status, failure, honeypotRef, goNext, goPrev, onSubmit } =
    useTryoutsForm();

  // Al cambiar de paso, el foco va al título del panel para que el lector de pantalla
  // anuncie el paso nuevo y la vista suba al inicio del formulario.
  const headingRef = useRef<HTMLHeadingElement>(null);
  const previousStep = useRef(currentStep);
  useEffect(() => {
    if (previousStep.current === currentStep) return;
    previousStep.current = currentStep;
    headingRef.current?.focus();
  }, [currentStep]);

  if (status === "success") return <TryoutsSuccess t={tOpen} />;

  const isSubmitting = status === "submitting";
  const isLastStep = currentStep === totalSteps - 1;
  const stepKey = STEP_KEYS[currentStep];

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} noValidate className="tryouts-form">
        {/* Campo trampa contra bots: fuera de pantalla, sin foco ni autocompletado */}
        <input
          ref={honeypotRef}
          type="text"
          name={HONEYPOT_FIELD}
          className="tryouts-form__honeypot"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
        <aside className="tryouts-form__aside">
          <ol className="tryouts-steps" aria-label={tForm("steps.label")}>
            {STEP_KEYS.map((key, index) => (
              <li
                key={key}
                className={classNames(
                  "tryouts-steps__item",
                  index < currentStep && "tryouts-steps__item--done",
                  index === currentStep && "tryouts-steps__item--active",
                )}
                aria-current={index === currentStep ? "step" : undefined}
              >
                <span className="tryouts-steps__index" aria-hidden="true">
                  {formatStepNumber(index)}
                </span>
                <span className="tryouts-steps__text">
                  <span className="tryouts-steps__title">{tForm(`steps.${key}.title`)}</span>
                  <span className="tryouts-steps__desc">{tForm(`steps.${key}.desc`)}</span>
                </span>
              </li>
            ))}
          </ol>

          <p className="tryouts-form__legend">
            <span aria-hidden="true">*</span> {tForm("required_legend")}
          </p>
        </aside>

        <div className="tryouts-panel">
          <header className="tryouts-panel__header">
            <p className="tryouts-panel__counter">
              {tForm("steps.counter", { current: currentStep + 1, total: totalSteps })}
            </p>
            <h2 ref={headingRef} tabIndex={-1} className="tryouts-panel__title">
              {tForm(`steps.${stepKey}.title`)}
            </h2>
            <p className="tryouts-panel__desc">{tForm(`steps.${stepKey}.desc`)}</p>
            <div className="tryouts-panel__progress" aria-hidden="true">
              <span style={{ transform: `scaleX(${(currentStep + 1) / totalSteps})` }} />
            </div>
          </header>

          <div key={currentStep} className="tryouts-panel__body">
            {currentStep === 0 && <StepProfile t={tForm} locale={locale} />}
            {currentStep === 1 && <StepTechnical t={tForm} />}
            {currentStep === 2 && <StepMindset t={tForm} />}
          </div>

          {status === "error" && (
            <p className="tryouts-form__error" role="alert">
              {tForm(`error.${failure}`)}
            </p>
          )}

          <footer className="tryouts-panel__nav">
            {currentStep > 0 && (
              <FormButton variant="ghost" onClick={goPrev} disabled={isSubmitting}>
                {tForm("back")}
              </FormButton>
            )}

            {/* Keys distintas: si React reutilizara el botón "Siguiente" y le cambiara el
                type a submit durante el mismo clic, el formulario se enviaría solo. */}
            {isLastStep ? (
              <FormButton
                key="submit"
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? tForm("submitting") : tForm("submit")}
              </FormButton>
            ) : (
              <FormButton key="next" onClick={goNext}>
                {tForm("next")}
              </FormButton>
            )}
          </footer>
        </div>
      </form>
    </FormProvider>
  );
}
