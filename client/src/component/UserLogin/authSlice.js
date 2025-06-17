import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    loggedInUser: null,
    status: 'idle',
    userChecked: false,
}

export const checkAuthAsync = createAsyncThunk(
  'auth/checkAuth', 
  async (_, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/check-auth`, 
      {}, { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLoggedInUser: (state, action) => {
            state.loggedInUser = action.payload;
        },
        clearLoggedInUser: (state) => {
            state.loggedInUser = null;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(checkAuthAsync.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(checkAuthAsync.fulfilled, (state, action) => {
          state.status = 'idle';
            if (action.payload.role == 'user'){
                state.loggedInUser = action.payload.user
            } else {
                state.loggedInUser = action.payload.vendor
            }
          state.userChecked = true;
        })
        .addCase(checkAuthAsync.rejected, (state, action) => {
          state.status = 'idle';
          state.userChecked = true;
        })
    }
})

export const selectLoggedInUser = (state) => state.auth.loggedInUser;
export const selectUserChecked = (state) => state.auth.userChecked;
export const { setLoggedInUser, clearLoggedInUser } = authSlice.actions;

export default authSlice.reducer;