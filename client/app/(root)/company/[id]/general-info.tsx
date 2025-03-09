"use client";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import React from "react";
import { FiEdit2 } from "react-icons/fi";
import userStore from "@/store/userStore";
import AvatarProfile from "@/components/Avatar";
import { Globe } from "lucide-react";
import BookPilot from "../../pilots/[id]/book-pilot";

const GeneralInfoCompany = ({
  companyName,
  companyId,
  companyImage,
  companyWebiste,
}: {
  companyName: string;
  companyWebiste: string;
  companyId: string;
  companyImage: string;
}) => {
  const { user, isAuthenticated } = userStore();

  return (
    <Card className="overflow-hidden">
      {/* Header Background */}
      <CardContent className="p-0">
        <div className="relative h-48 w-full overflow-hidden bg-gradient-to-r from-red-400 to-pink-500 text-white" />

        {/* Profile Section */}
        <div className="mx-auto max-w-4xl px-4">
          <div className="relative -mt-20 mb-4">
            <div className="relative flex justify-between items-end">
              <AvatarProfile
                className="md:size-40 size-32 bg-black"
                src={
                  companyImage
                    ? `https://res.cloudinary.com/dcv9bhbly/image/upload/v1736958453/${companyImage}`
                    : ""
                } // Display file URL if file selected, else fallback to default src
                fallbackClassName="text-3xl"
                fallbackText={companyName}
              />
              {isAuthenticated && user?.company_id === companyId && (
                <div className="flex items-center gap-2">
                  <Link href="/setting/company">
                    <FiEdit2 className="text-2xl" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-semibold flex items-center">
                  {companyName}
                </h1>
                <div className="flex justify-center md:justify-start gap-2 mt-2 mb-5">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  {companyWebiste ? (
                    <Link
                      href={companyWebiste}
                      target="_blank"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {companyWebiste.replace(/^https?:\/\//, "")}
                    </Link>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Website not available
                    </span>
                  )}
                </div>
              </div>
              {isAuthenticated && <BookPilot company_id={companyId} pilot_id={null}/>}
            </div>
            
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneralInfoCompany;
