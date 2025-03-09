"use client";
import React from "react";
import CompanyForm from "./company-form";
import { useQuery } from "@tanstack/react-query";
import { getUserCompany } from "@/api/user_api";
import withAuth from "@/components/withAuth";

const Page = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["company"],
    queryFn: getUserCompany,
    staleTime: 300000,
  });
  return isLoading ? null : (
    <CompanyForm
      logo={data.company.logo}
      name={data.company.name}
      gst={data.company.gst}
      url={data.company.website}
      status={data.company.status}
    />
  );
};

export default withAuth(Page, ["o"]);
