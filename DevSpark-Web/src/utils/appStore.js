import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import feedReducer from "./feedSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
  },
});

export default store;