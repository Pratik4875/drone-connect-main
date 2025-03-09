"use client";
import React from "react";
import { FormProvider } from "react-hook-form";
import { useForgot } from "@/hooks/useForgot";

const ForgotStepper = () => {
  const { CurrentStepComponent, methods, goToNextStep, loading } = useForgot();
  return (
    <div className="flex flex-col gap-6 mt-10">
      <FormProvider {...methods}>
        <CurrentStepComponent
          onNext={goToNextStep}
          loading={loading}
          title={"Password Reset Successfully!"}
          subtitle="Your password has been updated. You can now log in with the new credentials."
          buttonHref="/login"
          buttonTitle="Login"
        />
      </FormProvider>
    </div>
  );
};

export default ForgotStepper;
