import express from "express"
import { login } from "../controllers/auth.js"

// Allows express to identify that these routes have all been configured and allow us to keep this in separate file
const router = express.Router()

router.post("login", login)

export default router;