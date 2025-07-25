"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Truck, PackageCheck, PhoneCall } from "lucide-react";
import { useInView } from "react-intersection-observer";

export default function CTASection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const ctaItems = [
    {
      icon: <Truck className="h-10 w-10" />,
      title: "Ready to Ship?",
      description: "Schedule a pickup in just 2 minutes",
      buttonText: "Book Now",
      buttonVariant: "default",
    },
    {
      icon: <PackageCheck className="h-10 w-10" />,
      title: "Track a Package",
      description: "Real-time tracking for your shipments",
      buttonText: "Track Now",
      buttonVariant: "outline",
    },
    {
      icon: <PhoneCall className="h-10 w-10" />,
      title: "Need Help?",
      description: "Our support team is available 24/7",
      buttonText: "Contact Us",
      buttonVariant: "ghost",
    },
  ];

  return (
    <section
      ref={ref}
      className="py-16 md:py-24 bg-gradient-to-br from-primary/5 to-muted/50"
    >
      <div className="container px-4 md:px-6">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
          className="flex flex-col items-center text-center mb-16"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
          >
            Get Started With Aamira Today
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="max-w-2xl text-lg text-muted-foreground"
          >
            Join thousands of satisfied customers who trust us with their
            deliveries
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
        >
          {ctaItems.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-background rounded-xl border p-8 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-4 mb-4 rounded-full bg-primary/10 text-primary">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground mb-6">{item.description}</p>
                <Button
                  variant={
                    item.buttonVariant as "default" | "outline" | "ghost"
                  }
                  className="w-full"
                >
                  {item.buttonText}
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={itemVariants} className="mt-16 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Trusted by businesses and individuals worldwide
          </p>
          <div className="flex flex-wrap justify-center gap-6 opacity-70">
            {[
              "Acme Inc",
              "Globex Corp",
              "Stark Industries",
              "Wayne Enterprises",
              "Umbrella Corp",
            ].map((company, i) => (
              <motion.span
                key={i}
                className="text-muted-foreground font-medium"
                whileHover={{ scale: 1.05 }}
              >
                {company}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
