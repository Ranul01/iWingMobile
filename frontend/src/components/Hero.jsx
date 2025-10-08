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

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(titleWordsRef.current, { opacity: 0, y: 50 });
      gsap.set(highlightRef.current, { opacity: 0, scale: 0.8, y: 30 });
      gsap.set(paragraphRef.current, { opacity: 0, y: 30 });
      gsap.set(buttonsRef?.current, { opacity: 0, y: 40 });

      const tl = gsap.timeline({ delay: 0.5 });

      tl.to(titleWordsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: "power2.out",
      })
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
        .to(
          buttonsRef?.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.3"
        );

      if (videoRef.current && videoLoaded) {
        ScrollTrigger.create({
          trigger: heroRef.current,
          start: "top center",
          end: "bottom center",
          onEnter: () => videoRef.current?.play(),
          onLeave: () => videoRef.current?.pause(),
          onEnterBack: () => videoRef.current?.play(),
          onLeaveBack: () => videoRef.current?.pause(),
        });

        gsap.to(videoRef.current, {
          scale: 1.1,
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }
    }, heroRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [videoLoaded]);

  const handleVideoLoad = () => setVideoLoaded(true);

  const renderAnimatedWords = (text) =>
    text.split(" ").map((word, i) => (
      <span
        key={i}
        ref={(el) => (titleWordsRef.current[i] = el)}
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
          preload="metadata"
          onLoadedData={handleVideoLoad}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={heroVideo} type="video/mp4" />
          {/* Optional additional format */}
          {/* <source src="/video/hero-video.webm" type="video/webm" /> */}
          Your browser does not support the video tag.
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
      </div>

      {/* Content (single column now) */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-28 min-h-screen flex items-center">
        <div className="w-full text-center space-y-10">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            {renderAnimatedWords("Your Ultimate")}
            <span ref={highlightRef} className="block text-yellow-400 mt-4">
              Mobile Destination
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

          {/* If you re-enable buttons later, wrap them with ref={buttonsRef} */}
          {/* <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center">
            ...
          </div> */}
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
