// src/components/Footer.tsx

import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Github, Truck } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="border-t bg-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        {/* Company Info */}
        <div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/"
              className="text-2xl font-extrabold tracking-wide text-[#3F4555] dark:text-blue-400 hover:text-blue-600 transition-colors duration-300 flex items-center gap-1"
            >
              <span>
                <Truck className="w-10 h-10" />
              </span>{" "}
              Aamira Courier
            </Link>
          </motion.div>
          <p className="mt-2 text-gray-600">
            Internal package tracking tool to improve dispatch efficiency and
            real-time visibility across metro deliveries.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Navigation</h3>
          <ul className="space-y-1 text-gray-600">
            <li>
              <Link to="/dashboard" className="hover:text-blue-600">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/packages" className="hover:text-blue-600">
                All Packages
              </Link>
            </li>
            <li>
              <Link to="/alerts" className="hover:text-blue-600">
                Alerts
              </Link>
            </li>
            <li>
              <Link to="/upload" className="hover:text-blue-600">
                Import Status
              </Link>
            </li>
          </ul>
        </div>

        {/* Documentation */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Docs</h3>
          <ul className="space-y-1 text-gray-600">
            <li>
              <a href="/docs/api" className="hover:text-blue-600">
                API Reference
              </a>
            </li>
            <li>
              <a href="/docs/setup" className="hover:text-blue-600">
                Setup Guide
              </a>
            </li>
            <li>
              <a href="/docs/faq" className="hover:text-blue-600">
                FAQs
              </a>
            </li>
            <li>
              <a href="/docs/assumptions" className="hover:text-blue-600">
                Assumptions
              </a>
            </li>
          </ul>
        </div>

        {/* Social + Contact */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Contact</h3>
          <p className="text-gray-600 mb-2">
            aamiraltd@gmail.com
            <br />
            +880-1234-567890
          </p>
          <div className="flex space-x-3 mt-2">
            <a href="#" className="text-gray-500 hover:text-blue-600">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-500 hover:text-blue-600">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-500 hover:text-blue-600">
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://github.com/yourusername"
              className="text-gray-500 hover:text-blue-600"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t pt-6 pb-4 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} Aamira Software Solutions. All rights
        reserved.
      </div>
    </footer>
  );
}
