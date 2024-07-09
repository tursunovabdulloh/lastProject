import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  authChange: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, { payload }) => {
      state.user = payload;
      localStorage.setItem("user", JSON.stringify(payload));
      state.authChange = true;
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
      state.authChange = false;
    },
    authChange: (state, { payload }) => {
      state.authChange = payload;
    },
  },
});

export const { login, logout, authChange } = userSlice.actions;
export default userSlice.reducer;
