import React from 'react';
import { useNavigate } from 'react-router-dom';

function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8F4E1]">
      {/* Navigation Bar - Matching Navbar theme */}
      <nav className="bg-[#5c4024] shadow-sm py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div 
            className="text-2xl font-light tracking-wide cursor-pointer text-[#F8F4E1]"
            onClick={() => navigate('/')}
          >
            BAG COLLECTION
          </div>
          <div className="flex space-x-6">
            <button 
              onClick={() => navigate('/product')}
              className="text-sm hover:text-[#AF8F6F] transition-colors text-[#F8F4E1] font-light"
            >
              Collections
            </button>
            <button className="text-sm font-light text-[#AF8F6F] transition-colors">
              About
            </button>
            <button 
              onClick={() => navigate('/contact')}
              className="text-sm hover:text-[#AF8F6F] transition-colors text-[#F8F4E1] font-light"
            >
              Contact
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-[#2C1810] text-[#F8F4E1] py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-light mb-6 tracking-wide">ABOUT BAGZO</h1>
          <div className="w-24 h-0.5 bg-[#AF8F6F] mx-auto mb-8"></div>
          <p className="text-xl text-[#E8DFD0] max-w-3xl mx-auto font-light leading-relaxed">
            Crafting timeless pieces that blend elegance with functionality. 
            Discover the story behind our passion for exceptional bags.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-light text-[#2C1810] mb-8 tracking-wide">OUR STORY</h2>
              <div className="space-y-6">
                <p className="text-lg text-[#5A4738] leading-relaxed font-light">
                  Founded with a vision to revolutionize the way people carry their essentials, 
                  BagZo emerged from a simple belief: every bag should be a perfect blend of style, 
                  durability, and functionality.
                </p>
                <p className="text-lg text-[#5A4738] leading-relaxed font-light">
                  Our journey began in a small workshop where craftsmanship met innovation. 
                  Today, we continue to honor those roots while embracing modern design and 
                  sustainable practices.
                </p>
              </div>
              
              {/* Stats Section */}
              <div className="mt-12 flex flex-wrap gap-8">
                <div className="text-center">
                  <div className="text-4xl font-light text-[#AF8F6F] mb-2">3+</div>
                  <div className="text-sm text-[#5A4738] font-light tracking-wide">YEARS EXPERIENCE</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-light text-[#AF8F6F] mb-2">2K+</div>
                  <div className="text-sm text-[#5A4738] font-light tracking-wide">HAPPY CUSTOMERS</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-light text-[#AF8F6F] mb-2">20+</div>
                  <div className="text-sm text-[#5A4738] font-light tracking-wide">UNIQUE DESIGNS</div>
                </div>
              </div>
            </div>
            
            {/* Workshop Image */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#E0D6C2]">
              <img
                src="src/assets/store imae.jpg"
                alt="Our Workshop"
                className="w-full h-80 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = '/public/assets/store imae.jpg';
                }}
              />
              <div className="mt-6 pt-6 border-t border-[#E0D6C2]">
                <p className="text-sm text-[#5A4738] font-light italic text-center">
                  "Where craftsmanship meets innovation in every stitch"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white py-20 border-t border-[#E0D6C2]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-[#2C1810] mb-4 tracking-wide">OUR VALUES</h2>
            <div className="w-24 h-0.5 bg-[#AF8F6F] mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Quality Craftsmanship */}
            <div className="bg-[#F8F4E1] text-center p-8 rounded-2xl border border-[#E0D6C2] hover:border-[#AF8F6F] transition-all duration-300 hover:shadow-xl">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#E0D6C2]">
                <svg className="w-8 h-8 text-[#AF8F6F]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <h3 className="text-xl font-light text-[#2C1810] mb-4 tracking-wide">QUALITY CRAFTSMANSHIP</h3>
              <p className="text-[#5A4738] font-light leading-relaxed">
                Every stitch, every detail matters. We take pride in delivering products 
                that stand the test of time.
              </p>
            </div>

            {/* Sustainable Materials */}
            <div className="bg-[#F8F4E1] text-center p-8 rounded-2xl border border-[#E0D6C2] hover:border-[#AF8F6F] transition-all duration-300 hover:shadow-xl">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#E0D6C2]">
                <svg className="w-8 h-8 text-[#AF8F6F]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h3 className="text-xl font-light text-[#2C1810] mb-4 tracking-wide">SUSTAINABLE MATERIALS</h3>
              <p className="text-[#5A4738] font-light leading-relaxed">
                We're committed to using eco-friendly materials and ethical production practices.
              </p>
            </div>

            {/* Customer First */}
            <div className="bg-[#F8F4E1] text-center p-8 rounded-2xl border border-[#E0D6C2] hover:border-[#AF8F6F] transition-all duration-300 hover:shadow-xl">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#E0D6C2]">
                <svg className="w-8 h-8 text-[#AF8F6F]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <h3 className="text-xl font-light text-[#2C1810] mb-4 tracking-wide">CUSTOMER FIRST</h3>
              <p className="text-[#5A4738] font-light leading-relaxed">
                Your satisfaction is our priority. We're here to ensure you love your BagZo experience.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="py-20 px-4 bg-[#2C1810]">
        <div className="max-w-4xl mx-auto text-center">
          <svg className="w-16 h-16 text-[#AF8F6F] mx-auto mb-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <h3 className="text-3xl font-light text-[#F8F4E1] mb-8 tracking-wide">OUR MISSION</h3>
          <p className="text-xl text-[#E8DFD0] font-light leading-relaxed italic">
            "To create luxury accessories that not only complement your style but also 
            enhance your daily life through exceptional craftsmanship, sustainable practices, 
            and timeless design."
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;