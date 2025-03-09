import AvatarProfile from "@/components/Avatar";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
const RejectionModal = dynamic(() => import("./RejectionModal"), {
  loading: () => <div>Loading...</div>,
});
const pilotStatusColors = {
  pending: "bg-gray-100 text-gray-800",
  confirmed: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};
const AssignUsercard = ({
  status,
  image,
  name,
  reason,
}: {
  status: keyof typeof pilotStatusColors;
  image: string;
  name: string;
  reason: string | null;
}) => {
    console.log(reason);
    
  const [isModalOpen, setModalOpen] = useState(false);

  // Memoize the status styles to prevent unnecessary recalculations
  const statusStyles = useMemo(() => {
    return status === "rejected" ? { cursor: "pointer", color: "red" } : {};
  }, [status]);

  // Open modal only when needed
  const handleOpenModal = useCallback(() => {
    if (status === "rejected") setModalOpen(true);
  }, [status]);

  // Close modal function
  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  return (
    <>
      <div
        className="p-4 rounded-xl bg-white border border-gray-200 hover:border-gray-300 transition-colors"
        onClick={handleOpenModal}
        style={statusStyles}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
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
              <p className="text-base font-medium text-gray-800">{name}</p>
            </div>
          </div>
          <span
            className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center ${pilotStatusColors[status]}`}
          >
            {status === "confirmed" && (
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
            )}
            {status === "rejected" && <XCircle className="w-4 h-4 mr-1.5" />}
            {status === "pending" && <Clock className="w-4 h-4 mr-1.5" />}
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {/* {status} */}
          </span>
        </div>
      </div>
      {/* Modal for rejection reason */}
      {status === "rejected" && (
        <RejectionModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          image={image}
          name={name}
          reason={reason || ""}
        />
      )}
    </>
  );
};

export default AssignUsercard;
