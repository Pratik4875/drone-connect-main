const router = require("express").Router()
const {getPilots} = require("../Controllers/PilotController.js")
const reqAuth = require("../Middlewares/AuthMiddleware.js")

//TODO: add reqAuth here after testing whether the get request works properly
router.get("/",getPilots)

module.exports = router
