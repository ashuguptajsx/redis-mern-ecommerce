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
    
}