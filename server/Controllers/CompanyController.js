const tryCatchWrapper = require("../Utils/TryCatchWrapper.js");
const bcryptjs = require("bcryptjs");
const { get_db } = require("../Utils/MongoConnect.js");
const sendResponse = require("../Utils/SendResponse.js");
const { ObjectId } = require("mongodb");
const sendEmail = require("../Utils/SendEmail.js");
const { get_pilot_creds_template } = require("../Utils/HtmlEmailTemplates.js");
const isObjectIdValid = require("../Utils/ValidObjectId.js");

const getCompanyProfile = tryCatchWrapper(async (req, res, next) => {
  const company_id = req.params.id;

  if (!company_id || company_id.length < 1) {
    return sendResponse(400, "No id present", res);
  }

  if (!isObjectIdValid(company_id)) {
    return sendResponse(500, "Invalid object id", res);
  }

  const db = get_db();
  const company_col = await db.collection("company");

  //TODO: the projection in findOne doesn't work for some reason
  let company = await company_col
    .find({ _id: new ObjectId(company_id), status: "verified" })
    .limit(1)
    .project({ user_id: 0, gst: 0 })
    .toArray();

    console.log(company);
    
  if (!company || !company[0]) {
    return sendResponse(400, "No such company present", res);
  }

  company = company[0];

  const pilots = await db
    .collection("pilot")
    .aggregate([
      { $match: { company_id: company._id } },
      {
        $lookup: {
          from: "user",
          localField: "user_id",
          foreignField: "_id",
          as: "pilots",
        },
      },
      { $unwind: "$pilots" },
      {
        $project: {
          "pilots.name": 1,
          user_id: 1,
          drone_category: 1,
          "pilots.profile": 1,
        },
      },
      { $limit: 10 },
    ])
    .toArray();

  // console.log(pilots);

  let final_pilots = [];

  pilots.forEach((pilot) => {
    final_pilots.push({
      name: pilot.pilots.name,
      user_id: pilot.user_id,
      drone_category: pilot.drone_category,
      profile: pilot.pilots.profile,
    });
  });
  company.pilots = final_pilots;
  return res.status(200).json(company);
});

const getCompanyPilots = tryCatchWrapper(async (req, res, next) => {
  const company_id = req.params.id;

  if (!isObjectIdValid(company_id)) {
    return sendResponse(500, "Invalid object id", res);
  }
  const query_params = req.query;
  const filters = Object.keys(query_params);
  let page = 1,
    limit = 10;

  let aggregate_list = [{ $match: { company_id: new ObjectId(company_id) } }];
  let user_aggregate_pipeline = [
    {
      $match: { $expr: { $eq: ["$$user_id", "$_id"] } },
    },
  ];

  if (filters.includes("page")) {
    page = parseInt(query_params["page"]);
  }

  if (filters.includes("limit")) {
    limit = parseInt(query_params["limit"]);
  }
  if (filters.includes("category")) {
    aggregate_list.push({
      $match: {
        drone_category: { $regex: query_params["category"], $options: "i" },
      },
    });
  }
  if (filters.includes("search")) {
    user_aggregate_pipeline.push({
      $match: { name: { $regex: query_params["search"], $options: "i" } },
    });
  }

  user_aggregate_pipeline.push({
    $project: { name: 1, _id: 0, email: 1, profile: 1 },
  });

  let skip = (page - 1) * limit;
  aggregate_list.push(
    {
      $lookup: {
        from: "user",
        let: { user_id: "$user_id" },
        pipeline: user_aggregate_pipeline,
        as: "name",
      },
    },
    { $unwind: "$name" },

    {
      $project: {
        user_id: 1,
        _id: 0,
        name: 1,
        drone_category: 1,
        available: 1,
      },
    }
  );

  // console.log(aggregate_list)
  //console.log(user_aggregate_pipeline)
  const db = get_db();
  let pilots = await db.collection("pilot").aggregate(aggregate_list).toArray();
  let totalPilots = pilots.length;

  aggregate_list.push(
    {
      $skip: skip,
    },
    { $limit: limit }
  );

  pilots = await db.collection("pilot").aggregate(aggregate_list).toArray();

  let final_pilots = [];
  console.log(req.is_company_req);
  pilots.forEach((pilot) => {
    console.log(pilot);

    let info = {
      name: pilot.name.name,
      user_id: pilot.user_id,
      drone_category: pilot.drone_category,
      profile: pilot.name.profile,
      available: pilot.available,
    };
    if (req.is_company_req) {
      info.email = pilot.name.email;
    }
    final_pilots.push(info);
  });
  return res.status(200).json({
    success: true,
    pilots: final_pilots,
    currentPage: page,
    totalPilots: totalPilots,
    totalPages: Math.ceil(totalPilots / limit),
    hasNextPage: skip + pilots.length < totalPilots,
  });
});

