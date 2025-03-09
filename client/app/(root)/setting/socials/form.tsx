"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Config, SocialLinks } from "social-links";
import { UseMutationResult } from "@tanstack/react-query";
import { APIError } from "@/types/global";
import { SocialInput, SocialResponse } from "@/types/socials";

const config: Config = {
  usePredefinedProfiles: true,
  trimInput: true,
  allowQueryParams: false,
};
const socialLinks = new SocialLinks(config);

type SocialFormData = z.infer<typeof socialFormSchema>;

// Predefined social accounts
const socialAccounts = [
  {
    social: "Facebook",
    url: "https://facebook.com/",
  },
  {
    social: "Instagram",
    url: "https://instagram.com/",
  },
  {
    social: "Linkedin",
    url: "https://www.linkedin.com/in/",
  },
  {
    social: "Youtube",
    url: "https://youtube.com/@",
  },
];

// Define the schema
const socialFormSchema = z
  .object({
    platform: z.string().nonempty("Please select a social platform."),
    url: z
      .string()
      .url("Please enter a valid URL.")
      .nonempty("Profile URL is required."),
  })
  .refine(
    (data) => {
      const domain = socialLinks.detectProfile(data.url);
      
      if (domain !== data.platform.toLocaleLowerCase()) {
        return false;
      }
      return socialLinks.isValid(domain, data.url);
    },
    {
      message: "URL doesnt match with the select platform",
      path: ["url"],
    }
  );

const SocialForm = ({
  platform,
  url,
  mutation,
  loading
}: {
  platform: string;
  url: string;
  mutation: UseMutationResult<
    SocialResponse, // Response type
    APIError, // Error type
    SocialInput, // Variables/input type
    { toastId: string } // Context type
  >;
  loading: boolean
}) => {
  const form = useForm<SocialFormData>({
    resolver: zodResolver(socialFormSchema),
    defaultValues: {
      platform: platform,
      url: url,
    },
  });

  const onSubmit = (data: SocialFormData) => {
    const domain = socialLinks.detectProfile(data.url); // 'linkedin'
    const updatedData = {
      platform: data.platform,
      account: socialLinks.getProfileId(domain, data.url),
    };
    mutation.mutate(updatedData);
    console.log("Form Data:", updatedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Social Platform */}
        <FormField
          control={form.control}
          name="platform"
          render={({ field }) => (
            <FormItem>
              <Label>Social Platform</Label>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a platform" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {socialAccounts.map((platform) => (
                    <SelectItem key={platform.social} value={platform.social}>
                      {platform.social}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Profile URL */}
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <Label>Profile URL</Label>
              <FormControl>
                <Input placeholder="https://example.com/profile" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={loading}>
          Save changes
        </Button>
      </form>
    </Form>
  );
};

export default SocialForm;
