import express from "express"
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

/* READ */
router.get("/", verifyToken, getFeedPosts) // Grab the user feed when we are in the home page, homepage gives you every single post there is
router.get("/:userId/posts", verifyToken, getUserPosts) // Grab only the relevant users posts (iow click user Emil -> Gives only Emils posts)

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost) // Like / unlike

export default router