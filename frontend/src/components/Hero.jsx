import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";

const Hero = () => {
  const heroRef = useRef(null);
  const titleWordsRef = useRef([]);
  const highlightRef = useRef(null);
  const paragraphRef = useRef(null);
  const buttonsRef = useRef(null);
  const featureCardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(titleWordsRef.current, { opacity: 0, y: 50 });
      gsap.set(highlightRef.current, { opacity: 0, scale: 0.8, y: 30 });
      gsap.set(paragraphRef.current, { opacity: 0, y: 30 });
      gsap.set(buttonsRef.current, { opacity: 0, y: 40 });
      gsap.set(featureCardsRef.current, {
        opacity: 0,
        scale: 0.8,
        rotation: 5,
      });

      // Create timeline for sequential animations
      const tl = gsap.timeline({ delay: 0.5 });

      // Animate each word one by one
      tl.to(titleWordsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: "power2.out",
      })
        // Then animate the highlighted text with a bounce effect
        .to(
          highlightRef.current,
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            ease: "back.out(1.7)",
          },
          "-=0.3"
        )
        // Animate paragraph
        .to(
          paragraphRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.4"
        )
        // Animate buttons
        .to(
          buttonsRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.3"
        )
        // Animate feature cards with stagger
        .to(
          featureCardsRef.current,
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: "back.out(1.2)",
          },
          "-=0.5"
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Split text into individual words for animation
  const renderAnimatedWords = (text) => {
    return text.split(" ").map((word, index) => (
      <span
        key={index}
        ref={(el) => (titleWordsRef.current[index] = el)}
        className="inline-block mr-3"
      >
        {word}
      </span>
    ));
  };

  return (
    <div
      ref={heroRef}
      className="bg-gradient-to-r from-black to-gray-900 text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              {renderAnimatedWords("Your Ultimate")}
              <span ref={highlightRef} className="block text-yellow-400 mt-2">
                Mobile Destination
              </span>
            </h1>
            <p ref={paragraphRef} className="text-xl text-gray-300 max-w-md">
              Discover the latest smartphones and accessories at unbeatable
              prices. Quality products, fast shipping, and exceptional customer
              service.
            </p>
            <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/phones"
                className="bg-yellow-400 text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-500 transition-colors text-center"
              >
                Shop Phones
              </Link>
              <Link
                to="/accessories"
                className="border-2 border-yellow-400 text-yellow-400 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-400 hover:text-black transition-colors text-center"
              >
                Shop Accessories
              </Link>
            </div>
          </div>

          {/* Right Content - Feature Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Feature Card 1 */}
            <div
              ref={(el) => (featureCardsRef.current[0] = el)}
              className="bg-yellow-400 bg-opacity-10 backdrop-blur-lg border border-yellow-400 border-opacity-20 rounded-xl p-6 text-center"
            >
              <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-black"
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
              <h3 className="font-semibold mb-2">Latest Models</h3>
              <p className="text-sm text-gray-300">
                Premium smartphones from top brands
              </p>
            </div>

            {/* Feature Card 2 */}
            <div
              ref={(el) => (featureCardsRef.current[1] = el)}
              className="bg-yellow-400 bg-opacity-10 backdrop-blur-lg border border-yellow-400 border-opacity-20 rounded-xl p-6 text-center"
            >
              <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Warranty</h3>
              <p className="text-sm text-gray-300">
                1 year warranty on all devices
              </p>
            </div>

            {/* Feature Card 3 */}
            <div
              ref={(el) => (featureCardsRef.current[2] = el)}
              className="bg-yellow-400 bg-opacity-10 backdrop-blur-lg border border-yellow-400 border-opacity-20 rounded-xl p-6 text-center"
            >
              <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Fast Delivery</h3>
              <p className="text-sm text-gray-300">
                Free shipping on orders over $100
              </p>
            </div>

            {/* Feature Card 4 */}
            <div
              ref={(el) => (featureCardsRef.current[3] = el)}
              className="bg-yellow-400 bg-opacity-10 backdrop-blur-lg border border-yellow-400 border-opacity-20 rounded-xl p-6 text-center"
            >
              <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">24/7 Support</h3>
              <p className="text-sm text-gray-300">
                Expert customer service team
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Bottom */}
      <div className="relative">
        <svg
          className="w-full h-12 text-white"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  );
};

export default Hero;
