const { ObjectId } = require("mongodb");
const tryCatchWrapper = require("../Utils/TryCatchWrapper.js");
const sendResponse = require("../Utils/SendResponse.js");
const isObjectIdValid = require("../Utils/ValidObjectId.js");
const { get_db } = require("../Utils/MongoConnect.js");
const sendEmail = require("../Utils/SendEmail.js");
const {get_pilot_confirmation_template,get_send_booking_info_to_pilot_template} = require("../Utils/HtmlEmailTemplates.js")
const { default: ical } = require('ical-generator');

/*const bookPilot = tryCatchWrapper(async(req,res,next)=>{
    const {date, start_time, end_time, street_address,state,city,pincode,pilot_id,company_id}= req.body

    const user_email = req.user_email

    if(!date || date.length <1){
        return sendResponse(400,"No date provided",res)
    }

    if(!date.match(/\d{4}[-\/]\d{2}[-\/]\d{2}/)){
        return sendResponse(400, "Invalid date format.Please provide it in YYYY-MM-DD",res)

    }

    if(isNaN(Date.parse(date))){
        return sendResponse(400, "Invalid date format.Please provide it in YYYY-MM-DD",res)
    }


    if(Date.parse(date)< (new Date()).setMinutes(0,0,0)){

        return sendResponse(400, "Invalid date provided. Date cannot be before today",res)
    }

    if(!start_time || start_time.length <1 ){
        return sendResponse(400,"No start time provided",res)
    }
    // if(!start_time.match(/\d{2}:\d{2} AM|PM/)){

    //     return sendResponse(400,"Invalid start time format. Format accepted is 00:00 AM/PM",res)
    // }
    if(!end_time || end_time.length <1 ){
        return sendResponse(400,"No end time provided",res)
    }

    // if(!end_time.match(/\d{2}:\d{2} AM|PM/)){

    //     return sendResponse(400,"Invalid end time format. Format accepted is 00:00 AM/PM",res)
    // }
    if(!street_address || street_address.length <1){
        return sendResponse(400,"No street address provided",res)
    }

    if(!city || city.length <1){
        return sendResponse(400, "No city provided",res)
    }
    if(!state || state.length <1){
        return sendResponse(400, "No state provided",res)
    }

    if(!pincode || pincode.length <1){
        return sendResponse(400, "No pincode provided",res)
    }

    if(!pincode.match(/\d{6}/)){
        return sendResponse(400,"Invalid pincode provided",res)
    }

    if((!pilot_id || pilot_id.length <1) && (!company_id || company_id.length <1)){
        return sendResponse(400,"Neither pilot id nor company id provided",res)
    }

    if(pilot_id && company_id){
        return sendResponse(400, "Both pilot id and company id provided. Please provide only one",res)
    }

    if(pilot_id && !isObjectIdValid(pilot_id)){
        return sendResponse(400, "Invalid pilot id",res)
    }
    if(company_id && !isObjectIdValid(company_id)){
        return sendResponse(400, "Invalid company id",res)
    }

    let booking_doc = {}

    const db = get_db()
    const user= await db.collection("user").findOne({email:user_email})
    if(!user){
        return sendResponse(400,"No user found with this email id",res)
    }

    if(pilot_id){
        const pilot = await db.collection("pilot").findOne({_id:new ObjectId(pilot_id)})
        if(!pilot){
            return sendResponse(404, "No pilot found with the provided id",res)
        }
        booking_doc.pilot_id = new ObjectId(pilot_id)
        booking_doc.company_id =null 
    }
    else{
        const company = await db.collection("company").findOne({_id:new ObjectId(company_id)})
        if(!company){
            return sendResponse(404, "No company found with the provided id",res)
        }
        booking_doc.pilot_id = null
        booking_doc.company_id = new ObjectId(company_id)

    }

    booking_doc.user_id= user._id
    /*
    let ts = (new Date().getTime())+(5*60*60*1000)+(30*60*1000) 
    console.log(ts)
    ts = (new Date(ts)).toISOString().replace("Z","+05:30")
    console.log(new Date(ts))
    
    booking_doc.created_at=new Date()
    booking_doc.street_address= street_address
    booking_doc.state= state
    booking_doc.city= city
    booking_doc.pincode= parseInt(pincode)
    booking_doc.status= "pending"
    booking_doc.rejection_reason= null
    booking_doc.date= date
    booking_doc.start_time= start_time
    booking_doc.end_time= end_time


    const insert_result = await db.collection("booking").insertOne(booking_doc)
    if(!insert_result || !insert_result.insertedId){
        return sendResponse(500, "Failed to insert new booking", res)
    } 


    return res.status(201).json({success:true, message: "Pilot booking successful"})

})
*/

const makePilotOffline = async (pilot_id) => {
  const db = get_db();

  // Validate ObjectId
  if (!ObjectId.isValid(pilot_id)) {
    console.error("Invalid pilot ID");
    return false;
  }

  const pilot = await db
    .collection("pilot")
    .findOne({ _id: new ObjectId(pilot_id) });
  if (!pilot) return false;

  // Update pilot status to offline
  const updateResult = await db
    .collection("pilot")
    .updateOne(
      { _id: new ObjectId(pilot_id) },
      { $set: { status: "offline" } }
    );

  return updateResult.modifiedCount > 0;
};

