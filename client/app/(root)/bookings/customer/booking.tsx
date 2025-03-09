import React from 'react'
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PilotBookingForm from './form';
const Booking = () => {
  return (
    <Dialog>
    <DialogTrigger asChild>
      <Button variant="default">Add Booking</Button>
    </DialogTrigger>
    <DialogContent className={"md:max-w-2xl overflow-y-scroll max-h-screen"}>
      <DialogHeader>
        <DialogTitle>Book Pilot</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when youre done.
        </DialogDescription>
      </DialogHeader>
      <PilotBookingForm />
    </DialogContent>
  </Dialog>
  )
}

export default Booking