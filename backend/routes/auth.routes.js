import express from 'express';
 
const router = express.Router();

router.get("/signup",(req,res)=>{
     res.send("sign up route called")
})


export default router;