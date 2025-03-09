const router = require("express").Router()
const {reqAuth,checkWhetherUserisAdmin}= require("../Middlewares/AuthMiddleware.js")
const {adminGetCompanies, adminVerifyCompany, adminUnverifyCompany} =require("../Controllers/CompanyController.js")

router.get("/companies",reqAuth, checkWhetherUserisAdmin,adminGetCompanies)

router.patch("/verify-company",reqAuth, checkWhetherUserisAdmin, adminVerifyCompany)

router.patch("/unverify-company",reqAuth, checkWhetherUserisAdmin, adminUnverifyCompany)


module.exports = router
