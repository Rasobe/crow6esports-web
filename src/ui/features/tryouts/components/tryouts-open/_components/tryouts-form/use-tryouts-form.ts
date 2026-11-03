import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TryoutSubmissionError,
  submitTryoutApplication,
  type TryoutSubmissionFailure,
} from "@/ui/features/tryouts/api/submit-tryout-application";
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
  const [failure, setFailure] = useState<TryoutSubmissionFailure>("submit_failed");
  const honeypotRef = useRef<HTMLInputElement>(null);

  // Se valida al pulsar "Siguiente" o "Enviar", nunca al salir de un campo.
  const form = useForm<TryoutsFormValues>({
    resolver: zodResolver(tryoutsFormSchema),
    defaultValues: defaultTryoutsFormValues,
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  // Un campo que ya muestra error se revalida al escribir, para que el aviso desaparezca
  // en cuanto se corrige. Los campos sin error no se tocan hasta el siguiente paso.
  useEffect(() => {
    const subscription = form.watch((_values, { name }) => {
      if (name && form.getFieldState(name).error) void form.trigger(name);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const goNext = async () => {
    const isStepValid = await form.trigger([...STEP_FIELDS[currentStep]], { shouldFocus: true });
    if (isStepValid) setCurrentStep((step) => step + 1);
  };

  const goPrev = () => setCurrentStep((step) => step - 1);

  const onSubmit = form.handleSubmit(async (values) => {
    setStatus("submitting");
    try {
      // Se descartan los valores de campos que quedaron ocultos por otra respuesta
      const isFixedSchedule = values.scheduleType === "fixed";
      await submitTryoutApplication(
        {
          ...values,
          scheduleFrom: isFixedSchedule ? values.scheduleFrom : "",
          scheduleTo: isFixedSchedule ? values.scheduleTo : "",
          previousTeams: values.hasCompetitiveExp === "yes" ? values.previousTeams : "",
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        honeypotRef.current?.value,
      );
      setStatus("success");
    } catch (error) {
      setFailure(error instanceof TryoutSubmissionError ? error.reason : "submit_failed");
      setStatus("error");
    }
  });

  return {
    form,
    currentStep,
    totalSteps: STEP_FIELDS.length,
    status,
    failure,
    honeypotRef,
    goNext,
    goPrev,
    onSubmit,
  };
}
