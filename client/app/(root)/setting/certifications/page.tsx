"use client";
import React from "react";
import AddCertification from "./add-certificate";
import Certificate from "../../../../components/certificate";
import { useQuery } from "@tanstack/react-query";
import { getPilotCertificate } from "@/api/user_api";
import Loader from "@/components/loader";
import { certificateProps } from "@/types/certificate";
const Page = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["certifications"],
    queryFn: getPilotCertificate,
    staleTime: 300000,
  });

  return isLoading ? (
    <Loader />
  ) : (
    <div className="min-h-dvh">
      <div className="flex justify-between items-center">
        <h2 className="md:text-2xl text-xl font-semibold text-gray-900">
          Your Certifications
        </h2>
        <AddCertification />
      </div>
      <div className="mt-5 flex flex-col gap-5">
        {/* <Socialcard /> */}
        { data?.certificates && data?.certificates.length > 0 ? (
          data.certificates.map(
            (data: certificateProps, index: React.Key | null | undefined) => (
              <Certificate
                expiry_date={data.expiry_date}
                _id={data._id}
                name={data.name}
                url={data.url}
                key={index}
                edit={true}
              />
            )
          )
        ) : (
          <p>No certificates added!</p>
        )}
      </div>
    </div>
  );
};

export default Page;
