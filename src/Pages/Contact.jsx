import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Contact() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => setSubmitStatus(''), 5000);
    }, 2000);
  };

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
            <button 
              onClick={() => navigate('/about')}
              className="text-sm hover:text-[#AF8F6F] transition-colors text-[#F8F4E1] font-light"
            >
              About
            </button>
            <button className="text-sm font-light text-[#AF8F6F] transition-colors">
              Contact
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-[#2C1810] text-[#F8F4E1] py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-light mb-6 tracking-wide">GET IN TOUCH</h1>
          <div className="w-24 h-0.5 bg-[#AF8F6F] mx-auto mb-8"></div>
          <p className="text-xl text-[#E8DFD0] max-w-3xl mx-auto font-light leading-relaxed">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-xl p-10 border border-[#E0D6C2]">
              <h2 className="text-3xl font-light text-[#2C1810] mb-8 tracking-wide">SEND US A MESSAGE</h2>
              
              {submitStatus === 'success' && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg mb-8 text-center">
                  Thank you for your message! We'll get back to you soon.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label htmlFor="name" className="block text-sm font-light text-[#5A4738] mb-3 tracking-wide">
                      FULL NAME *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 border border-[#E0D6C2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AF8F6F] focus:border-[#AF8F6F] bg-white text-[#2C1810] placeholder-[#AF8F6F]/50 transition-all duration-300"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-light text-[#5A4738] mb-3 tracking-wide">
                      EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 border border-[#E0D6C2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AF8F6F] focus:border-[#AF8F6F] bg-white text-[#2C1810] placeholder-[#AF8F6F]/50 transition-all duration-300"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-light text-[#5A4738] mb-3 tracking-wide">
                    SUBJECT *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 border border-[#E0D6C2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AF8F6F] focus:border-[#AF8F6F] bg-white text-[#2C1810] placeholder-[#AF8F6F]/50 transition-all duration-300"
                    placeholder="What is this regarding?"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-light text-[#5A4738] mb-3 tracking-wide">
                    MESSAGE *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-6 py-4 border border-[#E0D6C2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AF8F6F] focus:border-[#AF8F6F] bg-white text-[#2C1810] placeholder-[#AF8F6F]/50 transition-all duration-300 resize-vertical"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#2C1810] hover:bg-[#AF8F6F] text-white font-light py-4 px-8 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 shadow-lg hover:shadow-xl tracking-wide text-lg"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      SENDING MESSAGE...
                    </span>
                  ) : (
                    'SEND MESSAGE'
                  )}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-12">
              <div>
                <h2 className="text-3xl font-light text-[#2C1810] mb-8 tracking-wide">CONTACT INFORMATION</h2>
                <p className="text-[#5A4738] mb-8 text-lg font-light leading-relaxed">
                  Have questions about our products or need assistance with your order? 
                  We're here to help! Reach out through any of the channels below.
                </p>
              </div>

              <div className="space-y-10">
                {/* Location */}
                <div className="flex items-start space-x-6">
                  <div className="bg-white w-14 h-14 rounded-full flex items-center justify-center shrink-0 border border-[#E0D6C2]">
                    <svg className="w-7 h-7 text-[#AF8F6F]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-light text-[#2C1810] mb-3 tracking-wide">OUR LOCATION</h3>
                    <p className="text-[#5A4738] font-light">Banglore Vijayanagera 7th Cross</p>
                    <p className="text-[#5A4738] font-light">Bangalore, Karnataka 560040</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-6">
                  <div className="bg-white w-14 h-14 rounded-full flex items-center justify-center shrink-0 border border-[#E0D6C2]">
                    <svg className="w-7 h-7 text-[#AF8F6F]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-light text-[#2C1810] mb-3 tracking-wide">EMAIL US</h3>
                    <p className="text-[#5A4738] font-light">bagzos@gmail.com</p>
                    <p className="text-[#5A4738] font-light">support@bagzo.com</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-6">
                  <div className="bg-white w-14 h-14 rounded-full flex items-center justify-center shrink-0 border border-[#E0D6C2]">
                    <svg className="w-7 h-7 text-[#AF8F6F]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-light text-[#2C1810] mb-3 tracking-wide">CALL US</h3>
                    <p className="text-[#5A4738] font-light">+1 (555) 123-4567</p>
                    <p className="text-[#5A4738] font-light">+91 97466 87046</p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start space-x-6">
                  <div className="bg-white w-14 h-14 rounded-full flex items-center justify-center shrink-0 border border-[#E0D6C2]">
                    <svg className="w-7 h-7 text-[#AF8F6F]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-light text-[#2C1810] mb-3 tracking-wide">BUSINESS HOURS</h3>
                    <p className="text-[#5A4738] font-light">Monday - Friday: 10:00 AM - 10:00 PM</p>
                    <p className="text-[#5A4738] font-light">Saturday: 9:00 AM - 6:00 PM</p>
                    <p className="text-[#5A4738] font-light">Sunday: Opend</p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="pt-8 border-t border-[#E0D6C2]">
                <h3 className="text-xl font-light text-[#2C1810] mb-6 tracking-wide">FOLLOW US</h3>
                <div className="flex space-x-6">
                  <a 
                    href="https://wa.me/+919746687046" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white border border-[#E0D6C2] hover:bg-[#AF8F6F] hover:border-[#AF8F6F] text-[#2C1810] hover:text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893-.001-3.189-1.262-6.187-3.55-8.444"/>
                    </svg>
                  </a>
                  <a 
                    href="https://instagram.com/abushahi_" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white border border-[#E0D6C2] hover:bg-[#AF8F6F] hover:border-[#AF8F6F] text-[#2C1810] hover:text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;