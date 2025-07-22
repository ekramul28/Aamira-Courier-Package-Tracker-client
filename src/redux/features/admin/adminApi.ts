import { baseApi } from "@/redux/api/baseApi";
import type { TResponseRedux } from "@/types/global";
import type {
  SystemStats,
  RecentActivity,
  Announcement,
  ChatMessage,
  ChatRoom,
  TAdmin,
} from "@/types/admin";
import type { TQueryParam } from "@/types/global";

const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSystemStats: builder.query<TResponseRedux<SystemStats>, void>({
      query: () => ({
        url: "/admin/stats",
        method: "GET",
      }),
      providesTags: ["admin"],
      transformResponse: (response: TResponseRedux<SystemStats>) => response,
    }),

    getRecentActivities: builder.query<TResponseRedux<RecentActivity[]>, void>({
      query: () => ({
        url: "/admin/activities",
        method: "GET",
      }),
      providesTags: ["admin"],
      transformResponse: (response: TResponseRedux<RecentActivity[]>) =>
        response,
    }),

    // getAnnouncements: builder.query<TResponseRedux<Announcement[]>, void>({
    //   query: () => ({
    //     url: "/admin/announcements",
    //     method: "GET",
    //   }),
    //   providesTags: ["admin"],
    //   transformResponse: (response: TResponseRedux<Announcement[]>) => response,
    // }),

    // createAnnouncement: builder.mutation<
    //   TResponseRedux<Announcement>,
    //   Partial<Announcement>
    // >({
    //   query: (data) => ({
    //     url: "/admin/announcements",
    //     method: "POST",
    //     body: data,
    //   }),
    //   invalidatesTags: ["admin"],
    //   transformResponse: (response: TResponseRedux<Announcement>) => response,
    // }),

    // // Chat endpoints
    // getChatRooms: builder.query<TResponseRedux<ChatRoom[]>, void>({
    //   query: () => ({
    //     url: "/admin/chat/rooms",
    //     method: "GET",
    //   }),
    //   providesTags: ["admin"],
    //   transformResponse: (response: TResponseRedux<ChatRoom[]>) => response,
    // }),

    // getChatMessages: builder.query<TResponseRedux<ChatMessage[]>, string>({
    //   query: (roomId) => ({
    //     url: `/admin/chat/rooms/${roomId}/messages`,
    //     method: "GET",
    //   }),
    //   providesTags: ["admin"],
    //   transformResponse: (response: TResponseRedux<ChatMessage[]>) => response,
    // }),

    // sendMessage: builder.mutation<
    //   TResponseRedux<ChatMessage>,
    //   { roomId: string; message: string }
    // >({
    //   query: ({ roomId, message }) => ({
    //     url: `/admin/chat/rooms/${roomId}/messages`,
    //     method: "POST",
    //     body: { message },
    //   }),
    //   invalidatesTags: ["admin"],
    //   transformResponse: (response: TResponseRedux<ChatMessage>) => response,
    // }),

    // createChatRoom: builder.mutation<
    //   TResponseRedux<ChatRoom>,
    //   { name: string; participants: string[] }
    // >({
    //   query: (data) => ({
    //     url: "/admin/chat/rooms",
    //     method: "POST",
    //     body: data,
    //   }),
    //   invalidatesTags: ["admin"],
    //   transformResponse: (response: TResponseRedux<ChatRoom>) => response,
    // }),

    getAllAdmins: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: "/admins",
          method: "GET",
          params: params,
        };
      },
      providesTags: ["admin"],
      transformResponse: (response: TResponseRedux<TAdmin[]>) => ({
        data: response.data,
        meta: response.meta,
      }),
    }),

    createAdmin: builder.mutation({
      query: (data) => ({
        url: "/users/create-admin",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["admin"],
    }),

    updateAdmin: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `/admins/${id}`,
        method: "PATCH",
        body: updatedData,
      }),
      invalidatesTags: ["admin"],
    }),

    deleteAdmin: builder.mutation({
      query: (id) => ({
        url: `/admins/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["admin"],
    }),
  }),
});

export const {
  useGetSystemStatsQuery,
  useGetRecentActivitiesQuery,
  // useGetAnnouncementsQuery,
  // useCreateAnnouncementMutation,
  // useGetChatRoomsQuery,
  // useGetChatMessagesQuery,
  // useSendMessageMutation,
  // useCreateChatRoomMutation,
  useGetAllAdminsQuery,
  useCreateAdminMutation,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
} = adminApi;
