import { baseApi } from "@/redux/api/baseApi";
import type { IJob } from "@/types/job";

export const jobApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllJobs: builder.query<IJob[], void>({
      query: () => ({
        url: "/jobs",
        method: "GET",
      }),
      transformResponse: (response: unknown) => {
        const res = response as { data: IJob[] };
        return res.data;
      },
      providesTags: ["jobs"],
    }),

    getSingleJob: builder.query<IJob, string>({
      query: (id) => ({
        url: `/jobs/${id}`,
        method: "GET",
      }),
      transformResponse: (response: unknown) => {
        const res = response as { data: IJob };
        return res.data;
      },
      providesTags: ["jobs"],
    }),

    createJob: builder.mutation<IJob, Partial<IJob>>({
      query: (data) => ({
        url: "/jobs",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["jobs"],
    }),

    updateJob: builder.mutation<IJob, { id: string; data: Partial<IJob> }>({
      query: ({ id, data }) => ({
        url: `/jobs/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["jobs"],
    }),

    deleteJob: builder.mutation<void, string>({
      query: (id) => ({
        url: `/jobs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["jobs"],
    }),

    // Corrected applyJob mutation
    applyJob: builder.mutation<IJob, { jobId: string }>({
      query: ({ jobId }) => ({
        url: `/jobs/${jobId}/apply`,
        method: "PATCH",
      }),
      invalidatesTags: ["jobs"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllJobsQuery,
  useGetSingleJobQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useApplyJobMutation,
} = jobApi;
