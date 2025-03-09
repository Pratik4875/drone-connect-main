import AvatarProfile from "@/components/Avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CheckCheck,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  FileText,
  Globe,
  ShieldCheck,
  ShieldX,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import { MdEmail } from "react-icons/md";
const getStatusBadge = (status: string) => {
  switch (status) {
    case "verified":
      return (
        <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20 rounded-full px-3">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Verified
          </span>
        </Badge>
      );
    case "pending":
      return (
        <Badge
          variant="outline"
          className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20 rounded-full px-3"
        >
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending Verification
          </span>
        </Badge>
      );
    default:
      return null;
  }
};
const CompanyVerification = ({
  image,
  name,
  status,
  gst,
  user_name,
  user_email,
  company_website,
  id,
  handleClickVerify,
  handleClickUnverify,
}: {
  image: string;
  name: string;
  status: string;
  gst: string;
  user_name: string;
  user_email: string;
  company_website: string;
  id: string;
  handleClickVerify: (id: string) => void;
  handleClickUnverify: (id: string) => void;
}) => {
  const [copiedText, setCopiedText] = useState("");
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(""), 2000);
  };
  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="flex flex-col">
        <div className="p-4 md:p-5 flex items-start gap-4">
          <AvatarProfile
            className="md:size-12 size-12"
            src={
              image
                ? `https://res.cloudinary.com/dmuhioahv/image/upload/v1736958453/${image}`
                : ""
            } // Display file URL if file selected, else fallback to default src
            fallbackClassName="text-xl"
            fallbackText={name}
          />
          <div>
            <h3 className="text-lg font-medium flex items-center gap-2">
              {name}
              {status === "verified" && (
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
              )}
            </h3>
            <div className="mt-2">{getStatusBadge(status)}</div>
          </div>
        </div>

        <div className="border-t md:border-t-0 md:border-l border-zinc-200 dark:border-zinc-800 p-4 md:p-5 md:flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="h-5 w-5 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    GST Number
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 group">
                          <span className="text-sm font-medium">{gst}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => copyToClipboard(gst)}
                          >
                            {copiedText === gst ? (
                              <CheckCheck className="h-3 w-3 text-green-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Click to copy</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="h-5 w-5 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                  <Globe className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    Website
                  </div>
                  <a
                    href={``}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                  >
                    {company_website.replace(/^https?:\/\//, "")}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="h-5 w-5 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                  <Users className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    User Name
                  </div>
                  <div className="text-sm font-mono  truncate">{user_name}</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-5 w-5 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                  <MdEmail className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    User Email
                  </div>
                  <div className="text-sm font-mono  truncate">
                    {user_email}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                ID:
              </div>
              <div className="text-xs font-mono">{id}</div>
            </div>

            {status === "unverified" && (
              <Button className="gap-2" onClick={() => handleClickVerify(id)}>
                <ShieldCheck className="h-4 w-4" />
                Confirm Verification
              </Button>
            )}
            {status === "verified" && (
              <Button className="gap-2" onClick={() => handleClickUnverify(id)}>
                <ShieldX className="h-4 w-4" />
                Unverify
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CompanyVerification;
