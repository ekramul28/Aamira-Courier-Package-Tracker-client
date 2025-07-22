// src/layouts/HomeLayout.tsx
import Footer from "@/pages/share/Footer";
import NavBar from "@/pages/share/Navbar";
import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const HomeLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <motion.main
        className="flex-grow pt-16" // Add padding-top to account for fixed navbar
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={window.location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </motion.main>
      <Footer />
    </div>
  );
};

export default HomeLayout;
