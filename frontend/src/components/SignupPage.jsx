import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";


const SignUpForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const{signup} = useUserStore()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    signup( formData);
  };

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen  text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-6 bg-slate-900 rounded-xl shadow-lg w-80 border border-slate-700"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-center text-xl font-semibold">Sign Up</h2>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          className="p-2 rounded border border-slate-600 bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 text-white"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="p-2 rounded border border-slate-600 bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 text-white"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="p-2 rounded border border-slate-600 bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 text-white"
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="p-2 rounded border border-slate-600 bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 text-white"
          required
        />
        <button
          type="submit"
          className="p-2 bg-slate-600 text-white rounded hover:bg-slate-700 transition"
        >
          Sign Up
        </button>
        <p className="text-center text-sm mt-2">
          Already have an account? <Link to="/login" className="text-blue-400 hover:underline">Login</Link>
        </p>
      </motion.form>
    </motion.div>
  );
};

export default SignUpForm;
