import React from "react";
const Footer = () => {
    return (
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 px-6">
          <div>
            <h3 className="font-bold text-lg">Categories</h3>
            <ul>
              <li>Room Coolers</li>
              <li>Irons</li>
              <li>Geysers</li>
              <li>Hob</li>
              <li>Fans</li>
              <li>Range Hoods</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg">Useful Links</h3>
            <ul>
              <li>Media</li>
              <li>Careers</li>
              <li>Products</li>
              <li>How To Order</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg">Policies</h3>
            <ul>
              <li>Terms and Conditions</li>
              <li>Return Policy</li>
              <li>Warranty Claim</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg">Get in Touch</h3>
            <p>Email: info@orientappliances.pk</p>
            <p>Phone: 0333-7148161, 03212450732</p>
            <div className="flex space-x-4 mt-2">
              <a href="#" className="bg-red-500 p-2 rounded-full">📘</a>
              <a href="#" className="bg-red-500 p-2 rounded-full">📷</a>
            </div>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  