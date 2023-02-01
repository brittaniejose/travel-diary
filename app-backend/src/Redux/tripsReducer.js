import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    tripID: {
        id: 0
    }
}

export const tripManagerSlice = createSlice({
    name: 'tripManager',
    initialState,
    reducers: {
        saveTripID: (state, action) => {
            state.tripID = action.payload
        }
    }
})

export const { saveTripID } = tripManagerSlice.actions;
export default tripManagerSlice.reducer;