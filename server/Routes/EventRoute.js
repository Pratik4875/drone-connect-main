const router = require("express").Router();

const {
  getAllEvents,
  addEvent,
  updateEvent,
  deleteEvent,
  getUserEvent,
} = require("../Controllers/EventController.js");
const { reqAuth } = require("../Middlewares/AuthMiddleware.js");

const {
  uploadAndConvertImage,
  checkExistenceOfImageAndUpload,
} = require("../Middlewares/ImageUploadConversion.js");

//TODO: do we need to protect this router???
router.get("/", reqAuth, getAllEvents);
router.get("/:id", reqAuth, getUserEvent);

router.post("/create", reqAuth, uploadAndConvertImage, addEvent);

router.put(
  "/update/:id",
  reqAuth,
  checkExistenceOfImageAndUpload,
  updateEvent
);
router.delete("/delete/:id", reqAuth, deleteEvent);
module.exports = router;
