import React, { useEffect, useState } from "react";
import AvatarProfile from "./Avatar";
import Link from "next/link";

const RightSidebar = () => {
  const [recentPilots, setRecentPilots] = useState<{  name: string; profile: string; user_id: string }[]>([]);
  const [recentCompanies, setRecentCompanies] = useState<{  name: string; logo: string; company_id: string }[]>([]);

  // Fetch Recently Viewed Pilots & Companies from localStorage
  useEffect(() => {
    const pilots = JSON.parse(localStorage.getItem("recentlyViewedPilots") || "[]");
    const companies = JSON.parse(localStorage.getItem("recentlyViewedCompanies") || "[]");

    setRecentPilots(pilots);
    setRecentCompanies(companies);
  }, []);

  const FollowItem = ({
    imgSrc,
    name,
    user_id,
    company_id,
  }: {
    imgSrc: string;
    name: string;
    user_id?: string;
    company_id?: string;
  }) => (
    <li className="flex items-center space-x-3 py-4">
      <div className="flex-shrink-0">
        <AvatarProfile
          className="md:size-8 size-8"
          src={imgSrc ? `https://res.cloudinary.com/dcv9bhbly/image/upload/v1736958453/${imgSrc}` : ""}
          fallbackClassName="text-md"
          fallbackText={name}
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900">
          {
            company_id ? (
              <Link href={`/company/${company_id}`}>{name}</Link>
            ) : null
          }
          {
            user_id ? (
              <Link href={`/pilots/${user_id}`}>{name}</Link>
            ) : null
          }
        </p>
      </div>
    </li>
  );

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-20 space-y-4">
        {/* Recently Viewed Pilots */}
        <section aria-labelledby="recent-pilots-heading">
          <div className="rounded-lg bg-white shadow">
            <div className="p-6">
              <h2 id="recent-pilots-heading" className="text-base font-medium text-gray-900">
                Recently Viewed Pilots
              </h2>
              <div className="mt-6 flow-root">
                <ul role="list" className="-my-4 divide-y divide-gray-200">
                  {recentPilots.length > 0 ? (
                    recentPilots.map((pilot,index) => (
                      <FollowItem key={index} imgSrc={pilot.profile} name={pilot.name} user_id={pilot.user_id} />
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No recently viewed pilots</p>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Recently Viewed Companies */}
        <section aria-labelledby="recent-companies-heading">
          <div className="rounded-lg bg-white shadow">
            <div className="p-6">
              <h2 id="recent-companies-heading" className="text-base font-medium text-gray-900">
                Recently Viewed Companies
              </h2>
              <div className="mt-6 flow-root">
                <ul role="list" className="-my-4 divide-y divide-gray-200">
                  {recentCompanies.length > 0 ? (
                    recentCompanies.map((company, index) => (
                      <FollowItem key={index} imgSrc={company.logo} name={company.name} company_id={company.company_id} />
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No recently viewed companies</p>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </aside>
  );
};

export default RightSidebar;
