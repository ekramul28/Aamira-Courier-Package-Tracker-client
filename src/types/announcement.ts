export type TAnnouncement = {
  _id: string;
  title: string;
  content: string;
  type: "enrollment" | "academic" | "job" | "general";
  priority: "low" | "medium" | "high";
  isActive: boolean;
  startDate: string;
  endDate?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type TCreateAnnouncement = Omit<
  TAnnouncement,
  "_id" | "createdAt" | "updatedAt" | "createdBy"
>;

export type TUpdateAnnouncement = Partial<TCreateAnnouncement>;

export type TAnnouncementFilters = {
  search?: string;
  type?: string;
  priority?: string;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
};
