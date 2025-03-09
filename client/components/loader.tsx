import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import React from "react";

const Loader = () => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <DotLottieReact
        src="https://assets-v2.lottiefiles.com/a/f1238826-1163-11ee-b850-5bbcb884107a/uJTMTEJuHX.lottie"
        loop
        autoplay
        className="scale-100 md:scale-100 md:w-auto md:max-w-none h-[100dvh]"
        height={"100%"}
        width={"100%"}
      />
    </div>
  );
};

export default Loader;
