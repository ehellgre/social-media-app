import jwt from "jsonwebtoken"

export const verifyToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization") // From the frontend grabs the Authorization header. That's where the frontend will be setting the token

        // If token doesn't exist
        if (!token) {
            return res.status(403).send("Access Denied")
        }

        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft(); // Takes everything after the Bearer(with space) from the right side
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET)
        req.user = verified
        next()  // Run the next function


    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}