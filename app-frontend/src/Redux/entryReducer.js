import { createSlice } from '@reduxjs/toolkit';

// entryReducer manages edit entry comp

const initialState = {
    entry: {},
    entryLocations: []
}
// date: "",
// title: "",
// content: "",
// photos: "",
// locations: "",

export const entryManagerSlice = createSlice({
    name: 'entryManager',
    initialState,
    reducers: {
        storeEntry: (state, action) => {
            state.entry = action.payload
        },
        storeCoords: (state, action) => {
            state.entryLocations = action.payload
        }
    }
})

export const { storeEntry, storeCoords } = entryManagerSlice.actions;
export default entryManagerSlice.reducer;