const createBooking = tryCatchWrapper(async (req, res, next) => {
  const {
    title,
    date,
    start_time,
    end_time,
    street_address,
    state,
    city,
    pincode,
  } = req.body;

  const user_email = req.user_email;

  if (!title || title.length < 1) {
    return sendResponse(400, "No title provided", res);
  }
  if (!date || date.length < 1) {
    return sendResponse(400, "No date provided", res);
  }

  if (!date.match(/\d{4}[-\/]\d{2}[-\/]\d{2}/)) {
    return sendResponse(
      400,
      "Invalid date format.Please provide it in YYYY-MM-DD",
      res
    );
  }

  if (isNaN(Date.parse(date))) {
    return sendResponse(
      400,
      "Invalid date format.Please provide it in YYYY-MM-DD",
      res
    );
  }

  if (Date.parse(date) < new Date().setMinutes(0, 0, 0)) {
    return sendResponse(
      400,
      "Invalid date provided. Date cannot be before today",
      res
    );
  }

  if (!start_time || start_time.length < 1) {
    return sendResponse(400, "No start time provided", res);
  }
  // if(!start_time.match(/\d{2}:\d{2} AM|PM/)){

  //     return sendResponse(400,"Invalid start time format. Format accepted is 00:00 AM/PM",res)
  // }
  if (!end_time || end_time.length < 1) {
    return sendResponse(400, "No end time provided", res);
  }

  // if(!end_time.match(/\d{2}:\d{2} AM|PM/)){

  //     return sendResponse(400,"Invalid end time format. Format accepted is 00:00 AM/PM",res)
  // }
  if (!street_address || street_address.length < 1) {
    return sendResponse(400, "No street address provided", res);
  }

  if (!city || city.length < 1) {
    return sendResponse(400, "No city provided", res);
  }
  if (!state || state.length < 1) {
    return sendResponse(400, "No state provided", res);
  }

  if (!pincode || pincode.length < 1) {
    return sendResponse(400, "No pincode provided", res);
  }

  if (!pincode.match(/\d{6}/)) {
    return sendResponse(400, "Invalid pincode provided", res);
  }

  const db = get_db();

  const user = await db.collection("user").findOne({ email: user_email });

  let booking_doc = {};
  booking_doc.user_id = user._id;
  /*
    let ts = (new Date().getTime())+(5*60*60*1000)+(30*60*1000) 
    console.log(ts)
    ts = (new Date(ts)).toISOString().replace("Z","+05:30")
    console.log(new Date(ts))
    */
  booking_doc.title = title;
  booking_doc.created_at = new Date();
  booking_doc.street_address = street_address;
  booking_doc.state = state;
  booking_doc.city = city;
  booking_doc.pincode = parseInt(pincode);
  booking_doc.status = "pending";
  booking_doc.date = new Date(date);
  booking_doc.start_time = new Date(start_time);
  booking_doc.end_time = new Date(end_time);
  booking_doc.requests = [];
  booking_doc.pilot_id = null;
  booking_doc.company_id = null;

  const insert_result = await db.collection("booking").insertOne(booking_doc);
  if (!insert_result || !insert_result.insertedId) {
    return sendResponse(500, "Failed to insert new booking", res);
  }

  return res
    .status(201)
    .json({ success: true, message: "booking created successfully" });
});

const getBookingTitle = tryCatchWrapper(async (req, res, next) => {
  const db = get_db();
  const user_email = req.user_email;

  // Fetch user details
  const user = await db.collection("user").findOne({ email: user_email });
  if (!user) return sendResponse(400, "User not found", res);

  const user_id = user._id;
  //console.log(user_email)

  // Validate user_id
  if (!user_id || !isObjectIdValid(user_id)) {
    return sendResponse(400, "Invalid user ID provided", res);
  }

  // Query: Only fetch bookings with status "pending"
  const filter_doc = {
    user_id: new ObjectId(user_id),
    date: { $gte: new Date() },
    status: "pending",
  };

  // Projection: Select only necessary fields
  const projection = { _id: 1, title: 1, status: 1 };

  // Fetch pending bookings
  const bookings = await db
    .collection("booking")
    .aggregate([{ $match: filter_doc }, { $project: projection }])
    .toArray();

  return res.status(200).json(bookings);
});

const getCustomerBookings = tryCatchWrapper(async (req, res, next) => {
  const db = get_db();
  const user_email = req.user_email;

  // Fetch user details
  const user = await db.collection("user").findOne({ email: user_email });
  if (!user) return sendResponse(400, "User not found", res);

  const user_id = user._id;

  // Validate user_id
  if (!user_id || !isObjectIdValid(user_id)) {
    return sendResponse(400, "Invalid user ID provided", res);
  }

  // Filter for customer bookings
  let filter_doc = { user_id: new ObjectId(user_id) };

  // Apply status filter
  if (req.query.status) {
    filter_doc.status = req.query.status.toLowerCase().trim();
  }

  // Apply title search
  if (req.query.title) {
    filter_doc.title = { $regex: req.query.title, $options: "i" }; // Case-insensitive search
  }

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Projection
  const projection = {
    _id: 1,
    title: 1,
    status: 1,
    date: 1,
    start_time: 1,
    end_time: 1,
    street_address: 1,
    state: 1,
    city: 1,
    pincode: 1,
    "pilotDetails.name": 1,
    "companyInfo.name": 1,
  };

  // Aggregation pipeline
  const pipeline = [
    { $match: filter_doc },
    { $sort: { date: -1 } },
    {
      $lookup: {
        from: "pilot",
        localField: "pilot_id",
        foreignField: "_id",
        as: "pilotInfo",
      },
    },
    { $unwind: { path: "$pilotInfo", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "user",
        localField: "pilotInfo.user_id",
        foreignField: "_id",
        as: "pilotDetails",
      },
    },
    { $unwind: { path: "$pilotDetails", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "company",
        localField: "company_id",
        foreignField: "_id",
        as: "companyInfo",
      },
    },
    { $unwind: { path: "$companyInfo", preserveNullAndEmptyArrays: true } },
    { $project: projection },
    { $skip: skip },
    { $limit: limit },
  ];

  // Fetch bookings
  const bookings = await db.collection("booking").aggregate(pipeline).toArray();

  // Get total count
  const totalBookings = await db
    .collection("booking")
    .countDocuments(filter_doc);
  const totalPages = Math.ceil(totalBookings / limit);

  return res.status(200).json({
    page,
    limit,
    totalBookings,
    totalPages,
    data: bookings,
  });
});

