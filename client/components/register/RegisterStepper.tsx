"use client";

import React from "react";
import { Progress } from "@/components/ui/progress";
import { FormProvider } from "react-hook-form";
import { useRegister } from "@/hooks/useRegister";

const RegisterStepper = () => {
  const { CurrentStepComponent, methods, goToNextStep, progress, loading } =
    useRegister();    
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your details below to create your account
        </p>
      </div>
      {
        progress !== 100 && <Progress value={progress} className="h-1" />
      }
      
      <FormProvider {...methods}>
        <CurrentStepComponent
          onNext={goToNextStep}
          loading={loading}
          title={"Account Created Successfully!"}
          subtitle="Welcome aboard! You can now log in and start exploring."
          buttonHref="/login"
          buttonTitle="Login"
        />
      </FormProvider>
    </div>
  );
};

export default RegisterStepper;
