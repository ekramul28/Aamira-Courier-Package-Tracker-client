import { baseApi } from "@/redux/api/baseApi";
import type { TPackage, TCreatePackage, TUpdatePackage } from "@/types/package";
import type { TQueryParam, TResponseRedux } from "@/types/global";

export const packageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all packages with optional filters
    getAllPackages: builder.query<
      { data: TPackage[]; meta: any },
      TQueryParam[] | void
    >({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: "/packages",
          method: "GET",
          params: params,
        };
      },
      providesTags: ["packages"],
      transformResponse: (response: TResponseRedux<TPackage[]>) => {
        console.log("inredux", response);
        return {
          data: response.data?.data ?? [],
          meta: response.meta ?? {},
        };
      },
    }),

    // Get a single package by ID
    getSinglePackage: builder.query<TPackage, string>({
      query: (id) => ({
        url: `/packages/${id}`,
        method: "GET",
      }),
      providesTags: ["packages"],
    }),

    // Create a new package
    createPackage: builder.mutation<TPackage, TCreatePackage>({
      query: (data) => ({
        url: "/packages",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["packages"],
    }),

    // Update a package
    updatePackage: builder.mutation<
      TPackage,
      { id: string; data: TUpdatePackage }
    >({
      query: ({ id, data }) => ({
        url: `/packages/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["packages"],
    }),

    // Delete a package
    deletePackage: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/packages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["packages"],
    }),
  }),
});

export const {
  useGetAllPackagesQuery,
  useGetSinglePackageQuery,
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useDeletePackageMutation,
} = packageApi;
