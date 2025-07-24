export type TPackage = {
  id: string;
  sender: string;
  recipient: string;
  status: "pending" | "in_transit" | "delivered" | "stuck" | "cancelled";
  origin: string;
  destination: string;
  weight: number;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
};

export type TCreatePackage = Omit<TPackage, "id" | "createdAt" | "updatedAt">;

export type TUpdatePackage = Partial<
  Omit<TPackage, "id" | "createdAt" | "updatedAt">
>;
