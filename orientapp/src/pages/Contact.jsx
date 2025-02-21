import React, { useState } from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaWhatsapp } from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Your message has been submitted! We will get back to you soon.");
    setFormData({ email: "", message: "" });
  };

  return (
    <div className="container mx-auto py-10 px-6">
      <h2 className="text-3xl font-bold text-center text-red-600">Contact Us</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        {/* ✅ Contact Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Send Us A Message</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block font-bold mb-1"><FaEnvelope className="inline-block mr-2" /> Your Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block font-bold mb-1">How Can We Help?</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded h-32"
              ></textarea>
            </div>
            <button type="submit" className="w-full bg-black text-white p-3 rounded-lg hover:bg-gray-800">
              SUBMIT
            </button>
          </form>
        </div>

        {/* ✅ Contact Information */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Our Contact Information</h3>
          <p className="flex items-center mb-2"><FaMapMarkerAlt className="mr-2 text-red-600" /> ORIENT Head Office: NEW ROYAL ELECTRIC STORE, Opposite district & Session Court, MA Jinnah Road, Karachi-Pakistan.</p>
          <p className="flex items-center mb-2"><FaPhone className="mr-2 text-red-600" /> Store: 0333-7418161, 03212450732</p>
          <p className="flex items-center mb-2"><FaPhone className="mr-2 text-red-600" /> Service Center: 0321-9232551</p>
          <p className="flex items-center mb-2"><FaWhatsapp className="mr-2 text-green-500" /> Reach us on WhatsApp!</p>
          <p className="flex items-center"><FaEnvelope className="mr-2 text-red-600" /> info@orientappliances.pk</p>
        </div>
      </div>

      {/* ✅ Google Map */}
      <div className="mt-10">
        <iframe
          className="w-full h-[400px] border rounded-lg shadow-md"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28948.319024969156!2d67.01054412583128!3d24.86146228897988!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33f01a5f2f4f9%3A0xb7c68f20edc0d75!2sNew%20Royal%20Electric%20Store!5e0!3m2!1sen!2s!4v1648952107504!5m2!1sen!2s"
          allowFullScreen=""
          loading="lazy"
          title="Google Map"
        ></iframe>
      </div>
    </div>
  );
};

export default Contact;
