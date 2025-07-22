import { baseApi } from "@/redux/api/baseApi";
import type {
  AcademicStats,
  AcademicYear,
  Course,
  CreateAcademicYearDto,
  CreateCourseDto,
  CreateDepartmentDto,
  CreateFacultyDto,
  CreateProgramDto,
  CreateSemesterDto,
  Department,
  Faculty,
  Program,
  Semester,
  UpdateAcademicYearDto,
  UpdateCourseDto,
  UpdateDepartmentDto,
  UpdateFacultyDto,
  UpdateProgramDto,
  UpdateSemesterDto,
} from "@/types/academic";
import type { TQueryParam, TResponseRedux } from "@/types/global";

export const academicApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Academic Year endpoints
    getAcademicYears: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: "/academic-years",
          method: "GET",
          params: params,
        };
      },
      providesTags: ["AcademicYear"],
      transformResponse: (response: TResponseRedux<AcademicYear[]>) => {
        return {
          data: response.data,
          meta: response.meta,
        };
      },
    }),

    addAcademicYear: builder.mutation({
      query: (data: CreateAcademicYearDto) => ({
        url: "/academic-years",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AcademicYear"],
    }),

    updateAcademicYear: builder.mutation({
      query: ({ id, data }: { id: string; data: UpdateAcademicYearDto }) => ({
        url: `/academic-years/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["AcademicYear"],
    }),

    deleteAcademicYear: builder.mutation({
      query: (id: string) => ({
        url: `/academic-years/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AcademicYear"],
    }),

    // Course endpoints
    getCourses: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: "/courses",
          method: "GET",
          params: params,
        };
      },
      providesTags: ["Course"],
      transformResponse: (response: TResponseRedux<Course[]>) => {
        return {
          data: response.data,
          meta: response.meta,
        };
      },
    }),

    addCourse: builder.mutation({
      query: (data: CreateCourseDto) => ({
        url: "/courses",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Course"],
    }),

    updateCourse: builder.mutation({
      query: ({ id, data }: { id: string; data: UpdateCourseDto }) => ({
        url: `/courses/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Course"],
    }),

    deleteCourse: builder.mutation({
      query: (id: string) => ({
        url: `/courses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Course"],
    }),

    // Program endpoints
    getPrograms: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: "/programs",
          method: "GET",
          params: params,
        };
      },
      providesTags: ["Program"],
      transformResponse: (response: TResponseRedux<Program[]>) => {
        return {
          data: response.data,
          meta: response.meta,
        };
      },
    }),

    addProgram: builder.mutation({
      query: (data: CreateProgramDto) => ({
        url: "/programs",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Program"],
    }),

    updateProgram: builder.mutation({
      query: ({ id, data }: { id: string; data: UpdateProgramDto }) => ({
        url: `/programs/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Program"],
    }),

    deleteProgram: builder.mutation({
      query: (id: string) => ({
        url: `/programs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Program"],
    }),

    // Academic Stats endpoint
    getAcademicStats: builder.query({
      query: () => ({
        url: "/academic/stats",
        method: "GET",
      }),
      providesTags: [
        "Department",
        "Semester",
        "AcademicYear",
        "Course",
        "Faculty",
        "Program",
      ],
      transformResponse: (response: TResponseRedux<AcademicStats>) => {
        return {
          data: response.data,
          meta: response.meta,
        };
      },
    }),
  }),
});

export const {
  // Academic Year hooks
  useGetAcademicYearsQuery,
  useAddAcademicYearMutation,
  useUpdateAcademicYearMutation,
  useDeleteAcademicYearMutation,

  // Course hooks
  useGetCoursesQuery,
  useAddCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,

  // Program hooks
  useGetProgramsQuery,
  useAddProgramMutation,
  useUpdateProgramMutation,
  useDeleteProgramMutation,

  // Academic Stats hook
  useGetAcademicStatsQuery,
} = academicApi;
