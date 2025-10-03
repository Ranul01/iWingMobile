import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import PhoneCard from "../components/PhoneCard";
import AccessoryCard from "../components/AccessoryCard";
import { getFeaturedPhones, getFeaturedAccessories } from "../utils/api";

const Home = () => {
  const [featuredPhones, setFeaturedPhones] = useState([]);
  const [featuredAccessories, setFeaturedAccessories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const [phonesResponse, accessoriesResponse] = await Promise.all([
          getFeaturedPhones(4),
          getFeaturedAccessories(4),
        ]);

        setFeaturedPhones(phonesResponse.data || []);
        setFeaturedAccessories(accessoriesResponse.data || []);
      } catch (error) {
        console.error("Error fetching featured products:", error);
        setError("Failed to load featured products");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white">
      {/* Hero Section */}
      <Hero />

      {/* Main Hero Banner */}
      {/* <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-yellow-400 via-purple-500 to-blue-500 bg-clip-text text-transparent">
            iWingMobile
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Experience the future of mobile technology with our premium
            collection of Apple products and accessories
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/phones"
              className="group relative overflow-hidden bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-400/25"
            >
              <span className="relative z-10">Explore Phones</span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link
              to="/accessories"
              className="group border-2 border-white/20 text-white px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:border-yellow-400 hover:bg-yellow-400/10"
            >
              Shop Accessories
            </Link>
          </div>
        </div>

        {/* Floating Elements */}
      {/* <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-10 animate-pulse delay-1000"></div>
      </section> */}

      {/* Featured Products Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/50 to-black"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Featured Phones */}
          <div className="mb-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Featured Phones
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-purple-500 mx-auto mb-6"></div>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Discover our handpicked selection of the latest iPhones
              </p>
            </div>

            {error ? (
              <div className="text-center py-12">
                <div className="bg-red-900/20 border border-red-500/50 text-red-400 px-6 py-4 rounded-lg mb-6 max-w-md mx-auto">
                  {error}
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-yellow-400 text-black px-8 py-3 rounded-full font-bold hover:bg-yellow-500 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredPhones.length > 0 ? (
                  featuredPhones.map((phone, index) => (
                    <div
                      key={phone._id}
                      className="transform transition-all duration-500 hover:scale-105"
                      style={{ animationDelay: `${index * 200}ms` }}
                    >
                      <PhoneCard phone={phone} />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-lg">
                      No featured phones available
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Featured Accessories */}
          <div>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Premium Accessories
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mb-6"></div>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Complete your mobile experience with our premium accessories
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredAccessories.length > 0 ? (
                featuredAccessories.map((accessory, index) => (
                  <div
                    key={accessory._id}
                    className="transform transition-all duration-500 hover:scale-105"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <AccessoryCard accessory={accessory} />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1v9a2 2 0 01-2 2H6a2 2 0 01-2-2V7a1 1 0 01-1-1V5a1 1 0 011-1h4z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg">
                    No featured accessories available
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 via-black to-blue-900/10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Why Choose Us?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-purple-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              We're committed to providing the best mobile shopping experience
              with unmatched quality and service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: "M5 13l4 4L19 7",
                title: "Quality Guaranteed",
                description:
                  "All our products are authentic and come with manufacturer warranty. We stand behind every product we sell.",
              },
              {
                icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1",
                title: "Best Prices",
                description:
                  "Competitive pricing with regular discounts and special offers. Get the best value for your money.",
              },
              {
                icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364",
                title: "Expert Support",
                description:
                  "Our knowledgeable team is here to help you find the perfect device and provide ongoing support.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group text-center p-8 rounded-2xl bg-gradient-to-b from-gray-900/50 to-black border border-gray-800 hover:border-yellow-400/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg group-hover:shadow-yellow-400/25 transition-all duration-300">
                  <svg
                    className="w-10 h-10 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={feature.icon}
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-yellow-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 via-purple-500/5 to-blue-500/5"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-yellow-400 via-purple-500 to-blue-500 bg-clip-text text-transparent">
            Ready to Upgrade?
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust iWingMobile for
            their mobile needs
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/phones"
              className="group relative overflow-hidden bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-400/25"
            >
              <span className="relative z-10">Browse Phones</span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link
              to="/contact"
              className="group border-2 border-gray-600 text-white px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:border-yellow-400 hover:bg-yellow-400/10"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
