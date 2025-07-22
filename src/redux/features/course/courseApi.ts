import { baseApi } from "@/redux/api/baseApi";
import type { ICourse } from "@/types/course";
import type { TQueryParam } from "@/types/global";

export const courseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCourses: builder.query<ICourse[], TQueryParam[] | undefined>({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item) => {
            params.append(item.name, item.value as string);
          });
        }

        return {
          url: "/courses",
          method: "GET",
          params,
        };
      },
      transformResponse: (response: unknown) => {
        const res = response as { data: ICourse[] };
        return res.data;
      },
      providesTags: ["courses"],
    }),

    getSingleCourse: builder.query<ICourse, string>({
      query: (id) => ({
        url: `/courses/${id}`,
        method: "GET",
      }),
      transformResponse: (response: unknown) => {
        const res = response as { data: ICourse };
        return res.data;
      },
      providesTags: ["courses"],
    }),

    createCourse: builder.mutation<ICourse, Partial<ICourse>>({
      query: (data) => ({
        url: "/courses/create-course",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["courses"],
    }),

    updateCourse: builder.mutation<
      ICourse,
      { id: string; data: Partial<ICourse> }
    >({
      query: ({ id, data }) => ({
        url: `/courses/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["courses"],
    }),

    deleteCourse: builder.mutation<void, string>({
      query: (id) => ({
        url: `/courses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["courses"],
    }),

    assignFaculties: builder.mutation<
      void,
      { courseId: string; faculties: string[] }
    >({
      query: ({ courseId, faculties }) => ({
        url: `/courses/${courseId}/assign-faculties`,
        method: "PUT",
        body: { faculties },
      }),
      invalidatesTags: ["courses"],
    }),

    getFacultiesWithCourse: builder.query<any, string>({
      query: (courseId) => ({
        url: `/courses/${courseId}/get-faculties`,
        method: "GET",
      }),
      providesTags: ["courses"],
    }),

    removeFaculties: builder.mutation<
      void,
      { courseId: string; faculties: string[] }
    >({
      query: ({ courseId, faculties }) => ({
        url: `/courses/${courseId}/remove-faculties`,
        method: "DELETE",
        body: { faculties },
      }),
      invalidatesTags: ["courses"],
    }),

    enrollInCourse: builder.mutation<void, string>({
      query: (courseId) => ({
        url: `/courses/${courseId}/enroll`,
        method: "POST",
      }),
      invalidatesTags: ["courses", "Course"],
    }),

    getEnrolledCourses: builder.query<ICourse[], void>({
      query: () => ({
        url: "/courses/enrolled",
        method: "GET",
      }),
      transformResponse: (response: unknown) => {
        const res = response as { data: ICourse[] };
        return res.data;
      },
      providesTags: ["Course"],
    }),

    unenrollFromCourse: builder.mutation<void, string>({
      query: (courseId) => ({
        url: `/courses/${courseId}/unenroll`,
        method: "DELETE",
      }),
      invalidatesTags: ["courses", "Course"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllCoursesQuery,
  useGetSingleCourseQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useAssignFacultiesMutation,
  useGetFacultiesWithCourseQuery,
  useRemoveFacultiesMutation,
  useEnrollInCourseMutation,
  useGetEnrolledCoursesQuery,
  useUnenrollFromCourseMutation,
} = courseApi;
