/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SelectRequest from "./select-request";
const BookPilot = ({
  pilot_id,
  company_id,
}: {
  pilot_id: string | null;
  company_id: string | null;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Book</Button>
      </DialogTrigger>
      <DialogContent className={"md:max-w-xl overflow-y-scroll max-h-screen"}>
        <DialogHeader>
          <DialogTitle>Book Pilot</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when youre done.
          </DialogDescription>
        </DialogHeader>
        <SelectRequest pilot_id={pilot_id} company_id={company_id} />
      </DialogContent>
    </Dialog>
  );
};

export default BookPilot;
