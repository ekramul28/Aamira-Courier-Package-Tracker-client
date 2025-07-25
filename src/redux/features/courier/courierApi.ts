// src/redux/api/courierApi.ts

import { baseApi } from "@/redux/api/baseApi";
import type { TResponseRedux, TQueryParam } from "@/types/global";
import type { TCourier } from "@/types/courier"; // Create this interface as needed

export const courierApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get All Couriers
    getAllCouriers: builder.query<
      {
        data: TCourier[];
        meta?: any;
      },
      TQueryParam[] | undefined
    >({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: TQueryParam) =>
            params.append(item.name, item.value as string)
          );
        }
        return {
          url: "/couriers",
          method: "GET",
          params: params,
        };
      },
      providesTags: ["courier"],
      transformResponse: (response: TResponseRedux<TCourier[]>) => ({
        data: response.data,
        meta: response.meta,
      }),
    }),

    // Get Single Courier
    getSingleCourier: builder.query<TResponseRedux<TCourier>, string>({
      query: (id) => ({
        url: `/couriers/${id}`,
        method: "GET",
      }),
      providesTags: ["courier"],
      transformResponse: (response: TResponseRedux<TCourier>) => response,
    }),

    // Create Courier
    createCourier: builder.mutation<
      TResponseRedux<TCourier>,
      Partial<TCourier>
    >({
      query: (data) => ({
        url: "/couriers",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["courier"],
      transformResponse: (response: TResponseRedux<TCourier>) => response,
    }),

    // Update Courier
    updateCourier: builder.mutation<
      TResponseRedux<TCourier>,
      { id: string; updatedData: Partial<TCourier> }
    >({
      query: ({ id, updatedData }) => ({
        url: `/couriers/${id}`,
        method: "PATCH",
        body: updatedData,
      }),
      invalidatesTags: ["courier"],
      transformResponse: (response: TResponseRedux<TCourier>) => response,
    }),

    // Delete Courier
    deleteCourier: builder.mutation<TResponseRedux<TCourier>, string>({
      query: (id) => ({
        url: `/couriers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["courier"],
      transformResponse: (response: TResponseRedux<TCourier>) => response,
    }),
  }),
});

export const {
  useGetAllCouriersQuery,
  useGetSingleCourierQuery,
  useCreateCourierMutation,
  useUpdateCourierMutation,
  useDeleteCourierMutation,
} = courierApi;
