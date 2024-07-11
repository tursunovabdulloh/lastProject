import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types";

interface UserState {
  user: User | null;
  authChange: boolean;
}

const initialState: UserState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  authChange: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
      state.authChange = true;
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
      state.authChange = false;
    },
    authChange: (state, action: PayloadAction<boolean>) => {
      state.authChange = action.payload;
    },
  },
});

export const { login, logout, authChange } = userSlice.actions;
export default userSlice.reducer;
