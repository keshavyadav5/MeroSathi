import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signinStart: (state) => {
      state.loading = true;
    },
    signinSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
      state.error = null;
    },
    signinFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.currentUser = null;
    },
    updateUserInfo: (state, action) => {
      state.currentUser = action.payload,
        state.loading = false,
        state.error = null
    },
    updateUserPassword: (state, action) => {
      state.currentUser = action.payload,
        state.loading = false,
        state.error = null
    }
  },
});

export const {
  signinStart,
  signinSuccess,
  signinFailed,
  logout,
  updateUserInfo,
  updateUserPassword
} = authSlice.actions;
export default authSlice.reducer;
