import Product from "../models/product.model.js";

export const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;
        
        const existingItem = user.cartItems.find(item => item.product.toString() === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            user.cartItems.push({
                product: productId,
                quantity: 1
            });
        }

        await user.save();
        res.json(user.cartItems);
    } catch (error) {
        console.log("error in addToCart controller", error.message);
        res.status(500).json({ message: "server error", error: error.message });
    }
}

export const removeAllFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;
        if (!productId) {
            user.cartItems = [];
        } else {
            user.cartItems = user.cartItems.filter((item) => item.product.toString() !== productId);
        }
        await user.save();
        res.json(user.cartItems);
    } catch (error) {
        res.status(500).json({ message: "server error", error: error.message });
    }
}

export const updateQuantity = async (req, res) => {
    try {
        const { id: productId } = req.params;
        const { quantity } = req.body;
        const user = req.user;
        const existingItem = user.cartItems.find((item) => item.product.toString() === productId);

        if (existingItem) {
            if (quantity === 0) {
                user.cartItems = user.cartItems.filter((item) => item.product.toString() !== productId);
                await user.save();
                return res.json(user.cartItems);
            }
            existingItem.quantity = quantity;
            await user.save();
            res.json(user.cartItems);
        } else {
            res.status(404).json({ message: "Item not found in cart" });
        }
    } catch (error) {
        console.log("error in updateQuantity controller", error.message);
        res.status(500).json({ message: "server error", error: error.message });
    }
}

export const getCartProducts = async (req, res) => {
    try {
        const user = await req.user.populate('cartItems.product');
        const cartItems = user.cartItems.map(item => ({
            ...item.product.toJSON(),
            quantity: item.quantity
        }));
        res.json(cartItems);
    } catch (error) {
        console.log("error in getCartItems controller", error.message);
        res.status(500).json({ message: "server error", error: error.message });
    }
}