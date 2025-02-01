import Product from "../models/product.model.js";


export const addToCart = async (req, res) => {
    try {
       const {productId}  = req.body;
       const user = req.user;
       const existingItem = user.cartItem.find(item => item.product == productId);
       if(existingItem ){
              existingItem.quantity += 1;
       }else{
        user.cartItem.push(productId);
       }

       await user.save();
         res.json(user.cartItem);
    } catch (error) {
        console.log("error in addToCart controller", error.message)
        res.status(500).json({message:"serve error", error:error.message})
    }
}

export const removeAllFromCart = async (req, res) => {
    try {
        const{productId} = req.body;
        const user = req.user;
        if(!productId){
            user.cartItem = [];
        }else{
            user.cartItem = user.cartItem.filter((item) =>item.id !== productId);
        }
        await user.save();
        res.json(user.cartItem);
    } catch (error) {
        res.status(500).json({message:"server error", error:error.message});
    }
}


export const updateQuantity = async(req, res) =>{
    try {
        const{id:productId} = req.params;
        const{quantity}  = req.body;
        const user =  req.user;
        const existingItem = user.cartItem.find((item) => item.id === productId);

        if(existingItem){
            if(quantity == 0){
                user.cartItem = user.cartItem.filter((item)=> item.id !== productId)
                 await user.save();
                 return res.json(user.cartItem);
            }
            existingItem.quantity = quantity;
            await user.save();
            res.json(user.cartItem);
        }else{
            res.status(404).json({message:"Item not found in cart"})
        }
    } catch (error) {
        console.log("error in updateQuantity controller", error.message);
        res.status(500).json({message:"server error", error:error.message});

    }
}


export const getCartProducts= async(req, res)=>{
   try {
    const products = await Product.find({_id:{$in:req.user.cartItems}});

    const cartItems = products.map(product =>{
        
    })
     
   } catch (error) {
    
   }
}