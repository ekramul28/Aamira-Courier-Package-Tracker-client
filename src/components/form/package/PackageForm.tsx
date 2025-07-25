import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const packageStatusOptions = [
  { label: "Created", value: "CREATED" },
  { label: "Picked Up", value: "PICKED_UP" },
  { label: "In Transit", value: "IN_TRANSIT" },
  { label: "Out for Delivery", value: "OUT_FOR_DELIVERY" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Exception", value: "EXCEPTION" },
  { label: "Cancelled", value: "CANCELLED" },
];

export const packageFormSchema = z.object({
  orderer_name: z.string().min(1, "Orderer name is required"),
  home_address: z.string().min(1, "Home address is required"),
  phone_number: z.string().min(1, "Phone number is required"),
});

export type PackageStatus =
  | "CREATED"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "EXCEPTION"
  | "CANCELLED";

export type IPackageFormValues = z.infer<typeof packageFormSchema>;

const formVariants = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -40 },
};

type PackageFormProps = {
  initialValues?: Partial<IPackageFormValues>;
  onSubmit: (values: IPackageFormValues) => void | Promise<void>;
  submitLabel?: string;
  isLoading?: boolean;
};

export const PackageForm: React.FC<PackageFormProps> = ({
  initialValues = {},
  onSubmit,
  submitLabel = "Submit",
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IPackageFormValues>({
    resolver: zodResolver(packageFormSchema),
    defaultValues: {
      ...initialValues,
    },
  });

  return (
    <motion.div
      variants={formVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4 }}
    >
      <Card className="w-[400px] shadow-lg">
        <CardHeader>
          <CardTitle>Orderer Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="orderer_name">Orderer Name</Label>
              <Input id="orderer_name" {...register("orderer_name")} />
              {errors.orderer_name && (
                <span className="text-red-500 text-xs">
                  {errors.orderer_name.message}
                </span>
              )}
            </div>
            <div>
              <Label htmlFor="home_address">Home Address</Label>
              <Input id="home_address" {...register("home_address")} />
              {errors.home_address && (
                <span className="text-red-500 text-xs">
                  {errors.home_address.message}
                </span>
              )}
            </div>
            <div>
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                type="phone_number"
                {...register("phone_number")}
              />
              {errors.phone_number && (
                <span className="text-red-500 text-xs">
                  {errors.phone_number.message}
                </span>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Submitting..." : submitLabel}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};
