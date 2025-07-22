import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  Student,
  StudentFormData,
  StudentFilters,
} from "../../types/student";

interface StudentState {
  students: Student[];
  selectedStudent: Student | null;
  loading: boolean;
  error: string | null;
  filters: StudentFilters;
}

const initialState: StudentState = {
  students: [],
  selectedStudent: null,
  loading: false,
  error: null,
  filters: {},
};

// Async thunks
export const fetchStudents = createAsyncThunk(
  "students/fetchStudents",
  async (filters: StudentFilters) => {
    // TODO: Replace with actual API call
    const response = await fetch(
      "/api/students?" + new URLSearchParams(filters as any)
    );
    if (!response.ok) throw new Error("Failed to fetch students");
    return response.json();
  }
);

export const addStudent = createAsyncThunk(
  "students/addStudent",
  async (studentData: StudentFormData) => {
    // TODO: Replace with actual API call
    const response = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(studentData),
    });
    if (!response.ok) throw new Error("Failed to add student");
    return response.json();
  }
);

export const updateStudent = createAsyncThunk(
  "students/updateStudent",
  async ({ id, data }: { id: string; data: StudentFormData }) => {
    // TODO: Replace with actual API call
    const response = await fetch(`/api/students/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update student");
    return response.json();
  }
);

export const deleteStudent = createAsyncThunk(
  "students/deleteStudent",
  async (id: string) => {
    // TODO: Replace with actual API call
    const response = await fetch(`/api/students/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete student");
    return id;
  }
);

const studentSlice = createSlice({
  name: "students",
  initialState,
  reducers: {
    setSelectedStudent: (state, action: PayloadAction<Student | null>) => {
      state.selectedStudent = action.payload;
    },
    setFilters: (state, action: PayloadAction<StudentFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Students
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch students";
      })
      // Add Student
      .addCase(addStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.students.push(action.payload);
      })
      .addCase(addStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add student";
      })
      // Update Student
      .addCase(updateStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.students.findIndex(
          (s) => s.id === action.payload.id
        );
        if (index !== -1) {
          state.students[index] = action.payload;
        }
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update student";
      })
      // Delete Student
      .addCase(deleteStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.students = state.students.filter((s) => s.id !== action.payload);
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete student";
      });
  },
});

export const { setSelectedStudent, setFilters, clearFilters } =
  studentSlice.actions;
export default studentSlice.reducer;