const getPilotCompanyBookings = tryCatchWrapper(async (req, res, next) => {
  const db = get_db();
  const user_email = req.user_email;

  // Fetch user details
  const user = await db.collection("user").findOne({ email: user_email });
  if (!user) return sendResponse(400, "User not found", res);

  const user_id = user._id;
  const user_role = user.user_type; // "p" = Pilot, "o" = Company

  // Validate user_id
  if (!user_id || !isObjectIdValid(user_id)) {
    return sendResponse(400, "Invalid user ID provided", res);
  }

  // Get pilot or company ID
  let filter_doc = {};
  let pilot_id = null;
  let company_id = null;

  if (user_role === "p") {
    const pilot = await db
      .collection("pilot")
      .findOne({ user_id: user_id }, { projection: { _id: 1 } });
    if (!pilot) return sendResponse(400, "Pilot not found", res);
    pilot_id = new ObjectId(pilot._id);
  } else if (user_role === "o") {
    const company = await db
      .collection("company")
      .findOne({ user_id: user_id }, { projection: { _id: 1 } });
    if (!company) return sendResponse(400, "Company not found", res);
    company_id = new ObjectId(company._id);
  } else {
    return sendResponse(400, "Invalid user role", res);
  }

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Projection
  const projection = {
    _id: 1,
    title: 1,
    date: 1,
    start_time: 1,
    end_time: 1,
    street_address: 1,
    state: 1,
    city: 1,
    pincode: 1,
    "requests.status": 1, // ✅ Get request status
    "customerInfo.name": 1, // ✅ Get customer name
    "requests.pilot_id": 1,
    "requests.company_id": 1,
  };

  // Aggregation pipeline
  const pipeline = [
    { $unwind: "$requests" }, // Unwind `requests[]`
    {
      $match: {
        $and: [
          pilot_id ? { "requests.pilot_id": pilot_id } : {},
          company_id ? { "requests.company_id": company_id } : {},
          { "requests.status": req.query.status.toLowerCase().trim() },
        ],
      },
    },
  ];

  // ✅ Apply title search
  if (req.query.title) {
    pipeline.push({
      $match: { title: { $regex: req.query.title, $options: "i" } }, // Case-insensitive search
    });
  }

  // Continue lookup for customer details
  pipeline.push(
    {
      $lookup: {
        from: "user",
        localField: "user_id",
        foreignField: "_id",
        as: "customerInfo",
      },
    },
    { $unwind: { path: "$customerInfo", preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: "$_id",
        title: { $first: "$title" },
        date: { $first: "$date" },
        start_time: { $first: "$start_time" },
        end_time: { $first: "$end_time" },
        street_address: { $first: "$street_address" },
        state: { $first: "$state" },
        city: { $first: "$city" },
        pincode: { $first: "$pincode" },
        requests: { $push: "$requests" }, // ✅ Preserve relevant requests only
        customerInfo: { $first: "$customerInfo" },
      },
    },
    { $project: projection },
    { $sort: { date: -1 } }, // Sort by latest bookings
    { $skip: skip },
    { $limit: limit }
  );

  // Fetch bookings
  const bookings = await db.collection("booking").aggregate(pipeline).toArray();

  // Get total count
  const totalBookings = await db.collection("booking").countDocuments({
    "requests.pilot_id": pilot_id,
    "requests.company_id": company_id,
  });
  const totalPages = Math.ceil(totalBookings / limit);

  return res.status(200).json({
    page,
    limit,
    totalBookings,
    totalPages,
    data: bookings,
  });
});

