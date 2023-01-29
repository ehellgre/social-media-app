import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    mode: "light",
    user: null,
    token: null,
    posts: [],
}

/* */
export const authSlice = createSlice({
    name: "auth",
    initialState,
    /* Actions / Functions */
    reducers: {
        setMode: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light" /* if mode == light change to dark, if not change to light */
        },
        setLogin: (state, action) => { /* action is basically arguments for the function */
            state.user = action.payload.user
            state.token = action.payload.token
        },
        setLogout: (state) => { /* When you logout, set user and token to null */
            state.user = null
            state.token = null
        },
        setFriends: (state, action) => { /* Set friends into our local state 'cause we need to keep this info */
            if (state.user) { /* If user already exists -> */
                state.user.friends = action.payload.friends /* Set friends inside our state */
            } else {
                console.error("user friends non-existent")
            }
        },
        setPosts: (state, action) => { /* Set the post */
            state.posts = action.payload.posts
        },
        setPost: (state, action) => { /*  */
            const updatedPosts = state.posts.map((post) => { /* Grab our list of posts & map through them */
                if (post._id === action.payload.post_id) return action.payload.post /* Return the updated relevant post  */
                return post /* Otherwise return what we currently have in our hands */
            })
            state.posts = updatedPosts
        }
    }
})

export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost } = authSlice.actions
export default authSlice.reducer