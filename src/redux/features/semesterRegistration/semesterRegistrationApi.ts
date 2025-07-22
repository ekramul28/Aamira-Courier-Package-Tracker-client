import { baseApi } from "@/redux/api/baseApi";
import type { TQueryParam, TResponseRedux } from "@/types/global";
import type { TSemesterRegistration } from "@/types/offeredCourse";
// import type { TSemesterRegistration } from "@/types/semesterRegistration";

const semesterRegistrationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSemesterRegistrations: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: "/semester-registrations",
          method: "GET",
          params: params,
        };
      },
      providesTags: ["SemesterRegistration"],
      transformResponse: (
        response: TResponseRedux<TSemesterRegistration[]>
      ) => ({
        data: response.data,
        meta: response.meta,
      }),
    }),

    getSingleSemesterRegistration: builder.query({
      query: (id) => ({
        url: `/semester-registrations/${id}`,
        method: "GET",
      }),
      providesTags: ["SemesterRegistration"],
      transformResponse: (response: TResponseRedux<TSemesterRegistration>) => ({
        data: response.data,
        meta: response.meta,
      }),
    }),

    createSemesterRegistration: builder.mutation({
      query: (data) => ({
        url: "/semester-registrations/create-semester-registration",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SemesterRegistration"],
    }),

    updateSemesterRegistration: builder.mutation({
      query: ({ id, data }) => ({
        url: `/semester-registrations/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["SemesterRegistration"],
    }),

    deleteSemesterRegistration: builder.mutation({
      query: (id) => ({
        url: `/semester-registrations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SemesterRegistration"],
    }),
  }),
});

export const {
  useGetAllSemesterRegistrationsQuery,
  useGetSingleSemesterRegistrationQuery,
  useCreateSemesterRegistrationMutation,
  useUpdateSemesterRegistrationMutation,
  useDeleteSemesterRegistrationMutation,
} = semesterRegistrationApi;
