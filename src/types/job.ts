export type JobType = "full-time" | "part-time" | "contract" | "freelance";

export interface JobFilters {
  search?: string;
  type?: JobType;
  status?: "open" | "closed" | "in-progress";
}

export interface JobLocation {
  type: string;
  address?: string;
  city?: string;
  country?: string;
  isRemote?: boolean;
}

export interface JobEmployer {
  id: string;
  name: string;
  logo?: string;
  description?: string;
}

export interface JobListing {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  type: JobType;
  status: "open" | "closed" | "in-progress";
  location: JobLocation;
  employer: JobEmployer;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  postedAt: string;
  deadline: string;
  department?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobFormData {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  type: JobType;
  location: JobLocation | any;
  salary?:
    | {
        min: number;
        max: number;
        currency: string;
      }
    | any;
  deadline: string;
  department?: string;
}

export interface ProposalFormData {
  jobId: string;
  coverLetter: string;
  expectedSalary?: number;
  availability?: string;
  attachments?: string[];
}

export interface FreelancerProfile {
  id: string;
  userId: string;
  title: string;
  bio: string;
  skills: string[];
  hourlyRate: number;
  availability: "full-time" | "part-time" | "contract";
  experience: {
    years: number;
    description: string;
  };
  education: {
    degree: string;
    field: string;
    institution: string;
    year: number;
  }[];
  portfolio: {
    title: string;
    description: string;
    url?: string;
  }[];
  rating: number;
  completedJobs: number;
  successRate: number;
  status: "available" | "busy" | "unavailable";
}

export interface Proposal {
  id: string;
  jobId: string;
  freelancerId: string;
  freelancer: FreelancerProfile;
  coverLetter: string;
  bid: number;
  estimatedDuration: string;
  status: "pending" | "accepted" | "rejected";
  submittedAt: string;
}

export interface FreelancerFilters {
  search?: string;
  skills?: string[];
  availability?: FreelancerProfile["availability"];
  minRating?: number;
  minExperience?: number;
  status?: FreelancerProfile["status"];
}

export interface IJob {
  _id?: string | any;
  id: number | any;
  title: string;
  category: string;
  description: string;
  bannerImage?: string;
  profileImage?: string | any;
  author: string;
  minPrice: number;
  maxPrice: number;
  deadline: string;
  vacancy: number;
  appliedBy: string | any;
  workMode: "remote" | "onsite" | "hybrid";
  createdAt?: string;
  updatedAt?: string;
}