const addPilot = tryCatchWrapper(async (req, res, next) => {
  const { name, email } = req.body;
  const company_id = req.params.id;

  if (!name || name.length < 1) {
    return sendResponse(400, "No name provided", res);
  }

  if (!email || email.length < 1) {
    return sendResponse(400, "No email provided", res);
  }

  if (!email.match(/\S+@\S+\.\S+/)) {
    return sendResponse(400, "Invalid email provided", res);
  }

  if (!company_id || company_id.length < 1) {
    return sendResponse(400, "No company id provided", res);
  }

  if (!isObjectIdValid(company_id)) {
    return sendResponse(500, "Invalid object id", res);
  }
  const db = get_db();

  const user_col = await db.collection("user");
  const existing_user = await user_col.findOne({ email: email });
  if (existing_user) {
    return sendResponse(400, "User already exists", res);
  }

  const password = randomPasswordGenerator();
  console.log(password);

  const hashed_password = bcryptjs.hashSync(password, bcryptjs.genSaltSync(10));

  const user_doc = {
    name: name.trim().toLowerCase(),
    district: null,
    city: null,
    state: null,
    pincode: null,
    email: email,
    password: hashed_password,
    user_type: "p",
    profile: null,
  };

  const user_insert_result = await user_col.insertOne(user_doc);
  if (!user_insert_result || !user_insert_result.insertedId) {
    console.log("Failed to insert the new user to the database");
    return sendResponse(500, "Failed to create a new user");
  }

  const company = await db.collection("company").aggregate();
  const pilot_doc = {
    user_id: user_insert_result.insertedId,
    company_id: new ObjectId(company_id),
    drone_category: null,
    is_company_person: true,
    ia_DGCA_license: null,
    license_number: null,
    available: false,
    socials: [],
  };

  const pilot_insert_result = await db.collection("pilot").insertOne(pilot_doc);
  if (!pilot_insert_result || !pilot_insert_result.insertedId) {
    console.log("failed to insert the pilot document in the pilot collection");
    return sendResponse(500, "Failed to create new pilot", res);
  }

  const emailResult = await sendEmail(
    email,
    get_pilot_creds_template(email, password),
    "DroneConnect | Pilot Login Credentials"
  );
  if (!emailResult) {
    return sendResponse(500, "Failed to send email", res);
  }

  return res
    .status(201)
    .json({ success: true, message: "Pilot added successfully" });
});

const deletePilotFromCompany = tryCatchWrapper(async (req, res, next) => {
  let user_id = req.params.id;
  if (!user_id || user_id.length < 1) {
    return sendResponse(400, "No user id provided", res);
  }
  if (!isObjectIdValid(user_id)) {
    return sendResponse(500, "Invalid object id", res);
  }

  const db = get_db();
  user_id = new ObjectId(user_id);

  const pilot = await db
    .collection("pilot")
    .findOne({ user_id: user_id });
    if(!pilot){
        return sendResponse(404, "No pilot found with this id",res)
    }
    let updateResult = await db
      .collection("pilot")
      .updateOne({ user_id: user_id },{$set:{is_company_person:false,company_id:null}});
    if(updateResult.modifiedCount!=1){
        return sendResponse(500,"Failed to remove pilot from company",res)
    }

    return sendResponse(200, "Pilot removed successfully",res)


});

const getPilotByEmail = tryCatchWrapper(async (req, res, next) => {
  const email = req.params.email;
  if (!email || email.length < 1) {
    return sendResponse(400, "No email provided", res);
  }
  if (!email.match(/\S+@\S+\.\S+/)) {
    return sendResponse(400, "Invalid email provided", res);
  }
  console.log(email);
  const db = get_db();
  let user = await db
    .collection("user")
    .aggregate([
      { $match: { email: email } },
      {
        $lookup: {
          from: "pilot",
          localField: "_id",
          foreignField: "user_id",
          as: "pilot",
        },
      },
      {
        $unwind: "$pilot",
      },

      {
        $project: { name: 1, email: 1, profile: 1, "pilot.drone_category": 1 },
      },
    ])
    .toArray();

  console.log(user);

  if (user.length == 1) {
    user = user[0];

    let final_user = {};
    final_user.name = user.name;
    final_user.email = user.email;
    final_user.profile = user.profile;
    final_user.category = user.pilot.drone_category;

    return res.status(200).json(final_user);
  }

  return res.status(500).json({
    success: false,
    message: "No pilot found with the provided details",
  });
});

