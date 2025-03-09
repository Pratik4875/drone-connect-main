import { Building2, Calendar, Clock, MapPin } from "lucide-react";
import { PiDroneLight } from "react-icons/pi";

import { Card, CardContent } from "@/components/ui/card";
interface Booking {
  bookingId: string;
  title: string;
  street_address: string;
  state: string;
  city: string;
  pincode: number;
  status: string;
  date: string;
  start_time: string;
  end_time: string;
  pilot_id?: null | string;
  company_id?: null | string;
  pilotName?: string;
  companyName?: string;
  type: "customer" | "pilot" | "company";
  customerName?: string;
}
import { VscSymbolEvent } from "react-icons/vsc";
import Link from "next/link";
import { format } from "date-fns";

export default function BookingCard({
  status,
  bookingId,
  title,
  date,
  start_time,
  end_time,
  street_address,
  city,
  state,
  pincode,
  pilotName,
  companyName,
  type,
  customerName,
}: Booking) {
  console.log(companyName);
  
  const statusColor =
    {
      pending: "bg-yellow-400 text-yellow-900",
      confirmed: "bg-green-400 text-green-900",
      rejected: "bg-red-400 text-white",
      completed: "bg-blue-400 text-white",
    }[status] || "bg-gray-400 text-gray-900";    
  return (
    <Link href={`/bookings/${type}/${bookingId}`}>
      <Card className="w-full transition-all duration-300 hover:shadow-2xl hover:scale-100">
        <CardContent className="p-0">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg md:text-2xl font-bold text-black flex items-center">
                <VscSymbolEvent className="mr-2" />
                {title}
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor} capitalize`}
              >
                {status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center text-black">
                <Calendar className="w-5 h-5 mr-2" />
                <span>{format(new Date(date), "MMMM d, yyyy")}</span>
              </div>
              <div className="flex items-center text-black">
                <Clock className="w-5 h-5 mr-2" />

                <span>
                  {format(new Date(start_time), "hh:mm a")} -{" "}
                  {format(new Date(end_time), "hh:mm a")}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-black mb-2">
                Location
              </h3>
              <div className="flex items-start text-black">
                <MapPin className="w-5 h-5 mr-2 mt-1" />
                <span>
                  {street_address}, {city}, {state} {pincode}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {type === "customer" && (
                <>
                  {companyName && (
                    <div className="flex items-center text-black">
                      <Building2 className="w-5 h-5 mr-2" />
                      <span>
                        Company :{" "}
                        {companyName ? (
                          companyName
                        ) : (
                          "No Company Accepted"
                        )}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center text-black">
                    <PiDroneLight className="w-5 h-5 mr-2" />
                    <span>
                      Pilot :{" "}
                      {pilotName ? (
                        pilotName
                      ) : (
                        "No Pilot Accepted"
                      )}
                    </span>
                  </div>
                </>
              )}
              {
                (type === "pilot" || type === "company") && (
                  <div className="flex items-center text-black">
                    <Building2 className="w-5 h-5 mr-2" />
                    <span>
                      Customer :{" "}
                      {customerName ? (
                        customerName
                      ) : (
                        "No Customer Accepted"
                      )}
                    </span>
                  </div>
                )
              }
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
