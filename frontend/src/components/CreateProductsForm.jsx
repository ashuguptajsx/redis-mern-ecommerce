import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";
const categories = ["jeans", "t-shirts", "shoes", "glasses", "jackets", "suits", "bags"];

const CreateProductForm = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",   
    description: "",
    price: "",
    category: "",
    image: "",
  });

 

  const { createProduct, loading} = useProductStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("function triggered")
    console.log(newProduct);
    await createProduct(newProduct);
    setNewProduct({
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",  
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      className='shadow-2xl rounded-xl p-8 mb-8 max-w-xl mx-auto border border-gray-700' // Removed bg-gray-800
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <h2 className='text-2xl font-semibold mb-6 text-gray-100 tracking-wide'>
        Create New Product
      </h2>

      <form onSubmit={handleSubmit} className='space-y-6'>
        <div>
          <label htmlFor='name' className='block text-sm font-medium text-gray-300 mb-1'>
            Product Name
          </label>
          <motion.input
            type='text'
            id='name'
            name='name'
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className='block w-full bg-gray-900 border border-gray-600 rounded-lg py-3 px-4 text-gray-100 
              focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-300'
            required
            whileFocus={{ scale: 1.02 }}
          />
        </div>

        <div>
          <label htmlFor='description' className='block text-sm font-medium text-gray-300 mb-1'>
            Description
          </label>
          <motion.textarea
            id='description'
            name='description'
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            rows='4'
            className='block w-full bg-gray-900 border border-gray-600 rounded-lg py-3 px-4 text-gray-100 
              focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-300'
            required
            whileFocus={{ scale: 1.02 }}
          />
        </div>

        <div>
          <label htmlFor='price' className='block text-sm font-medium text-gray-300 mb-1'>
            Price
          </label>
          <motion.input
            type='number'
            id='price'
            name='price'
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            step='0.01'
            className='block w-full bg-gray-900 border border-gray-600 rounded-lg py-3 px-4 text-gray-100 
              focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-300'
            required
            whileFocus={{ scale: 1.02 }}
          />
        </div>

        <div>
          <label htmlFor='category' className='block text-sm font-medium text-gray-300 mb-1'>
            Category
          </label>
          <motion.select
            id='category'
            name='category'
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            className='block w-full bg-gray-900 border border-gray-600 rounded-lg py-3 px-4 text-gray-100 
              focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-300'
            required
            whileFocus={{ scale: 1.02 }}
          >
            <option value='' className='text-gray-400'>Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category} className='text-gray-100'>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}     
          </motion.select>
        </div>

        <div className='flex items-center'>
          <input type='file' id='image' className='sr-only' accept='image/*' onChange={handleImageChange} />
          <motion.label
            htmlFor='image'
            className='cursor-pointer bg-gray-900 py-3 px-4 border border-gray-600 rounded-lg text-sm 
              font-medium text-gray-300 hover:bg-gray-700 hover:border-gray-500 transition-all duration-300'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Upload className='h-5 w-5 inline-block mr-2' />
            Upload Image
          </motion.label>
          {newProduct.image && (
            <motion.span
              className='ml-3 text-sm text-gray-400 italic'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Image uploaded
            </motion.span>
          )}
        </div>

        <motion.button
        
          type='submit'
          className='w-full cursor-pointer flex justify-center py-3 px-4 border border-gray-600 rounded-lg shadow-md 
            text-sm font-medium text-gray-100 bg-gray-700 hover:bg-gray-600 focus:outline-none 
            focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 
            disabled:opacity-50 transition-all duration-300'
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
        >
           {loading ? (
            <>
              <Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
              Loading...
            </>
          ) : ( 
            <>
              <PlusCircle className='mr-2 h-5 w-5' />
              Create Product
            </>
           )} 
        </motion.button>
      </form>
    </motion.div>
  );
};

export default CreateProductForm;