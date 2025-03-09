import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import userStore from "@/store/userStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { APIError } from "@/types/global";
import {
  addPilotCompany,
  addPilotToCompany,
  fetchPilotByEmail,
} from "@/api/user_api";
import debounce from "lodash.debounce";
import AvatarProfile from "@/components/Avatar";

const formSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string(),
});
const AddPilotCompanyModal = () => {
  const { isAuthenticated, user } = userStore();
  const queryClient = useQueryClient(); // Access React Query's query client
  const [email, setEmail] = useState("");
  const [debouncedEmail, setDebouncedEmail] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [companyId, setCompanyId] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      setCompanyId(user.company_id!);
    } else {
      setCompanyId(null);
    }
    console.log(companyId);
  }, [isAuthenticated, user]); // Dependencies
  const debounceEmailChange = useCallback(
    debounce((value) => {
      if (value.trim() === "") {
        setDebouncedEmail(""); // Don't fetch when erasing everything
      } else {
        setDebouncedEmail(value);
      }
    }, 500),
    []
  );
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValid(emailRegex.test(debouncedEmail));
  }, [debouncedEmail]);
  // Fetch Pilot Details
  const { data: pilot, isFetching } = useQuery({
    queryKey: ["pilot", debouncedEmail],
    queryFn: () => fetchPilotByEmail(email),
    enabled: isValid && debouncedEmail.length > 0, // Prevent API calls when erasing
  });

  const mutationAlready = useMutation({
    mutationFn: addPilotToCompany,
    onMutate: () => {
      const toastId = toast.loading("Adding...");
      return { toastId }; // Return the toast ID to access it later
    },
    onSuccess: async (data, variables, context) => {
      toast.success("Successfully added!", { id: context.toastId });
      setEmail("");
      debounceEmailChange("");
      queryClient.invalidateQueries({ queryKey: ["company-pilots-list"] }); // Invalidate the 'socials' query to refetch data
    },
    onError: (error: APIError, _variables, context) => {
      // Update the toast to show error
      toast.error(`Add to failed: ${error.response.data.message}`, {
        id: context?.toastId,
      });
    },
  });
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    debounceEmailChange(value);
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
    },
  });
  const mutation = useMutation({
    mutationFn: addPilotCompany,
    onMutate: () => {
      const toastId = toast.loading("Adding...");
      return { toastId }; // Return the toast ID to access it later
    },
    onSuccess: async (data, variables, context) => {
      toast.success("Successfully added!", { id: context.toastId });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["company-pilots-list"] }); // Invalidate the 'socials' query to refetch data
    },
    onError: (error: APIError, _variables, context) => {
      // Update the toast to show error
      toast.error(`Add to failed: ${error.response.data.message}`, {
        id: context?.toastId,
      });
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    const data = {
      id: companyId,
      ...values,
    };
    mutation.mutate(data);
  }
  const handleSubmit = () => {
    if (pilot) {
      mutationAlready.mutate({ id: companyId!, email });
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Pilot</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Pilot</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="new_user">New User</TabsTrigger>
            <TabsTrigger value="already_user">Already User</TabsTrigger>
          </TabsList>
          <TabsContent value="new_user">
            <Card>
              <CardHeader>
                <CardTitle>New User</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-3 max-w-full mx-auto"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Joe Doe"
                              type="text"
                              {...field}
                            />
                          </FormControl>

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
                              placeholder="example@gmail.com"
                              type="email"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Submit</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="already_user">
            <Card>
              <CardHeader>
                <CardTitle>Already User</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      placeholder="example@gmail.com"
                      required
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                    />
                  </div>

                  {isFetching && <p>Loading pilot details...</p>}
                  {pilot && (
                    <div className="flex items-center w-max">
                      {/* <img
                      src="https://readymadeui.com/profile_4.webp"
                      className="w-9 h-9 rounded-full shrink-0"
                    /> */}
                      <AvatarProfile
                        className="md:size-16 size-9"
                        src={
                          pilot.profile
                            ? `https://res.cloudinary.com/dcv9bhbly/image/upload/v1736958453/${pilot.profile}`
                            : ""
                        } // Display file URL if file selected, else fallback to default src
                        fallbackClassName="text-xl"
                        fallbackText={pilot.name}
                      />
                      <div className="ml-4">
                        <p className="text-sm text-black capitalize">
                          {pilot.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {pilot.email}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 capitalize">
                          {pilot.category} size Drones
                        </p>
                      </div>
                    </div>
                    // <div className="border p-2 rounded">
                    //   <p>
                    //     <strong>Name:</strong> {pilot.name}
                    //   </p>
                    //   <p>
                    //     <strong>Email:</strong> {pilot.email}
                    //   </p>
                    //   <p>
                    //     <strong>Experience:</strong> {pilot.experience} years
                    //   </p>
                    // </div>
                  )}

                  <Button
                    onClick={handleSubmit}
                    disabled={!pilot || mutationAlready.isPending}
                  >
                    {mutationAlready.isPending ? "Adding..." : "Add Pilot"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddPilotCompanyModal;
