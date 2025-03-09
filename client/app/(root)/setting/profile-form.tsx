/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import toast from "react-hot-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { LocationHelper } from "@/utils/LocationHelper";
import userStore, { User } from "@/store/userStore";
import ProfileUpdate from "./profile-update";
import { useMutation } from "@tanstack/react-query";
import { profileGeneralInfoUpdate } from "@/api/user_api";
import { APIError } from "@/types/global";
const Schema = z.object({
  name: z
    .string()
    .min(2, { message: "Full Name must be at least 2 characters long." })
    .max(100, { message: "Full Name must be at most 100 characters long." })
    .trim(),
  email: z.string().email("Invalid email").trim(),
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

const ProfileForm = () => {
  const [initialValues, setInitialValues] = useState<z.infer<
    typeof Schema
  > | null>(null);
  const {
    cities,
    districts,
    fetchCities,
    fetchPincodes,
    getDistrict,
    pincodes,
    states,
    getDistrictByStateName,
  } = LocationHelper();
  const { user, loading, updateUser } = userStore();
  const form = useForm<z.infer<typeof Schema>>({
    resolver: zodResolver(Schema),
  });

  useEffect(() => {
    if (!loading && user) {
      initializeFormValues(user);
    }
  }, [loading, user]);

  function initializeFormValues(userData: User) {
    const initialFormValues = {
      name: userData.name!,
      email: userData.email!,
      state: userData.state ? userData.state : "",
      district: userData.district!,
      city: userData.city!,
      pincode: userData.pincode?.toString()!,
    };

    form.setValue("name", userData.name!);
    form.setValue("email", userData.email!);
    form.setValue("state", userData.state!);
    if (userData.state) {
      getDistrict(userData.state!);
    }
    if (userData.state) {
      getDistrictByStateName(userData.state!);
    }

    form.setValue("district", userData.district!);
    if (userData.state) {
      fetchCities(userData.state!);
    }
    form.setValue("city", userData.city!);
    if (userData.state && userData.city) {
      fetchPincodes(userData.state!, userData.city!);
    }
    form.setValue("pincode", userData.pincode?.toString()!);
    setInitialValues(initialFormValues);
  }
  const mutation = useMutation({
    mutationFn: profileGeneralInfoUpdate,
    onMutate: () => {
      const toastId = toast.loading("Updating...");
      return { toastId }; // Return the toast ID to access it later
    },
    onSuccess: async (data, variables, context) => {
      toast.success("Updation successful!", { id: context.toastId });
      console.log(data, variables, context);

      updateUser({
        city: variables.city,
        district: variables.district,
        state: variables.state,
        pincode: variables.pincode,
        name: variables.name,
      });
    },
    onError: (error: APIError, _variables, context) => {
      // Update the toast to show error
      toast.error(`Updation failed: ${error.response.data.message}`, {
        id: context?.toastId,
      });
    },
  });
  function onSubmit(values: z.infer<typeof Schema>) {
    try {
      // Compare current values with initial values
      const isDataChanged =
        JSON.stringify(values) !== JSON.stringify(initialValues);
      if (!isDataChanged) {
        toast.error("No changes made to the form.");
        return;
      }
      mutation.mutate(values);
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <div>
      <ProfileUpdate src={user.profile!} fullname={user.name!} />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 max-w-3xl mx-auto py-4 min-h-dvh"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fullname</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" type="" {...field} />
                </FormControl>
                <FormDescription>Enter a title for the event.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="shadcn"
                    type="email"
                    readOnly
                    {...field}
                  />
                </FormControl>
                <FormDescription>Enter a title for the event.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col md:flex-row items-center gap-5">
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>State</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between"
                        >
                          {field.value
                            ? states.find(
                                (state: { state: string; code: string }) =>
                                  state.state === field.value
                              )?.state
                            : "Select your state"}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search state..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No state found.</CommandEmpty>
                          <CommandGroup>
                            {states.map(
                              (state: { state: string; code: string }) => (
                                <CommandItem
                                  value={state.state}
                                  key={state.code}
                                  onSelect={() => {
                                    form.setValue("state", state.state);
                                    getDistrict(state.code); // Fetch districts for selected state
                                    fetchCities(state.state); // Fetch cities for selected state
                                    form.setValue("district", ""); // Reset district field
                                    form.setValue("city", ""); // Reset district field
                                    form.setValue("pincode", ""); // Reset district field
                                  }}
                                >
                                  {state.state}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      state.state === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              )
                            )}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>District</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between"
                        >
                          {field.value
                            ? districts.find(
                                (district) => district === field.value
                              ) || "Select your district"
                            : "Select your district"}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search district..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No district found.</CommandEmpty>
                          <CommandGroup>
                            {districts?.map((district) => (
                              <CommandItem
                                value={district}
                                key={district}
                                onSelect={() => {
                                  form.setValue("district", district);
                                  form.setValue("city", ""); // Reset district field
                                  form.setValue("pincode", ""); // Reset district field
                                }}
                              >
                                {district}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    district === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col md:flex-row items-center gap-5">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>City</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between"
                        >
                          {field.value
                            ? cities.find((city) => city === field.value) ||
                              "Select your city"
                            : "Select your city"}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search city..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No city found.</CommandEmpty>
                          <CommandGroup>
                            {cities.map((city) => (
                              <CommandItem
                                value={city}
                                key={city}
                                onSelect={() => {
                                  form.setValue("city", city);
                                  fetchPincodes(form.getValues("state"), city); // Fetch pincodes for selected city
                                  form.setValue("pincode", ""); // Reset pincode field
                                }}
                              >
                                {city}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    city === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pincode"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Pincode</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between"
                        >
                          {field.value
                            ? pincodes.find(
                                (pincode) => pincode === field.value
                              ) || "Select your pincode"
                            : "Select your pincode"}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search pincode..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No pincode found.</CommandEmpty>
                          <CommandGroup>
                            {pincodes.map((pincode) => (
                              <CommandItem
                                value={pincode}
                                key={pincode}
                                onSelect={() => {
                                  form.setValue("pincode", pincode);
                                }}
                              >
                                {pincode}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    pincode === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={mutation.isPending}>
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ProfileForm;
