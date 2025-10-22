import React from "react";
import { Link } from "react-router-dom";
import { FaTiktok, FaInstagram, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleWhatsAppClick = (message) => {
    const whatsappUrl = `https://wa.me/94707075121?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-lg">iW</span>
              </div>
              <span className="text-xl font-bold">iWingMobile</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Your trusted destination for the latest mobile phones and
              accessories. Quality products, competitive prices, and exceptional
              customer service.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.tiktok.com/@iwing.mobile?_t=ZS-90T6yFn58SO&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-yellow-400 transition-colors"
                aria-label="Follow us on TikTok"
              >
                <FaTiktok className="w-6 h-6" />
              </a>
              <a
                href="https://www.instagram.com/iwing_mobile.official_?igsh=N3pxdmFxbm96bjh4&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-yellow-400 transition-colors"
                aria-label="Follow us on Instagram"
              >
                <FaInstagram className="w-6 h-6" />
              </a>
              <a
                href="https://maps.app.goo.gl/TQVx8gK13RQk2zsBA?g_st=ipc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-yellow-400 transition-colors"
                aria-label="Visit our store location"
              >
                <FaMapMarkerAlt className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-yellow-400">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/phones"
                  className="text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  Phones
                </Link>
              </li>
              <li>
                <Link
                  to="/accessories"
                  className="text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  Accessories
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  className="text-gray-300 hover:text-yellow-400 transition-colors text-left"
                  onClick={() =>
                    handleWhatsAppClick(
                      "Hi, I would like to know more about iWingMobile."
                    )
                  }
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="text-gray-300 hover:text-yellow-400 transition-colors text-left"
                  onClick={() =>
                    handleWhatsAppClick(
                      "Hi, I would like to contact iWingMobile."
                    )
                  }
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-yellow-400">
              Customer Service
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  className="text-gray-300 hover:text-yellow-400 transition-colors text-left"
                  onClick={() =>
                    handleWhatsAppClick(
                      "Hi, I need help with a product/service."
                    )
                  }
                >
                  Help Center
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="text-gray-300 hover:text-yellow-400 transition-colors text-left"
                  onClick={() =>
                    handleWhatsAppClick(
                      "Hi, I would like to know about shipping information."
                    )
                  }
                >
                  Shipping Info
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="text-gray-300 hover:text-yellow-400 transition-colors text-left"
                  onClick={() =>
                    handleWhatsAppClick(
                      "Hi, I would like to inquire about returns."
                    )
                  }
                >
                  Returns
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="text-gray-300 hover:text-yellow-400 transition-colors text-left"
                  onClick={() =>
                    handleWhatsAppClick(
                      "Hi, I would like to know about warranty information."
                    )
                  }
                >
                  Warranty
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="text-gray-300 hover:text-yellow-400 transition-colors text-left"
                  onClick={() =>
                    handleWhatsAppClick(
                      "Hi, I would like to know about your privacy policy."
                    )
                  }
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">
            © {currentYear} Fianto Solutions. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
