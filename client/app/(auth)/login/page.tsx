"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/hooks/useLogin";
import Link from "next/link";
import Image from "next/image";
import userStore from "@/store/userStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Page = () => {
  const router = useRouter();
  const { form, onSubmit } = useLogin();
  const { isAuthenticated, loading } = userStore();
  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        toast('Redirecting to the home'); // Show toast message immediately
        const timer = setTimeout(() => {
          router.replace('/blog'); // Redirect after delay
        }, 2000); // Delay in milliseconds (e.g., 2000ms = 2 seconds)
  
        return () => clearTimeout(timer); // Cleanup timeout on unmount or re-render
      }
    }
  }, [isAuthenticated, router, loading]);
  
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={"flex flex-col gap-6"}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className={"flex flex-col gap-6"}
                >
                  <div className="flex flex-col items-center gap-2 text-center">
                    <Image
                      src={"/drone-connet.png"}
                      alt="logo"
                      className="mx-auto mb-16 size-24 text-slate-900"
                      height={200}
                      width={200}
                    />
                    <h1 className="text-2xl font-bold">
                      Login to your account
                    </h1>
                    <p className="text-balance text-sm text-muted-foreground">
                      Enter your email below to login to your account
                    </p>
                  </div>
                  <div className="grid gap-6">
                    <div className="grid gap-2">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <FormControl>
                              <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-2">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex justify-between">
                              <FormLabel htmlFor="password">Password</FormLabel>
                              <Link
                                href="/forgot-password"
                                className="ml-auto text-sm underline-offset-4 hover:underline"
                              >
                                Forgot your password?
                              </Link>
                            </div>
                            <FormControl>
                              <Input
                                id="password"
                                type="password"
                                required
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      Login
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
