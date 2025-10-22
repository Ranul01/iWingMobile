import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import AccessoryVideo from "../components/AccessoryVideo";
import PhoneCard from "../components/PhoneCard";
import AccessoryCard from "../components/AccessoryCard";
import { getFeaturedPhones, getFeaturedAccessories } from "../utils/api";

const Home = () => {
  const [featuredPhones, setFeaturedPhones] = useState([]);
  const [featuredAccessories, setFeaturedAccessories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Phones carousel state
  const trackRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Accessories carousel state
  const accTrackRef = useRef(null);
  const [accCardWidth, setAccCardWidth] = useState(0);
  const [accIndex, setAccIndex] = useState(0);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const [phonesResponse, accessoriesResponse] = await Promise.all([
          getFeaturedPhones(8),
          getFeaturedAccessories(8),
        ]);

        setFeaturedPhones(phonesResponse.data || []);
        setFeaturedAccessories(accessoriesResponse.data || []);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // compute phone card width
  useEffect(() => {
    const computeWidth = () => {
      if (!trackRef.current) return;
      const first = trackRef.current.querySelector(".phone-card");
      if (!first) return setCardWidth(0);
      const w = first.getBoundingClientRect().width;
      const gap =
        parseFloat(window.getComputedStyle(trackRef.current).gap) || 0;
      setCardWidth(w + gap);
    };

    computeWidth();
    window.addEventListener("resize", computeWidth);
    return () => window.removeEventListener("resize", computeWidth);
  }, [featuredPhones]);

  // compute accessory card width
  useEffect(() => {
    const computeAccWidth = () => {
      if (!accTrackRef.current) return;
      const first = accTrackRef.current.querySelector(".accessory-card");
      if (!first) return setAccCardWidth(0);
      const w = first.getBoundingClientRect().width;
      const gap =
        parseFloat(window.getComputedStyle(accTrackRef.current).gap) || 0;
      setAccCardWidth(w + gap);
    };

    computeAccWidth();
    window.addEventListener("resize", computeAccWidth);
    return () => window.removeEventListener("resize", computeAccWidth);
  }, [featuredAccessories]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  const phones = featuredPhones || [];
  const accessories = featuredAccessories || [];
  const maxVisible = 4;

  // --- Phones handlers ---
  const displayPhones = phones.slice(0, Math.max(phones.length, 1));

  const handlePrev = () => {
    if (!trackRef.current) return;
    const newIndex = Math.max(0, currentIndex - 1);
    setCurrentIndex(newIndex);
    trackRef.current.scrollTo({
      left: newIndex * cardWidth,
      behavior: "smooth",
    });
  };

  const handleNext = () => {
    if (!trackRef.current) return;
    const visibleCount = Math.min(
      maxVisible,
      Math.max(1, Math.floor(trackRef.current.clientWidth / (cardWidth || 1)))
    );
    const maxIndex = Math.max(0, displayPhones.length - visibleCount);
    const newIndex = Math.min(maxIndex, currentIndex + 1);
    setCurrentIndex(newIndex);
    trackRef.current.scrollTo({
      left: newIndex * cardWidth,
      behavior: "smooth",
    });
  };

  // --- Accessories handlers ---
  const displayAccessories = accessories.slice(
    0,
    Math.max(accessories.length, 1)
  );

  const handlePrevAcc = () => {
    if (!accTrackRef.current) return;
    const newIndex = Math.max(0, accIndex - 1);
    setAccIndex(newIndex);
    accTrackRef.current.scrollTo({
      left: newIndex * accCardWidth,
      behavior: "smooth",
    });
  };

  const handleNextAcc = () => {
    if (!accTrackRef.current) return;
    const visibleCount = Math.min(
      maxVisible,
      Math.max(
        1,
        Math.floor(accTrackRef.current.clientWidth / (accCardWidth || 1))
      )
    );
    const maxIndex = Math.max(0, displayAccessories.length - visibleCount);
    const newIndex = Math.min(maxIndex, accIndex + 1);
    setAccIndex(newIndex);
    accTrackRef.current.scrollTo({
      left: newIndex * accCardWidth,
      behavior: "smooth",
    });
  };

  const handleWhatsAppClick = (message) => {
    const whatsappUrl = `https://wa.me/94707075121?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="bg-black text-white">
      {/* Hero Section */}
      <Hero />

      {/* Featured Phones - white background, cards with swipe buttons */}
      <section className="py-16 bg-white text-black relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">
                Featured Phones
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Handpicked selection of the latest phones
              </p>
            </div>

            {featuredPhones.length > 0 && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrev}
                  aria-label="Previous phones"
                  className="w-10 h-10 rounded-md bg-black text-yellow-400 hover:bg-gray-900 flex items-center justify-center shadow"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Next phones"
                  className="w-10 h-10 rounded-md bg-black text-yellow-400 hover:bg-gray-900 flex items-center justify-center shadow"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Phones Carousel track */}
          <div
            ref={trackRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
            style={{ scrollBehavior: "smooth", paddingBottom: 8 }}
          >
            {displayPhones.length > 0 ? (
              displayPhones.map((phone) => (
                <div
                  key={phone._id}
                  className="phone-card snap-start flex-shrink-0 w-11/12 sm:w-1/2 md:w-1/3 lg:w-1/4"
                >
                  <PhoneCard phone={phone} />
                </div>
              ))
            ) : (
              <div className="w-full text-center py-12">
                <p className="text-gray-600">No featured phones available</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Accessory Video Section */}
      <AccessoryVideo />

      {/* Premium Accessories - white carousel */}
      <section className="py-16 bg-white text-black relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">
                Premium Accessories
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Complete your mobile experience with our premium accessories
              </p>
            </div>

            {featuredAccessories.length > 0 && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrevAcc}
                  aria-label="Previous accessories"
                  className="w-10 h-10 rounded-md bg-black text-yellow-400 hover:bg-gray-900 flex items-center justify-center shadow"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={handleNextAcc}
                  aria-label="Next accessories"
                  className="w-10 h-10 rounded-md bg-black text-yellow-400 hover:bg-gray-900 flex items-center justify-center shadow"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Accessories Carousel track */}
          <div
            ref={accTrackRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
            style={{ scrollBehavior: "smooth", paddingBottom: 8 }}
          >
            {displayAccessories.length > 0 ? (
              displayAccessories.map((accessory) => (
                <div
                  key={accessory._id}
                  className="accessory-card snap-start flex-shrink-0 w-11/12 sm:w-1/2 md:w-1/3 lg:w-1/4"
                >
                  <AccessoryCard accessory={accessory} />
                </div>
              ))
            ) : (
              <div className="w-full text-center py-12">
                <p className="text-gray-600">No accessories available</p>
              </div>
            )}
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
            ].map((feature) => (
              <div
                key={feature.title}
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
            <button
              type="button"
              className="group border-2 border-gray-600 text-white px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:border-yellow-400 hover:bg-yellow-400/10"
              onClick={() =>
                handleWhatsAppClick("Hi, I would like to contact iWingMobile.")
              }
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
