import { motion } from "framer-motion";
import { Trash, Star } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const ProductsList = () => {
  const { deleteProduct, toggleFeaturedProduct, products } = useProductStore();

  return (
    <motion.div
      className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Header Section */}
      <div className="mb-6">
        <h2 className="text-gray-200 text-xl font-semibold mb-4">Product Inventory</h2>
        <div className="grid grid-cols-5 gap-4 pb-3 border-b border-gray-700">
          {["Product", "Price", "Category", "Featured", "Actions"].map((header) => (
            <div
              key={header}
              className="text-sm font-medium text-gray-400 uppercase tracking-wider"
            >
              {header}
            </div>
          ))}
        </div>
      </div>

      {/* Product List Section */}
      <div className="space-y-3">
        {products?.map((product) => (
          <motion.div
            key={product._id}
            className="grid grid-cols-5 gap-4 items-center bg-gray-700 p-4 rounded-md border border-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.01, backgroundColor: "rgb(55, 65, 81)" }}
            transition={{ duration: 0.2 }}
          >
            {/* Product Info */}
            <div className="flex items-center space-x-3">
              <motion.div
                className="relative w-10 h-10 rounded overflow-hidden border border-gray-500"
                whileHover={{ scale: 1.1 }}
              >
                <img
                  className="w-full h-full object-cover"
                  src={product.image}
                  alt={product.name}
                />
              </motion.div>
              <span className="text-gray-200 text-sm font-medium truncate">{product.name}</span>
            </div>

            {/* Price */}
            <div className="text-gray-200 text-sm">
              <span className="bg-gray-600 px-3 py-1 rounded-full font-mono">
                ${product.price.toFixed(2)}
              </span>
            </div>

            {/* Category */}
            <div className="text-gray-300 text-sm">
              <span className="bg-gray-600 px-3 py-1 rounded-full">
                {product.category}
              </span>
            </div>

            {/* Featured Toggle */}
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleFeaturedProduct(product._id)}
                className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors duration-300 ${
                  product.isFeatured
                    ? "bg-gray-300 text-gray-800"
                    : "bg-gray-600 text-gray-400"
                }`}
              >
                <Star className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Delete Action */}
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => deleteProduct(product._id)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-600 text-gray-400 hover:text-red-400 hover:bg-gray-500 transition-colors duration-300"
              >
                <Trash className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {products?.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No products available</p>
        </div>
      )}
    </motion.div>
  );
};

export default ProductsList;