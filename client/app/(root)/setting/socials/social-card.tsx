import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { HiMiniArrowTopRightOnSquare } from "react-icons/hi2";
import Link from "next/link";
import UpdateSocials from "./update-socials";
import DeleteSocials from "./delete-socials";
import { useSocial } from "@/hooks/useSocial";

interface SocialCardProps {
  account: string;
  social: string;
}

const SocialCard: React.FC<SocialCardProps> = ({ account, social }) => {
  const { socialAccounts } = useSocial();

  // Memoize socialData to prevent unnecessary calculations on re-renders
  const socialData = useMemo(() => {
    return socialAccounts.find(
      (item) => item.social.toLowerCase() === social.toLowerCase()
    );
  }, [socialAccounts, social]);

  if (!socialData) {
    console.warn(`Social platform "${social}" not found in socialAccounts.`);
    return null;
  }

  const { icon: Icon, url } = socialData;
  const profileUrl = `${url}${account}`;

  return (
    <Card>
      <CardContent className="p-5 flex items-center gap-4">
        {/* Display social media icon if available */}
        {Icon}
        <p className="w-52 truncate text-gray-800 font-medium">{account}</p>

        <div className="ml-auto flex items-center gap-4">
          {/* External link to the social profile */}
          <Link href={profileUrl} target="_blank" aria-label={`Visit ${social} profile`}>
            <HiMiniArrowTopRightOnSquare className="text-xl text-blue-500 hover:text-blue-700 transition" />
          </Link>

          <UpdateSocials platform={social} url={profileUrl} />
          <DeleteSocials platform={social} />
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialCard;
