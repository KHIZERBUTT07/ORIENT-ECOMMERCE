import React from "react";

const About = () => {
  return (
    <div className="container mx-auto py-10 px-6">
      {/* ✅ Hero Section */}
      <div className="relative w-full h-[350px] bg-black">
        <img
          src="/images/1732876776.jpeg" // 🔄 Update with actual banner path
          alt="About Us"
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-white">
          <h1 className="text-4xl font-bold">Who We Are</h1>
          <p className="mt-2 font-bold text-lg">Learn More About Our Brand & Mission</p>
        </div> 
      </div>

      {/* ✅ Our Story Section */}
      <div className="mt-10 flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl font-bold text-gray-800">Our Story</h2>
          <p className="mt-4 text-gray-600 leading-relaxed">
            Orient Brand is recognized in the industry as a market leader in the categories of
            electrical and gas appliances. We have been manufacturing superior quality ceiling fans,
            pedestal fans, exhaust fans, bracket fans, room air coolers, hobs, chimneys, irons,
            electric geysers, instant geysers, and traditional gas geysers for years; striving for
            utmost standards and value for our esteemed customers. Our products and services aim for
            reliability, energy efficiency, and optimum performance. We feel proud in being the
            manufacturers of Pakistan’s best-in-class products, enhancing the user experience.
          </p>
        </div>
        <div className="w-full md:w-1/2 flex justify-center mt-6 md:mt-0">
          <img
            src="/images/about1.jpg" // 🔄 Update with actual image path
            alt="Our Story"
            className="w-[80%] rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* ✅ Our Mission Section */}
      <div className="mt-16 flex flex-col md:flex-row-reverse items-center">
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl font-bold text-gray-800">Our Mission</h2>
          <p className="mt-4 text-gray-600 leading-relaxed">
            All of this would not have been possible without the endless support and arduous work of
            our talented team members. They are always encouraged to keep abreast of the
            ever-evolving market trends and technology developments. Their learnings are then
            incorporated into the production process to guarantee the finest for our consumers.
            Built with sheer diligence and an example of state-of-the-art production standards, our
            product line consists of:
            <ul className="mt-3 list-disc list-inside text-gray-700">
              <li>Orient Smart Series</li>
              <li>Orient Deluxe Series</li>
              <li>Orient Instant Geysers</li>
              <li>Orient Room Coolers</li>
            </ul>
          </p>
        </div>
        <div className="w-full md:w-1/2 flex justify-center mt-6 md:mt-0">
          <img
            src="/images/about2.jpg" // 🔄 Update with actual image path
            alt="Our Mission"
            className="w-[80%] rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* ✅ Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700"
      >
        🡱
      </button>
    </div>
  );
};

export default About;
