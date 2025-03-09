const router = require("express").Router()
const {getCompanyProfile, getCompanyPilots, addPilot, deletePilotFromCompany, getPilotByEmail,addExistingPilotToCompany, getCompanies} = require("../Controllers/CompanyController.js")
const {reqAuth} = require("../Middlewares/AuthMiddleware.js")
const isCompanyRequest= require("../Middlewares/CompanyAuth.js")

//TODO: should this be restricted??
router.get("/:id", reqAuth,getCompanyProfile)

router.get("/pilots/:id", reqAuth,isCompanyRequest,getCompanyPilots)

router.post("/:id/add-pilot", reqAuth,addPilot)

router.delete("/delete-pilot/:id", reqAuth,deletePilotFromCompany)

router.get("/pilot/:email", reqAuth,getPilotByEmail)

router.post("/:id/add-existing-pilot",reqAuth,addExistingPilotToCompany)

router.get("/", reqAuth,getCompanies)
module.exports = router
