import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  Instructor,
  InstructorFormData,
  InstructorFilters,
} from "../../types/instructor";

interface InstructorState {
  instructors: Instructor[];
  selectedInstructor: Instructor | null;
  loading: boolean;
  error: string | null;
  filters: InstructorFilters;
}

const initialState: InstructorState = {
  instructors: [],
  selectedInstructor: null,
  loading: false,
  error: null,
  filters: {},
};

// Async thunks
export const fetchInstructors = createAsyncThunk(
  "instructors/fetchInstructors",
  async (filters: InstructorFilters) => {
    // TODO: Replace with actual API call
    const response = await fetch(
      "/api/instructors?" + new URLSearchParams(filters as any)
    );
    if (!response.ok) throw new Error("Failed to fetch instructors");
    return response.json();
  }
);

export const addInstructor = createAsyncThunk(
  "instructors/addInstructor",
  async (instructorData: InstructorFormData) => {
    // TODO: Replace with actual API call
    const response = await fetch("/api/instructors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(instructorData),
    });
    if (!response.ok) throw new Error("Failed to add instructor");
    return response.json();
  }
);

export const updateInstructor = createAsyncThunk(
  "instructors/updateInstructor",
  async ({ id, data }: { id: string; data: InstructorFormData }) => {
    // TODO: Replace with actual API call
    const response = await fetch(`/api/instructors/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update instructor");
    return response.json();
  }
);

export const deleteInstructor = createAsyncThunk(
  "instructors/deleteInstructor",
  async (id: string) => {
    // TODO: Replace with actual API call
    const response = await fetch(`/api/instructors/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete instructor");
    return id;
  }
);

export const assignSubject = createAsyncThunk(
  "instructors/assignSubject",
  async ({
    instructorId,
    subjectId,
  }: {
    instructorId: string;
    subjectId: string;
  }) => {
    // TODO: Replace with actual API call
    const response = await fetch(`/api/instructors/${instructorId}/subjects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subjectId }),
    });
    if (!response.ok) throw new Error("Failed to assign subject");
    return response.json();
  }
);

export const updateGrade = createAsyncThunk(
  "instructors/updateGrade",
  async ({
    instructorId,
    subjectId,
    studentId,
    grade,
  }: {
    instructorId: string;
    subjectId: string;
    studentId: string;
    grade: string;
  }) => {
    // TODO: Replace with actual API call
    const response = await fetch(
      `/api/instructors/${instructorId}/subjects/${subjectId}/grades`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, grade }),
      }
    );
    if (!response.ok) throw new Error("Failed to update grade");
    return response.json();
  }
);

const instructorSlice = createSlice({
  name: "instructors",
  initialState,
  reducers: {
    setSelectedInstructor: (
      state,
      action: PayloadAction<Instructor | null>
    ) => {
      state.selectedInstructor = action.payload;
    },
    setFilters: (state, action: PayloadAction<InstructorFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Instructors
      .addCase(fetchInstructors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInstructors.fulfilled, (state, action) => {
        state.loading = false;
        state.instructors = action.payload;
      })
      .addCase(fetchInstructors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch instructors";
      })
      // Add Instructor
      .addCase(addInstructor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addInstructor.fulfilled, (state, action) => {
        state.loading = false;
        state.instructors.push(action.payload);
      })
      .addCase(addInstructor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add instructor";
      })
      // Update Instructor
      .addCase(updateInstructor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInstructor.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.instructors.findIndex(
          (i) => i.id === action.payload.id
        );
        if (index !== -1) {
          state.instructors[index] = action.payload;
        }
      })
      .addCase(updateInstructor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update instructor";
      })
      // Delete Instructor
      .addCase(deleteInstructor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInstructor.fulfilled, (state, action) => {
        state.loading = false;
        state.instructors = state.instructors.filter(
          (i) => i.id !== action.payload
        );
      })
      .addCase(deleteInstructor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete instructor";
      })
      // Assign Subject
      .addCase(assignSubject.fulfilled, (state, action) => {
        const instructor = state.instructors.find(
          (i) => i.id === action.payload.instructorId
        );
        if (instructor) {
          instructor.assignedSubjects.push(action.payload.subject);
        }
      })
      // Update Grade
      .addCase(updateGrade.fulfilled, (state, action) => {
        const instructor = state.instructors.find(
          (i) => i.id === action.payload.instructorId
        );
        if (instructor) {
          const subject = instructor.assignedSubjects.find(
            (s) => s.id === action.payload.subjectId
          );
          if (subject) {
            const student = subject.students.find(
              (s) => s.studentId === action.payload.studentId
            );
            if (student) {
              student.grade = action.payload.grade;
            }
            subject.gradingHistory.push(action.payload);
          }
        }
      });
  },
});

export const { setSelectedInstructor, setFilters, clearFilters } =
  instructorSlice.actions;
export default instructorSlice.reducer;
