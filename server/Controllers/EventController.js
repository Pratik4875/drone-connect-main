const tryCatchWrapper = require("../Utils/TryCatchWrapper.js");
const { get_db } = require("../Utils/MongoConnect.js");
const sendResponse = require("../Utils/SendResponse.js");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const { ObjectId } = require("mongodb");
const isObjectIdValid = require("../Utils/ValidObjectId.js");

cloudinary.config({
  cloud_name: process.env.CLOUDNARY_CLOUD_NAME,
  api_key: process.env.CLOUDNARY_API_KEY,
  api_secret: process.env.CLOUDNARY_API_SECRET,
  secure: true,
});

// get all events

const getAllEvents = tryCatchWrapper(async (req, res, next) => {
  const query_params = req.query;
  const filters = Object.keys(query_params);
  let page = 1,
    limit = 10;
  let aggregate = [];
  let user_email = req.user_email;

  if (filters.includes("page") && filters.includes("limit")) {
    page = parseInt(query_params["page"]);
    limit = parseInt(query_params["limit"]);
  }

  if (filters.includes("page") && filters.includes("limit")) {
    page = parseInt(query_params["page"]);
    limit = parseInt(query_params["limit"]);
  }

  if (filters.includes("name") && query_params["name"].length>0) {
      console.log("inside name")
    aggregate.push({
      $match: {
        name: {
          $regex: query_params["name"],
          $options: "i",
        },
      },
    });
  }

  if (filters.includes("city") && query_params["city"].length>0) {
    aggregate.push({
      $match: {
        city: {
          $regex: query_params["city"],
          $options: "i",
        },
      },
    });
  }

  if (filters.includes("state") && query_params["state"].length >0) {
    aggregate.push({
      $match: {
        state: {
          $regex: query_params["state"],
          $options: "i",
        },
      },
    });
  }


  const db = get_db();
  let skip = (page - 1) * limit;
  let user = await db.collection("user").findOne({ email: user_email });
  let user_pincode = parseInt(user["pincode"]);
  console.log(user_pincode);

  aggregate.push(
    {
      $addFields: {
        distance: {
          $abs: {
            $subtract: [{ $toInt: "$pincode" }, { $literal: user_pincode }],
          },
        },
      },
    },
    {
      $sort: { distance: 1 },
    },
    { $project: { distance: 0 } }
  );

  // Lookup company details
  aggregate.push(
    {
      $lookup: {
        from: "company",
        localField: "company_id",
        foreignField: "_id",
        as: "company_info",
      },
    },
    {
      $unwind: {
        path: "$company_info",
        preserveNullAndEmptyArrays: true, // Keep events even if there's no matching company
      },
    }
  );

  // Filter for verified companies
  aggregate.push({
    $match: {
      $and: [
        { "company_info.status": "verified" }, // Only include verified companies
        // { company_info: { $exists: false } }, // Include events without a company
      ],
    },
  });

  // Exclude unnecessary company details
  aggregate.push({
    $project: {
      "company_info.logo": 0,
      "company_info.website": 0,
      "company_info.gst": 0,
      "company_info.user_id": 0,
      "company_info._id": 0,
    },
  });

  const event_col = await db.collection("event");
  let totalEventsAfterFilter = (await event_col.aggregate(aggregate).toArray()).length;
  aggregate.push({ $skip: skip }, { $limit: limit });
  let events = await event_col.aggregate(aggregate).toArray();

  return res.status(200).json({
    success: true,
    data: events,
    currentPage: parseInt(page),
    totalEvents: totalEventsAfterFilter,
    totalPages: Math.ceil(totalEventsAfterFilter / limit),
    hasNextPage: skip + events.length < totalEventsAfterFilter,
  });
}); 
// insert event

