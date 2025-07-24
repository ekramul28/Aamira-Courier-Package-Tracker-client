import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const packageFormSchema = z.object({
  sender: z.string().min(1, "Sender is required"),
  recipient: z.string().min(1, "Recipient is required"),
  origin: z.string().min(1, "Origin is required"),
  destination: z.string().min(1, "Destination is required"),
  weight: z.coerce.number().min(0.01, "Weight must be positive"),
});

export type PackageFormValues = z.infer<typeof packageFormSchema>;

const formVariants = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -40 },
};

type PackageFormProps = {
  initialValues?: Partial<PackageFormValues>;
  onSubmit: (values: PackageFormValues) => void | Promise<void>;
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
  } = useForm<PackageFormValues>({
    resolver: zodResolver(packageFormSchema),
    defaultValues: initialValues,
  });

  return (
    <motion.div
      variants={formVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4 }}
    >
      <Card className="w-[350px] shadow-lg">
        <CardHeader>
          <CardTitle>Package Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="sender">Sender</Label>
              <Input id="sender" {...register("sender")} />
              {errors.sender && (
                <span className="text-red-500 text-xs">
                  {errors.sender.message}
                </span>
              )}
            </div>
            <div>
              <Label htmlFor="recipient">Recipient</Label>
              <Input id="recipient" {...register("recipient")} />
              {errors.recipient && (
                <span className="text-red-500 text-xs">
                  {errors.recipient.message}
                </span>
              )}
            </div>
            <div>
              <Label htmlFor="origin">Origin</Label>
              <Input id="origin" {...register("origin")} />
              {errors.origin && (
                <span className="text-red-500 text-xs">
                  {errors.origin.message}
                </span>
              )}
            </div>
            <div>
              <Label htmlFor="destination">Destination</Label>
              <Input id="destination" {...register("destination")} />
              {errors.destination && (
                <span className="text-red-500 text-xs">
                  {errors.destination.message}
                </span>
              )}
            </div>
            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.01"
                {...register("weight")}
              />
              {errors.weight && (
                <span className="text-red-500 text-xs">
                  {errors.weight.message}
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
