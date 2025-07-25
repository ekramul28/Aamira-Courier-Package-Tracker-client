export type TCourier = {
  _id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
  userId: string;
};
