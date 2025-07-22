// src/redux/features/academic/academicSemesterApi.ts
import { baseApi } from "@/redux/api/baseApi";
import type { TQueryParam, TResponseRedux } from "@/types/global";
import type { TAcademicSemester } from "@/types/academicManagement.type";

export const academicSemesterApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createAcademicSemester: build.mutation({
      query: (data) => ({
        url: "/academic-semesters/create-academic-semester",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["academicSemester"],
    }),

    getSingleAcademicSemester: build.query({
      query: (id) => ({
        url: `/academic-semesters/${id}`,
        method: "GET",
      }),
      providesTags: ["academicSemester"],
    }),

    updateAcademicSemester: build.mutation({
      query: ({ id, data }) => ({
        url: `/academic-semesters/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["academicSemester"],
    }),

    deleteAcademicSemester: build.mutation({
      query: (id) => ({
        url: `/academic-semesters/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["academicSemester"],
    }),

    getAllAcademicSemesters: build.query({
      query: (args?: TQueryParam[]) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item) => {
            params.append(item.name, item.value as string);
          });
        }

        return {
          url: "/academic-semesters",
          method: "GET",
          params,
        };
      },
      transformResponse: (response: TResponseRedux<TAcademicSemester[]>) => {
        return {
          data: response.data,
          meta: response.meta,
        };
      },
      providesTags: ["academicSemester"],
    }),
  }),
});

export const {
  useCreateAcademicSemesterMutation,
  useGetSingleAcademicSemesterQuery,
  useUpdateAcademicSemesterMutation,
  useDeleteAcademicSemesterMutation,
  useGetAllAcademicSemestersQuery,
} = academicSemesterApi;
