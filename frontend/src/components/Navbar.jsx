import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
// import { useCart } from "../context/CartContex";
import Cart from "./Cart";

const Navbar = () => {
  const location = useLocation();
  // const { itemCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActiveRoute = (path) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/phones", label: "Phones" },
    { path: "/accessories", label: "Accessories" },
  ];

  return (
    <>
      <nav className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-2 flex-shrink-0 group"
            >
              <div className="w-9 h-9 bg-yellow-400 rounded-lg flex items-center justify-center shadow-md shadow-yellow-400/20 transition-transform group-hover:scale-105">
                <span className="text-black font-extrabold text-lg">iW</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                iWingMobile
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => {
                const active = isActiveRoute(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      active
                        ? "text-yellow-400"
                        : "text-gray-300 hover:text-yellow-400 hover:bg-yellow-400/10"
                    }`}
                  >
                    {link.label}
                    {active && (
                      <span className="absolute left-1/2 -bottom-1 h-[2px] w-6 -translate-x-1/2 bg-yellow-400 rounded-full"></span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Side: Cart + Mobile Menu */}
            <div className="flex items-center space-x-2">
              {/* Cart Button */}
              {/* <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-300 hover:text-yellow-400 transition-colors hover:bg-yellow-400/10 rounded-md"
                aria-label="Open cart"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5-5M7 13l-2.5 5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                  />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </button> */}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-300 hover:text-yellow-400 transition-colors hover:bg-yellow-400/10 rounded-md"
                aria-label="Toggle menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-800 bg-black/95">
              <div className="flex flex-col space-y-2">
                {navLinks.map((link) => {
                  const active = isActiveRoute(link.path);
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        active
                          ? "text-yellow-400 bg-yellow-400/10"
                          : "text-gray-300 hover:text-yellow-400 hover:bg-yellow-400/10"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Cart Sidebar */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
