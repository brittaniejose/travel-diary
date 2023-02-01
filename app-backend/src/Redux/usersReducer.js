import { createSlice } from '@reduxjs/toolkit';

// usersReducer manages signup and login

const initialState = {
    user: {
        email: "",
        password: "",
        token: ""
    }
}

export const usersManagerSlice = createSlice({
    name: 'usersManager',
    initialState,
    reducers: {
        saveUser: (state, action) => {
            state.user = action.payload
        }
    }
})

export const { saveUser } = usersManagerSlice.actions;
export default usersManagerSlice.reducer;