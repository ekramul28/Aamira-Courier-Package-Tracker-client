"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Khan",
    role: "E-commerce Seller",
    feedback:
      "Aamira Courier has made our same-day deliveries incredibly smooth and fast. Highly reliable service!",
  },
  {
    name: "Rahim Uddin",
    role: "Small Business Owner",
    feedback:
      "The real-time tracking feature is a game-changer. My customers are happier, and so am I!",
  },
  {
    name: "Anika Chowdhury",
    role: "Logistics Manager",
    feedback:
      "We've cut manual errors by 90% since switching to Aamira's tracking system. Impressive support team!",
  },
];

export function Testimonials() {
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

  return (
    <section ref={ref} className="py-16 md:py-24 bg-muted/40">
      <div className="container px-4 md:px-6">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
          className="flex flex-col items-center text-center mb-12"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4"
          >
            Trusted by Businesses
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="max-w-[700px] text-gray-500 md:text-lg"
          >
            Don't just take our word for it - hear what our customers say about
            our services
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8 flex flex-col h-full">
                  <Quote className="h-8 w-8 text-primary mb-4 opacity-70" />
                  <p className="text-gray-600 mb-6 flex-grow">
                    "{testimonial.feedback}"
                  </p>
                  <div className="mt-auto">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
