import { baseApi } from "@/redux/api/baseApi";
import type { IOfferedCourse } from "@/types/offeredCourse";
import type { TQueryParam, TResponseRedux } from "@/types/global";

export const offerCourseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllOfferedCourses: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: "/offered-courses",
          method: "GET",
          params: params,
        };
      },
      providesTags: ["offeredCourses"],
      transformResponse: (response: TResponseRedux<IOfferedCourse[]>) => ({
        data: response.data,
        meta: response.meta,
      }),
    }),

    getMyOfferedCourses: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: "/offered-courses/my-offered-courses",
          method: "GET",
          params: params,
        };
      },
      providesTags: ["offeredCourses"],
      transformResponse: (response: TResponseRedux<IOfferedCourse[]>) => ({
        data: response.data,
        meta: response.meta,
      }),
    }),

    getSingleOfferedCourse: builder.query({
      query: (id) => ({
        url: `/offered-courses/${id}`,
        method: "GET",
      }),
      providesTags: ["offeredCourses"],
      transformResponse: (response: TResponseRedux<IOfferedCourse>) => ({
        data: response.data,
        meta: response.meta,
      }),
    }),

    createOfferedCourse: builder.mutation({
      query: (data) => ({
        url: "/offered-courses/create-offered-course",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["offeredCourses"],
    }),

    updateOfferedCourse: builder.mutation({
      query: ({ id, data }) => ({
        url: `/offered-courses/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["offeredCourses"],
    }),

    deleteOfferedCourse: builder.mutation({
      query: (id) => ({
        url: `/offered-courses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["offeredCourses"],
    }),
    getOfferedCoursesBySemester: builder.query({
      query: (academicSemesterId: string) => ({
        url: `/offered-courses/by-semester/${academicSemesterId}`,
        method: "GET",
      }),
      providesTags: ["offeredCourses"],
    }),

    getOfferedCoursesByYear: builder.query({
      query: (academicYearId: string) => ({
        url: `/offered-courses/by-year/${academicYearId}`,
        method: "GET",
      }),
      providesTags: ["offeredCourses"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllOfferedCoursesQuery,
  useGetMyOfferedCoursesQuery,
  useGetSingleOfferedCourseQuery,
  useCreateOfferedCourseMutation,
  useUpdateOfferedCourseMutation,
  useDeleteOfferedCourseMutation,
  useGetOfferedCoursesBySemesterQuery,
  useGetOfferedCoursesByYearQuery,
} = offerCourseApi;
