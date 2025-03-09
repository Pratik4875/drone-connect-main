const tryCatchWrapper = require("../Utils/TryCatchWrapper");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const { ObjectId } = require("mongodb");
const { get_db } = require("../Utils/MongoConnect.js");
const sendResponse = require("../Utils/SendResponse.js");
const isObjectIdValid = require("../Utils/ValidObjectId.js")
cloudinary.config({
  cloud_name: process.env.CLOUDNARY_CLOUD_NAME,
  api_key: process.env.CLOUDNARY_API_KEY,
  api_secret: process.env.CLOUDNARY_API_SECRET,
  secure: true,
});

const createPost = tryCatchWrapper(async (req, res, next) => {
  // Extract user email, description, and file path
  const { description } = req.body;
  const { path } = req.file; // Assuming multer is used to handle `req.file`
  const email = req.user_email;

  // Validate email
  if (!email) {
    return sendResponse(401, "User email is required", res);
  }

  // Validate uploaded file
  if (!path) {
    return sendResponse(400, "Image file is required", res);
  }
  if (!description) {
    return sendResponse(400, "Description file is required", res);
  }
  // Establish database connection
  const db = get_db();

  // Fetch user by email
  const users_col = db.collection("user");
  const user = await users_col.findOne({ email });
  if (!user) {
    return sendResponse(404, "User does not exist", res);
  }

  // Fetch pilot by user_id
  const pilot_col = db.collection("pilot");
  const pilot = await pilot_col.findOne({ user_id: user._id });
  if (!pilot) {
    return sendResponse(404, "Pilot does not exist", res);
  }

  // Upload image to Cloudinary
  let uploadResult;
  try {
    uploadResult = await cloudinary.uploader.upload(path, {
      folder: "posts", // Optional folder structure in Cloudinary
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

  // Prepare post data
  const postData = {
    user_id: user._id,
    pilot_id: pilot._id,
    description: description || "", // Default to empty string if no description
    image: uploadResult.public_id, // Store the Cloudinary public ID
    created_at: new Date(), // Add timestamp
  };

  // Insert post into the database
  const post_col = db.collection("post");
  const insertResult = await post_col.insertOne(postData);

  // Validate database insert result
  if (!insertResult.acknowledged || !insertResult.insertedId) {
    return sendResponse(500, "Failed to create post", res);
  }

  // Respond with success
  return res.status(201).json({
    success: true,
    message: "Post added successfully",
  });
});

const getAllPosts = tryCatchWrapper(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1, 10 posts per page

  // Establish database connection
  const db = get_db();

  // Fetch the posts collection
  const post_col = db.collection("post");

  // Calculate pagination offsets
  const skip = (page - 1) * limit;
  console.log(skip);

  const totalPosts = await post_col.countDocuments();
  const pipeline = [
    { $sort: { created_at: -1 } }, // Sort by latest
    { $skip: skip }, // Pagination skip
    { $limit: parseInt(limit) }, // Pagination limit
    {
      $lookup: {
        from: "user", // Collection to join
        localField: "user_id", // Field in the posts collection
        foreignField: "_id", // Field in the user collection
        as: "user_info", // Output array field
      },
    },
    {
      $unwind: "$user_info", // Deconstruct the array to a single object
    },
    {
      $lookup: {
        from: "pilot", // Assuming there's a "pilot" collection
        localField: "user_id", // Field in the posts collection to match with pilot
        foreignField: "user_id", // Field in the pilot collection to match with user_id
        as: "pilot_info", // Output array field for pilot details
      },
    },
    {
      $unwind: { path: "$pilot_info", preserveNullAndEmptyArrays: true }, // If there's no pilot, return null for pilot_info
    },
    {
      $project: {
        description: 1,
        image: 1,
        created_at: 1,
        "user_info.name": 1, // Include only the user's name
        "user_info.profile": 1,
        "user_info._id": 1,
        "pilot_info.ia_DGCA_license": 1, // Add the pilot details you want
      },
    },
  ];
  

  const posts = await post_col.aggregate(pipeline).toArray();

  // Respond with all posts
  return res.status(200).json({
    success: true,
    data: posts,
    currentPage: parseInt(page),
    totalPosts,
    totalPages: Math.ceil(totalPosts / limit),
    hasNextPage: skip + posts.length < totalPosts,
  });
});

const getUserPost = tryCatchWrapper(async (req, res, next) => {
  const post_id = req.params.id;
  if (!post_id) {
    return sendResponse(400, "No post id provided", res);
  }

    if(!isObjectIdValid(post_id)){
        return sendResponse(500, "Invalid object id", res)
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
  const pilot_col = await db.collection("pilot");
  const pilot = await pilot_col.findOne({ user_id: user._id });
  if (!pilot) {
    return sendResponse(400, "No pilot", res);
  }
  const post_col = await db.collection("post");

  const post = await post_col.findOne(
    {
      _id: new ObjectId(post_id),
      user_id: new ObjectId(user._id),
      _id: new ObjectId(post_id),
    },
    { projection: { pilot_id: 0, user_id: 0, created_at: 0 } }
  );

  if (!post) {
    return sendResponse(400, "No post found!", res);
  }
  return res.status(200).json({ success: true, post });
});
//Update a post
const updatePost = tryCatchWrapper(async (req, res, next) => {
  const post_id = req.params.id;
  if (!post_id) {
    return sendResponse(400, "No post id provided", res);
  }
    if(!isObjectIdValid(post_id)){
        return sendResponse(500, "Invalid object id", res)
    }
  const { description } = req.body;
  let path;
  if (req.file) {
    path = req.file.path;
  }
  console.log(path);
  
  const user_email = req.user_email;
  if (!user_email) {
    return sendResponse(400, "User email is required", res);
  }
  if (!description && !path) {
    return sendResponse(400, "There is nothing to be updated", res);
  }

  const db = get_db();
  const user_col = await db.collection("user");
  const user = await user_col.findOne({ email: user_email });

  if (!user) {
    return sendResponse(401, "No user found with this email", res);
  }

  let updated_post = {};

  if (description) {
    updated_post.description = description;
  }

  if (path) {
    let uploadResult;
    try {
      uploadResult = await cloudinary.uploader.upload(path, {
        folder: "posts", // Optional folder structure in Cloudinary
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
    } else {
      updated_post.image = uploadResult.public_id;
    }
  }

  let post_col = await db.collection("post");
  let old_post = await post_col.findOne({ _id: new ObjectId(post_id) });
  let update_result = await post_col.updateOne(
    { _id: new ObjectId(post_id) },
    { $set: updated_post }
  );

  console.log(updated_post);
  console.log(update_result);
  if (update_result.modifiedCount == 1) {
    let warning_msg;
    if (path) {
      const destroy_result = await cloudinary.uploader
        .destroy(old_post.image)
        .catch((error) => {
          return sendResponse(500, error.message, res);
        });

      if (destroy_result.result !== "ok") {
        warning_msg = "Failed to delete the old image after updating";
        console.error(warning_msg);
      }
    }
    if (warning_msg) {
      return res.status(201).json({
        success: true,
        message: "updated post successfully",
        warning: warning_msg,
      });
    } else {
      return res
        .status(201)
        .json({ success: true, message: "updated post successfully" });
    }
  }
  return res
    .status(401)
    .json({ success: false, message: "post update not successful" });
});

const deletePost = tryCatchWrapper(async (req, res, next) => {
  const post_id = req.params.id;

  if (!post_id || post_id.length < 1) {
    return sendResponse(
      400,
      "Not enough details provided to carry out this operation",
      res
    );
  } else {
    if(!isObjectIdValid(post_id)){
        return sendResponse(500, "Invalid object id", res)
    }
    const db = get_db();
    const post_col = await db.collection("post");
    const post = await post_col.findOne({ _id: new ObjectId(post_id) });

    //delete image from cloudinary

    const destroy_result = await cloudinary.uploader
      .destroy(post.image)
      .catch((error) => {
        return sendResponse(500, error.message, res);
      });

    let warning_msg;
    if (destroy_result.result !== "ok") {
      warning_msg = "Failed to delete image from cloudinary";
      console.log(warning_msg);
      return res
        .status(401)
        .json({ success: false, message: "Image could not be deleted." });
    }

    const result = await post_col.deleteOne({ _id: new ObjectId(post_id) });
    if (result.deletedCount == 1) {
      if (warning_msg) {
        return res.status(200).json({
          success: true,
          message: "Post deleted successfully",
          warning_messae: warning_msg,
        });
      } else {
        return res
          .status(200)
          .json({ success: true, message: "Post deleted successfully" });
      }
    } else {
      return res.status(401).json({
        success: false,
        message: "Post could not be deleted succesfully",
      });
    }
}})

const get458PostsForUser = tryCatchWrapper(async(req,res,next)=>{
    const user_id = req.params.id
    //give the total docs currently displaying in the skip variable so that I can skip that many documents and give the next ones
    let skip =0
    const limit =10
    if(req.query.skip){
    skip = parseInt(req.query.skip)
        console.log("posts for user to skip: "+skip)
    }

    if(!user_id || user_id.length <1){
        return sendResponse(400, "No user id provided", res)
    }

    if(!isObjectIdValid(user_id)){
        return sendResponse(500, "Invalid object id", res)
    }
    const db = get_db()
    const post_col = await db.collection("post")
    let aggregate_list = [
        {$match:{"user_id":new ObjectId(user_id)}},
        {$skip:skip},
        {$limit:limit},
        {$sort: {created_at:-1}},
        {$project:{_id:0,pilot_id:0,user_id:0}}
    ]
    const posts_for_user = await post_col.aggregate(aggregate_list).toArray()
    res.status(200).json({posts: posts_for_user, count:posts_for_user.length, to_skip: skip +posts_for_user.length})

})

//Sexy Frontend developer's version of getting posts for user
const getPostsForUser = tryCatchWrapper(async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query; // Default to page 1, 10 posts per page
    const user_id = req.params.id

    if(!user_id || user_id.length <1){
        return sendResponse(400,"No user id provided",res)
    }

    
    if(!isObjectIdValid(user_id)){
        return sendResponse(500, "Invalid object id", res)
    }

    // Establish database connection
    const db = get_db();

    // Fetch the posts collection
    const post_col = db.collection("post");

    // Calculate pagination offsets
    const skip = (page - 1) * limit;
    console.log(skip);

    const pipeline = [
        {$match: {user_id: new ObjectId(user_id)}},
        { $sort: { created_at: -1 } }, // Sort by latest
        {
            $lookup: {
                from: "user", // Collection to join
                localField: "user_id", // Field in the posts collection
                foreignField: "_id", // Field in the user collection
                as: "user_info", // Output array field
            },
        },
        {
            $unwind: "$user_info", // Deconstruct the array to a single object
        },
        {
            $project: {
                description: 1,
                image: 1,
                created_at: 1,
                "user_info.name": 1, // Include only the user's name
                "user_info.profile": 1,
            },
        },
    ];

    const totalPosts = (await post_col.aggregate(pipeline).toArray()).length;

    pipeline.push(
        { $skip: skip }, // Pagination skip
        { $limit: parseInt(limit) }, // Pagination limit
    )

    const posts = await post_col.aggregate(pipeline).toArray()

    // Respond with all posts
    return res.status(200).json({
        success: true,
        data: posts,
        currentPage: parseInt(page),
        totalPosts,
        totalPages: Math.ceil(totalPosts / limit),
        hasNextPage: skip + posts.length < totalPosts,
    });
});
module.exports = {
    createPost,
    getAllPosts,
    updatePost, 
    deletePost,
    getUserPost,
    getPostsForUser
};
