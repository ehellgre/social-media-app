import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User.js"


/* REGISTER USER */

// Has to be async because we are calling MongoDB, which is asyncronous. req -> requestbody that we get from the frontend, res -> sending back to the frontend
export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body


        /* Hashing takes plaintext data elements and converts them into consistent ciphertext outputs used for data verification. 
        Salting adds random characters to data, like passwords, to thwart hackers who look for consistent words and phrases in sensitive data in order to decode it. */
        const salt = await bcrypt.genSalt() // Using salt to encrypt password
        const passwordHash = await bcrypt.hash(password, salt) 

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),   // Giving fake values for views & impressions for the looks
            impressions: Math.floor(Math.random() * 10000),
        })
        const savedUser = await newUser.save()
        res.status(201).json(savedUser)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

/* LOG IN, basic authentication */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body // Grap email & password when user tries to log in
        const user = await User.findOne({ email: email }) // Mongoose, for trying to find the specified email (check ../models/User.js). Returns the user information
        if (!user) return res.status(400).json({ msg: "User does not exist." }) // If user doesnt exists, return statuscode 400

        const isMatch = await bcrypt.compare(password, user.password) // If we can match password to the password we have in database. Uses the same salt to compare if they both turn out to be the same hash
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        delete user.password    // Delete the user password so it doesn't get send back to frontend
        res.status(200).json({ token, user })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}