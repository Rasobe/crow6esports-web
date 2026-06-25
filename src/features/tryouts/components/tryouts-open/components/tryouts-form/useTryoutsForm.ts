"use client";

import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation } from "@tanstack/react-query";
import { TryoutsFormData, defaultTryoutsFormValues, STEP_FIELDS, tryoutsSchema } from "@/features/tryouts/schema";

async function submitTryouts(data: TryoutsFormData): Promise<void> {
    const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("tryouts.open.form.error.submit_failed");
    }
}

export function useTryoutsForm() {
    const totalSteps = Object.keys(STEP_FIELDS).length;
    const [currentStep, setCurrentStep] = useState(0);

    const form = useForm<TryoutsFormData>({
        resolver: zodResolver(tryoutsSchema) as Resolver<TryoutsFormData>,
        defaultValues: defaultTryoutsFormValues,
        mode: "onTouched",
    });

    const mutation = useMutation({
        mutationFn: submitTryouts,
    });

    const goNext = async () => {
        const isValid = await form.trigger(STEP_FIELDS[currentStep]);
        if (isValid) setCurrentStep(prev => prev + 1);
    };

    const goPrev = () => setCurrentStep(prev => prev - 1);

    const onSubmit = form.handleSubmit((data) => {
        mutation.mutate(data);
    });

    return {
        form,
        currentStep,
        totalSteps,
        isSubmitted: mutation.isSuccess,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        goNext,
        goPrev,
        onSubmit,
    };
}