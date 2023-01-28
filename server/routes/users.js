import express from "express"
import {
    getUser,
    getUserFriends,
    addRemoveFriend,
} from "../controllers/users.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

/* READ */
router.get("/:id", verifyToken, getUser) // Get the user (readonly)
router.get("/:id/friends", verifyToken, getUserFriends) // Get the users friends

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend) // Update function = use patch. Add or remove friend.

export default router