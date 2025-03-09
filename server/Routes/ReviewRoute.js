const router = require("express").Router()
const {reqAuth}= require("../Middlewares/AuthMiddleware.js")
const {addReview, getPilotReviewStats} = require("../Controllers/ReviewController.js")

router.post("/add", reqAuth,addReview)

router.get("/pilot/:id",reqAuth,getPilotReviewStats)


module.exports = router
