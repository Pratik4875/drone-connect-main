import ForgotStepper from "@/components/forgot-password/ForgotStepper";
import Image from "next/image";
import React from "react";

const Page = () => {
  return (
    // <div classNameName="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
    //   <div classNameName="flex w-full max-w-sm flex-col gap-6">
    //     <a href="#" classNameName="flex items-center gap-2 self-center font-medium">
    //       <div classNameName="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
    //         {/* <GalleryVerticalEnd classNameName="size-4" /> */}
    //       </div>
    //       Acme Inc.
    //     </a>
    //     <div classNameName="flex flex-col gap-6">
    //   <Card>
    //     <CardHeader classNameName="text-center">
    //       <CardTitle classNameName="text-xl">Forgot Your Password?</CardTitle>
    //       <CardDescription>
    //       Enter your details below to recover your account
    //       </CardDescription>
    //     </CardHeader>
    //     <CardContent>
    //       <form>
    //         <div classNameName="grid gap-6">

    //           <div classNameName="grid gap-6">
    //             <div classNameName="grid gap-2">
    //               <Label htmlFor="email">Email</Label>
    //               <Input
    //                 id="email"
    //                 type="email"
    //                 placeholder="m@example.com"
    //                 required
    //               />
    //             </div>
    //             <Button type="submit" classNameName="w-full">
    //               Login
    //             </Button>
    //           </div>
    //           <div classNameName="text-center text-sm">
    //             Don&apos;t have an account?{" "}
    //             <a href="#" classNameName="underline underline-offset-4">
    //               Sign up
    //             </a>
    //           </div>
    //         </div>
    //       </form>
    //     </CardContent>
    //   </Card>

    // </div>
    //   </div>
    // </div>
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="relative flex flex-1 flex-col items-center justify-center pt-12 pb-16">
        <Image src={'/drone-connet.png'} alt="logo" className="mx-auto mb-16 size-24 text-slate-900" height={200} width={200} />
        <div className="max-w-sm">
          <h1 className="mb-2 text-center text-lg font-semibold text-gray-900">
            Reset your password
          </h1>
          <p className="mb-1 text-center text-sm">
            Enter your email and we will send you a OTP to reset your password.
          </p>
          <ForgotStepper />
          {/* <form action="/password/email" className="w-full">
            <div className="">
              <label
                htmlFor="email-address"
                className="block text-sm/6 font-semibold text-gray-900"
              >
                Email address
              </label>
              <input
                type="email"
                id="email-address"
                className="mt-2 appearance-none text-slate-900 bg-white rounded-md block w-full px-3 h-10 shadow-xs sm:text-sm focus:outline-hidden placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500 ring-1 ring-slate-200"
              />
            </div>
            <button
              type="submit"
              className="inline-flex justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-700 mt-6 w-full"
            >
              <span>Reset your password</span>
            </button>
          </form> */}
        </div>
      </div>
    </div>
  );
};

export default Page;
