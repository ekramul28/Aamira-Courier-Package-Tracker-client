import { baseApi } from "@/redux/api/baseApi";
import type { TQueryParam, TResponseRedux } from "@/types/global";
import type { TMarkDistribution } from "@/types/student";
// You may want to define TGrade in your types directory
// import type { TGrade } from "@/types/grade";

const gradesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllGrades: builder.query<TResponseRedux<TMarkDistribution[]>, any>({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: "/marks",
          method: "GET",
          params: params,
        };
      },
      providesTags: ["Grades"],
    }),

    getSingleGrade: builder.query<TResponseRedux<TMarkDistribution>, string>({
      query: (id) => ({
        url: `/marks/${id}`,
        method: "GET",
      }),
      providesTags: ["Grades"],
    }),

    createGrade: builder.mutation<
      TMarkDistribution,
      Partial<TMarkDistribution>
    >({
      query: (data) => ({
        url: "/marks",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Grades"],
    }),

    updateGrade: builder.mutation<
      TMarkDistribution,
      { id: string; data: Partial<TMarkDistribution> }
    >({
      query: ({ id, data }) => ({
        url: `/marks/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Grades"],
    }),

    deleteGrade: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/marks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Grades"],
    }),
  }),
});

export const {
  useGetAllGradesQuery,
  useGetSingleGradeQuery,
  useCreateGradeMutation,
  useUpdateGradeMutation,
  useDeleteGradeMutation,
} = gradesApi;
