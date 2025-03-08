import React from 'react';

const HomePage = () => {
  // Product data with image paths and hrefs
  const products = [
    { name: 'shoes', image: '/img1.jpg', href: '/category/hello' },
    { name: 'hoodies', image: '/img2.jpg', href: '/category/jeans' },
    { name: 'bluedress', image: '/img3.jpg', href: '/category/dress' },
    { name: 'jacket', image: '/img4.jpg', href: '/category/skirt' },
    { name: 'dress', image: '/img5.jpg', href: '/category/shoes' },
  ];

  return (
    <div className="text-white min-h-screen  p-8">
      {/* Heading */}
      <h1 className="text-4xl font-bold text-center mb-12">
        Explore Our Categories
      </h1>

      {/* Products Grid */}
      <div className="grid grid-cols-1a sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {products.map((product, index) => (
          <a 
            key={index} 
            href={product.href} 
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
          </a>
        ))}
      </div>
    </div>
  );
};

export default HomePage;