import React, { useEffect, useState } from 'react';
import { useCartStore } from '../stores/useCartStore';
import { Minus, Plus, Trash2, Tag } from 'lucide-react';
import axios from '../lib/axios';
import { toast } from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with error handling
const getStripe = async () => {
  if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
    throw new Error('Stripe public key is not configured');
  }
  return loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
};

const CartPage = () => {
  const { cart, getCartItems, updateQuantity, removeFromCart, total, subtotal } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getCartItems();
    fetchAvailableCoupons();
  }, [getCartItems]);

  const fetchAvailableCoupons = async () => {
    try {
      const response = await axios.get('coupons/user');
      setAvailableCoupons(response.data);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      await removeFromCart(productId);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item from cart');
    }
  };

  const handleApplyCoupon = async (code = couponCode) => {
    try {
      const response = await axios.post('coupons/validate', { code });
      setAppliedCoupon(response.data);
      toast.success('Coupon applied successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid coupon code');
      setAppliedCoupon(null);
    }
  };

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      const stripe = await getStripe();
      
      const response = await axios.post('payments/create-checkout-session', {
        products: cart,
        couponCode: appliedCoupon?.code
      });

      if (!response.data || !response.data.id) {
        throw new Error('Invalid response from server');
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: response.data.id
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Checkout failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-300">
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <p>Add some products to your cart to see them here.</p>
        </div>
      </div>
    );
  }

  const finalTotal = appliedCoupon 
    ? total * (1 - appliedCoupon.discountPercentage / 100) 
    : total;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-200">Shopping Cart</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.map((item) => (
              <div 
                key={item._id} 
                className="bg-slate-800 rounded-lg p-4 flex flex-col sm:flex-row items-center gap-4 border border-slate-700"
              >
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="text-lg font-medium text-gray-200">{item.name}</h3>
                  <p className="text-gray-400">${item.price}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item._id, Math.max(0, item.quantity - 1))}
                    className="p-1 hover:bg-slate-700 rounded"
                  >
                    <Minus size={16} className="text-gray-300" />
                  </button>
                  <span className="text-gray-200 w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="p-1 hover:bg-slate-700 rounded"
                  >
                    <Plus size={16} className="text-gray-300" />
                  </button>
                  <button
                    onClick={() => handleRemoveFromCart(item._id)}
                    className="p-1 hover:bg-slate-700 rounded ml-4"
                  >
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-xl font-semibold mb-4 text-gray-200">Order Summary</h3>
            
            {/* Available Coupons */}
            {availableCoupons.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Available Coupons:</h4>
                <div className="space-y-2">
                  {availableCoupons.map((coupon) => (
                    <div 
                      key={coupon.code}
                      className="flex items-center justify-between p-2 bg-slate-700 rounded-md"
                    >
                      <div className="flex items-center gap-2">
                        <Tag size={16} className="text-green-400" />
                        <span className="text-gray-200">{coupon.code}</span>
                        <span className="text-sm text-gray-400">({coupon.discountPercentage}% off)</span>
                      </div>
                      <button
                        onClick={() => handleApplyCoupon(coupon.code)}
                        className="text-sm text-green-400 hover:text-green-300"
                      >
                        Apply
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Manual Coupon Input */}
            <div className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  className="flex-grow px-3 py-2 bg-slate-700 rounded-md text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
                <button
                  onClick={() => handleApplyCoupon()}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-md transition duration-300"
                >
                  Apply
                </button>
              </div>
              {appliedCoupon && (
                <div className="mt-2 text-green-400 text-sm">
                  Coupon applied: {appliedCoupon.discountPercentage}% off
                </div>
              )}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-400">
                  <span>Discount</span>
                  <span>-${(total - finalTotal).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-300">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t border-slate-700 pt-2 mt-2">
                <div className="flex justify-between text-gray-200 font-semibold">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={handleCheckout}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white py-2 px-4 rounded-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : 'Proceed to Checkout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;