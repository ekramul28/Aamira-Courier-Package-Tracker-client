import { baseApi } from "@/redux/api/baseApi";
import type { Course } from "@/types/academic";
import type { CourseOffering } from "@/types/course";
import type { TEnrollment } from "@/types/enrollment.type";
import type { TQueryParam, TResponseRedux } from "@/types/global";
import type { TStudent } from "@/types/student";
import type { IUserProfile } from "@/types/user";

export const studentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all students with query filters
    getAllStudents: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }

        return {
          url: "/students",
          method: "GET",
          params: params,
        };
      },
      providesTags: ["student"],
      transformResponse: (response: TResponseRedux<TStudent[]>) => {
        return {
          data: response.data,
          meta: response.meta,
        };
      },
    }),

    // Create Student
    createStudent: builder.mutation({
      query: (data) => ({
        url: "/users/create-student",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["student"],
    }),

    // Get a single student
    getSingleStudent: builder.query({
      query: (id) => ({
        url: `/students/${id}`,
        method: "GET",
      }),
      providesTags: ["student"],
    }),

    // Update any student by ID
    updateStudent: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `/students/${id}`,
        method: "PATCH",
        body: updatedData,
      }),
      invalidatesTags: ["student"],
    }),

    // Get student courses (enrolled + available)
    getStudentCourses: builder.query<
      TResponseRedux<{
        enrolledCourses: CourseOffering[];
        availableCourses: Course[];
      }>,
      string
    >({
      query: (studentId) => ({
        url: `/students/${studentId}/courses`,
        method: "GET",
      }),
      providesTags: ["studentCourses"],
    }),

    // Enroll in a course
    enrollInCourse: builder.mutation({
      query: ({
        studentId,
        courseId,
      }: {
        studentId: string;
        courseId: string;
      }) => ({
        url: `/students/${studentId}/courses/${courseId}/enroll`,
        method: "POST",
      }),
      invalidatesTags: ["studentCourses"],
    }),

    // Drop a course
    dropCourse: builder.mutation({
      query: ({
        studentId,
        courseId,
      }: {
        studentId: string;
        courseId: string;
      }) => ({
        url: `/students/${studentId}/courses/${courseId}/drop`,
        method: "DELETE",
      }),
      invalidatesTags: ["studentCourses"],
    }),

    // Get student enrollments
    getStudentEnrollments: builder.query<TResponseRedux<TEnrollment[]>, string>(
      {
        query: (studentId) => ({
          url: `/students/${studentId}/enrollments`,
          method: "GET",
        }),
        providesTags: ["studentEnrollments"],
      }
    ),

    // Get my student profile
    getMyStudentProfile: builder.query({
      query: () => ({
        url: "/students/my-profile",
        method: "GET",
      }),
      providesTags: ["studentProfiles"],
    }),

    // Get any student's profile
    getStudentProfile: builder.query({
      query: (studentId) => ({
        url: `/students/${studentId}`,
        method: "GET",
      }),
      providesTags: ["studentProfiles"],
    }),

    // Update own profile
    updateOwnProfile: builder.mutation({
      query: ({ id, updateData }) => ({
        url: `/students/${id}`,
        method: "PATCH",
        body: updateData,
      }),
      invalidatesTags: ["studentProfiles"],
    }),

    // Delete student
    deleteStudent: builder.mutation({
      query: (id) => ({
        url: `/students/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["student"],
    }),

    // Get currently logged-in user info
    getMe: builder.query<TResponseRedux<IUserProfile>, void>({
      query: () => ({
        url: "/users/me",
        method: "GET",
      }),
      providesTags: ["userProfiles", "student"],
    }),
  }),
});

export const {
  useGetAllStudentsQuery,
  useCreateStudentMutation,
  useGetSingleStudentQuery,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
  useGetMyStudentProfileQuery,
  useGetStudentProfileQuery,
  useUpdateOwnProfileMutation,
  useGetStudentCoursesQuery,
  useEnrollInCourseMutation,
  useDropCourseMutation,
  useGetStudentEnrollmentsQuery,
  useGetMeQuery,
} = studentApi;
