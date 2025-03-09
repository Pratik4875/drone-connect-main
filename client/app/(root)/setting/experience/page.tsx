"use client";
import React from "react";
import AddExperience from "./add-experience";
import { useQuery } from "@tanstack/react-query";
import { getPilotExperience } from "@/api/user_api";
import Loader from "@/components/loader";
import ExperienceTimeline from "@/components/experience-timeline";
const Page = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["experience"],
    queryFn: getPilotExperience,
    staleTime: 300000,
  });

  return isLoading ? (
    <Loader />
  ) : (
    <div className="min-h-dvh">
      <div className="flex justify-between items-center">
        <h2 className="md:text-2xl text-xl font-semibold text-gray-900">
          Your Experience
        </h2>
        <AddExperience />
      </div>
      <div className="mt-5 flex flex-col gap-5">
        {/* <Socialcard /> */}
        {data?.experience && data?.experience.length > 0 ? (
          <ExperienceTimeline data={data?.experience} editing={true}/>
        ) : (
          <p>No Experience added!</p>
        )}
      </div>
    </div>
  );
};

export default Page;
