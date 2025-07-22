import { baseApi } from "@/redux/api/baseApi";
import type { TQueryParam, TResponseRedux } from "@/types/global";
import type { TAcademicDepartment } from "@/types/academicManagement.type";

export const academicDepartmentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createAcademicDepartment: build.mutation({
      query: (data) => ({
        url: "/academic-departments/create-academic-department",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AcademicDepartment"],
    }),

    getSingleAcademicDepartment: build.query({
      query: (id) => ({
        url: `/academic-departments/${id}`,
        method: "GET",
      }),
      providesTags: ["AcademicDepartment"],
    }),

    updateAcademicDepartment: build.mutation({
      query: ({ id, data }) => ({
        url: `/academic-departments/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["AcademicDepartment"],
    }),

    deleteAcademicDepartment: build.mutation({
      query: (id) => ({
        url: `/academic-departments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AcademicDepartment"],
    }),

    getAllAcademicDepartments: build.query({
      query: (args?: TQueryParam[]) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }

        return {
          url: "/academic-departments",
          method: "GET",
          params,
        };
      },
      transformResponse: (response: TResponseRedux<TAcademicDepartment[]>) => {
        return {
          data: response.data,
          meta: response.meta,
        };
      },
      providesTags: ["AcademicDepartment"],
    }),
  }),
});

export const {
  useCreateAcademicDepartmentMutation,
  useGetSingleAcademicDepartmentQuery,
  useUpdateAcademicDepartmentMutation,
  useDeleteAcademicDepartmentMutation,
  useGetAllAcademicDepartmentsQuery,
} = academicDepartmentApi;
