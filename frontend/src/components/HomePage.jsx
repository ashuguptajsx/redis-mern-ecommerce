import React from 'react';
import { Link } from 'react-router-dom'; // Import Link

const HomePage = () => {
  // Updated product data with consistent hrefs matching /category/:category
  const products = [
    { name: 'shoes', image: '/img1.jpg', href: '/category/shoes' },
    { name: 'hoodies', image: '/img2.jpg', href: '/category/hoodies' }, // Fixed to match name
    { name: 'bluedress', image: '/img3.jpg', href: '/category/dress' }, // Adjusted to dress
    { name: 'jacket', image: '/img4.jpg', href: '/category/jacket' }, // Fixed to match name
    { name: 'dress', image: '/img5.jpg', href: '/category/dress' }, // Fixed to match name
  ];

  return (
    <div className="text-white min-h-screen p-8">
      {/* Heading */}
      <h1 className="text-4xl font-bold text-center mb-12">
        Explore Our Categories
      </h1>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {products.map((product, index) => (
          <Link
            key={index}
            to={product.href} // Use "to" instead of "href" for Link
            className="relative w-full block hover:opacity-90 transition-opacity"
          >
            {/* Product Image */}
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />
            {/* Product Name */}
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded">
              {product.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;