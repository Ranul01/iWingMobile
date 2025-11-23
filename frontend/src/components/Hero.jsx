import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import heroVideo from "../video/hero-video.mp4";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef(null);
  const videoRef = useRef(null);
  const titleWordsRef = useRef([]);
  const highlightRef = useRef(null);
  const paragraphRef = useRef(null);
  const buttonsRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Extracted handlers to avoid deep nesting
  const handleVideoPlay = (video) => {
    if (video) video.play().catch(() => {});
  };

  const handleVideoPause = (video) => {
    if (video) video.pause();
  };

  useEffect(() => {
    // Capture refs at the start of the effect
    const hero = heroRef.current;
    const video = videoRef.current;
    const highlight = highlightRef.current;
    const paragraph = paragraphRef.current;
    const buttons = buttonsRef.current;
    const titleWords = titleWordsRef.current.filter(Boolean); // Filter out null/undefined

    if (!hero) return;

    const ctx = gsap.context(() => {
      // Only set initial states for elements that exist
      if (titleWords.length > 0) {
        gsap.set(titleWords, { opacity: 0, y: 50 });
      }
      if (highlight) {
        gsap.set(highlight, { opacity: 0, scale: 0.8, y: 30 });
      }
      if (paragraph) {
        gsap.set(paragraph, { opacity: 0, y: 30 });
      }
      if (buttons) {
        gsap.set(buttons, { opacity: 0, y: 40 });
      }

      const tl = gsap.timeline({ delay: 0.5 });

      // Only animate elements that exist
      if (titleWords.length > 0) {
        tl.to(titleWords, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.2,
          ease: "power2.out",
        });
      }

      if (highlight) {
        tl.to(
          highlight,
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            ease: "back.out(1.7)",
          },
          titleWords.length > 0 ? "-=0.3" : 0
        );
      }

      if (paragraph) {
        tl.to(
          paragraph,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.4"
        );
      }

      if (buttons) {
        tl.to(
          buttons,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.3"
        );
      }

      // Video animations only if video exists and is loaded
      if (video && videoLoaded) {
        ScrollTrigger.create({
          trigger: hero,
          start: "top center",
          end: "bottom center",
          onEnter: () => handleVideoPlay(video),
          onLeave: () => handleVideoPause(video),
          onEnterBack: () => handleVideoPlay(video),
          onLeaveBack: () => handleVideoPause(video),
        });

        gsap.to(video, {
          scale: 1.1,
          scrollTrigger: {
            trigger: hero,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }
    }, hero);

    return () => {
      ctx.revert();
    };
  }, [videoLoaded]);

  const handleVideoLoad = () => setVideoLoaded(true);

  const renderAnimatedWords = (text) =>
    text.split(" ").map((word, i) => (
      <span
        key={`${word}-${i}`}
        ref={(el) => {
          if (el) titleWordsRef.current[i] = el;
        }}
        className="inline-block mr-3"
      >
        {word}
      </span>
    ));

  return (
    <div ref={heroRef} className="relative min-h-screen overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full">
        <video
          ref={videoRef}
          loop
          muted
          playsInline
          autoPlay
          preload="auto"
          onLoadedData={handleVideoLoad}
          onError={(e) => {
            console.debug("Video load error:", e);
          }}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={heroVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-28 min-h-screen flex items-center">
        <div className="w-full text-center space-y-10">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white">
            {renderAnimatedWords("iWingMobile")}
            <span ref={highlightRef} className="block text-yellow-400 mt-4">
              Your Ultimate Mobile Destination
            </span>
          </h1>
          <p
            ref={paragraphRef}
            className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto"
          >
            Discover the latest smartphones and accessories at unbeatable
            prices. Quality products, fast shipping, and exceptional customer
            service.
          </p>

          {/* Uncomment if you want to add buttons back */}
          {/* 
          <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-yellow-400 text-black px-8 py-3 rounded-full font-bold text-lg hover:bg-yellow-500 transition-colors">
              Shop Now
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-white hover:text-black transition-colors">
              Learn More
            </button>
          </div>
          */}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="animate-bounce">
          <svg
            className="w-6 h-6 text-yellow-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Hero;
