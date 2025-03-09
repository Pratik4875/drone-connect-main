import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useState } from "react";
import { z } from "zod";
import {
  registerUser,
  sendRegisterOTP,
  verifyOTP,
} from "@/api/user_api";
import StepOne from "@/components/register/StepOne";
import StepTwo from "@/components/register/StepTwo";
import StepThree from "@/components/register/StepThree";
import StepFour from "@/components/register/StepFour";
import StepFive from "@/components/register/StepFive";
import SuccessScreen from "@/components/SuccessScreen";

type APIError = {
  response: {
    data: {
      message: string;
    };
  };
};
export const useRegister = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const stepOneSchema = z.object({
    email: z.string().email("Invalid email"),
  });

  const stepTwoSchema = stepOneSchema.extend({
    otp: z.string().length(6, "Code must be 6 digits"),
  });

  const stepThreeSchema = stepOneSchema.extend({
    name: z
      .string()
      .min(2, { message: "Full Name must be at least 2 characters long." })
      .max(100, { message: "Full Name must be at most 100 characters long." }),
    user_type: z.enum(["p", "c", "o"], {
      required_error: "Please select a valid user type.",
    }),
  });

  const stepFourSchema = stepOneSchema.extend({
    state: z.string({
      required_error: "Please select a state.",
    }),
    district: z.string({
      required_error: "Please select a district.",
    }),
    city: z.string({
      required_error: "Please select a city.",
    }),
    pincode: z.string({
      required_error: "Please select a pincode.",
    }),
  });

  const stepFiveSchema = stepOneSchema
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

  const stepSchemas = [
    stepOneSchema,
    stepTwoSchema,
    stepThreeSchema,
    stepFourSchema,
    stepFiveSchema,
  ];

  // Form methods
  const methods = useForm({
    resolver: zodResolver(stepSchemas[currentStep - 1]), // Adjust resolver for current step
    mode: "onChange",
  });

  const stepOneMutation = useMutation({
    mutationFn: sendRegisterOTP,
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
    onSuccess: async (data) => {
      console.log("Step 2 success", data);
      handleNext();
    },
    onError: (error: APIError) => {
      toast.error(
        `Password verification failed: ${error.response.data.message}`
      );
    },
  });

  const mutation = useMutation({
    mutationFn: registerUser,
    onMutate: () => {
      const toastId = toast.loading("Loading...");
      return { toastId }; // Context has a toastId property
    },
    onSuccess: async (_data, _variables, context: { toastId: string }) => {
      toast.success("Register successful!", { id: context.toastId });
      handleNext();
    },
    onError: (error: APIError, _variables, context?: { toastId: string }) => {
      toast.error(`Register failed: ${error.response.data.message}`, {
        id: context?.toastId,
      });
    },
  });

  const handleNext = () => {
    console.log("going nexttt");
    
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
    setProgress((prev) => prev + 20);
  };
  const steps = [
    { id: 1, component: StepOne, onSubmit: stepOneMutation.mutate },
    { id: 2, component: StepTwo, onSubmit: stepTwoMutation.mutate },
    {
      id: 3,
      component: StepThree,
      onSubmit: () => {
        handleNext();
      },
    },
    {
      id: 4,
      component: StepFour,
      onSubmit: () => {
        handleNext();
      },
    },
    { id: 5, component: StepFive, onSubmit: mutation.mutate },
    { id: 6, component: SuccessScreen, onSubmit: () => {} },

  ];

  const goToNextStep = async () => {
    console.log("next stepp goingg broooooo");
    
    const isValid = await methods.trigger();
    console.log(isValid);
    
    if (isValid) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formData = methods.getValues() as any;
      console.log(formData);
      
      if (formData) {
        try {
          console.log(steps[currentStep - 1]);
          steps[currentStep - 1].onSubmit(formData)
          
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
    progress,
    loading,
    CurrentStepComponent,
    goToNextStep,
    handleNext,
    methods
  };
};
