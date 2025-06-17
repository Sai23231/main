import {configureStore} from '@reduxjs/toolkit'
import authReducer from '../component/UserLogin/authSlice.js';

export const store = configureStore({
    reducer : {
        auth: authReducer,
    }
});