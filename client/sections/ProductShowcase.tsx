"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
const fadeInVariantsLeft = {
  hidden: { opacity: 0, x: -100 }, // Start with opacity 0 and position left
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, transition: "all", delay: 0.5 },
  }, // Transition to opacity 1 and position 0
};
const fadeInVariantsTop = {
  hidden: { opacity: 0, y: -100 }, // Start with opacity 0 and position left
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, transition: "all", delay: 0.5 },
  }, // Transition to opacity 1 and position 0
};
const fadeInVariantsBottom = {
  hidden: { opacity: 0, y: 100 }, // Start with opacity 0 and position left
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, transition: "all", delay: 0.5 },
  }, // Transition to opacity 1 and position 0
};
const fadeInVariantsRight = {
  hidden: { opacity: 0, y: 100 }, // Start with opacity 0 and position left
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, transition: "all", delay: 0.5 },
  }, // Transition to opacity 1 and position 0
};
export function ProductShowcase() {
  return (
    <section>
      <div className="bg-gray-50  py-24 sm:py-32">
        <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
          <h2 className="section-title mt-5 ">Why Choose Us?</h2>
          <p className="section-des mt-5">
            Discover how our platform simplifies drone photography and
            videography for clients and pilots alike.
          </p>
          <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
            <motion.div
              initial="hidden"
              viewport={{ once: true, amount: "some"}}
              whileInView="visible"
              variants={fadeInVariantsLeft}
              className="relative lg:row-span-2"
            >
              <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem]"></div>
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
                <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
                  <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                  Seamless Connections
                  </p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                  Easily find and book skilled drone pilots near you.
                  </p>
                </div>
                <div className="relative min-h-[30rem] w-full grow [container-type:inline-size] max-lg:mx-auto max-lg:max-w-sm">
                  <div className="absolute inset-x-10 bottom-0 top-10 overflow-hidden rounded-t-[12cqw] border-x-[3cqw] border-t-[3cqw] border-gray-700 bg-gray-900 shadow-2xl">
                    <Image
                      className="size-full object-cover object-top"
                      src="https://272c5fb8.rocketcdn.me/wp-content/uploads/2023/02/umiles-diferencias-entre-piloto-y-operador-de-drones-02.jpg"
                      alt=""
                      height={200}
                      width={200}
                    />
                  </div>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-l-[2rem]"></div>
            </motion.div>
            <motion.div
              initial="hidden"
              viewport={{ once: true, amount: "some"}}
              whileInView="visible"
              variants={fadeInVariantsTop}
              className="relative max-lg:row-start-1"
            >
              <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-t-[2rem]"></div>
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
                <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                  <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                  Post Your Requirements
                  </p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                  Specify detailed needs for tailored services.
                  </p>
                </div>
                <div className="flex flex-1 items-center justify-center px-8 max-lg:pb-12 max-lg:pt-10 sm:px-10 lg:pb-2">
                  <Image
                    className="w-full max-lg:max-w-xs rounded-lg"
                    src="https://5.imimg.com/data5/BI/FJ/GLADMIN-26100334/post-your-requirement-service-500x500.jpg"
                    alt=""
                    height={200}
                    width={200}
                  />
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-t-[2rem]"></div>
            </motion.div>
            <motion.div
              initial="hidden"
              viewport={{ once: true, amount: "some"}}
              whileInView="visible"
              variants={fadeInVariantsBottom}
              className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2"
            >
              <div className="absolute inset-px rounded-lg bg-white"></div>
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)]">
                <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                  <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                  Flexible Opportunities
                  </p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                  Support freelance drone pilots with new gigs
                  </p>
                </div>
                <div className="flex flex-1 items-center justify-center px-8 max-lg:pb-12 max-lg:pt-10 sm:px-10 lg:pb-2">
                  <Image
                    className="w-full max-lg:max-w-xs rounded-lg"
                    src="https://cognizant.scene7.com/is/image/cognizant/video-banner-how-can-a-hundred-year-old-utility-reinvent-itself-desktop-1"
                    alt=""
                    height={200}
                    width={200}
                  />
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5"></div>
            </motion.div>
            <motion.div 
            initial="hidden"
            viewport={{ once: true, amount: "some"}}
            whileInView="visible"
            variants={fadeInVariantsRight}
            className="relative lg:row-span-2">
              <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
                <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
                  <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                  User-Friendly Design
                  </p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                  Intuitive interface for effortless navigation.
                  </p>
                </div>
                <div className="relative min-h-[30rem] w-full grow">
                <Image
                      className="size-full object-cover object-top"
                      src="https://cdn.dribbble.com/userupload/6580601/file/original-50800a769bc86bee1d786f1afcfa569b.png"
                      alt=""
                      height={200}
                      width={200}
                    />
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
