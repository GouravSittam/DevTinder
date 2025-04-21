import { createSlice } from "@reduxjs/toolkit";

const requestSlices = createSlice({
    name: "requests",
    initialState: null,
    reducers:{
        addRequests: (state, action)=> action.payload,
        removeRequests: (state, action)=>{
            const newArray = state.filter(r=> r._id !== action.payload);
            return newArray
        },
    },
});

export const {addRequests, removeRequests} = requestSlices.actions;
export default requestSlices.reducer;