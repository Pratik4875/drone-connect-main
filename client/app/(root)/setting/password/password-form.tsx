"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import toast from "react-hot-toast";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { APIError } from "@/types/global";
import { profilePasswordUpdate } from "@/api/user_api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
const Schema = z
  .object({
    old_password: z.string().min(1, "Old password is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })
  .refine((data) => data.old_password !== data.password, {
    message: "Passwords must be different of old password.",
    path: ["password"],
  });
const PasswordUpdateForm = () => {
  const form = useForm<z.infer<typeof Schema>>({
    resolver: zodResolver(Schema),
    defaultValues: {
        old_password: "",
        password: "",
        confirmPassword: ""
      }
  });
  const mutation = useMutation({
    mutationFn: profilePasswordUpdate,
    onMutate: () => {
      const toastId = toast.loading("Updating...");
      return { toastId }; // Return the toast ID to access it later
    },
    onSuccess: async (data, variables, context) => {
        form.reset();
      toast.success("Updation successful!", { id: context.toastId });
    },
    onError: (error: APIError, _variables, context) => {
      // Update the toast to show error
      toast.error(`Updation failed: ${error.response.data.message}`, {
        id: context?.toastId,
      });
    },
  });
  function onSubmit(values: z.infer<typeof Schema>) {
    mutation.mutate(values);
  }
  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 max-w-3xl mx-auto py-4 min-h-dvh"
        >
          <FormField
            control={form.control}
            name="old_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="old_password">Old Password</FormLabel>
                <FormControl>
                  <PasswordInput id="old_password" required {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="password">New Password</FormLabel>
                <FormControl>
                  <PasswordInput id="password" required {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="confirmPassword">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <PasswordInput id="confirmPassword" required {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={mutation.isPending}>
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default PasswordUpdateForm;
