"use client";

import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-semibold gradient-title mb-4">
              About DhanChakr
            </h3>
            <p className="text-gray-600 leading-relaxed">
              DhanChakr is your trusted platform to manage your finances
              efficiently. We provide powerful tools to help you take control of
              your financial journey.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold gradient-title mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                <a href="#features" className="hover:text-blue-600">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-blue-600">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#testimonials" className="hover:text-blue-600">
                  Testimonials
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-blue-600">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-semibold gradient-title mb-4">
              Follow Us
            </h3>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transform hover:scale-110 transition-transform duration-300"
              >
                <Facebook size={24} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transform hover:scale-110 transition-transform duration-300"
              >
                <Twitter size={24} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transform hover:scale-110 transition-transform duration-300"
              >
                <Instagram size={24} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transform hover:scale-110 transition-transform duration-300"
              >
                <Linkedin size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-12 border-t border-gray-200 pt-6 text-center text-gray-600">
          &copy; {new Date().getFullYear()} DhanChakr. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