const getBookingByIdCustomer = tryCatchWrapper(async (req, res, next) => {
  const db = get_db();
  const user_email = req.user_email;

  // Fetch user details
  const user = await db.collection("user").findOne({ email: user_email });
  if (!user) return sendResponse(400, "User not found", res);

  const user_id = user._id;

  // Validate user_id
  if (!user_id || !isObjectIdValid(user_id)) {
    return sendResponse(400, "Invalid user ID provided", res);
  }
  const bookingId = req.params.id;
  if (!ObjectId.isValid(bookingId)) {
    return res.status(400).json({ error: "Invalid booking ID" });
  }

  const booking = await db
    .collection("booking")
    .aggregate([
      { $match: { _id: new ObjectId(bookingId), user_id: user_id } },

      // Lookup main pilot details
      {
        $lookup: {
          from: "pilot",
          localField: "pilot_id",
          foreignField: "_id",
          as: "pilotInfo",
        },
      },
      { $unwind: { path: "$pilotInfo", preserveNullAndEmptyArrays: true } },

      // Lookup main pilot's name from the 'user' collection
      {
        $lookup: {
          from: "user",
          localField: "pilotInfo.user_id",
          foreignField: "_id",
          as: "pilotDetails",
        },
      },
      { $unwind: { path: "$pilotDetails", preserveNullAndEmptyArrays: true } },

      // Lookup main company details
      {
        $lookup: {
          from: "company",
          localField: "company_id",
          foreignField: "_id",
          as: "companyDetails",
        },
      },
      {
        $unwind: { path: "$companyDetails", preserveNullAndEmptyArrays: true },
      },

      // Unwind requests array to attach details inside it
      { $unwind: { path: "$requests", preserveNullAndEmptyArrays: true } },

      // Lookup pilot details for each request
      {
        $lookup: {
          from: "pilot",
          localField: "requests.pilot_id",
          foreignField: "_id",
          as: "requests.pilotInfo",
        },
      },
      {
        $unwind: {
          path: "$requests.pilotInfo",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Lookup pilot's name from the 'user' collection for requests
      {
        $lookup: {
          from: "user",
          localField: "requests.pilotInfo.user_id",
          foreignField: "_id",
          as: "requests.pilotDetails",
        },
      },
      {
        $unwind: {
          path: "$requests.pilotDetails",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Lookup company details for each request
      {
        $lookup: {
          from: "company",
          localField: "requests.company_id",
          foreignField: "_id",
          as: "requests.companyDetails",
        },
      },
      {
        $unwind: {
          path: "$requests.companyDetails",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Group back to reconstruct the requests array into separate pilot & company objects
      {
        $group: {
          _id: "$_id",
          user_id: { $first: "$user_id" },
          title: { $first: "$title" },
          created_at: { $first: "$created_at" },
          street_address: { $first: "$street_address" },
          state: { $first: "$state" },
          city: { $first: "$city" },
          pincode: { $first: "$pincode" },
          status: { $first: "$status" },
          date: { $first: "$date" },
          start_time: { $first: "$start_time" },
          end_time: { $first: "$end_time" },
          pilot_id: { $first: "$pilot_id" },
          pilotname: { $first: "$pilotDetails.name" },
          company_id: { $first: "$company_id" },
          companyname: { $first: "$companyDetails.name" },

          // Separate pilot requests
          pilot_requests: {
            $push: {
              $cond: {
                if: { $ne: ["$requests.pilot_id", null] }, // If pilot_id exists
                then: {
                  pilot_id: "$requests.pilot_id",
                  pilot_name: "$requests.pilotDetails.name",
                  pilotImage: "$requests.pilotDetails.profile",
                  status: "$requests.status",
                  reason: "$requests.rejection_reason",
                },
                else: "$$REMOVE",
              },
            },
          },

          // Separate company requests
          company_requests: {
            $push: {
              $cond: {
                if: { $ne: ["$requests.company_id", null] }, // If company_id exists
                then: {
                  company_id: "$requests.company_id",
                  company_name: "$requests.companyDetails.name",
                  companyImage: "$requests.companyDetails.logo",
                  status: "$requests.status",
                  reason: "$requests.rejection_reason",
                },
                else: "$$REMOVE",
              },
            },
          },
        },
      },
    ])
    .toArray();

  if (!booking.length) {
    return res.status(404).json({ error: "Booking not found" });
  }

  return res.status(200).json({
    ...booking[0],
  });
});

const getBookingByIdCompanyPilot = tryCatchWrapper(async (req, res, next) => {
  const db = get_db();
  const user_email = req.user_email;

  // Fetch user details
  const user = await db.collection("user").findOne({ email: user_email });
  if (!user) return sendResponse(400, "User not found", res);

  const user_id = user._id;
  const user_role = user.user_type; // "c" = customer, "p" = pilot, "o" = company

  // Validate user_id
  if (!user_id || !isObjectIdValid(user_id)) {
    return sendResponse(400, "Invalid user ID provided", res);
  }

  // Validate booking ID
  const bookingId = req.params.id;
  if (!ObjectId.isValid(bookingId)) {
    return res.status(400).json({ error: "Invalid booking ID" });
  }

  // ✅ Initialize role-based filter
  let filter_doc = { _id: new ObjectId(bookingId) };

  let pilot_id = null;
  let company_id = null;

  if (user_role === "p") {
    const pilot = await db
      .collection("pilot")
      .findOne({ user_id: user_id }, { projection: { _id: 1 } });
    if (!pilot) return sendResponse(400, "Pilot not found", res);
    pilot_id = new ObjectId(pilot._id);
    filter_doc["requests.pilot_id"] = pilot_id; // Filter only requests for this pilot
  } else if (user_role === "o") {
    const company = await db
      .collection("company")
      .findOne({ user_id: user_id }, { projection: { _id: 1 } });
    if (!company) return sendResponse(400, "Company not found", res);
    company_id = new ObjectId(company._id);
    filter_doc["requests.company_id"] = company_id; // Filter only requests for this company
  }
  // const projection = {
  //   _id: 1,
  //   title: 1,
  //   date: 1,
  //   start_time: 1,
  //   end_time: 1,
  //   street_address: 1,
  //   state: 1,
  //   city: 1,
  //   pincode: 1,
  //   "requests.status": 1, // ✅ Get request status
  //   "customerDetails.name": 1,
  // };
  const booking = await db
    .collection("booking")
    .aggregate([
      { $match: filter_doc },

      {
        $lookup: {
          from: "user",
          localField: "user_id",
          foreignField: "_id",
          as: "customerDetails",
        },
      },
      {
        $unwind: { path: "$customerDetails", preserveNullAndEmptyArrays: true },
      },
      // ✅ Unwind requests array to filter specific pilot/company request
      { $unwind: "$requests" },

      // ✅ Match only the specific request for pilot_id or company_id
      {
        $match: {
          $or: [
            { "requests.pilot_id": pilot_id },
            { "requests.company_id": company_id },
          ],
        },
      },

      // ✅ Lookup pilot details for request
      {
        $lookup: {
          from: "pilot",
          localField: "requests.pilot_id",
          foreignField: "_id",
          as: "requests.pilotInfo",
        },
      },
      {
        $unwind: {
          path: "$requests.pilotInfo",
          preserveNullAndEmptyArrays: true,
        },
      },

      // ✅ Lookup pilot's user details
      {
        $lookup: {
          from: "user",
          localField: "requests.pilotInfo.user_id",
          foreignField: "_id",
          as: "requests.pilotDetails",
        },
      },
      {
        $unwind: {
          path: "$requests.pilotDetails",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "pilot",
          localField: "pilot_id",
          foreignField: "_id",
          as: "pilotInfo",
        },
      },
      {
        $unwind: {
          path: "$pilotInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "user",
          localField: "pilotInfo.user_id",
          foreignField: "_id",
          as: "pilotDetails",
        },
      },
      {
        $unwind: {
          path: "$pilotDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      // ✅ Group back with specific request status
      {
        $group: {
          _id: "$_id",
          user_id: { $first: "$user_id" },
          customer_name: {
            $first: { $ifNull: ["$customerDetails.name", "Unknown"] },
          },
          created_at: { $first: "$created_at" },
          street_address: { $first: "$street_address" },
          state: { $first: "$state" },
          city: { $first: "$city" },
          pincode: { $first: "$pincode" },
          date: { $first: "$date" },
          start_time: { $first: "$start_time" },
          end_time: { $first: "$end_time" },
          title: { $first: "$title" },
          requests: { $push: "$requests" }, // ✅ Preserve relevant requests only
          pilot_id: { $first: "$pilotDetails._id" },
          pilotname: { $first: "$pilotDetails.name" },
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          date: 1,
          start_time: 1,
          end_time: 1,
          street_address: 1,
          state: 1,
          city: 1,
          pincode: 1,
          "requests.status": 1,
          customer_name: 1,
          pilotname: 1,
          pilot_id: 1,
        },
      },
    ])
    .toArray();

  if (!booking.length) {
    return res.status(404).json({ error: "Booking not found" });
  }

  return res.status(200).json({
    ...booking[0],
  });
});

const assignPilotOrCompanyToBooking = tryCatchWrapper(
  async (req, res, next) => {
    const { booking_id } = req.body;
    let { pilot_id = null, company_id = null } = req.body;

    if (!booking_id || booking_id.length < 1) {
      return sendResponse(400, "No booking id present", res);
    }

    if (!isObjectIdValid(booking_id)) {
      return sendResponse(400, "Invalid booking id present", res);
    }

    if (
      (!pilot_id || pilot_id.length < 1) &&
      (!company_id || company_id.length < 1)
    ) {
      return sendResponse(400, "Neither pilot id nor company id provided", res);
    }

    if (pilot_id && company_id) {
      return sendResponse(
        400,
        "Both pilot id and company id provided. Please provide only one",
        res
      );
    }

    if (pilot_id && !isObjectIdValid(pilot_id)) {
      return sendResponse(400, "Invalid pilot id", res);
    }
    if (company_id && !isObjectIdValid(company_id)) {
      return sendResponse(400, "Invalid company id", res);
    }

    if (pilot_id) {
      pilot_id = new ObjectId(pilot_id);
    }

    if (company_id) {
      company_id = new ObjectId(company_id);
    }

    const db = get_db();
    const booking = await db
      .collection("booking")
      .findOne({ _id: new ObjectId(booking_id) });
    if (!booking) {
      return sendResponse(404, "No booking found with this id", res);
    }

      //check whether the pilot is already confirmed for another event
      //this is not applicable to companies

      if(pilot_id){
          const pilot_cnf_bookings = await clashingPilotBookings(db,pilot_id,booking)


          //console.log(pilot_cnf_bookings)
          //console.log(booking.start_time)
          //console.log(booking.end_time)
          if(pilot_cnf_bookings.length >0){
              return sendResponse(500, "Cannot assign pilot to this booking.The pilot is already confirmed for another event at the same time.",res)
          }
      }



      //avoid duplicate requests
      const requests = booking.requests

      let pilot_and_company_ids = []
      requests.forEach((request)=>{
          if(request.pilot_id){
              pilot_and_company_ids.push(request.pilot_id.toString())
          }
          if(request.company_id){
              pilot_and_company_ids.push(request.company_id.toString())
          }

      })

      if(pilot_id && pilot_and_company_ids.includes(pilot_id.toString())){
          return sendResponse(400, "Request for this pilot already exists",res)
      }
      if(company_id && pilot_and_company_ids.includes(company_id.toString())){
          return sendResponse(400, "Request for this company already exists",res)
      }

    const updateResult = await db.collection("booking").updateOne(
      { _id: new ObjectId(booking_id) },
      {
        $push: {
          requests: {
            pilot_id: pilot_id,
            company_id: company_id,
            rejection_reason: null,
            status: "pending",
          },
        },
      }
    );

    if (updateResult && updateResult.modifiedCount == 1) {
      return res
        .status(200)
        .json({ success: true, message: "Booking updated successfully" });
    }
    return res.status(500).json({
      success: false,
      message: "Failed to assign pilot or company to request",
    });
  }
);

const updatePilotBookingRequest = tryCatchWrapper(async (req, res, next) => {
  const db = get_db();
  const user_email = req.user_email;

    console.log(user_email)
  // Fetch user details
  const user = await db.collection("user").findOne({ email: user_email });
  if (!user) return sendResponse(400, "User not found", res);

  const user_id = user._id;
  const user_role = user.user_type; // Ensure only pilots can access

  if (user_role !== "p") {
    return res
      .status(403)
      .json({ error: "Only pilots can update booking requests." });
  }

  // Validate user_id
  if (!user_id || !isObjectIdValid(user_id)) {
    return sendResponse(400, "Invalid user ID provided", res);
  }

  // Validate booking ID
  const bookingId = req.params.id;
  if (!ObjectId.isValid(bookingId)) {
    return res.status(400).json({ error: "Invalid booking ID" });
  }

  const { status, rejection_reason } = req.body;

  // Validate request status
  if (!status || !["confirmed", "rejected"].includes(status.toLowerCase())) {
    return res
      .status(400)
      .json({ error: "Invalid status. Use 'confirmed' or 'rejected'." });
  }

  // If rejecting, ensure rejection_reason is provided
  if (
    status === "rejected" &&
    (!rejection_reason || rejection_reason.trim() === "")
  ) {
    return res.status(400).json({
      error: "Rejection reason is required when rejecting a request.",
    });
  }

    
  // ✅ Find the pilot's assigned ID
  const pilot = await db
    .collection("pilot")
    .findOne({ user_id: user_id }, { projection: { _id: 1 } });
  if (!pilot) return res.status(404).json({ error: "Pilot not found." });

  const pilotId = pilot._id;

    //Note(458): This needs to be tested
    //find the booking that is being updated
    const booking = await db.collection("booking").findOne({_id:new ObjectId(bookingId)})
    if(!booking){
        return sendResponse(404, "No booking was found associated with this id",res)
    }

    //check whether the pilot is confirmed for some other event at the same time and date

    if(status === "confirmed"){
        const pilot_cnf_bookings = await clashingPilotBookings(db,pilotId,booking) 
        if(pilot_cnf_bookings.length >0){
            return sendResponse(500, "This pilot is booked for some other event at the same time.",res)
        }
    }

  // ✅ Update request status in the booking's `requests[]` array
  const updateFields = {};
  if (status === "confirmed" || status === "rejected") {
    if (status === "confirmed") {
      updateFields["status"] = status; // Set global status only when confirmed
      updateFields["pilot_id"] = pilotId;
    }
    updateFields["requests.$.status"] = status;
  }
  if (status === "rejected") {
    updateFields["requests.$.rejection_reason"] = rejection_reason;
  }

  // ✅ Check if there's already a confirmed request
  const existingConfirmed = await db.collection("booking").findOne({
    _id: new ObjectId(bookingId),
    "requests.status": "confirmed",
  });

  if (status === "confirmed" && existingConfirmed) {
    return res
      .status(400)
      .json({ error: "A pilot has already been confirmed for this booking." });
  }

    if(status==="confirmed"){
       const booking_user = await db.collection("user").findOne({_id:new ObjectId(booking.user_id)}) 
        const pilot = await db.collection("user").findOne({_id: new ObjectId(user_id)},{projection:{name:1,email:1}})

        //send email to the pilot
        let p_cal = ical()
        p_cal.createEvent({
            start:new Date(booking.start_time),
            end: new Date(booking.end_time),
            summary: `You are confirmed for ${booking.title} event`,
            description: `You are confirmed for ${booking.title} event`,
            organizer:`${booking_user.name} <${booking_user.email}>`
        })

        let p_cal_attachment = [{
            "contentType": "text/calendar",
            "content": Buffer.from(p_cal.toString())
        }]

        let booking_start_ts = new Date(booking.start_time)
        let booking_end_ts = new Date(booking.end_time)
        const months ={
            0:"January",
            1:"February",
            2:"March",
            3:"April",
            4:"May",
            5:"June",
            6:"July",
            7:"August",
            8:"September",
            9:"October",
            10:"November",
            11:"December"
        }

        const days ={
            0:"Sunday",
            1: "Monday",
            2:"Tuesday",
            3:"Wednesday",
            4:"Thursday",
            5:"Friday",
            6:"Saturday"
        }

        await sendEmail("iconicronaldo0@gmail.com", get_send_booking_info_to_pilot_template(
            {
                to:pilot.email,
                customer_name: booking_user.name,
                customer_email:booking_user.email,
                booking_title:booking.title,

                booking_start_date: days[booking_start_ts.getDay()]+ " " +booking_start_ts.getDate() + " " + months[booking_start_ts.getMonth()] + ", " + booking_start_ts.getFullYear(),

                booking_start_time:(booking_start_ts.getHours() > 12 ? booking_start_ts.getHours()-12 : booking_start_ts.getHours())+ ":" + booking_start_ts.getMinutes() + " " + (booking_start_ts.getHours() > 12 ? "PM": "AM"),

                booking_end_date: days[booking_end_ts.getDay()]+ " " +booking_end_ts.getDate() + " " + months[booking_end_ts.getMonth()] + ", " + booking_end_ts.getFullYear(),

                booking_end_time:(booking_end_ts.getHours() > 12 ? booking_end_ts.getHours()-12 : booking_end_ts.getHours()) + ":" + booking_end_ts.getMinutes() + " " + (booking_end_ts.getHours() > 12 ? "PM": "AM"),

                booking_location:booking.street_address + ", " + booking.city + ", " +booking.state+ " - " +booking.pincode 
            }
        ), subject="Drone Connect | Pilot confirmed for your event",attachments=p_cal_attachment)
        
        //send email to customer
        let cal = ical()
        cal.createEvent({
            start:new Date(booking.start_time),
            end: new Date(booking.end_time),
            summary: `Pilot confirmed for your ${booking.title} event`,
            organizer:`${booking_user.name} <${booking_user.email}>`,
            description: `${pilot.name} is available and confirmed for your event`
        })

        let cal_attachment = [{
            "contentType": "text/calendar",
            "content": Buffer.from(cal.toString())
        }]


        await sendEmail("iconicronaldo0@gmail.com", get_pilot_confirmation_template(
            {
                pilot_name: pilot.name,
                to:booking_user.email,
                pilot_email:pilot.email,
                event_name: booking.title
            }
        ), subject="Drone Connect | Pilot confirmed for your event",attachments=cal_attachment)


    }

  // ✅ Update the selected pilot's request
  const updateResult = await db
    .collection("booking")
    .updateOne(
      { _id: new ObjectId(bookingId), "requests.pilot_id": pilotId },
      { $set: updateFields }
    );

  // ✅ If status is "confirmed", reject all other requests for the same booking
  if (status === "confirmed") {
    await db.collection("booking").updateMany(
      {
        _id: new ObjectId(bookingId),
      },
      {
        $set: {
          "requests.$[elem].status": "rejected",
          "requests.$[elem].rejection_reason": "Another pilot was confirmed",
        },
      },
      {
        arrayFilters: [
          {
            "elem.pilot_id": { $ne: pilotId }, // Reject all other pilots
            "elem.company_id": { $exists: true }, // Also reject requests with a company_id
            "elem.status": { $ne: "rejected" }, // Ensure already rejected requests remain unchanged
          },
        ],
      }
    );
  }

  if (updateResult.matchedCount === 0) {
    return res.status(404).json({
      error:
        "Booking request not found or you do not have permission to update it.",
    });
  }

  return res
    .status(200)
    .json({ message: `Booking request ${status} successfully.` });
});



const updateCompanyBookingRequest = tryCatchWrapper(async (req, res, next) => {
  const db = get_db();
  const user_email = req.user_email;

  // Fetch user details
  const user = await db.collection("user").findOne({ email: user_email });
  if (!user) return sendResponse(400, "User not found", res);

  const user_id = user._id;
  const user_role = user.user_type; // Ensure only pilots can access

  if (user_role !== "o") {
    return res
      .status(403)
      .json({ error: "Only company can update booking requests." });
  }

  const company = await db.collection("company").findOne({ user_id: user_id });
  if (!company) return sendResponse(400, "Company not found", res);
  const companyId = company._id;
  // Validate user_id
  if (!user_id || !isObjectIdValid(user_id)) {
    return sendResponse(400, "Invalid user ID provided", res);
  }
  if (!companyId || !isObjectIdValid(companyId)) {
    return sendResponse(400, "Invalid company ID", res);
  }

  // Validate booking ID
  const bookingId = req.params.id;
  if (!ObjectId.isValid(bookingId)) {
    return res.status(400).json({ error: "Invalid booking ID" });
  }

  const { status, rejection_reason, pilot_id } = req.body;

  // Validate request status
  if (!status || !["confirmed", "rejected"].includes(status.toLowerCase())) {
    return res
      .status(400)
      .json({ error: "Invalid status. Use 'confirmed' or 'rejected'." });
  }

  // If rejecting, ensure rejection_reason is provided
  if (
    status === "rejected" &&
    (!rejection_reason || rejection_reason.trim() === "")
  ) {
    return res.status(400).json({
      error: "Rejection reason is required when rejecting a request.",
    });
  }

  let pilotId = null;
  if (pilot_id) {
    const pilot = await db
      .collection("pilot")
      .findOne({ user_id: new ObjectId(pilot_id) }, { projection: { _id: 1 } });
  
    if (!pilot) return res.status(404).json({ error: "Pilot not found." });
  
    pilotId = pilot._id;
  }


    //Note(458): This needs to be tested
    //find the booking that is being updated
    const booking = await db.collection("booking").findOne({_id:new ObjectId(bookingId)})
    if(!booking){
        return sendResponse(404, "No booking was found associated with this id",res)
    }

    //check whether the pilot is confirmed for some other event at the same time and date
    
    if(status === "confirmed"){
    const pilot_cnf_bookings = await clashingPilotBookings(db,pilotId,booking) 
    if(pilot_cnf_bookings.length >0){
        return sendResponse(500, "This pilot is booked for some other event at the same time.",res)
    }
    }


  // ✅ Update request status in the booking's `requests[]` array
  const updateFields = {};
  if (status === "confirmed" || status === "rejected") {
    if (status === "confirmed") {
      updateFields["status"] = status; // Set global status only when confirmed
      updateFields["pilot_id"] = pilotId;
      updateFields["company_id"] = companyId;
    }
    updateFields["requests.$.status"] = status;
  }


  if (status === "rejected") {
    updateFields["requests.$.rejection_reason"] = rejection_reason;
  }

  // ✅ Check if there's already a confirmed request
  const existingConfirmed = await db.collection("booking").findOne({
    _id: new ObjectId(bookingId),
    status: "confirmed",
  });

  if (status === "confirmed" && existingConfirmed) {
    return res
      .status(400)
      .json({ error: "A pilot has already been confirmed for this booking." });
  }

    if(status==="confirmed"){
       const booking_user = await db.collection("user").findOne({_id:new ObjectId(booking.user_id)}) 
        const pilot = await db.collection("user").findOne({_id: new ObjectId(pilot_id)},{projection:{name:1, email:1}})

        //send email to the pilot
        let p_cal = ical()
        p_cal.createEvent({
            start:new Date(booking.start_time),
            end: new Date(booking.end_time),
            summary: `You are confirmed for ${booking.title} event`,
            description: `You are confirmed for ${booking.title} event`,
            organizer:`${booking_user.name} <${booking_user.email}>`
        })

        let p_cal_attachment = [{
            "contentType": "text/calendar",
            "content": Buffer.from(p_cal.toString())
        }]

        let booking_start_ts = new Date(booking.start_time)
        let booking_end_ts = new Date(booking.end_time)
        const months ={
            0:"January",
            1:"February",
            2:"March",
            3:"April",
            4:"May",
            5:"June",
            6:"July",
            7:"August",
            8:"September",
            9:"October",
            10:"November",
            11:"December"
        }

        const days ={
            0:"Sunday",
            1: "Monday",
            2:"Tuesday",
            3:"Wednesday",
            4:"Thursday",
            5:"Friday",
            6:"Saturday"
        }

        await sendEmail([pilot.email,user.email], get_send_booking_info_to_pilot_template(
            {
                to:pilot.email,
                customer_name: booking_user.name,
                customer_email:booking_user.email,
                booking_title:booking.title,

                booking_start_date: days[booking_start_ts.getDay()]+ " " +booking_start_ts.getDate() + " " + months[booking_start_ts.getMonth()] + ", " + booking_start_ts.getFullYear(),

                booking_start_time:(booking_start_ts.getHours() > 12 ? booking_start_ts.getHours()-12 : booking_start_ts.getHours())+ ":" + booking_start_ts.getMinutes() + " " + (booking_start_ts.getHours() > 12 ? "PM": "AM"),

                booking_end_date: days[booking_end_ts.getDay()]+ " " +booking_end_ts.getDate() + " " + months[booking_end_ts.getMonth()] + ", " + booking_end_ts.getFullYear(),

                booking_end_time:(booking_end_ts.getHours() > 12 ? booking_end_ts.getHours()-12 : booking_end_ts.getHours()) + ":" + booking_end_ts.getMinutes() + " " + (booking_end_ts.getHours() > 12 ? "PM": "AM"),

                booking_location:booking.street_address + ", " + booking.city + ", " +booking.state+ " - " +booking.pincode 
            }
        ), subject="Drone Connect | You are confirmed ",attachments=p_cal_attachment)
        
        //send email to customer
        let cal = ical()
        cal.createEvent({
            start:new Date(booking.start_time),
            end: new Date(booking.end_time),
            summary: `Pilot confirmed for your ${booking.title} event`,
            organizer:`${booking_user.name} <${booking_user.email}>`,
            description: `${pilot.name} is available and confirmed for your event`
        })

        let cal_attachment = [{
            "contentType": "text/calendar",
            "content": Buffer.from(cal.toString())
        }]


        await sendEmail(booking_user.email, get_pilot_confirmation_template(
            {
                pilot_name: pilot.name,
                to:booking_user.email,
                pilot_email:pilot.email,
                event_name: booking.title
            }
        ), subject="Drone Connect | Pilot confirmed for your event",attachments=cal_attachment)

    }
  // ✅ Update the selected pilot's request
  const updateResult = await db
    .collection("booking")
    .updateOne(
      { _id: new ObjectId(bookingId), "requests.company_id": companyId },
      { $set: updateFields }
    );

  console.log(updateResult);

  if (updateResult.matchedCount === 0) {
    return res.status(404).json({
      error:
        "Booking request not found or you do not have permission to update it.",
    });
  }
  // ✅ If status is "confirmed", reject all other requests for the same booking
  if (status === "confirmed") {
    await db.collection("booking").updateOne(
      { _id: new ObjectId(bookingId) },
      {
        $push: {
          requests: {
            pilot_id: pilotId,
            company_id: null,
            rejection_reason: null,
            status: "confirmed",
          },
        },
      }
    );

    await db.collection("booking").updateMany(
      {
        _id: new ObjectId(bookingId),
      },
      {
        $set: {
          "requests.$[elem].status": "rejected",
          "requests.$[elem].rejection_reason": "Another pilot was confirmed",
        },
      },
      {
        arrayFilters: [
          {
            "elem.pilot_id": { $ne: pilotId }, // Reject all other pilots
            "elem.company_id": { $ne: companyId }, // Also reject requests with a company_id
            "elem.status": { $ne: "rejected" }, // Ensure already rejected requests remain unchanged
          },
        ],
      }
    );
  }


  return res
    .status(200)
    .json({ message: `Booking request ${status} successfully.` });
});

const markBookingAsComplete = tryCatchWrapper(async (req, res, next) => {
  let booking_id = req.params.id;

  if (!isObjectIdValid(booking_id)) {
    return sendResponse(400, "Invalid booking id", res);
  }
  const db = get_db();

  booking_id = new ObjectId(booking_id);

  const booking = await db.collection("booking").findOne({ _id: booking_id });
  if (!booking) {
    return sendResponse(404, "No booking found with this id", res);
  }

  if (booking.status != "confirmed") {
    return sendResponse(
      500,
      "The booking must be confirmed before marking it as complete",
      res
    );
  }
  
  if (Date.now() < Date.parse(booking.date)) {
    return sendResponse(500, "The event has not concluded yet", res);
  }
  const searchFields = { _id: new ObjectId(booking_id) };
  const updateFields = { status: "completed" };
  
  // Define array filters dynamically
  const arrayFilters = [];
  if (booking.pilot_id) {
    updateFields["requests.$[pilotElem].status"] = "completed";
    arrayFilters.push({ "pilotElem.pilot_id": booking.pilot_id });
  }
  if (booking.company_id) {
    updateFields["requests.$[companyElem].status"] = "completed";
    arrayFilters.push({ "companyElem.company_id": booking.company_id });
  }
  
  const update_result = await db.collection("booking").updateOne(
    searchFields,
    { $set: updateFields },
    { arrayFilters: arrayFilters.length > 0 ? arrayFilters : undefined }
  );
  

  if (update_result.modifiedCount == 1) {
    return sendResponse(200, "Booking marked as complete", res);
  }
  return sendResponse(500, "Couldn't mark the booking as complete", res);
});


async function clashingPilotBookings(db,pilot_id,booking){

      let pilot_cnf_bookings = []
   pilot_cnf_bookings=await db.collection("booking").find(
          {
              requests: {$elemMatch: {$and:[{pilot_id: pilot_id}, {status:"confirmed"}]}}, 
              status:"confirmed",

              //4 clash conditions - the timestamps contain the date as well
              //ST- start_time for current booking
              //ET - end_time for currrent booking
              //st- start_time for clash booking
              //et -end_time for clash booking
              // condition 1
              //  st|---------------------------|et
              //  ST                            ET(current)

              //condition 2
              //  st|--------------------et-------|
              //  ST                            ET(current)

              //condition 3
              //  |----st-----------------------|et
              //  ST                            ET(current)

              //condition 4
              //  |----st----------------et-------|
              //  ST                            ET(current)

              $or:[
                  //cond 1
                  {
                      $and:[
                          {start_time:{$lte:booking.start_time}},
                          {end_time:{$gte:booking.end_time}}
                      ]
                  },

                  //cond 2
                  {
                      $and:[
                          {start_time:{$lte: booking.start_time}},
                          {$and:
                              [
                                  {end_time:{$lte:booking.end_time}}, 
                                  {end_time:{$gt:booking.start_time}}
                              ]
                          }
                      ]
                  },

                  //condition 3
                  {
                      $and:[
                          {end_time:{$gte: booking.end_time}},
                          {$and:
                              [
                                  {start_time:{$lt:booking.end_time}}, 
                                  {start_time:{$gt:booking.start_time}}
                              ]
                          }
                      ]
                  },


                  //condition 4
                  {
                      $and:[
                          {$and:
                              [
                                  {end_time:{$lte:booking.end_time}}, 
                                  {end_time:{$gt:booking.start_time}}
                              ]
                          },
                          {$and:
                              [
                                  {start_time:{$lt:booking.end_time}}, 
                                  {start_time:{$gt:booking.start_time}}
                              ]
                          }
                      ]
                  }

              ]

          }
              
      ).toArray()

    return pilot_cnf_bookings
}

async function clashingCompanyBookings(db,company_id,booking){

      const company_cnf_bookings = await db.collection("booking").find(
          {
              requests: {$elemMatch: {$and:[{company_id: company_id}, {status:"confirmed"}]}}, 
              status:"confirmed",

              //4 clash conditions - the timestamps contain the date as well
              //ST- start_time for current booking
              //ET - end_time for currrent booking
              //st- start_time for clash booking
              //et -end_time for clash booking
              // condition 1
              //  st|---------------------------|et
              //  ST                            ET(current)

              //condition 2
              //  st|--------------------et-------|
              //  ST                            ET(current)

              //condition 3
              //  |----st-----------------------|et
              //  ST                            ET(current)

              //condition 4
              //  |----st----------------et-------|
              //  ST                            ET(current)

              $or:[
                  //cond 1
                  {
                      $and:[
                          {start_time:{$lte:booking.start_time}},
                          {end_time:{$gte:booking.end_time}}
                      ]
                  },

                  //cond 2
                  {
                      $and:[
                          {start_time:{$lte: booking.start_time}},
                          {$and:
                              [
                                  {end_time:{$lte:booking.end_time}}, 
                                  {end_time:{$gt:booking.start_time}}
                              ]
                          }
                      ]
                  },

                  //condition 3
                  {
                      $and:[
                          {end_time:{$gte: booking.end_time}},
                          {$and:
                              [
                                  {start_time:{$lt:booking.end_time}}, 
                                  {start_time:{$gt:booking.start_time}}
                              ]
                          }
                      ]
                  },


                  //condition 4
                  {
                      $and:[
                          {$and:
                              [
                                  {end_time:{$lte:booking.end_time}}, 
                                  {end_time:{$gt:booking.start_time}}
                              ]
                          },
                          {$and:
                              [
                                  {start_time:{$lt:booking.end_time}}, 
                                  {start_time:{$gt:booking.start_time}}
                              ]
                          }
                      ]
                  }

              ]

          }
              
      ).toArray()

    return company_cnf_bookings
}
module.exports = {
  // bookPilot,
  createBooking,
  getBookingTitle,
  getCustomerBookings,
  assignPilotOrCompanyToBooking,
  getBookingByIdCustomer,
  getPilotCompanyBookings,
  getBookingByIdCompanyPilot,
  updatePilotBookingRequest,
  updateCompanyBookingRequest,
  markBookingAsComplete,
};
