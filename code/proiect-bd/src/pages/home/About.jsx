import React from "react";
import "tailwindcss/tailwind.css"; // Ensure TailwindCSS is loaded

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Section */}
      <section className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2">
            <h1 className="text-4xl font-bold mb-4">About Us</h1>
            <p className="text-gray-700 leading-relaxed mb-6">
              Welcome to Clinica, your trusted partner in managing your healthcare needs conveniently and efficiently.
              At Clinica, we understand the challenges individuals face when it comes to scheduling doctor appointments
              and managing their health records.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Clinica is committed to excellence in healthcare technology. We continuously strive to enhance our platform,
              integrating the latest advancements to improve user experience and deliver superior service. Whether you're
              booking your first appointment or managing ongoing care, Clinica is here to support you every step of the way.
            </p>
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p className="text-gray-700 leading-relaxed">
              Our vision at Clinica is to create a seamless healthcare experience for every user. We aim to bridge the gap
              between patients and healthcare providers, making it easier for you to access the care you need, when you need it.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center mt-6 md:mt-0">
            <img
              src="/assets/about_image.png"
              alt="Doctors"
              className="w-full max-w-md rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:bg-blue-600 hover:text-white">
              <h3 className="text-xl font-bold mb-2">Efficiency</h3>
              <p className="text-gray-700 hover:text-white">
                Streamlined appointment scheduling that fits into your busy lifestyle.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:bg-blue-600 hover:text-white">
              <h3 className="text-xl font-bold mb-2">Convenience</h3>
              <p className="text-gray-700 hover:text-white">
                Access to a network of trusted healthcare professionals in your area.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:bg-blue-600 hover:text-white">
              <h3 className="text-xl font-bold mb-2">Personalization</h3>
              <p className="text-gray-700 hover:text-white">
                Tailored recommendations and reminders to help you stay on top of your health.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
