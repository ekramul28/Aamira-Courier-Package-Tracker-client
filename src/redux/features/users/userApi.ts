// userApi.ts
import { baseApi } from "@/redux/api/baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<any, void>({
      query: () => ({
        url: "/users/me",
        method: "GET",
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ["user-profile"],
    }),
  }),
});

export const { useGetMeQuery } = userApi;
