"use client";
import React from "react";
import withAuth from "@/components/withAuth";
import ProfessionalForm from "./form";
import { useQuery } from "@tanstack/react-query";
import { getPilotDetails } from "@/api/user_api";
import CompanyInfo from "./company";
const Page = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["professional"],
    queryFn: getPilotDetails,
    staleTime: 300000,
  });
  console.log(data);

  return isLoading ? null : (
    <>
      {data?.pilot?.company_id && data?.pilot?.is_company_person && (
        <CompanyInfo
          logo={data.pilot.company.logo}
          name={data.pilot.company.name}
          website={data.pilot.company.website}
          id={data.pilot.company_id}
          canLeave={true}
        />
      )}
      <ProfessionalForm
        drone_category={data.pilot.drone_category}
        ia_DGCA_license={data.pilot.ia_DGCA_license}
        license_number={data.pilot.license_number}
        available={data.pilot.available}
      />
    </>
  );
};
export default withAuth(Page, ["p"]);
