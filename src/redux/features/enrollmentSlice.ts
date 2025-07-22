import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { CourseOffering } from "@/types/course";
import type {
  TEnrollment,
  EnrollmentFilters,
  EnrollmentFormData,
} from "@/types/enrollment.type";

interface EnrollmentState {
  courseOfferings: CourseOffering[];
  enrollments: TEnrollment[];
  loading: boolean;
  error: string | null;
  filters: EnrollmentFilters;
}

const initialState: EnrollmentState = {
  courseOfferings: [],
  enrollments: [],
  loading: false,
  error: null,
  filters: {},
};

// Async thunks
export const fetchCourseOfferings = createAsyncThunk(
  "enrollment/fetchCourseOfferings",
  async (filters: EnrollmentFilters) => {
    // TODO: Replace with actual API call
    const response = await fetch(
      "/api/course-offerings?" + new URLSearchParams(filters as any)
    );
    if (!response.ok) throw new Error("Failed to fetch course offerings");
    return response.json();
  }
);

export const fetchEnrollments = createAsyncThunk(
  "enrollment/fetchEnrollments",
  async (studentId: string) => {
    // TODO: Replace with actual API call
    const response = await fetch(`/api/enrollments/${studentId}`);
    if (!response.ok) throw new Error("Failed to fetch enrollments");
    return response.json();
  }
);

export const enrollInCourse = createAsyncThunk(
  "enrollment/enrollInCourse",
  async (data: EnrollmentFormData) => {
    // TODO: Replace with actual API call
    const response = await fetch("/api/enrollments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to enroll in course");
    return response.json();
  }
);

export const dropCourse = createAsyncThunk(
  "enrollment/dropCourse",
  async (enrollmentId: string) => {
    // TODO: Replace with actual API call
    const response = await fetch(`/api/enrollments/${enrollmentId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to drop course");
    return enrollmentId;
  }
);

const enrollmentSlice = createSlice({
  name: "enrollment",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<EnrollmentFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Course Offerings
      .addCase(fetchCourseOfferings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseOfferings.fulfilled, (state, action) => {
        state.loading = false;
        state.courseOfferings = action.payload;
      })
      .addCase(fetchCourseOfferings.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch course offerings";
      })
      // Fetch Enrollments
      .addCase(fetchEnrollments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEnrollments.fulfilled, (state, action) => {
        state.loading = false;
        state.enrollments = action.payload;
      })
      .addCase(fetchEnrollments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch enrollments";
      })
      // Enroll in Course
      .addCase(enrollInCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(enrollInCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.enrollments.push(action.payload);
        const courseOffering = state.courseOfferings.find(
          (co) => co.id === action.payload.courseOfferingId
        );
        if (courseOffering) {
          courseOffering.enrolledStudents += 1;
        }
      })
      .addCase(enrollInCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to enroll in course";
      })
      // Drop Course
      .addCase(dropCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(dropCourse.fulfilled, (state, action) => {
        state.loading = false;
        const enrollment = state.enrollments.find(
          (e) => e.id === action.payload
        );
        if (enrollment) {
          enrollment.status = "dropped";
          const courseOffering = state.courseOfferings.find(
            (co) => co.id === enrollment.courseOfferingId
          );
          if (courseOffering) {
            courseOffering.enrolledStudents -= 1;
          }
        }
      })
      .addCase(dropCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to drop course";
      });
  },
});

export const { setFilters, clearFilters } = enrollmentSlice.actions;
export default enrollmentSlice.reducer;
