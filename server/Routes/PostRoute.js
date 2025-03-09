const router = require("express").Router();
const { reqAuth } = require("../Middlewares/AuthMiddleware.js");
const {
  uploadAndConvertImage,
  checkExistenceOfImageAndUpload,
} = require("../Middlewares/ImageUploadConversion.js");

const { createPost, getAllPosts, updatePost, deletePost, getPostsForUser, getUserPost} = require("../Controllers/PostController.js");


router.post("/create", reqAuth, uploadAndConvertImage, createPost);

//TODO: the posts should be accessible only after logging in right? so we need to pass reqAuth here. 
//TODO: also the get route for posts in redundant here. It just needs to be a slash
router.get("/posts", getAllPosts);

router.put("/update/:id", reqAuth, checkExistenceOfImageAndUpload, updatePost);
router.delete("/delete/:id", reqAuth, deletePost);
router.get("/posts/:id", reqAuth, getUserPost);
router.get("/:id",reqAuth,getPostsForUser)


module.exports = router;
