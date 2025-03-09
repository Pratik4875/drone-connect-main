/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { GridOneWrapper } from "@/components/GridOneWarpper";
import CarouselCard from "./carousel-card";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile, getUserReview } from "@/api/user_api";
import GeneralInfo from "./general-info";
import ProfileCertificate from "./certificates";
import Loader from "@/components/loader";
import ExperienceTimeline from "@/components/experience-timeline";
import CompanyInfo from "../../setting/professional/company";
import { APIError } from "@/types/global";
import RatingComponent from "./rating-component";

interface RootObject {
  p_id: string;
  p_drone_category: string;
  p_is_company_person: boolean;
  p_ia_DGCA_license: boolean | null;
  p_license_number: string;
  p_available: boolean;
  p_socials: Psocial[];
  p_posts: any[];
  p_certificates: any[];
  p_experience: any[];
  p_company: Pcompany;
  name: string;
  city: string;
  state: string;
  _id: string;
  profile: string;
  user_id: string;
}

interface Pcompany {
  website: string;
  logo: string;
  name: string;
}

interface Psocial {
  platform: string;
  account: string;
}
interface Pilot {
  name: string;
  profile: string;
  user_id: string;
}

const Page = () => {
  const { id } = useParams<{ id: string }>(); // Correct TypeScript typing
  const { data, isLoading, isError, error } = useQuery<RootObject, APIError>({
    queryKey: ["pilot", id], // Include 'id' in queryKey for dynamic queries
    queryFn: () => getUserProfile(id),
    staleTime: 300000,
    enabled: !!id, // Prevent automatic fetch
  });
  const {
    data: reviewData,
    isLoading: reviewLoading,
    isError: reviewIsError,
  } = useQuery<any, APIError>({
    queryKey: ["pilot-review", id], // Include 'id' in queryKey for dynamic queries
    queryFn: () => getUserReview(id),
    staleTime: 300000,
    enabled: !!id, // Prevent automatic fetch
  });

  // Store recently viewed pilot in localStorage
  useEffect(() => {
    if (data) {
      const existingPilots: Pilot[] = JSON.parse(
        localStorage.getItem("recentlyViewedPilots") || "[]"
      );

      // Remove if pilot already exists
      const updatedPilots = existingPilots.filter(
        (pilot) => pilot.user_id !== data.user_id
      );

      // Add the new pilot at the beginning
      updatedPilots.unshift({
        name: data?.name,
        profile: data?.profile,
        user_id: data?.user_id,
      });

      // Keep only the last 5 pilots
      if (updatedPilots.length > 5) {
        updatedPilots.pop(); // Remove the oldest pilot
      }

      localStorage.setItem(
        "recentlyViewedPilots",
        JSON.stringify(updatedPilots)
      );
    }
  }, [data]);
  return (
    <GridOneWrapper>
      {isLoading && <Loader />}
      {isError && <p>{error?.response?.data?.message || "Error occured"}</p>}
      {data && (
        <div className="max-w-4xl mx-auto bg-white space-y-4 my-10 overflow-hidden p-0">
          <GeneralInfo
            city={data?.city}
            state={data?.state}
            droneCategory={data?.p_drone_category}
            socials={data?.p_socials}
            username={data?.name}
            userId={data?._id}
            profileImage={data?.profile}
            isAvailable={data?.p_available}
            pilot_id={data.p_id}
            isCompanyPerson={data.p_is_company_person}
            isLicense={data?.p_ia_DGCA_license}
          />
          {data.p_is_company_person && (
            <CompanyInfo
              canLeave={false}
              id=""
              logo={data?.p_company?.logo}
              name={data?.p_company?.name}
              website={data?.p_company?.website}
            />
          )}
          {data.p_experience.length > 0 && (
            <Card className="overflow-hidden">
              {/* Header Background */}
              <CardContent className="">
                <h1 className="text-2xl font-bold my-4">Experience</h1>
                <ExperienceTimeline data={data?.p_experience} editing={false} />
              </CardContent>
            </Card>
          )}
          {data.p_certificates.length > 0 && (
            <ProfileCertificate data={data.p_certificates} />
          )}
          {data.p_posts.length > 0 && (
            <Card className="overflow-hidden">
              {/* Header Background */}
              <CardContent className="">
                <h1 className="text-2xl font-bold my-4">Posts</h1>
                <CarouselCard
                  data={data?.p_posts}
                  id={id}
                  username={data?.name}
                  userId={data?.user_id}
                  profileImage={data?.profile}
                  isLicense={data?.p_ia_DGCA_license}
                />
              </CardContent>
            </Card>
          )}

          {
            !reviewIsError && !reviewLoading && <RatingComponent data={reviewData}/>
          }
          
        </div>
      )}
    </GridOneWrapper>
  );
};

export default Page;
