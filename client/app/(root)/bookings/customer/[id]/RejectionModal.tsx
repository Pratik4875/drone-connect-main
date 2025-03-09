import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";
import AvatarProfile from "@/components/Avatar";

const RejectionModal = ({
  isOpen,
  onClose,
  image,
  name,
  reason,
}: {
  isOpen: boolean;
  onClose: () => void;
  image: string;
  name: string;
  reason: string;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
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
                <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
              </div>
            </div>
          </DialogTitle>
          <DialogDescription>
            <div className="flex items-start space-x-3 mt-5">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-lg font-medium text-gray-800 mb-2">
                  Rejection Reason
                </h4>
                <p className="text-gray-600">{reason}</p>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default RejectionModal;
