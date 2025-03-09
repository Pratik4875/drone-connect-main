import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Certificate from "@/components/certificate";
import { certificateProps } from "@/types/certificate";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ProfileCertificate = ({ data }: any) => {

  return (
    <Card className="overflow-hidden">
      {/* Header Background */}
      <CardContent className="">
        <h1 className="text-2xl font-bold my-4">Certificates</h1>
        <div className="flex flex-col space-y-4">
          {data && data.length > 0
            ? data.map((certificate: certificateProps) => (
                <Certificate
                  expiry_date={certificate.expiry_date}
                  _id={certificate._id}
                  name={certificate.name}
                  url={certificate.url}
                  key={certificate._id}
                  edit={false}
                />
              ))
            : null}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCertificate;
