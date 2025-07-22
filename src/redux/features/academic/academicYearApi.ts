import { baseApi } from "@/redux/api/baseApi";
import type { TQueryParam, TResponseRedux } from "@/types/global";

export type TAcademicYear = {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export const academicYearApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createAcademicYear: build.mutation({
      query: (data) => ({
        url: "/academic-years/create-academic-year",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["academicYear"],
    }),

    getSingleAcademicYear: build.query({
      query: (id) => ({
        url: `/academic-years/${id}`,
        method: "GET",
      }),
      providesTags: ["academicYear"],
    }),

    updateAcademicYear: build.mutation({
      query: ({ id, data }) => ({
        url: `/academic-years/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["academicYear"],
    }),

    deleteAcademicYear: build.mutation({
      query: (id) => ({
        url: `/academic-years/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["academicYear"],
    }),

    getAllAcademicYears: build.query({
      query: (args?: TQueryParam[]) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }

        return {
          url: "/academic-years",
          method: "GET",
          params,
        };
      },
      transformResponse: (response: TResponseRedux<TAcademicYear[]>) => {
        return {
          data: response.data,
          meta: response.meta,
        };
      },
      providesTags: ["academicYear"],
    }),
  }),
});

export const {
  useCreateAcademicYearMutation,
  useGetSingleAcademicYearQuery,
  useUpdateAcademicYearMutation,
  useDeleteAcademicYearMutation,
  useGetAllAcademicYearsQuery,
} = academicYearApi;
