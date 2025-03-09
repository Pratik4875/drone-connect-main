const tryCatchWrapper = require("../Utils/TryCatchWrapper.js");
const { get_db } = require("../Utils/MongoConnect.js");
const isObjectIdValid = require("../Utils/ValidObjectId.js");
const sendResponse = require("../Utils/SendResponse.js");
const { ObjectId } = require("mongodb");

const addReview = tryCatchWrapper(async (req, res, next) => {
  const { booking_id, rating, review } = req.body;
  const user_email = req.user_email;
  if (!booking_id || booking_id.length < 1) {
    return sendResponse(400, "No booking id provided", res);
  }
  if (!isObjectIdValid(booking_id)) {
    return sendResponse(400, "Invalid booking id provided", res);
  }

  if (!rating) {
    return sendResponse(400, "No rating provided", res);
  }

  if (rating < 0 || rating > 5) {
    return sendResponse(400, "Invalid rating provided", res);
  }
  if (!review || review.length < 1) {
    return sendResponse(400, "No review provided", res);
  }

  const db = get_db();
  const user = await db.collection("user").findOne({ email: user_email });
  if (!user) {
    return sendResponse(400, "No user found!", res);
  }
  const booking = await db
    .collection("booking")
    .findOne({ _id: new ObjectId(booking_id), user_id: user._id });

  if (!booking) {
    return sendResponse(404, "No booking found associated with this id", res);
  }
  if (booking.status != "completed") {
    return sendResponse(400, "The booked event has not concluded yet", res);
  }

  const review_for_booking = await db.collection("review").findOne({
    booking_id: new ObjectId(booking_id),
  });
  if (review_for_booking) {
    return sendResponse(
      500,
      "Review already exists for this booking and pilot by this user",
      res
    );
  }

  const insert_result = await db.collection("review").insertOne({
    pilot_id: booking.pilot_id,
    booking_id: new ObjectId(booking_id),
    rating: parseFloat(rating),
    review: review,
    created_at: new Date(),
    user_id: user._id,
  });

  if (!insert_result || !insert_result.insertedId) {
    return sendResponse(500, "Failed to insert the review", res);
  }
  return res
    .status(200)
    .json({ success: true, message: "pilot review added successfully" });
});

const getPilotReviewStats = tryCatchWrapper(async (req, res, next) => {
  const user_id = req.params.id;
  const db = get_db();

  if (!user_id || user_id.length < 1) {
    return sendResponse(400, "No pilot ID provided", res);
  }
  if (!isObjectIdValid(user_id)) {
    return sendResponse(400, "Invalid pilot ID provided", res);
  }

  // ✅ Find user
  const user = await db.collection("user").findOne({ _id: new ObjectId(user_id) });
  if (!user) return sendResponse(404, "No user found associated with this ID", res);

  // ✅ Find pilot profile
  const pilot = await db.collection("pilot").findOne({ user_id: user._id });
  if (!pilot) return sendResponse(404, "No pilot found associated with this ID", res);

  // ✅ Fetch ratings + customer info
  const ratings = await db
    .collection("review")
    .aggregate([
      { $match: { pilot_id: pilot._id } }, // Match reviews for this pilot

      // 🔹 Join with `user` collection to get customer name
      {
        $lookup: {
          from: "user",
          localField: "user_id", // Assuming `customer_id` exists in reviews
          foreignField: "_id",
          as: "customerInfo",
        },
      },
      { $unwind: "$customerInfo" }, // Flatten the array

      // 🔹 Group for statistics
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
          reviews: {
            $push: {
              rating: "$rating",
              review: "$review",
              customerName: "$customerInfo.name",
              customerProfile: "$customerInfo.profile",
              created_at : "$created_at",
            },
          },
        },
      },

      // 🔹 Calculate overall stats
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$_id" },
          totalReviews: { $sum: "$count" },
          ratingsBreakdown: { $push: { rating: "$_id", count: "$count" } },
          allReviews: { $push: "$reviews" }, // Collect all reviews
        },
      },
    ])
    .toArray();

  if (ratings.length < 1) return sendResponse(404, "No reviews found for this pilot", res);

  // 🔹 Format breakdown
  let ratingBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  ratings[0].ratingsBreakdown.forEach(({ rating, count }) => {
    ratingBreakdown[rating] = count;
  });

  return res.status(200).json({
    averageRating: ratings[0].averageRating.toFixed(1),
    totalReviews: ratings[0].totalReviews,
    ratingBreakdown: ratingBreakdown,
    reviews: ratings[0].allReviews.flat(), // Flatten reviews
  });
});


module.exports = {
  addReview,
  getPilotReviewStats,
};
