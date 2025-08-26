import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: [],
  reducers: {
    addFeed: (state, action) => {
      return action.payload;
    },
    appendFeed: (state, action) => {
      // Adds new users to the end of the existing array.
      state.push(...action.payload);
    },
    removeUserFromFeed: (state, action) => {
      // console.log("State before filtering:");
      // state.forEach(user => console.log(user));
      return state.filter((user) => user._id !== action.payload);
    },
    clearFeed: (state) => {
      return [];
    },
  },
});

export const { addFeed, appendFeed, removeUserFromFeed, clearFeed } = feedSlice.actions;
export default feedSlice.reducer;
