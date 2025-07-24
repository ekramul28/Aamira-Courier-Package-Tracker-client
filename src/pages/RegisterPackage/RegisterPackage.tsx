import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { useCreatePackageMutation } from "@/redux/features/package/packageApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PackageForm,
  type PackageFormValues,
} from "@/components/form/package/PackageForm";
import type { TPackage } from "@/types/package";
import PackageDetails from "@/components/form/package/PackageDetails";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const socket = io("http://localhost:5000"); // Adjust if your backend runs elsewhere

const formVariants = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -40 },
};

export default function RegisterPackage() {
  const [createPackage, { isLoading }] = useCreatePackageMutation();
  const [success, setSuccess] = useState(false);
  const [lastPackage, setLastPackage] = useState<TPackage | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleSubmit = async (data: PackageFormValues) => {
    try {
      const result = await createPackage({
        ...data,
        status: "pending",
      }).unwrap();
      toast.success("Package registered successfully!");
      socket.emit("package_registered", result);
      setLastPackage(result);
      setSuccess(true);
    } catch (error) {
      toast.error("Failed to register package");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-background">
      <AnimatePresence mode="wait">
        {!success ? (
          <PackageForm
            key="form"
            onSubmit={handleSubmit}
            submitLabel="Register Package"
            isLoading={isLoading}
          />
        ) : (
          <motion.div
            key="success"
            variants={formVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4 }}
          >
            <Card className="w-[350px] shadow-lg text-center">
              <CardHeader>
                <CardTitle>Success!</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Package registered successfully.</p>
                <div className="flex flex-col gap-2">
                  <Button onClick={() => setSuccess(false)} className="w-full">
                    Register Another
                  </Button>
                  {lastPackage && (
                    <Button
                      variant="outline"
                      onClick={() => setDetailsOpen(true)}
                      className="w-full"
                    >
                      View Details
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
              <DialogContent className="max-w-xl">
                <PackageDetails
                  packageData={lastPackage}
                  onClose={() => setDetailsOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
