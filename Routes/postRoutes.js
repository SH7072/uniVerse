const express = require("express");
const router = express.Router();
const { createPost, deletePost, getPost, getAllPost, likePost, unlikePost,addComment } = require("../Controllers/postController");
const { verifyToken, signToken } = require("../Config/jwt");

//Routes for the API endpoints go here...

// Create a new post for the authenticated user
router.post("/createPost/:id", verifyToken, createPost);

// Delete a post with the given id for the authenticated user
router.delete("/deletePost/:id", verifyToken, deletePost);

// Get information about a post with the given id for the authenticated user
router.get("/post/:id", verifyToken, getPost);

// Get all the posts for the authenticated user
router.get("/allPost/:id", verifyToken, getAllPost);


// Like a post with the given id for the authenticated user
router.post("/likePost/:user_id/:post_id", verifyToken, likePost);

// Unlike a post with the given id for the authenticated user
router.post("/unlikePost/:user_id/:post_id", verifyToken, unlikePost);

// Add a comment to a post with the given id for the authenticated user
router.post("/comment/:id", verifyToken, addComment);



module.exports = router;