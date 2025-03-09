const router = require("express").Router();
const { reqAuth, verifyAuth } = require("../Middlewares/AuthMiddleware.js");
const {
  ulogin,
  uregister,
  sendEmailVerificationOTP,
  verifyOTP,
  checkIfEmailExistsAndSendOTP,
  resetPassword,
  getUser,
  logout,
  changeProfileAvatar,
  updateProfileGeneral,
  updateProfilePassword,
  getCompany,
  updateCompanyDetails,
  updateCompanyLogo,
  getPilotDetails,
  getPilotSocials,
  addPilotSocials,
  updatePilotSocials,
  deletePilotSocial,
  addPilotCertificate,
  getPilotCertificates,
  updatePilotCertificate,
  deletePilotCertificate,
  getPilotExperience,
  addPilotExperience,
  updatePilotExperience,
  deletePilotExperience,
  updateProfessionalDetails,
  removeFromCompany, 
getUserProfileDetails
} = require("../Controllers/UserController.js");
const {
  uploadAndConvertImage,
} = require("../Middlewares/ImageUploadConversion.js");
router.post("/login", ulogin);
router.post("/register", verifyAuth, uregister);
router.post("/sendotp", sendEmailVerificationOTP);
router.post("/verifyotp", verifyOTP);
router.post("/fpcheckemail", checkIfEmailExistsAndSendOTP);
router.post("/resetpassword", verifyAuth, resetPassword);
router.get("/get-user", reqAuth, getUser);
router.post("/logout", reqAuth, logout);
router.post(
  "/update-profile",
  reqAuth,
  uploadAndConvertImage,
  changeProfileAvatar
);
router.put("/update-general-profile", reqAuth, updateProfileGeneral);
router.put("/update-password-profile", reqAuth, updateProfilePassword);
router.get("/company", reqAuth, getCompany);
router.put("/update-company-details", reqAuth, updateCompanyDetails);
router.post(
  "/update-company-logo",
  reqAuth,
  uploadAndConvertImage,
  updateCompanyLogo
);
router.get("/pilot", reqAuth, getPilotDetails);
router.put("/update-professional-details", reqAuth, updateProfessionalDetails);


router.get("/socials", reqAuth, getPilotSocials);
router.post("/socials", reqAuth, addPilotSocials);
router.put("/socials", reqAuth, updatePilotSocials);
router.delete("/socials", reqAuth, deletePilotSocial);

router.get("/certificate", reqAuth, getPilotCertificates);
router.post("/certificate", reqAuth, addPilotCertificate);
router.put("/certificate", reqAuth, updatePilotCertificate);
router.delete("/certificate", reqAuth, deletePilotCertificate);

router.get("/expereince", reqAuth, getPilotExperience);
router.post("/expereince", reqAuth, addPilotExperience);
router.put("/expereince", reqAuth, updatePilotExperience);
router.delete("/expereince", reqAuth, deletePilotExperience);


router.post("/leave-company", reqAuth, removeFromCompany);
router.get("/user_profile/:id",getUserProfileDetails)
module.exports = router;
