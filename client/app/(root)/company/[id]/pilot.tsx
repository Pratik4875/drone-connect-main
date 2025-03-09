import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import CompanyPilotCard from "./compay-pilot-card";
import Link from "next/link";
import { useParams } from "next/navigation";
interface Pilot {
  name: string;
  user_id: string;
  drone_category: string;
  profile: string;
}
const CompayPilots = ({ data }: { data: Pilot[] }) => {
  const { id } = useParams<{ id: string }>(); // Correct TypeScript typing

  return (
    <Card className="overflow-hidden">
      {/* Header Background */}
      <CardContent className="">
        <h1 className="text-2xl font-bold my-4">Our Pilots</h1>
        <div className="flex flex-col space-y-4">
          <ul role="list" className="divide-y divide-gray-100">
            {data.length > 0 &&
              data.map((pilot) => (
                <CompanyPilotCard
                  category={pilot.drone_category}
                  name={pilot.name}
                  profileImage={pilot.profile}
                  user_id={pilot.user_id}
                  key={pilot.user_id}
                />
              ))}
          </ul>
          {data.length > 9 && (
            <Button variant={"outline"} asChild>
              <Link href={`/company/${id}/pilots`}>View All</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompayPilots;
