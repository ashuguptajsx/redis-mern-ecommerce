import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/useCartStore';
import axios from '../lib/axios';
import { toast } from 'react-hot-toast';
import { useUserStore } from '../stores/useUserStore';

const PurchaseSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [isVerifying, setIsVerifying] = useState(true);
    const clearCart = useCartStore(state => state.clearCart);
    const user = useUserStore(state => state.user);

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const sessionId = searchParams.get('session_id');
                if (!sessionId) {
                    toast.error('Invalid session');
                    navigate('/cart');
                    return;
                }

                const response = await axios.post('/payments/checkout-success', {
                    sessionId
                });

                if (response.data.success) {
                    // Clear cart in the backend
                    await axios.delete('/cart/clear');
                    // Clear cart in the frontend store
                    clearCart();
                    toast.success('Payment successful! Thank you for your purchase.');
                } else {
                    toast.error('Payment verification failed');
                }
            } catch (error) {
                console.error('Error verifying payment:', error);
                toast.error(error.response?.data?.message || 'Error verifying payment');
            } finally {
                setIsVerifying(false);
                // Redirect to orders page after 3 seconds
                setTimeout(() => {
                    navigate('/orders');
                }, 3000);
            }
        };

        verifyPayment();
    }, [searchParams, navigate, clearCart]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                {isVerifying ? (
                    <>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                            Verifying your payment...
                        </h2>
                        <p className="text-gray-600">
                            Please wait while we confirm your purchase
                        </p>
                    </>
                ) : (
                    <>
                        <div className="text-green-500 text-6xl mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                            Payment Successful!
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Thank you for your purchase. You will be redirected to your orders page shortly.
                        </p>
                        <button
                            onClick={() => navigate('/orders')}
                            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
                        >
                            View Orders
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PurchaseSuccess; 