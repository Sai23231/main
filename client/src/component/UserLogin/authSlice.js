import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    loggedInUser: null,
    adminUser: null,
    status: 'idle',
    userChecked: false,
}

export const checkAuthAsync = createAsyncThunk(
  'auth/checkAuth', 
  async (_, { rejectWithValue }) => {
  try {
    // First try to check user authentication
    try {
      const userResponse = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/check-auth`, 
        {}, { withCredentials: true }
      );
      return userResponse.data;
    } catch (userError) {
      // If user auth fails, try vendor authentication
      try {
        const vendorResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/vendors/check-auth`, 
          { withCredentials: true }
        );
        if (vendorResponse.data.success) {
          return {
            ...vendorResponse.data,
            role: 'vendor'
          };
        }
      } catch (vendorError) {
        // If vendor auth fails, try venue authentication
        try {
          const venueResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/venue/check-auth`, 
            { withCredentials: true }
          );
          if (venueResponse.data.success) {
            return {
              ...venueResponse.data,
              role: 'venue'
            };
          }
        } catch (venueError) {
          // All failed, return user error
          throw userError;
        }
      }
    }
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const checkAdminAuthAsync = createAsyncThunk(
  'auth/checkAdminAuth', 
  async (_, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/check-auth`, 
      {}, { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const checkVendorAuthAsync = createAsyncThunk(
  'auth/checkVendorAuth', 
  async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/vendors/check-auth`, 
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const checkVenueAuthAsync = createAsyncThunk(
  'auth/checkVenueAuth', 
  async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/venue/check-auth`, 
      { withCredentials: true }
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
        setAdminUser: (state, action) => {
            state.adminUser = action.payload;
        },
        clearLoggedInUser: (state) => {
            state.loggedInUser = null;
        },
        clearAdminUser: (state) => {
            state.adminUser = null;
        },
        clearAllUsers: (state) => {
            state.loggedInUser = null;
            state.adminUser = null;
        },
        setUserChecked: (state, action) => {
            state.userChecked = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(checkAuthAsync.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(checkAuthAsync.fulfilled, (state, action) => {
          state.status = 'idle';
          if (action.payload && action.payload.user) {
            if (action.payload.role == 'user'){
                state.loggedInUser = action.payload.user
            } else {
                state.loggedInUser = action.payload.vendor
            }
          } else if (action.payload && action.payload.vendor) {
            // Handle vendor authentication
            state.loggedInUser = {
              ...action.payload.vendor,
              role: 'vendor'
            };
          }
          state.userChecked = true;
        })
        .addCase(checkAuthAsync.rejected, (state, action) => {
          state.status = 'idle';
          state.userChecked = true;
        })
        .addCase(checkVendorAuthAsync.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(checkVendorAuthAsync.fulfilled, (state, action) => {
          state.status = 'idle';
          if (action.payload && action.payload.vendor) {
            state.loggedInUser = {
              ...action.payload.vendor,
              role: 'vendor'
            };
          }
          state.userChecked = true;
        })
        .addCase(checkVendorAuthAsync.rejected, (state, action) => {
          state.status = 'idle';
          state.userChecked = true;
        })
        .addCase(checkVenueAuthAsync.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(checkVenueAuthAsync.fulfilled, (state, action) => {
          state.status = 'idle';
          if (action.payload && action.payload.venue) {
            state.loggedInUser = {
              ...action.payload.venue,
              role: 'venue'
            };
          }
          state.userChecked = true;
        })
        .addCase(checkVenueAuthAsync.rejected, (state, action) => {
          state.status = 'idle';
          state.userChecked = true;
        })
        .addCase(checkAdminAuthAsync.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(checkAdminAuthAsync.fulfilled, (state, action) => {
          state.status = 'idle';
          state.adminUser = action.payload.admin;
          state.userChecked = true;
        })
        .addCase(checkAdminAuthAsync.rejected, (state, action) => {
          state.status = 'idle';
          state.userChecked = true;
        })
    }
})

export const selectLoggedInUser = (state) => state.auth.loggedInUser;
export const selectAdminUser = (state) => state.auth.adminUser;
export const selectUserChecked = (state) => state.auth.userChecked;
export const { setLoggedInUser, setAdminUser, clearLoggedInUser, clearAdminUser, clearAllUsers, setUserChecked } = authSlice.actions;

export default authSlice.reducer;