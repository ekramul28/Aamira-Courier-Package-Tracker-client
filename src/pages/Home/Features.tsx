import SectionHeader from "@/components/resuable/SectionHeader";
import { motion } from "framer-motion";
import {
  Bell,
  BookOpen,
  Briefcase,
  FileText,
  GraduationCap,
  Users,
} from "lucide-react";

const features = [
  {
    icon: GraduationCap,
    title: "Student Management",
    description:
      "Manage detailed student profiles, academic records, and performance metrics in one place.",
  },
  {
    icon: Users,
    title: "Instructor Portal",
    description:
      "Empower instructors with tools to manage syllabi, student assessments, and real-time feedback.",
  },
  {
    icon: BookOpen,
    title: "Course Enrollment",
    description:
      "Simplified course registration with automated prerequisite checks and real-time seat availability.",
  },
  {
    icon: FileText,
    title: "Academic Performance",
    description:
      "Access insightful analytics on student grades and progress to ensure academic excellence.",
  },
  {
    icon: Briefcase,
    title: "Job Marketplace",
    description:
      "Bridge academia with industry through curated job listings and internship programs.",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description:
      "Receive timely alerts about class updates, grade submissions, and important deadlines.",
  },
];

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
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function Features() {
  return (
    <section className=" my-5   ">
      <div className="container mx-auto px-4">
        <SectionHeader
          title=" Empowering Academic Excellence"
          subtitle=" Explore a suite of intelligent tools designed to streamline and
            elevate your academic environment."
        />

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -6 }}
              className="relative group  p-6 my-5 rounded-2xl bg-white dark:bg-gray-800  border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:border-blue-500 shadow-[inset_0px_30px_40px_0px_rgba(255,255,255,0.1),inset_0px_0px_20px_0px_rgba(0,0,0,0.1),0px_-5px_10px_0px_rgba(63,63,63,0.2)] "
            >
              <motion.div className="flex items-center justify-center w-14 h-14 rounded-xl  dark:from-blue-600/20 dark:to-blue-500/20 mb-5 transition-transform duration-500 group-hover:rotate-6">
                <feature.icon className="w-6 h-6 text-gray-600 dark:text-blue-400 transition-colors duration-300" />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed transition-colors duration-300">
                {feature.description}
              </p>
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-500 transition-all duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
