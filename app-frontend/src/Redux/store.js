import { configureStore } from '@reduxjs/toolkit';
import  usersReducer  from './usersReducer';
import tripsReducer from './tripsReducer';

export const store = configureStore({
    reducer: {
        usersManager: usersReducer,
    },
    reducer: {
        tripManager: tripsReducer
    }
})