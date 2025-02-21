import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '../stores/useUserStore';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {login} = useUserStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
    login({email, password});
  };

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="bg-slate-900 p-8 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-slate-300">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-slate-400">Email</label>
            <input 
              type="email" 
              className="w-full p-2 border border-slate-300 rounded mt-1" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-slate-400">Password</label>
            <input 
              type="password" 
              className="w-full p-2 border border-slate-300 rounded mt-1" 
              placeholder="Enter your password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <motion.button 
            type="submit" 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-slate-600 text-white py-2 rounded  transition"
          >
            Login
          </motion.button>
        </form>
        <p className="text-center text-sm text-slate-600 mt-4">
          Don't have an account? <a href="/signup" className="text-blue-500">Sign up</a>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
