"use client";
import React from "react";
import AddSocial from "./add-socials";
import Socialcard from "./social-card";
import { useQuery } from "@tanstack/react-query";
import { getPilotSocials } from "@/api/user_api";
import Loader from "@/components/loader";

const Page = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["socials"],
    queryFn: getPilotSocials,
    staleTime: 300000,
  });

  return isLoading ? (
    <Loader />
  ) : (
    <div className="min-h-dvh">
      <div className="flex justify-between items-center">
        <h2 className="md:text-2xl text-xl font-semibold text-gray-900">
          Your Social Links
        </h2>
        <AddSocial />
      </div>
      <div className="mt-5 flex flex-col gap-5">
        {/* <Socialcard /> */}
        {data?.socials.length > 0 ? (
          data.socials.map((data: { account: string; platform: string; }, index: React.Key | null | undefined) => (
            <Socialcard
              account={data.account}
              social={data.platform}
              key={index}
            />
          ))
        ) : (
          <p>No social links added!</p>
        )}
      </div>
    </div>
  );
};

export default Page;
