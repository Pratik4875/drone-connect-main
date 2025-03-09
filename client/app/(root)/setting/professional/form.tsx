import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { APIError } from "@/types/global";
import { updatePilotProfessional } from "@/api/user_api";

// Zod Schema
const schema = z
  .object({
    ia_DGCA_license: z.union([
      z.boolean({
        required_error: "Please specify if you have a DGCA License.",
      }),
      z.string().min(1, "Please specify if you have a DGCA License."),
    ]),
    license_number: z
      .string()
      .min(6, "DGCA License number must be of 15 characters.")
      .max(6, "DGCA License number must not exceed 15 characters.")
      .regex(/^[A-Za-z0-9\-]+$/, {
        message:
          "DGCA License number can only contain letters, numbers, and hyphens.",
      })
      .optional()
      .or(z.literal("")),
    drone_category: z.union([
      z.enum(["micro", "small", "large", "nano", "medium"]),
      z.string().min(1, "Please select a category."),
    ]),
    available: z.boolean().optional(), // This is optional
  })
  .refine(
    (data) => {
      if (data.ia_DGCA_license === true) {
        return data.license_number !== "";
      }
      return true;
    },
    {
      message: "Please enter a your license number",
      path: ["license_number"],
    }
  );

// Component
export default function ProfessionalForm({
  drone_category,
  ia_DGCA_license,
  license_number,
  available,
}: {
  drone_category: "" | "micro" | "small" | "large" | "nano" | "medium" | null;
  ia_DGCA_license: boolean | null;
  license_number: string | null;
  available: boolean;
}) {
  const queryClient = useQueryClient(); // Access React Query's query client
  const mutation = useMutation({
    mutationFn: updatePilotProfessional,
    onMutate: () => {
      const toastId = toast.loading("Adding...");
      return { toastId }; // Return the toast ID to access it later
    },
    onSuccess: async (data, variables, context) => {
      toast.success("Successfully added!", { id: context.toastId });
      queryClient.invalidateQueries({ queryKey: ["professional"] }); // Invalidate the 'socials' query to refetch data
    },
    onError: (error: APIError, _variables, context) => {
      // Update the toast to show error
      toast.error(`Add to failed: ${error.response.data.message}`, {
        id: context?.toastId,
      });
    },
  });
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      ia_DGCA_license: ia_DGCA_license ?? "",
      license_number: license_number ?? "",
      drone_category:
        (drone_category as
          | ""
          | "micro"
          | "small"
          | "large"
          | "nano"
          | "medium") ?? "",
      available: available ?? false,
    },
    mode: "all",
  });

  const onSubmit: SubmitHandler<z.infer<typeof schema>> = (values) => {
    mutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5 max-w-3xl mx-auto min-h-dvh"
      >
        {/* DGCA License Question */}
        <FormField
          control={form.control}
          name="ia_DGCA_license"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Do you have DGCA License</FormLabel>
              <Select
                onValueChange={(val) => field.onChange(val === "true")}
                value={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Indicate whether you possess a DGCA license required for drone
                operation.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* DGCA License Number */}
        <FormField
          control={form.control}
          name="license_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>DGCA License Number</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your DGCA license number"
                  type="text"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide your valid DGCA license number for verification
                purposes. (Required if DGCA License is Yes)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Drone Category */}
        <FormField
          control={form.control}
          name="drone_category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Drone Category</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your drone category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="nano">Nano</SelectItem>
                  <SelectItem value="micro">Micro</SelectItem>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the category of your drone as per DGCA regulations.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Availability */}
        <FormField
          control={form.control}
          name="available"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Availability</FormLabel>
                <FormDescription>
                  Specify whether you are currently available for drone
                  operations.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
