import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { TPackage } from "@/types/package";

interface PackageState {
  packages: TPackage[];
}

const initialState: PackageState = {
  packages: [],
};

const packageSlice = createSlice({
  name: "package",
  initialState,
  reducers: {
    addOrUpdatePackage(state, action: PayloadAction<TPackage>) {
      const idx = state.packages.findIndex(
        (pkg) => pkg.id === action.payload.id
      );
      if (idx !== -1) {
        state.packages[idx] = action.payload;
      } else {
        state.packages.push(action.payload);
      }
    },
    removePackage(state, action: PayloadAction<string>) {
      state.packages = state.packages.filter(
        (pkg) => pkg.id !== action.payload
      );
    },
    setPackages(state, action: PayloadAction<TPackage[]>) {
      state.packages = action.payload;
    },
  },
});

export const { addOrUpdatePackage, removePackage, setPackages } =
  packageSlice.actions;
export default packageSlice.reducer;