const addExistingPilotToCompany = tryCatchWrapper(async (req, res, next) => {
  const company_id = req.params.id;
  const { email } = req.body;

  if (!company_id || company_id.length < 1) {
    return sendResponse(400, "No company id provided", res);
  }

  if (!isObjectIdValid(company_id)) {
    return sendResponse(500, "Invalid object id", res);
  }

  if (!email || email.length < 1) {
    return sendResponse(400, "No email provided", res);
  }
  if (!email.match(/\S+@\S+\.\S+/)) {
    return sendResponse(400, "Invalid email provided", res);
  }
  const db = get_db();
  const user = await db.collection("user").findOne({ email: email });
  if (!user) {
    return sendResponse(400, "No user found with this email", res);
  }
  const user_id = user._id;

  const pilot = await db.collection("pilot").findOne({ user_id: user_id });
  if (!pilot) {
    return sendResponse(400, "No pilot found for this email id", res);
  }

  const update_result = await db.collection("pilot").updateOne(
    { user_id: user_id },
    {
      $set: { is_company_person: true, company_id: new ObjectId(company_id) },
    }
  );

  if (update_result && update_result.modifiedCount == 1) {
    return res
      .status(201)
      .json({ success: true, message: "Pilot added to company successfully" });
  }

  return res
    .status(500)
    .json({ success: false, message: "Failed to add pilot to company" });
});

function randomPasswordGenerator() {
  let password = "";
  let caps = 1;
  for (i = 0; i < 5; i++) {
    let num = Math.floor(Math.random() * 26);
    if (caps == 1 || (i == 4 && caps == 0)) {
      password += String.fromCharCode(65 + num);
      caps = 0;
    } else {
      password += String.fromCharCode(97 + num);
    }
  }

  let special_chars = "[]{}()|@#$%&*!?";

  password += special_chars.charAt(
    Math.floor(Math.random() * (special_chars.length - 1))
  );

  for (i = 0; i < 3; i++) {
    password += String.fromCharCode(48 + Math.floor(Math.random() * 10));
  }

  return password;
}

const getCompanies = tryCatchWrapper(async (req, res, next) => {
  const query_params = req.query;
  let filters = Object.keys(query_params);
  let page = 1;
  let limit = 10;
  let aggregate_doc = [
    { $match: { status: "verified" } }, // ✅ Match only verified companies
    { $project: { gst: 0, user_id: 0, status: 0 } },
  ];
  if (filters.includes("page")) {
    page = parseInt(query_params["page"]);
  }

  if (filters.includes("limit")) {
    limit = parseInt(query_params["limit"]);
  }
  if (filters.includes("search")) {
    aggregate_doc.push({
      $match: {
        name: {
          $regex: query_params["search"],
          $options: "i",
        },
      },
    });
  }

  const db = get_db();

  let companies = await db
    .collection("company")
    .aggregate(aggregate_doc)
    .toArray();
  const totalCompanies = companies.length;

  let skip = limit * (page - 1);

  aggregate_doc.push({ $skip: skip }, { $limit: limit });
  companies = await db.collection("company").aggregate(aggregate_doc).toArray();

  return res.status(200).json({
    success: true,
    data: companies,
    currentPage: parseInt(page),
    totalCompanies,
    totalPages: Math.ceil(totalCompanies / limit),
    hasNextPage: skip + companies.length < totalCompanies,
  });
});

