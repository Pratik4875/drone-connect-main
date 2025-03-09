import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Award, Calendar, LinkIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import UpdateCertificate from "../app/(root)/setting/certifications/update-certificate";
import DeleteCertificate from "../app/(root)/setting/certifications/delete-certificate";
import { certificateProps } from "@/types/certificate";

const Certificate = ({
  url,
  name,
  expiry_date,
  _id,
  edit,
}: certificateProps) => {
  const isExpired = new Date(expiry_date) < new Date();

  return (
    <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardContent className="flex-grow p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Award className="h-6 w-6 text-blue-500 flex-shrink-0" />
          <h3 className="text-xl font-semibold text-gray-800 truncate">
            {name}
          </h3>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-600 flex items-center">
            <LinkIcon className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
            <Link
              href={url}
              className="text-blue-500 hover:underline truncate"
              target="_blank"
            >
              {url}
            </Link>
          </p>
          <p className="text-sm text-gray-600 flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
            Expires: {new Date(expiry_date).toLocaleDateString()}
          </p>
        </div>
        <div className="mt-4">
          <Badge variant={isExpired ? "destructive" : "secondary"}>
            {isExpired ? "Expired" : "Active"}
          </Badge>
        </div>
      </CardContent>
      {edit && (
        <CardFooter className="bg-gray-50 px-6 py-4">
          <div className="flex justify-end space-x-2 w-full">
            <UpdateCertificate
              expiry_date={expiry_date}
              name={name}
              url={url}
              _id={_id}
            />
            <DeleteCertificate id={_id} />
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default Certificate;
