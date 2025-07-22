import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  grade: string;
  marks: number;
  batch: string;
  semester: string;
  assignedBy: string;
  assignedAt: string;
}

interface AcademicPerformanceState {
  grades: Grade[];
  loading: boolean;
  error: string | null;
}

const initialState: AcademicPerformanceState = {
  grades: [],
  loading: false,
  error: null,
};

const academicPerformanceSlice = createSlice({
  name: "academicPerformance",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addGrade: (state, action: PayloadAction<Grade>) => {
      state.grades.push(action.payload);
    },
    updateGrade: (state, action: PayloadAction<Grade>) => {
      const index = state.grades.findIndex(
        (grade) => grade.id === action.payload.id
      );
      if (index !== -1) {
        state.grades[index] = action.payload;
      }
    },
    deleteGrade: (state, action: PayloadAction<string>) => {
      state.grades = state.grades.filter(
        (grade) => grade.id !== action.payload
      );
    },
    setGrades: (state, action: PayloadAction<Grade[]>) => {
      state.grades = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  addGrade,
  updateGrade,
  deleteGrade,
  setGrades,
} = academicPerformanceSlice.actions;

export default academicPerformanceSlice.reducer;
