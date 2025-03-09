import React from "react";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline";
import { BriefcaseBusiness } from "lucide-react";
import UpdateExperience from "@/app/(root)/setting/experience/update-experience";
import DeleteExperience from "@/app/(root)/setting/experience/delete-experience";
const ExperienceTimeline = ({ data, editing }:{
  data: {
    _id: string;
    details: string;
    end_date: string;
    start_date: string;
  }[];
  editing: boolean;
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };
  return (
    <Timeline>
      {data.map((item, index) => (
        <TimelineItem key={index}>
          <TimelineSeparator>
            <TimelineDot>
              <BriefcaseBusiness />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent className="pb-4">
            <TimelineTitle>Experience {index + 1}</TimelineTitle>
            <TimelineDescription className="italic">
              {formatDate(item.start_date)} -{" "}
              {item.end_date ? formatDate(item.end_date) : "Present"}
            </TimelineDescription>
            <TimelineDescription className="line-clamp-2 hover:line-clamp-none my-3">
              {item.details}
            </TimelineDescription>
            {editing && (
              <TimelineDescription>
                <div className="space-x-2">
                  <UpdateExperience
                    _id={item._id}
                    details={item.details}
                    end_date={item.end_date}
                    start_date={item.start_date}
                  />
                  <DeleteExperience id={item._id} />
                </div>
              </TimelineDescription>
            )}
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
};

export default ExperienceTimeline;
