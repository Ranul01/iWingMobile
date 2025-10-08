import React, { useRef, useLayoutEffect, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import accessoryVideo from "../video/accessory_video.mp4";

gsap.registerPlugin(ScrollTrigger);

const AccessoryVideo = () => {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const wordsRef = useRef([]);
  const highlightRef = useRef(null);
  const paragraphRef = useRef(null);
  const animatedOnceRef = useRef(false);

  const renderWords = (text) =>
    text.split(" ").map((w, i) => (
      <span
        key={`${w}-${i}`}
        ref={(el) => {
          if (el) wordsRef.current[i] = el;
        }}
        className="inline-block mr-3"
      >
        {w}
      </span>
    ));

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    // Prevent duplicate (StrictMode / fast remount) runs
    if (animatedOnceRef.current) {
      // Ensure visible if animation skipped
      gsap.set([wordsRef.current, highlightRef.current, paragraphRef.current], {
        clearProps: "all",
      });
      return;
    }
    animatedOnceRef.current = true;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      tl.from(wordsRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.55,
        stagger: 0.15,
        ease: "power2.out",
        immediateRender: false,
      })
        .from(
          highlightRef.current,
          {
            opacity: 0,
            y: 30,
            scale: 0.85,
            duration: 0.6,
            ease: "back.out(1.6)",
            immediateRender: false,
          },
          "-=0.35"
        )
        .from(
          paragraphRef.current,
          {
            opacity: 0,
            y: 30,
            duration: 0.55,
            ease: "power2.out",
            immediateRender: false,
          },
          "-=0.4"
        );

      const video = videoRef.current;
      if (video) {
        gsap.to(video, {
          scale: 1.08,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, section);

    // Refresh after layout to ensure correct measurements
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => ctx.revert();
  }, []);

  // Intersection-based play/pause (independent of GSAP state)
  // Extracted observer callback to reduce nesting
  const handleIntersection = (entries) => {
    entries.forEach((entry) => {
      const currentVideo = videoRef.current;
      if (!currentVideo) return;

      if (entry.isIntersecting) {
        currentVideo.play().catch((error) => {
          // Silently handle autoplay policy errors
          console.debug("Video autoplay prevented:", error);
        });
      } else {
        currentVideo.pause();
      }
    });
  };

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;

    if (!section || !video) return;

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.15,
    });

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          loop
          muted
          playsInline
          autoPlay
          preload="auto"
          className="w-full h-full object-cover will-change-transform"
          onError={(e) => {
            console.error("Video error:", e);
          }}
        >
          <source src={accessoryVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-28 min-h-screen flex items-center">
        <div className="w-full text-center space-y-10">
          <h2 className="text-4xl md:text-6xl font-bold leading-tight text-white">
            {renderWords("Elevate Your")}
            <span ref={highlightRef} className="block text-yellow-400 mt-4">
              Mobile Experience
            </span>
          </h2>
          <p
            ref={paragraphRef}
            className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto"
          >
            Discover premium accessories designed to complement your device and
            enhance your lifestyle
          </p>
        </div>
      </div>

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
    </section>
  );
};

export default AccessoryVideo;
