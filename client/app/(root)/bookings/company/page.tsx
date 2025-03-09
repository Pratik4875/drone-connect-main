"use client";
import React from "react";
import withAuth from "@/components/withAuth";
import PilotCompanyPage from "@/components/PilotCompanyBooking";

const Page: React.FC = () => {
  return <PilotCompanyPage type="company" />;
};

export default withAuth(Page, ["o"]);
