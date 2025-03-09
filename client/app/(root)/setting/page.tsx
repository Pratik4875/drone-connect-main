"use client";
import React from "react";
import ProfileForm from "./profile-form";
import withAuth from "@/components/withAuth";
const Page = () => {
  return <ProfileForm />;
};

export default withAuth(Page, ["c", "p", "o", "a"]);


