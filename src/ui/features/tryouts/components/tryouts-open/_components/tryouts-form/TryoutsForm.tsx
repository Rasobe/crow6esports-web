import "./tryouts-form.scss";
import { FormProvider } from "react-hook-form";
import { createMessageTranslator, type Messages } from "@/ui/i18n";
import { FormButton } from "@/ui/shared/components/button/FormButton";
import { classNames } from "@/ui/shared/lib/class-names";
import { StepMindset, StepProfile, StepTechnical } from "../steps";
import { TryoutsSuccess } from "../tryouts-success";
import { useTryoutsForm } from "./use-tryouts-form";

interface TryoutsFormProps {
  messages: Messages;
}

const STEP_LABEL_KEYS = ["steps.profile", "steps.technical", "steps.mindset"] as const;

export function TryoutsForm({ messages }: TryoutsFormProps) {
  const tOpen = createMessageTranslator(messages);
  const tForm = createMessageTranslator(messages, "form");
  const { form, currentStep, totalSteps, status, goNext, goPrev, onSubmit } = useTryoutsForm();

  if (status === "success") return <TryoutsSuccess t={tOpen} />;

  const isSubmitting = status === "submitting";
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} noValidate className="tryouts-form">
        <div
          className="tryouts-progress"
          role="progressbar"
          aria-valuemin={1}
          aria-valuenow={currentStep + 1}
          aria-valuemax={totalSteps}
        >
          {STEP_LABEL_KEYS.map((labelKey, index) => (
            <div
              key={labelKey}
              className={classNames(
                "tryouts-progress__step",
                index < currentStep && "tryouts-progress__step--done",
                index === currentStep && "tryouts-progress__step--active",
              )}
            >
              <span className="tryouts-progress__label">{tForm(labelKey)}</span>
              <div className="tryouts-progress__bar" />
            </div>
          ))}
        </div>

        <div key={currentStep} className="tryouts-step-wrapper">
          {currentStep === 0 && <StepProfile t={tForm} />}
          {currentStep === 1 && <StepTechnical t={tForm} />}
          {currentStep === 2 && <StepMindset t={tForm} />}
        </div>

        {status === "error" && (
          <p className="tryouts-form__error" role="alert">
            {tForm("error.submit_failed")}
          </p>
        )}

        <div className="tryouts-form__nav">
          {currentStep > 0 && (
            <FormButton variant="ghost" onClick={goPrev} disabled={isSubmitting}>
              {tForm("back")}
            </FormButton>
          )}

          {isLastStep ? (
            <FormButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? tForm("submitting") : tForm("submit")}
            </FormButton>
          ) : (
            <FormButton onClick={goNext}>{tForm("next")}</FormButton>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
