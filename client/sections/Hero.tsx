"use client";
// import ArrowIcon from "@/assets/arrow-right.svg";
// import cogImage from "@/assets/cog.png";
// import cylinderImage from "@/assets/cylinder.png";
// import noodleImage from "@/assets/noodle.png";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const DotLottieReact = dynamic(
  () =>
    import("@lottiefiles/dotlottie-react").then((mod) => mod.DotLottieReact),
  {
    ssr: false, // Disable server-side rendering for this component
  }
);
export const Hero = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);

  const fadeInVariantsUp = {
    hidden: { opacity: 0, y: 100 }, // Start with opacity 0 and position left
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, transition: "all", delay: 0.5 },
    }, // Transition to opacity 1 and position 0
  };

  const fadeInVariantsUp2 = {
    hidden: { opacity: 0, y: 100 }, // Start with opacity 0 and position left
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, transition: "all", delay: 1 },
    }, // Transition to opacity 1 and position 0
  };

  return (
    <section
      ref={heroRef}
      className="pt-8 pb-20 md:pt-5 md:pb-10 overflow-x-clip min-h-dvh"
      style={{
        background:
          "radial-gradient(ellipse 200% 100% at bottom left, #183EC2, #EAEEFE 100%)",
      }}
    >
      <div className="container">
        <div className="md:flex items-center">
          <div className="md:w-[478px]">
            <motion.h1
              initial="hidden"
              viewport={{ once: true }}
              whileInView="visible"
              variants={fadeInVariantsUp}
              className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text mt-6"
            >
              Connect with Professional Drone Pilots in Minutes
            </motion.h1>
            <motion.p
              initial="hidden"
              viewport={{ once: true }}
              whileInView="visible"
              variants={fadeInVariantsUp2}
              className="text-xl text-[#010D3E] tracking-tight mt-6"
            >
              Simplifying drone photography and videography for clients and
              pilots alike.
            </motion.p>
            <div className="flex gap-1 items-center mt-[30px]">
            <Button asChild className="btn btn-primary">
      <Link href="/register">Register</Link>
    </Button>
    <Button asChild className="btn btn-text flex gap-1 bg-transparent text-black">
      <Link href="/login">Login</Link>
    </Button>
              
            </div>
          </div>
          <div className="mt-20 md:mt-0 md:h-[648px] md:flex-1 relative">
            <DotLottieReact
              src="https://assets-v2.lottiefiles.com/a/052a947c-1164-11ee-9eff-ffc34cc68537/UjjE2Xtvhu.lottie"
              loop
              autoplay
              className="md:absolute md:h-full scale-150 md:scale-100 md:w-auto md:max-w-none md:-left-10 lg:left-0"
              height={500}
              width={500}
            />

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                visible: {
                  y: 0,
                  opacity: 1,
                  transition: { transition: "all" },
                },
                hidden: { opacity: 0, y: -100 },
              }}
              className="hidden md:block -top-8 -left-38 md:absolute"
              style={{
                translateY: translateY,
              }}
            >
              <Image
                src={
                  "https://cdn3d.iconscout.com/3d/premium/thumb/drone-3d-icon-download-in-png-blend-fbx-gltf-file-formats--camera-quadcopter-technology-virtual-reality-pack-science-icons-3342616.png?f=webp"
                }
                width={220}
                height={220}
                alt="Cylinder image"
              />
            </motion.div>

            <motion.div
              style={{
                rotate: 0,
                translateY: translateY,
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                visible: {
                  y: 0,
                  opacity: 1,
                  transition: { transition: "all" },
                },
                hidden: { opacity: 0, y: 100 },
              }}
            >
              <Image
                src={
                  "https://cdn3d.iconscout.com/3d/premium/thumb/flying-drone-3d-icon-download-in-png-blend-fbx-gltf-file-formats--camera-quadcopter-pack-miscellaneous-icons-5265334.png?f=webp"
                }
                height={220}
                width={220}
                alt="Noodle image"
                className="hsidden lg:block top-[524px] left-[448px] absolute rotate-[30deg]"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
