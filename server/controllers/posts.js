import Post from "../models/Post.js"
import User from "../models/User.js"

/* CREATE */
export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath } = req.body // Grap userId, description & picturePath
        const user = await User.findById(userId) // Grap user info
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: []
        })
        await newPost.save() // Save the post

        const post = await Post.find() // Grabs _all_ the posts
        res.status(201).json(post) // Return all the posts + the new one
    } catch (err) {
        res.status(409).json({ message: err.message })
    }
}

/* READ */
export const getFeedPosts = async (req, res) => { // Grabs every post from everyone
    try {
        const post = await Post.find() // Grabs _all_ the posts
        res.status(200).json(post) // Return all the posts + the new one
    } catch (error) {
        res.status(404).json({ message: err.message })
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params
        const post = await Post.find({ userId }) // Return just the users post
        res.status(200).json(post)
    } catch (error) {
        res.status(404).json({ message: err.message })
    }
}

/* UPDATE */
export const likePost = async (req, res) => {
    try {
        const { id } = req.params // id comes from query string
        const { userId } = req.body // userId comes from the body of the request
        const post = await Post.findById(id) // Grap the post info
        const isLiked = post.likes.get(userId) // If userId exists, post has been liked

        if (isLiked) {
            postMessage.likes.delete(userId) // Deletes if exists
        } else {
            post.likes.set(userId, true) // Sets if doesnt exist
        }

        const updatedPost = await Post.findByIdAndUpdate( // Depending on post.likes -> update 
            id,
            { likes: post.likes },
            { new: true },
        )

        res.status(200).json(updatedPost) // Update the frontend
    } catch (error) {
        res.status(404).json({ message: err.message })
    }    
}