import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  packageId: z.string().min(1, "Package ID is required"),
  status: z.enum([
    "CREATED",
    "PICKED_UP",
    "IN_TRANSIT",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "EXCEPTION",
    "CANCELLED",
  ]),
  lat: z
    .preprocess((v) => {
      if (v === "" || v === undefined) return undefined;
      const n = Number(v);
      return isNaN(n) ? undefined : n;
    }, z.number().optional())
    .refine((val) => val === undefined || typeof val === "number", {
      message: "Latitude must be a number",
    }),
  lon: z
    .preprocess((v) => {
      if (v === "" || v === undefined) return undefined;
      const n = Number(v);
      return isNaN(n) ? undefined : n;
    }, z.number().optional())
    .refine((val) => val === undefined || typeof val === "number", {
      message: "Longitude must be a number",
    }),
  note: z.string().optional(),
  eta: z.string().optional(),
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
    setValue,
    watch,
    formState: { errors },
  } = useForm<IPackageFormValues>({
    resolver: zodResolver(packageFormSchema),
    defaultValues: {
      status: initialValues.status ?? "CREATED",
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
          <CardTitle>Package Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="packageId">Package ID</Label>
              <Input id="packageId" {...register("packageId")} />
              {errors.packageId && (
                <span className="text-red-500 text-xs">
                  {errors.packageId.message}
                </span>
              )}
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={watch("status")}
                onValueChange={(v) => setValue("status", v as PackageStatus)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {packageStatusOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && (
                <span className="text-red-500 text-xs">
                  {errors.status.message}
                </span>
              )}
            </div>
            <div>
              <Label htmlFor="lat">Latitude</Label>
              <Input id="lat" type="number" step="any" {...register("lat")} />
              {errors.lat && (
                <span className="text-red-500 text-xs">
                  {errors.lat.message}
                </span>
              )}
            </div>
            <div>
              <Label htmlFor="lon">Longitude</Label>
              <Input id="lon" type="number" step="any" {...register("lon")} />
              {errors.lon && (
                <span className="text-red-500 text-xs">
                  {errors.lon.message}
                </span>
              )}
            </div>
            <div>
              <Label htmlFor="note">Note</Label>
              <Input id="note" {...register("note")} />
              {errors.note && (
                <span className="text-red-500 text-xs">
                  {errors.note.message}
                </span>
              )}
            </div>
            <div>
              <Label htmlFor="eta">ETA</Label>
              <Input id="eta" type="datetime-local" {...register("eta")} />
              {errors.eta && (
                <span className="text-red-500 text-xs">
                  {errors.eta.message}
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
