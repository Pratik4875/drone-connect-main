import Link from "next/link";
import Image from "next/image";
import RegisterStepper from "@/components/register/RegisterStepper";

const Page = () => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center">
          <Image src={'/drone-connet.png'} alt="logo" className="mx-auto mb-16 size-24 text-slate-900" height={200} width={200} />

          </Link>
          
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <RegisterStepper />
            <div className="text-center text-sm mt-5">
              Already have an account?{" "}
              <Link href="/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          src="https://images.unsplash.com/photo-1622048982661-af7d1bdff6c3?q=80&w=3269&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          height={700}
          width={700}
        />
      </div>
    </div>
  );
};

export default Page;
