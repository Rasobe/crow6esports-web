import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitTryoutApplication } from "@/ui/features/tryouts/api/submit-tryout-application";
import {
  STEP_FIELDS,
  defaultTryoutsFormValues,
  tryoutsFormSchema,
  type TryoutsFormValues,
} from "@/ui/features/tryouts/schemas/tryouts-form.schema";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

export function useTryoutsForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [status, setStatus] = useState<SubmitStatus>("idle");

  const form = useForm<TryoutsFormValues>({
    resolver: zodResolver(tryoutsFormSchema),
    defaultValues: defaultTryoutsFormValues,
    mode: "onTouched",
  });

  const goNext = async () => {
    const isStepValid = await form.trigger([...STEP_FIELDS[currentStep]]);
    if (isStepValid) setCurrentStep((step) => step + 1);
  };

  const goPrev = () => setCurrentStep((step) => step - 1);

  const onSubmit = form.handleSubmit(async (values) => {
    setStatus("submitting");
    try {
      await submitTryoutApplication(values);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  });

  return {
    form,
    currentStep,
    totalSteps: STEP_FIELDS.length,
    status,
    goNext,
    goPrev,
    onSubmit,
  };
}
