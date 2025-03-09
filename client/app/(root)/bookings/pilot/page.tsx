"use client";
import PilotCompanyPage from "@/components/PilotCompanyBooking";
import withAuth from "@/components/withAuth";
import React from "react";

const Page: React.FC = () => {
  return <PilotCompanyPage type="pilot" />;
};

export default withAuth(Page, ["p"]);
