export interface IBlog {
  _id?: string;
  title: string;
  category: string;
  description: string;
  link?: string;
  profileImage?: string;
  bannerImage?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy: string;
  votes?: number;
  votedBy?: string[] | any;
}
