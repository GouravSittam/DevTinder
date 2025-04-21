import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
    name: "feed", 
    initialState: null,
    reducers: {
        addFeed: (state, action)=>{
            return action.payload; 
        }, 
        removeUserFromFeed: (state, action) => {
            console.log("State before filtering:");
            state.forEach(user => console.log(user));
            return state.filter(user => user._id !== action.payload);
        }
    }
});

export const {addFeed, removeUserFromFeed} = feedSlice.actions;
export default feedSlice.reducer;