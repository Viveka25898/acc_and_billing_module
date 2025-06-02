import { createSlice } from "@reduxjs/toolkit";
const storedUser = JSON.parse(localStorage.getItem("user")) || null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser?.username || null,  // Fix: Restore user state
    role: storedUser?.role || null,      // Fix: Restore role state
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload.username;
      state.role = action.payload.role;
      localStorage.setItem("user", JSON.stringify(action.payload)); // Fix: Save full user data
    },
    logout: (state) => {
      state.user = null;
      state.role = null;
      localStorage.removeItem("user"); // Clear localStorage
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
