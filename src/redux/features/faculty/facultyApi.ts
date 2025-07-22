import { baseApi } from "@/redux/api/baseApi";
import type { TFaculty } from "@/types/faculty";
import type { TQueryParam, TResponseRedux } from "@/types/global";

const facultyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllFaculties: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: "/faculties",
          method: "GET",
          params: params,
        };
      },
      providesTags: ["Faculty"],
      transformResponse: (response: TResponseRedux<TFaculty[]>) => ({
        data: response.data,
        meta: response.meta,
      }),
    }),

    getSingleFaculty: builder.query({
      query: (id) => ({
        url: `/faculties/${id}`,
        method: "GET",
      }),
      providesTags: ["Faculty"],
      transformResponse: (response: TResponseRedux<TFaculty>) => ({
        data: response.data,
        meta: response.meta,
      }),
    }),

    createFaculty: builder.mutation({
      query: (data) => ({
        url: "/users/create-faculty",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Faculty"],
    }),

    updateFaculty: builder.mutation({
      query: ({ id, data }) => ({
        url: `/faculties/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Faculty"],
    }),

    deleteFaculty: builder.mutation({
      query: (id) => ({
        url: `/faculties/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Faculty"],
    }),
  }),
});

export const {
  useGetAllFacultiesQuery,
  useGetSingleFacultyQuery,
  useCreateFacultyMutation,
  useUpdateFacultyMutation,
  useDeleteFacultyMutation,
} = facultyApi;
