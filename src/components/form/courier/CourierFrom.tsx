import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  useCreateCourierMutation,
  useUpdateCourierMutation,
} from "@/redux/features/courier/courierApi";
import type { TCourier } from "@/types/courier";

const courierSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  status: z.enum(["active", "inactive"]),
});

type CourierFormData = z.infer<typeof courierSchema>;

interface CourierFormProps {
  courier?: TCourier;
  onSuccess?: () => void;
}

const CourierForm: React.FC<CourierFormProps> = ({ courier, onSuccess }) => {
  const { toast } = useToast();
  const [createCourier] = useCreateCourierMutation();
  const [updateCourier] = useUpdateCourierMutation();

  const form = useForm<CourierFormData>({
    resolver: zodResolver(courierSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      status: "active",
    },
  });

  useEffect(() => {
    if (courier) {
      form.reset({
        name: courier.name,
        email: courier.email,
        password: "", // do not preload password
        status: courier.status,
      });
    }
  }, [courier, form]);

  const onSubmit = async (data: CourierFormData) => {
    try {
      if (courier) {
        await updateCourier({
          id: courier._id,
          updatedData: data,
        }).unwrap();
        toast({
          title: "Success",
          description: "Courier updated successfully",
        });
      } else {
        await createCourier(data).unwrap();
        toast({
          title: "Success",
          description: "Courier created successfully",
        });
      }
      onSuccess?.();
    } catch (err) {
      console.log(err);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{courier ? "Update Courier" : "Add Courier"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Courier name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Courier email"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {!courier && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                {courier ? "Update Courier" : "Create Courier"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CourierForm;
