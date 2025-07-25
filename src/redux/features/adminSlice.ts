import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { TAdmin } from "@/types/admin";

interface AdminState {
  selectedAdmin: TAdmin | null;
}

const initialState: AdminState = {
  selectedAdmin: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setSelectedAdmin: (state, action: PayloadAction<TAdmin | null>) => {
      state.selectedAdmin = action.payload;
    },
  },
});

export const { setSelectedAdmin } = adminSlice.actions;
export default adminSlice.reducer;
