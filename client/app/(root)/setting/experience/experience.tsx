import { Card, CardContent } from "@/components/ui/card";
import React, { useState } from "react";
import {
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
interface DronePilotExperienceProps {
  experienceStart: string;
  experienceEnd: string;
  content: string;
  sr_no: number;
  _id: string;
}
import { GiDeliveryDrone } from "react-icons/gi";
import UpdateExperience from "./update-experience";
import DeleteExperience from "./delete-experience";
const Experience = ({
  experienceStart,
  experienceEnd,
  content,
  _id,
  sr_no,
}: DronePilotExperienceProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const truncateContent = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };
  return (
    <Card className="w-full overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <GiDeliveryDrone className="w-6 h-6 text-indigo-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Experience {sr_no}
            </h2>
          </div>
          <div className="space-x-2">
            <UpdateExperience
              _id={_id}
              details={content}
              end_date={experienceEnd}
              start_date={experienceStart}
            />
            <DeleteExperience id={_id} />
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-4">
          <CalendarIcon className="w-4 h-4 mr-2" />
          <span>
            {formatDate(experienceStart)} -{" "}
            {experienceEnd ? formatDate(experienceEnd) : "Present"}
          </span>
        </div>
        <div className="text-gray-700 dark:text-gray-200 leading-relaxed">
          {isExpanded ? content : truncateContent(content, 150)}
        </div>
        {content.length > 150 && (
          <Button
            variant="ghost"
            className="mt-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <ChevronUpIcon className="w-4 h-4 mr-2" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDownIcon className="w-4 h-4 mr-2" />
                Read More
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default Experience;
