import { baseApi } from "@/redux/api/baseApi";
import type { TEnrolledCourse } from "@/types/enrolledCourse";
import type { TQueryParam, TResponseRedux } from "@/types/global";

const enrollmentCourseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllEnrolledCourses: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: "/enrolled-courses",
          method: "GET",
          params: params,
        };
      },
      providesTags: ["enrolledCourses"],
      transformResponse: (response: TResponseRedux<TEnrolledCourse[]>) => ({
        data: response.data,
        meta: response.meta,
      }),
    }),

    getMyEnrolledCourses: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: "/enrolled-courses/my-enrolled-courses",
          method: "GET",
          params: params,
        };
      },
      providesTags: ["enrolledCourses"],
      transformResponse: (response: TResponseRedux<TEnrolledCourse[]>) => ({
        data: response.data,
        meta: response.meta,
      }),
    }),

    createEnrolledCourse: builder.mutation({
      query: (data) => ({
        url: "/enrolled-courses/create-enrolled-course",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["enrolledCourses"],
    }),

    updateEnrolledCourseMarks: builder.mutation({
      query: (data) => ({
        url: "/enrolled-courses/update-enrolled-course-marks",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["enrolledCourses"],
    }),
  }),
});

export const {
  useGetAllEnrolledCoursesQuery,
  useGetMyEnrolledCoursesQuery,
  useCreateEnrolledCourseMutation,
  useUpdateEnrolledCourseMarksMutation,
} = enrollmentCourseApi;
