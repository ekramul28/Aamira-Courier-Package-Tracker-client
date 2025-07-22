import { baseApi } from "@/redux/api/baseApi";
import type { IBlog } from "@/types/blog";

export const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBlogs: builder.query<IBlog[], void>({
      query: () => ({
        url: "/blogs",
        method: "GET",
      }),
      transformResponse: (response: unknown) => {
        const res = response as { data: IBlog[] };
        return res.data;
      },
      providesTags: ["blogs"],
    }),

    getSingleBlog: builder.query<IBlog, string>({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: "GET",
      }),
      transformResponse: (response: unknown) => {
        const res = response as { data: IBlog };
        return res.data;
      },
      providesTags: ["blogs"],
    }),

    createBlog: builder.mutation<IBlog, Partial<IBlog>>({
      query: (data) => ({
        url: "/blogs",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["blogs"],
    }),

    updateBlog: builder.mutation<IBlog, { id: string; data: Partial<IBlog> }>({
      query: ({ id, data }) => ({
        url: `/blogs/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["blogs"],
    }),

    deleteBlog: builder.mutation<void, string>({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["blogs"],
    }),

    // VOTE BLOG
    voteBlog: builder.mutation<IBlog, string>({
      query: (id) => ({
        url: `/blogs/${id}/vote`,
        method: "PATCH",
      }),
      invalidatesTags: ["blogs"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllBlogsQuery,
  useGetSingleBlogQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useVoteBlogMutation,
} = blogApi;
