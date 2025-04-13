import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import { stripe } from "../lib/stripe.js";

export const createCheckoutSession = async (req, res) => {
	try {
		const { products, couponCode } = req.body;

		if (!Array.isArray(products) || products.length === 0) {
			return res.status(400).json({ error: "Invalid or empty products array" });
		}

		// Create line items for Stripe
		const lineItems = products.map((product) => ({
			price_data: {
				currency: "usd",
				product_data: {
					name: product.name,
					images: [product.image],
				},
				unit_amount: Math.round(product.price * 100), // Convert to cents
			},
			quantity: product.quantity || 1,
		}));

		// Calculate total amount
		const totalAmount = products.reduce((sum, product) => 
			sum + (product.price * 100 * (product.quantity || 1)), 0);

		// Handle coupon if provided
		let stripeCouponId = null;
		if (couponCode) {
			const coupon = await Coupon.findOne({ 
				code: couponCode, 
				userId: req.user._id, 
				isActive: true,
				expirationDate: { $gt: new Date() }
			});

			if (coupon) {
				stripeCouponId = await createStripeCoupon(coupon.discountedPercentage);
			}
		}

		// Create Stripe checkout session
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: lineItems,
			mode: "payment",
			success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.CLIENT_URL}/cart`,
			discounts: stripeCouponId ? [{ coupon: stripeCouponId }] : [],
			customer_email: req.user.email, // Add customer email if available
			metadata: {
				userId: req.user._id.toString(),
				couponCode: couponCode || "",
				products: JSON.stringify(
					products.map((p) => ({
						id: p._id,
						quantity: p.quantity,
						price: p.price,
					}))
				),
			},
		});

		// Create reward coupon for large purchases
		if (totalAmount >= 20000) { // $200 or more
			try {
				const newCoupon = new Coupon({
					code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
					discountedPercentage: 10,
					expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
					userId: req.user._id,
					isActive: true
				});
				await newCoupon.save();
			} catch (error) {
				console.error("Error creating reward coupon:", error);
				// Don't throw the error as this is a bonus feature
			}
		}

		res.status(200).json({ 
			id: session.id,
			totalAmount: totalAmount / 100 // Convert back to dollars
		});
	} catch (error) {
		console.error("Error processing checkout:", error);
		res.status(500).json({ 
			message: "Error processing checkout", 
			error: error.message 
		});
	}
};

export const checkoutSuccess = async (req, res) => {
	try {
		const { sessionId } = req.body;
		const session = await stripe.checkout.sessions.retrieve(sessionId);

		if (session.payment_status === "paid") {
			// Deactivate used coupon
			if (session.metadata.couponCode) {
				await Coupon.findOneAndUpdate(
					{
						code: session.metadata.couponCode,
						userId: session.metadata.userId,
					},
					{
						isActive: false,
					}
				);
			}

			// Create new order
			const products = JSON.parse(session.metadata.products);
			const newOrder = new Order({
				user: session.metadata.userId,
				products: products.map((product) => ({
					product: product.id,
					quantity: product.quantity,
					price: product.price,
				})),
				totalAmount: session.amount_total / 100, // Convert from cents to dollars
				stripeSessionId: sessionId,
			});

			await newOrder.save();

			res.status(200).json({
				success: true,
				message: "Payment successful, order created, and coupon deactivated if used.",
				orderId: newOrder._id,
			});
		} else {
			throw new Error("Payment not successful");
		}
	} catch (error) {
		console.error("Error processing successful checkout:", error);
		res.status(500).json({ 
			message: "Error processing successful checkout", 
			error: error.message 
		});
	}
};

async function createStripeCoupon(discountPercentage) {
	try {
		const coupon = await stripe.coupons.create({
			percent_off: discountPercentage,
			duration: "once",
		});
		return coupon.id;
	} catch (error) {
		console.error("Error creating Stripe coupon:", error);
		throw error;
	}
}