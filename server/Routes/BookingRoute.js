const router = require("express").Router();

const {
  createBooking,
  getCustomerBookings,
  assignPilotOrCompanyToBooking,
  getBookingByIdCustomer,
  getBookingTitle,
  getPilotCompanyBookings,
  getBookingByIdCompanyPilot,
  updatePilotBookingRequest,
  updateCompanyBookingRequest,
    markBookingAsComplete
} = require("../Controllers/BookingController.js");

const { reqAuth } = require("../Middlewares/AuthMiddleware.js");

router.post("/create", reqAuth, createBooking);

router.get("/get-booking-title", reqAuth, getBookingTitle);

router.get("/get-customer-bookings", reqAuth, getCustomerBookings);
router.get("/get-pilot-customer-bookings", reqAuth, getPilotCompanyBookings);

router.get("/get-booking/:id", reqAuth, getBookingByIdCustomer);
router.get(
  "/get-booking-company-pilot/:id",
  reqAuth,
  getBookingByIdCompanyPilot
);

router.post("/assign", reqAuth, assignPilotOrCompanyToBooking);

router.put("/update-booking-pilot/:id", reqAuth, updatePilotBookingRequest);
router.put("/update-booking-company/:id", reqAuth, updateCompanyBookingRequest);
router.put("/:id/complete",reqAuth,markBookingAsComplete)

module.exports = router;