const adminGetCompanies = tryCatchWrapper(async (req, res, next) => {
  const query_params = req.query;
  let filters = Object.keys(query_params);
  let page = 1;
  let limit = 10;
  let aggregate_doc = [];

  if (filters.includes("page")) {
    page = parseInt(query_params["page"]);
  }

  if (filters.includes("limit")) {
    limit = parseInt(query_params["limit"]);
  }

  if (
    filters.includes("status") &&
    ["verified", "unverified"].includes(
      query_params["status"].trim().toLowerCase()
    )
  ) {
    let status = query_params["status"].trim().toLowerCase();
    if (status === "unverified") {
      aggregate_doc.push({
        $match: {
          $and: [
            { status: status },
            { name: { $ne: null } },
            { logo: { $ne: null } },
            { website: { $ne: null } },
            { gst: { $ne: null } },
          ],
        },
      });
    } else {
      aggregate_doc.push({ $match: { status: status } });
    }
  }

  if (filters.includes("search")) {
    aggregate_doc.push({
      $match: {
        name: {
          $regex: query_params["search"],
          $options: "i",
        },
      },
    });
  }

  // Add lookup to get user details (name and email)
  aggregate_doc.push({
    $lookup: {
      from: "user", // Replace with actual users collection name
      localField: "user_id",
      foreignField: "_id",
      as: "userDetails",
    },
  });

  // Unwind the userDetails array to extract name and email
  aggregate_doc.push({
    $unwind: {
      path: "$userDetails",
      preserveNullAndEmptyArrays: true, // Preserve companies without user data
    },
  });

  // Project the required fields
  aggregate_doc.push({
    $project: {
      _id: 1,
      name: 1,
      status: 1,
      gst: 1,
      website: 1,
      logo: 1,
      user_name: "$userDetails.name",
      user_email: "$userDetails.email",
    },
  });

  const db = get_db();
  let companies = await db
    .collection("company")
    .aggregate(aggregate_doc)
    .toArray();
  const totalCompanies = companies.length;
  let skip = limit * (page - 1);

  aggregate_doc.push({ $skip: skip }, { $limit: limit });
  companies = await db.collection("company").aggregate(aggregate_doc).toArray();

  return res.status(200).json({
    success: true,
    data: companies,
    currentPage: parseInt(page),
    totalCompanies,
    totalPages: Math.ceil(totalCompanies / limit),
    hasNextPage: skip + companies.length < totalCompanies,
  });
});

const adminVerifyCompany = tryCatchWrapper(async (req, res, next) => {
  const { company_id } = req.body;

  if (!company_id || company_id.length < 1) {
    return sendResponse(400, "No company id provided", res);
  }

  if (!isObjectIdValid(company_id)) {
    return sendResponse(400, "Invalid company id provided", res);
  }

  const db = get_db();
  const company = await db
    .collection("company")
    .findOne({ _id: new ObjectId(company_id) });
  if (!company) {
    return sendResponse(404, "No company found associated with this id", res);
  }

  if (!company.status || company.status == "unverified") {
    const updateResult = await db
      .collection("company")
      .updateOne(
        { _id: new ObjectId(company_id) },
        { $set: { status: "verified" } }
      );

    if (!updateResult || updateResult.modifiedCount != 1) {
      return sendResponse(500, "Failed to verify company", res);
    }

    return res
      .status(200)
      .json({ success: true, message: "Verification successful" });
  } else {
    return sendResponse(500, "Company already verified", res);
  }
});

const adminUnverifyCompany = tryCatchWrapper(async (req, res, next) => {
  const { company_id } = req.body;

  if (!company_id || company_id.length < 1) {
    return sendResponse(400, "No company id provided", res);
  }

  if (!isObjectIdValid(company_id)) {
    return sendResponse(400, "Invalid company id provided", res);
  }

  const db = get_db();
  const company = await db
    .collection("company")
    .findOne({ _id: new ObjectId(company_id) });
  if (!company) {
    return sendResponse(404, "No company found associated with this id", res);
  }

  if (company.status == "verified") {
    const updateResult = await db
      .collection("company")
      .updateOne(
        { _id: new ObjectId(company_id) },
        { $set: { status: "unverified" } }
      );

    if (!updateResult || updateResult.modifiedCount != 1) {
      return sendResponse(500, "Failed to unverify company", res);
    }

    return res
      .status(200)
      .json({ success: true, message: "Unverification successful" });
  } else {
    return sendResponse(500, "Company is not verified", res);
  }
});

module.exports = {
  getCompanyProfile,
  getCompanyPilots,
  addPilot,
  deletePilotFromCompany,
  getPilotByEmail,
  addExistingPilotToCompany,
  getCompanies,
  adminGetCompanies,
  adminVerifyCompany,
  adminUnverifyCompany,
};
