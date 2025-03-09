import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

const SuccessScreen = ({
  title,
  subtitle,
  buttonTitle,
  buttonHref,
}: {
  title: string;
  subtitle: string;
  buttonTitle: string;
  buttonHref: string;
}) => {
  return (
    <div className="relative w-full max-w-md h-full md:h-auto">
      <div className="relative  text-center flex flex-col items-center">
        <DotLottieReact
          src="https://assets-v2.lottiefiles.com/a/b36cb88a-1150-11ee-8f49-9b6c0bfe85bb/Y50UE4gUwg.lottie"
          autoplay
          className="size-48 scale-150 md:scale-100 "
          height={500}
          width={500}
        />
        <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
          {title}
        </h3>
        <p className="text-gray-600 my-5">{subtitle}</p>
        <Button asChild className="w-full">
          <Link href={buttonHref}>{buttonTitle}</Link>
        </Button>
      </div>
    </div>
  );
};

export default SuccessScreen;
