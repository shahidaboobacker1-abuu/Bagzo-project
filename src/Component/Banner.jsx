import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Banner = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Slides data array - Full image banner slides
  const slides = [
    {
      id: 1,
      title: "Sleek",
      subtitle: "Premium Bags & Accessories",
      description: "Why settle for just one when you can enjoy all three? Bagzo Days is here with the season's most-loved bags from elegant totes to compact crossbodies.",
      image: "/assets/big image6.webp"  // Direct path from public folder
    },
    {
      id: 2,
      title: "Luxury",
      subtitle: "Handcrafted Excellence",
      description: "Experience luxury with our handcrafted leather collection. Each bag is made from premium materials with attention to detail.",
      image: "/assets/kikk.webp"  // Direct path from public folder
    },
    {
      id: 3,
      title: "Minimalist",
      subtitle: "Clean & Functional Design",
      description: "Discover our minimalist bag collection featuring clean lines and practical functionality for the modern individual.",
      image: "/assets/banner image.webp"  // Direct path from public folder
    },
    {
      id: 4,
      title: "Modern",
      subtitle: "Contemporary Styles",
      description: "Explore our modern collection with contemporary designs that blend style and functionality.",
      image: "/assets/gierl image.webp"  // Direct path from public folder
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  // Auto-slide functionality - 3 seconds interval
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 2500);
    
    return () => clearInterval(interval);
  }, [slides.length]);

  const currentSlideData = slides[currentSlide];

  return (
    <div className="relative bg-[#FEFCF5] min-h-screen"> {/* Changed to lighter background */}
      {/* Main Content Container with separate spaces */}
      <div className="pt-0">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12">
          {/* Text Section - Top part with spacing */}
          <div className="mb-8 md:mb-12 lg:mb-16">
            <div className="text-center max-w-3xl mx-auto">
              {/* Subtitle */}
              <div className="mb-4">
                <span className="text-[#AF8F6F] text-sm md:text-base font-light tracking-wider uppercase">
                  {currentSlideData.subtitle}
                </span>
              </div>
              
              {/* Main Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-light mb-4 md:mb-6 leading-tight text-[#2C1810] tracking-wide">
                {currentSlideData.title}
              </h1>
              
              {/* Description */}
              <p className="text-base md:text-lg lg:text-xl text-[#5A4738] leading-relaxed font-light">
                {currentSlideData.description}
              </p>
            </div>
          </div>

          {/* Image Section - Bottom part with spacing */}
          <div className="relative h-[300px] md:h-[350px] lg:h-[400px] overflow-hidden rounded-lg shadow-xl border border-[#E8E1D0]"> {/* Lighter border */}
            {/* Background Image */}
            <div className="absolute inset-0 transition-all duration-1000">
              <img 
                src={currentSlideData.image} 
                alt={currentSlideData.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('Failed to load banner image:', currentSlideData.image);
                  e.target.style.display = 'none';
                }}
              />
              {/* Lighter Overlay for better image contrast */}
              <div className="absolute inset-0 bg-[#2C1810]/5"></div> {/* Lighter overlay */}
            </div>
            
            {/* Image container - no overlay text */}
          </div>

          {/* Removed Slide Indicators (dots) */}
          
        </div>
      </div>
    </div>
  );
};

export default Banner;