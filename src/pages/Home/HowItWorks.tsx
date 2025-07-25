import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PackageSearch,
  MapPin,
  Clock,
  CheckCircle,
  Truck,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function HowItWorks() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const steps = [
    {
      icon: <PackageSearch className="h-8 w-8" />,
      title: "Submit Your Package",
      description:
        "Bring your package to one of our locations or schedule a pickup.",
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Real-Time Tracking",
      description:
        "Track your package in real-time from pickup to delivery with our advanced system.",
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Estimated Delivery",
      description:
        "Get accurate estimated delivery times based on current conditions.",
    },
    {
      icon: <Truck className="h-8 w-8" />,
      title: "In Transit Updates",
      description:
        "Receive notifications at every major checkpoint during transit.",
    },
    {
      icon: <ShieldCheck className="h-8 w-8" />,
      title: "Secure Delivery",
      description: "Rest assured with our secure delivery confirmation system.",
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: "Delivery Confirmation",
      description:
        "Get instant confirmation when your package is successfully delivered.",
    },
  ];

  return (
    <section className="py-12 md:py-24 bg-muted/40" ref={ref}>
      <div className="container px-4 md:px-6">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
          className="flex flex-col items-center space-y-8 text-center"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl font-bold tracking-tighter sm:text-4xl"
          >
            How It Works
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="max-w-[700px] text-gray-500 md:text-lg"
          >
            Our simple and transparent process ensures your packages are handled
            with care every step of the way.
          </motion.p>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-8"
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{
                  y: -5,
                  transition: { duration: 0.2 },
                }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="flex flex-row items-center space-x-4 space-y-0">
                    <motion.div
                      className="p-2 rounded-full bg-primary/10 text-primary"
                      whileHover={{ rotate: 10, scale: 1.1 }}
                    >
                      {step.icon}
                    </motion.div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
