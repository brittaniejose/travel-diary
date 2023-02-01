import { configureStore } from '@reduxjs/toolkit';
import  usersReducer  from './usersReducer';
import tripsReducer from './tripsReducer';
import entryReducer from './entryReducer';

export const store = configureStore({
    reducer: {
        usersManager: usersReducer,
    },
    reducer: {
        tripManager: tripsReducer,
    },
    reducer: {
        entryManager: entryReducer
    }
})