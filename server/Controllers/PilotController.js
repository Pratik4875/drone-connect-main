const { get_db } = require("../Utils/MongoConnect.js");
const tryCatchWrapper = require("../Utils/TryCatchWrapper.js");

const getPilots = tryCatchWrapper(async (req, res, next) => {
  //filters
  //name
  //city
  //state
  //availability
  //has license or no
  //company
  //drone_category

  let query_params = req.query;
  console.log(query_params);

  let filters = Object.keys(query_params);
  let filter_agg = [{ $match: { user_type: "p" } }];

  let drone_category = ""; // empty string indicates all drone categories
  let page = 1;
  let limit = 20;

  if (filters.length > 0) {
    if (filters.includes("page")) {
      page = parseInt(query_params["page"]);
    }
    if (filters.includes("limit")) {
      limit = parseInt(query_params["limit"]);
    }
    if (filters.includes("name")) {
      filter_agg.push({
        $match: { name: { $regex: query_params["name"], $options: "i" } },
      });
    }
    if (filters.includes("city")) {
      filter_agg.push({
        $match: { city: { $regex: query_params["city"], $options: "i" } },
      });
    }
    if (filters.includes("district")) {
      filter_agg.push({
        $match: {
          district: { $regex: query_params["district"], $options: "i" },
        },
      });
    }
    if (filters.includes("state")) {
      filter_agg.push({
        $match: { state: { $regex: query_params["state"], $options: "i" } },
      });
    }
    //this needs the pilot collection to be joined
    if (filters.includes("available")) {
      //filter_agg.push({$lookup:{from: "pilot", pipeline:[{$match: {$expr:{$and:[{$eq:["$_id","$user_id"]}, {$eq:["$available",{$literal: query_params["avail"]=="true"}]}]}}}], as:"availability"}})
      filter_agg.push({
        $lookup: {
          from: "pilot",
          let: { user_doc_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$$user_doc_id", "$user_id"] },
                    { $eq: ["$available", { $literal: query_params["available"] == "true" }] },
                  ],
                },
              },
            },
            { $project: { available: 1, _id: 0 } },
          ],
          as: "available",
        },
      });

      filter_agg.push({ $unwind: "$available" });
    }
    /*if(filters.includes("has_license")){
            filter_agg.push({$lookup:{from: "pilot",let:{user_doc_id: "$_id"}, pipeline:[{$match: {$expr:{$and:[{$eq:["$$user_doc_id","$user_id"]}, {$eq:["$ia_DGCA_license",{$literal:query_params["has_license"]=="true"}]}]}}}, {$project:{license_number:1,_id:0}}], as:"license_number",}})

            filter_agg.push({$unwind:"$license_number"})

        }*/
    //assuming that I get the drone category as the same string as it is stored in the database.
    if (filters.includes("drone_category")) {
      drone_category = query_params["drone_category"];
    }

    //filter based on whether the pilot is a company pilot or noto
    if (
      filters.includes("company_person") 
    ) {
      filter_agg.push({
        $lookup: {
          from: "pilot",
          let: { user_doc_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$$user_doc_id", "$user_id"] },
                    { $eq: ["$is_company_person", { $literal:query_params["company_person"] == "true"}] },
                  ],
                },
              },
            },
          ],
          as: "company_pilot",
        },
      });

      filter_agg.push({ $unwind: "$company_pilot" });
    }
    //filter based on company name
    ///requires the company collection to be joined
    /*if(filters.includes("company")){
            filter_agg.push({$lookup:{from: "pilot",let:{user_doc_id: "$_id"}, pipeline:[{$match: {$expr:{$eq:["$$user_doc_id","$user_id"]}}}, {$lookup:{from:"company", let:{company_id:"$company_id"},pipeline:[{$match:{$expr:{$and:[{$eq:["$$company_id","$_id"]}]}}},{$match:{"name":{$regex:query_params["company"],$options:"i"}}},{$project:{_id:0,name:1}}], as:"company_name"}},{$unwind:"$company_name"},{$project:{_id:0,user_id:0, company_id:0,drone_category:0,ia_DGCA_license:0,is_company_person:0,license_number:0,available:0,socials:0}} ],as:"company_fetch"}})

            filter_agg.push({$unwind:"$company_fetch"})
        }*/
  }

  if (drone_category == "") {
    filter_agg.push({
      $lookup: {
        from: "pilot",
        let: { user_doc_id: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$$user_doc_id", "$user_id"] } } },
          { $project: { drone_category: 1, _id: 0,ia_DGCA_license: 1 } },
        ],
        as: "drone_category",
      },
    });
  } else {
    filter_agg.push({
      $lookup: {
        from: "pilot",
        let: { user_doc_id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$$user_doc_id", "$user_id"] },
                  {
                    $eq: [
                      "$drone_category",
                      {
                        $literal: query_params["drone_category"]
                          .toLowerCase()
                          .trim(),
                      },
                    ],
                  },
                ],
              },
            },
          },
          { $project: { drone_category: 1, _id: 0,ia_DGCA_license: 1 } },
        ],
        as: "drone_category",
      },
    });
  }

  let skip = (page - 1) * limit;
  filter_agg.push({ $unwind: "$drone_category" });

    filter_agg.push(
        {
            $lookup: 
            {
                from: "pilot",
                let :{user_doc_id:"$_id"},
                pipeline: [
                    {
                        $match:{
                            $expr:{
                                $eq: ["$user_id","$$user_doc_id"]
                            }
                        }

                    },
                    
                    {
                        $lookup: {
                            from: "review",
                            let: {pilot_doc_id: "$_id"},
                            pipeline:[
                                {
                                    $match: {
                                        $expr:{
                                            $eq: ["$$pilot_doc_id","$pilot_id"]
                                        }
                                    }
                                },


                                {
                                    $group: {
                                        _id: "$rating",
                                        count: { $sum: 1 },
                                    }
                                },
                                

                                // 🔹 Calculate overall stats
                                {
                                    $group: {
                                        _id: null,
                                            averageRating: { $avg: "$_id" },
                                    },
                                },
                                {
                                    $project: {averageRating:1,_id:0}


                                }
                                
                                

                            ],
                            as: "avg_rating_inner"

                        }

                    },

                   {$unwind: {path:"$avg_rating_inner", preserveNullAndEmptyArrays:true}},

                    {$project:{avg_rating_inner:{$ifNull:["$avg_rating_inner.averageRating",0]},_id:0}}

                ],
                as: "avg_rating"


            },

        },
        {$unwind:"$avg_rating"}
    )


  console.log(filter_agg);


  filter_agg.push({
    $project: {
      profile: 1,
      name: 1,
      drone_category: 1,
      state: 1,
      city: 1,
      available: 1,
        avg_rating:1,
    },
  });

  const db = get_db();

  const user_col = await db.collection("user");
  const pilot_col = await db.collection("pilot");
  const totalPilots = (await user_col.aggregate(filter_agg).toArray()).length;

    //todo: uncomment these lines
  filter_agg.push({ $skip: skip });
  filter_agg.push({ $limit: limit });
    let pilots = await user_col.aggregate(filter_agg).toArray()
  console.log(pilots);

  let modified_results = [];
  pilots.forEach((pilot) => {
    let mod_pilot = {};
    mod_pilot.user_id = pilot._id;
    mod_pilot.name = pilot.name;
    mod_pilot.city = pilot.city;
    mod_pilot.state = pilot.state;
    mod_pilot.drone_category = pilot.drone_category.drone_category;
    mod_pilot.profile = pilot.profile;
    mod_pilot.has_license = pilot.drone_category.ia_DGCA_license;
      mod_pilot.rating = pilot.avg_rating.avg_rating_inner
    modified_results.push(mod_pilot);
  });

  return res.status(200).json({
    success: true,
    data: modified_results,
    currentPage: parseInt(page),
    totalPilots,
    totalPages: Math.ceil(totalPilots / limit),
    hasNextPage: skip + pilots.length < totalPilots,
  });
});

// endpoint for a company adding a pilot
const addPilot = tryCatchWrapper(async (req, res, next) => {
  const email = req.user_email;
});

//get all info about one pilot
module.exports = { getPilots };