const addEvent = tryCatchWrapper(async (req, res, next) => {
  const user_email = req.user_email;

  const { path } = req.file;
  const db = get_db();

  const user = await db.collection("user").findOne({ email: user_email });
  if (!user) {
    return res.status(400).json({ message: "No such user found" });
  }

  const company = await db.collection("company").findOne({ user_id: user._id });
  if (!company) {
    return res.status(400).json({ message: "No company found for this user" });
  }
  if (company.status === "unverified") {
    fs.unlink(path, (err) => {
      if (err) console.error("Error deleting file:", err.message);
    });
    return res
      .status(400)
      .json({ message: "Your status is unverified you cant add!" });
  }
  const { mode = "nv", name, desc, start_ts, end_ts, reg_link } = req.body;
  let { street_addr, city, state, pincode } = req.body;

  //mode values can be :
  //1. "v" -> virtual
  //2. "nv" -> not -virtual ie irl event

  if (!name || name.length < 1) {
    return sendResponse(400, "No event name provided", res);
  }
  if (!desc || desc.length < 1) {
    return sendResponse(400, "No event description provided", res);
  }
  if (!start_ts || start_ts.length < 1) {
    return sendResponse(400, "No start timestamp provided", res);
  }
  if (!end_ts || end_ts.length < 1) {
    return sendResponse(400, "No end timestamp provided", res);
  }

  if (mode == "nv") {
    if (!street_addr || street_addr.length < 1) {
      return sendResponse(400, "No address line provided", res);
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
  }

  // Upload image to Cloudinary
  let uploadResult;
  try {
    uploadResult = await cloudinary.uploader.upload(path, {
      folder: "events", // Optional folder structure in Cloudinary
      resource_type: "image",
    });
  } catch (error) {
    return sendResponse(500, `Image upload failed: ${error.message}`, res);
  } finally {
    // Remove file from local storage
    fs.unlink(path, (err) => {
      if (err) console.error("Error deleting file:", err.message);
    });
  }

  // Validate Cloudinary upload result
  if (!uploadResult || !uploadResult.public_id) {
    return sendResponse(500, "Failed to upload image", res);
  }

  let event_doc = {
    name: name,
    company_id: company._id,
    desc: desc,
    start_ts: new Date(start_ts),
    end_ts: new Date(end_ts),
    reg_link: reg_link,
    image: uploadResult.public_id,
    mode: mode,
  };

  if (street_addr) {
    event_doc.street_addr = street_addr;
  }
  if (city) {
    event_doc.city = city;
  }
  if (state) {
    event_doc.state = state;
  }
  if (pincode) {
    event_doc.pincode = parseInt(pincode);
  }

  const insert_result = await db.collection("event").insertOne(event_doc);
  if (!insert_result.acknowledged || !insert_result.insertedId) {
    return res
      .status(500)
      .json({ success: false, msg: "Could not add new event" });
  }

  return res
    .status(200)
    .json({ success: true, msg: "Event added successfully" });
});

//update event
const updateEvent = tryCatchWrapper(async (req, res, next) => {
  const user_email = req.user_email;

  const db = get_db();
  const user = await db.collection("user").findOne({ email: user_email });
  if (!user || (user.user_type != "o" && user.user_type != "a")) {
    return sendResponse(400, "No such user found with this email id", res);
  }

  //Not applicable if the admin is trying to delete the events
  /* const company= await db.collection("company").findOne({user_id: user._id})
    if(!company){
        return sendResponse(400, "No company found with this email id",res)
    }
    const company_id = company._id
    */

  const event_id = req.params.id;
  let image;
  if (req.file) {
    image = req.file.path;
  }

  let {
    name,
    desc,
    start_ts,
    end_ts,
    street_addr,
    city,
    state,
    pincode,
    reg_link,
      mode
  } = req.body;

  if (!event_id || event_id.length < 1) {
    return sendResponse(400, "No event id provided ", res);
  }
  if (!isObjectIdValid(event_id)) {
    return sendResponse(500, "Invalid object id", res);
  }

  let set_doc = {};
  let warning_msg = "";

  if (name && name.length > 0) {
    set_doc.name = name;
  }
  if (desc && desc.length > 0) {
    set_doc.desc = desc;
  }
  if (
    start_ts &&
    start_ts.length > 0
    // && start_ts.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+05:30/)
  ) {
    set_doc.start_ts = new Date(start_ts);
  }
    if(mode && mode.length>0 && ["v","nv"].includes(mode.trim().toLowerCase())){
        set_doc.mode = mode.trim().toLowerCase()
    }

    console.log(mode)
  console.log(end_ts);

  if (
    end_ts &&
    end_ts.length > 0
    // && end_ts.match(/\d{4}-\d{2}-\d{0,2}T\d{2}:\d{2}:\d{2}\+05:30/)
  ) {
    console.log(new Date(end_ts));
    set_doc.end_ts = new Date(end_ts);
  }

  if (street_addr && street_addr.length > 0) {
    set_doc.street_addr = street_addr;
  }

  if (state && state.length > 0) {
    set_doc.state = state;
  }

  if (city && city.length > 0) {
    set_doc.city = city;
  }

  if (pincode && pincode.length > 0) {
    set_doc.pincode = parseInt(pincode);
  }

  if (reg_link && reg_link.length > 0) {
    set_doc.reg_link = reg_link;
  }

  if (image) {
    let uploadResult;
    try {
      uploadResult = await cloudinary.uploader.upload(path, {
        folder: "events", // Optional folder structure in Cloudinary
        resource_type: "image",
      });
    } catch (error) {
      return sendResponse(500, `Image upload failed: ${error.message}`, res);
    } finally {
      // Remove file from local storage
      fs.unlink(path, (err) => {
        if (err) console.error("Error deleting file:", err.message);
      });
    }

    // Validate Cloudinary upload result
    if (!uploadResult || !uploadResult.public_id) {
      return sendResponse(500, "Failed to upload image", res);
    }

    set_doc.image = uploadResult.public_id;

    let old_event = await db
      .collection("event")
      .findOne({ _id: new ObjectId(event_id) });

    if (!old_event) {
      return sendResponse(400, "No such event found", res);
    }
    const destroy_result = await cloudinary.uploader
      .destroy(old_event.image)
      .catch((error) => {
        warning_msg += error.message + "\n";
        //return sendResponse(500, error.message, res);
      });

    if (destroy_result.result !== "ok") {
      warning_msg += "Failed to delete the old image after updating\n";
      console.error(warning_msg);
    }
  }
    console.log(set_doc)
  const update_result = await db
    .collection("event")
    .updateOne({ _id: new ObjectId(event_id) }, { $set: set_doc });

  if (update_result.modifiedCount == 1) {
    if (warning_msg) {
      return res.status(200).json({
        success: true,
        message: "Event updated successfully with warnings",
        warning_message: warning_msg,
      });
    }

    return res
      .status(200)
      .json({ success: true, message: "Event updated successfully" });
  } else {
    if (warning_msg) {
      return res.status(500).json({
        success: false,
        message: "Event not updated successfully.Contains warnings",
        warning_message: warning_msg,
      });
    }
      console.log(update_result)
    return res
      .status(500)
      .json({ success: false, message: "Event not updated successfully" });
  }
});

//delete event
const deleteEvent = tryCatchWrapper(async (req, res, next) => {
  const event_id = req.params.id;
  const user_email = req.user_email;

  if (!event_id || event_id.length < 1) {
    return sendResponse(400, "No event id provided", res);
  }
  if (!isObjectIdValid(event_id)) {
    return sendResponse(500, "Invalid object id", res);
  }
  let warning_msg = "";
  const db = get_db();
  const user = await db.collection("user").findOne({ email: user_email });

  if (!user || (user.user_type != "o" && user.user_type != "a")) {
    return sendResponse(400, "No such user found with this email", res);
  }

  const event_col = await db.collection("event");
  const old_event = await event_col.findOne({ _id: new ObjectId(event_id) });

  if (!old_event) {
    return sendResponse(400, "No such event found", res);
  }

  if (old_event.image != "" && !old_event.image.match(/path/)) {
    console.log(old_event.image);
    const destroy_result = await cloudinary.uploader
      .destroy(old_event.image)
      .catch((error) => {
        warning_msg += error.message + "\n";
        //return sendResponse(500, error.message, res);
      });

    if (destroy_result.result !== "ok") {
      warning_msg += "Failed to delete the image\n";
      console.error(warning_msg);
    }
  }

  const delete_result = await event_col.deleteOne({
    _id: new ObjectId(event_id),
  });

  if (delete_result && delete_result.deletedCount == 1) {
    if (warning_msg) {
      return res.status(200).json({
        success: true,
        message: "Event deleted successfully",
        warning_message: warning_msg,
      });
    }
    return res
      .status(200)
      .json({ success: true, message: "Event deleted successfully" });
  } else {
    if (warning_msg) {
      return res.status(500).json({
        success: false,
        message: "Event not deleted successfully",
        warning_message: warning_msg,
      });
    }

    return res
      .status(500)
      .json({ success: false, message: "Event not deleted successfully" });
  }
});

// get events for one particular user
const getUserEvent = tryCatchWrapper(async (req, res, next) => {
  const event_id = req.params.id;
  if (!event_id) {
    return sendResponse(400, "No post id provided", res);
  }
  if (!isObjectIdValid(event_id)) {
    return sendResponse(500, "Invalid object id", res);
  }
  const user_email = req.user_email;
  if (!user_email) {
    return sendResponse(400, "User email is required", res);
  }
  const db = get_db();
  const user_col = await db.collection("user");
  const user = await user_col.findOne({ email: user_email });

  if (!user) {
    return sendResponse(401, "No user found with this email", res);
  }
  const company_col = await db.collection("company");
  const company = await company_col.findOne({ user_id: user._id });
  if (!company) {
    return sendResponse(400, "No pilot", res);
  }
  const event_col = await db.collection("event");

  const event = await event_col.findOne(
    {
      _id: new ObjectId(event_id),
      company_id: new ObjectId(company._id),
    },
    { projection: { company_id: 0 } }
  );

  if (!event) {
    return sendResponse(400, "No event found!", res);
  }
  return res.status(200).json({ success: true, event });
});

module.exports = {
  getAllEvents,
  addEvent,
  updateEvent,
  deleteEvent,
  getUserEvent,
};
