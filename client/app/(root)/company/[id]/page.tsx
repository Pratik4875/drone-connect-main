"use client";
import { GridOneWrapper } from "@/components/GridOneWarpper";
import React, { useEffect } from "react";
import GeneralInfoCompany from "./general-info";
import CompayPilots from "./pilot";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getCompanyProfile } from "@/api/user_api";
import Loader from "@/components/loader";
import { APIError } from "@/types/global";
interface RootObject {
  _id: string;
  website: string;
  logo: string;
  name: string;
  pilots: Pilot[];
}

interface Pilot {
  name: string;
  user_id: string;
  drone_category: string;
  profile: string;
}

interface company {
  name: string;
  logo: string;
  company_id: string;
}
const Page = () => {
  const { id } = useParams<{ id: string }>(); // Correct TypeScript typing
  const { data, isLoading, isError, error } = useQuery<RootObject, APIError>({
    queryKey: ["socials", id], // Include 'id' in queryKey for dynamic queries
    queryFn: () => getCompanyProfile(id),
    staleTime: 300000,
    enabled: !!id, // Prevent automatic fetch
  });
  
  console.log(data);
  useEffect(() => {
    if (data) {
      const existingPilots: company[] = JSON.parse(localStorage.getItem("recentlyViewedCompanies") || "[]");

      // Remove if pilot already exists
      const updatedPilots = existingPilots.filter((company) => company.company_id !== data?._id);

      // Add the new pilot at the beginning
      updatedPilots.unshift({
        name: data?.name,
        logo: data?.logo,
        company_id: data?._id
      });

      // Keep only the last 5 pilots
      if (updatedPilots.length > 5) {
        updatedPilots.pop(); // Remove the oldest pilot
      }

      localStorage.setItem("recentlyViewedCompanies", JSON.stringify(updatedPilots));
    }
  }, [data]);
  return (
    <GridOneWrapper>
      {isLoading && <Loader />}
      {isError && <p>{error?.response?.data?.message || "Error occured"}</p>}
      {data && (
        <div className="max-w-4xl mx-auto bg-white space-y-4 my-10 overflow-hidden p-0">
          <GeneralInfoCompany
            companyImage={data.logo}
            companyId={data._id}
            companyName={data.name}
            companyWebiste={data.website}
          />
          {data.pilots.length > 0 && <CompayPilots data={data.pilots} />}
        </div>
      )}
    </GridOneWrapper>
  );
};

export default Page;
