import { baseApi } from "@/redux/api/baseApi";
import type {
  TAnnouncement,
  TCreateAnnouncement,
  TUpdateAnnouncement,
} from "@/types/announcement";
import type { TQueryParam, TResponseRedux } from "@/types/global";

export const announcementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all announcements with optional filters
    getAllAnnouncements: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }

        return {
          url: "/announcements",
          method: "GET",
          params: params,
        };
      },
      providesTags: ["announcements"],
      transformResponse: (response: TResponseRedux<TAnnouncement[]>) => {
        return {
          data: response.data,
          meta: response.meta,
        };
      },
    }),

    // Get a single announcement by ID
    getSingleAnnouncement: builder.query({
      query: (id) => ({
        url: `/announcements/${id}`,
        method: "GET",
      }),
      providesTags: ["announcements"],
    }),

    // Create a new announcement
    createAnnouncement: builder.mutation({
      query: (data: TCreateAnnouncement) => ({
        url: "/announcements",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["announcements"],
    }),

    // Update an announcement
    updateAnnouncement: builder.mutation({
      query: ({ id, data }: { id: string; data: TUpdateAnnouncement }) => ({
        url: `/announcements/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["announcements"],
    }),

    // Delete an announcement
    deleteAnnouncement: builder.mutation({
      query: (id: string) => ({
        url: `/announcements/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["announcements"],
    }),
  }),
});

export const {
  useGetAllAnnouncementsQuery,
  useGetSingleAnnouncementQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
} = announcementApi;
