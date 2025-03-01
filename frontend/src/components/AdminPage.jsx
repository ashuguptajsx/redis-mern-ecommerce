import { BarChart, PlusCircle, ShoppingBasket } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import AnalyticsTab from "../components/AnalyticsTab";
import CreateProductsForm from "../components/CreateProductsForm";
import ProductsList from "../components/ProductsList";
// import { useProductStore } from "../stores/useProductStore";

const tabs = [
  { id: "create", label: "Create Product", icon: PlusCircle },
  { id: "products", label: "Products", icon: ShoppingBasket },
  { id: "analytics", label: "Analytics", icon: BarChart },
];

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("create");
  // const { fetchAllProducts } = useProductStore();

  // useEffect(() => {
  //   fetchAllProducts();
  // }, [fetchAllProducts]);

  return (
    <div className='min-h-screen  relative overflow-hidden'>
      <div className='relative z-10 container mx-auto px-4 py-16'>
        <motion.h1
          className='text-4xl font-bold mb-8 text-gray-100 text-center'
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8,
            ease: "easeOut",
            type: "spring",
            stiffness: 100
          }}
        >
          Admin Dashboard
        </motion.h1>

        <div className='flex justify-center mb-8'>
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-5 py-3 mx-2 rounded-lg transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-gray-700 text-white shadow-lg shadow-gray-700/20"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
              }`}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <tab.icon className='mr-2 h-5 w-5' />
              <span className="font-medium">{tab.label}</span>
            </motion.button>
          ))}
        </div>

        <motion.div
          className="
           rounded-xl  shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.6,
            delay: 0.2,
            ease: "easeOut"
          }}
        >
          {activeTab === "create" && <CreateProductsForm />}
          {activeTab === "products" && <ProductsList />}
          {activeTab === "analytics" && <AnalyticsTab />}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPage;