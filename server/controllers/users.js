import User from "../models/User"

/* READ */

export const getUser = async (req, res) => {
    try {
        const { id } = req.params // Grab the id from the req.params
        const user = await User.findById(id) // Use the id to grab the user info we need
        res.status(200).json(user) // Send everything relevant to the frontend about the user
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}


export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params // Grab the id from the req.params
        const user = await User.findById(id) // Use the id to grab the user info we need
    
        const friends = await Promise.all( // Multiple api calls to the database
            user.friends.map((id) => User.findById(id)) // Grab each id the user has -> Grab all the information from the id
        )
        // Format in a proper way for the frontend
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath } // Return object of all the things we want to grab
            }
        )
        res.status(200).json(formattedFriends) // Sent everything to frontend
    } catch (err) {
        res.status(404).json({ message: err.message })
    }

}

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
    try {
        const { id, friendId } = req.params // Grab id and friendId from the req.params
        const user = await User.findById(id) // Grab the current user information
        const friend = await User.findById(friendId) // Grab the friend information

        if (user.friends.includes(friendId)) { // See if the friendId is included in the main users friends Id
            user.friends = user.friends.filter((id) => id !== friendId) // If included, remove. 
            friend.friends = friend.friends.filter((id) => id !== id) // Remove user from the friend friendlist
        } else { // If not included ->
            user.friends.push(friendId) // Add friend to the user friendlist
            friend.friends.push(id) // Add user to the friends friendlist
        }
        await user.save() // Save updated friendlist
        await friend.save() // Save updated friendlist

        // Format again
        const friends = await Promise.all( // Multiple api calls to the database
            user.friends.map((id) => User.findById(id)) // Grab each id the user has -> Grab all the information from the id
        )
        // Format in a proper way for the frontend
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath } // Return object of all the things we want to grab
            }
        )

        res.status(200).json(formattedFriends)

    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}
