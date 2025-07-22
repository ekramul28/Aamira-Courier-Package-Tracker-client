import { baseApi } from "@/redux/api/baseApi";
import type { TQueryParam, TResponseRedux } from "@/types/global";
import type { TAcademicFaculty } from "@/types/academicManagement.type";

export const academicFacultyApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createAcademicFaculty: build.mutation({
      query: (data) => ({
        url: "/academic-faculties/create-academic-faculty",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["academicFaculty"],
    }),

    getSingleAcademicFaculty: build.query({
      query: (id) => ({
        url: `/academic-faculties/${id}`,
        method: "GET",
      }),
      providesTags: ["academicFaculty"],
    }),

    updateAcademicFaculty: build.mutation({
      query: ({ id, data }) => ({
        url: `/academic-faculties/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["academicFaculty"],
    }),

    deleteAcademicFaculty: build.mutation({
      query: (id) => ({
        url: `/academic-faculties/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["academicFaculty"],
    }),

    getAllAcademicFaculties: build.query({
      query: (args?: TQueryParam[]) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }

        return {
          url: "/academic-faculties",
          method: "GET",
          params,
        };
      },
      transformResponse: (response: TResponseRedux<TAcademicFaculty[]>) => {
        return {
          data: response.data,
          meta: response.meta,
        };
      },
      providesTags: ["academicFaculty"],
    }),
  }),
});

export const {
  useCreateAcademicFacultyMutation,
  useGetSingleAcademicFacultyQuery,
  useUpdateAcademicFacultyMutation,
  useDeleteAcademicFacultyMutation,
  useGetAllAcademicFacultiesQuery,
} = academicFacultyApi;
