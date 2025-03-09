import { z } from "zod";

export const RegisterSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Full Name must be at least 2 characters long." })
      .max(100, { message: "Full Name must be at most 100 characters long." }),
    email: z
      .string()
      .min(2, { message: "Email must be at least 2 characters long." })
      .max(50, { message: "Email must be at most 50 characters long." })
      .email({ message: "Invalid email address." }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long." })
      .max(50, { message: "Password must be at most 50 characters long." }),
    confirmPassword: z.string({
      required_error: "Please confirm your password.",
    }),
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
    user_type: z.enum(["p", "c", "company"], {
      required_error: "Please select a valid user type.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"], // Specify the field for the error message
  });

export type RegisterType = z.infer<typeof RegisterSchema>;
