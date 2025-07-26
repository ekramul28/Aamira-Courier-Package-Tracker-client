import type { DefinitionType } from "@reduxjs/toolkit/query";
import {
  type BaseQueryApi,
  type BaseQueryFn,
  type FetchArgs,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

import { toast } from "sonner";
import { logout, setUser } from "../features/auth/authSlice";
import type { RootState } from "../store";

// Utility to get the current auth token from the Redux store
import { store } from "../store";
export function getAuthToken() {
  return (store.getState() as RootState).auth.token;
}

const baseQuery = fetchBaseQuery({
  // baseUrl: "http://localhost:5000/api/v1",
  baseUrl: "https://aamira-courier-package-tracker-serv.vercel.app/api/v1",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;

    if (token) {
      headers.set("authorization", `${token}`);
    }

    return headers;
  },
});

const baseQueryWithRefreshToken: BaseQueryFn<
  FetchArgs,
  BaseQueryApi,
  DefinitionType
> = async (args, api, extraOptions): Promise<any> => {
  let result = await baseQuery(args, api, extraOptions);
  if (result?.error?.status === 404) {
    const errorMessage = result.error.data as { message: string };
    toast.error(errorMessage.message);
  }
  if (result?.error?.status === 403) {
    const errorMessage = result.error.data as { message: string };
    toast.error(errorMessage.message);
  }
  if (result?.error?.status === 401) {
    //* Send Refresh
    console.log("Sending refresh token");

    const res = await fetch(
      "https://aamira-courier-package-tracker-serv.vercel.app/api/v1",
      // "http://localhost:5000/api/v1/auth/refresh-token",
      {
        method: "POST",
        credentials: "include",
      }
    );

    const data = await res.json();

    if (data?.data?.accessToken) {
      const user = (api.getState() as RootState).auth.user;

      api.dispatch(
        setUser({
          user,
          token: data.data.accessToken,
        })
      );

      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: ["packages", "announcements", "courier", "admin"],
  endpoints: () => ({}),
});
