import express from "express"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import multer from "multer"
import helmet from "helmet"
import morgan from "morgan"
import path from "path"
import { fileURLToPath } from "url"
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import postRoutes from "./routes/posts.js"
import { register } from "./controllers/auth.js"
import { createPost } from "./controllers/posts.js"
import { verifyToken } from "./middleware/auth.js"

/* CONFIGS */
const __filename = fileURLToPath(import.meta.url) // For grabbing file url (when using type: modules) 
const __dirname = path.dirname(__filename) // For using directory name

dotenv.config() // For using .env files

const app = express() // Invoke express application to use middleware
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))
app.use(morgan("common"))
app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))
app.use(cors())
app.use("/assets", express.static(path.join(__dirname, 'public/assets'))) // Setting directory where we store our assets (in this case locally) (assets in this case = imgs)

/* FILE STORAGE */

// Check multer docs
// Basically when somebody uploads a file its saved in destination location
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage }) // When uploading, use this variable 

/* ROUTES WITH FILES */
// 1. route 2. middleware, uploads picture locally to "public/assets" 3. endpoint register -> logic
app.post("/auth/register", upload.single("picture"), register)
// Allow user to upload picture when posting
// 1. route, 2. middleware verifyToken, 3. will grab & upload the picture property from the frontend, 4. controller (logic)
app.post("/posts", verifyToken, upload.single("picture"), createPost)

/* ROUTES */
app.use("/auth", authRoutes)
app.use("/users", userRoutes)
app.use("/posts", postRoutes)

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001
mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,         // 
        useUnifiedTopology: true,       // 
    })
    .then(() => {
        app.listen(PORT, () => console.log(`Server Port: ${PORT}`)) // After we connect do callback function
    })
    .catch((error) => console.log(`${error} did not connect`)) // Catch if we have an error connecting