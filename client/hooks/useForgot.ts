import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useState } from "react";
import { z } from "zod";
import { ForgotPassword, sendForgotOTP, verifyOTP } from "@/api/user_api";
import StepOne from "@/components/register/StepOne";
import StepTwo from "@/components/register/StepTwo";
import StepFive from "@/components/register/StepFive";
import SuccessScreen from "@/components/SuccessScreen";
// https://assets-v2.lottiefiles.com/a/b36cb88a-1150-11ee-8f49-9b6c0bfe85bb/Y50UE4gUwg.lottie
type APIError = {
  response: {
    data: {
      message: string;
    };
  };
};
export const useForgot = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const stepOneSchema = z.object({
    email: z.string().email("Invalid email"),
  });

  const stepTwoSchema = stepOneSchema.extend({
    otp: z.string().length(6, "Code must be 6 digits"),
  });

  const stepThreeSchema = stepOneSchema
    .extend({
      password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long." })
        .max(50, { message: "Password must be at most 50 characters long." }),
      confirmPassword: z.string({
        required_error: "Please confirm your password.",
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    });

  const stepSchemas = [stepOneSchema, stepTwoSchema, stepThreeSchema];

  // Form methods
  const methods = useForm({
    resolver: zodResolver(stepSchemas[currentStep - 1]), // Adjust resolver for current step
    mode: "onChange",
  });

  const stepOneMutation = useMutation({
    mutationFn: sendForgotOTP,
    onSuccess: async (data) => {
      console.log("Step 1 success", data);
      handleNext();
    },
    onError: (error: APIError) => {
      toast.error(`Failed to send OTP : ${error.response.data.message}`);
    },
  });

  const stepTwoMutation = useMutation({
    mutationFn: verifyOTP,
    onSuccess: async () => {
      handleNext();
    },
    onError: (error: APIError) => {
      toast.error(
        `Password verification failed: ${error.response.data.message}`
      );
    },
  });

  const mutation = useMutation({
    mutationFn: ForgotPassword,

    onSuccess: async (_data, _variables, context: { toastId: string }) => {
      handleNext();
      methods.reset();
      toast.success("Password updated successfully", { id: context.toastId });
    },
    onError: (error: APIError) => {
      toast.error(`Password update failed: ${error.response.data.message}`);
    },
  });

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };
  const steps = [
    { id: 1, component: StepOne, onSubmit: stepOneMutation.mutate },
    { id: 2, component: StepTwo, onSubmit: stepTwoMutation.mutate },
    { id: 3, component: StepFive, onSubmit: mutation.mutate },
    { id: 4, component: SuccessScreen, onSubmit: mutation.mutate },
  ];

  const goToNextStep = async () => {
    const isValid = await methods.trigger();
    if (isValid) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formData = methods.getValues() as any;
      if (formData) {
        try {
          steps[currentStep - 1].onSubmit(formData);
        } catch (error) {
          console.error("Error:", error);
        }
      }
    }
  };

  const loading =
    stepOneMutation.isPending ||
    stepTwoMutation.isPending ||
    mutation.isPending;
  const CurrentStepComponent = steps[currentStep - 1].component;

  return {
    loading,
    CurrentStepComponent,
    goToNextStep,
    handleNext,
    methods,
  };
};
