import mongoose from 'mongoose';

export const connectDb = async () =>{
    try {
       const connection = await mongoose.connect(process.env.MONGO_URI )
       console.log("Connected to database")
        
    } catch (error) {    
        console.log("Error in connecting to database",error)
        
    }
}