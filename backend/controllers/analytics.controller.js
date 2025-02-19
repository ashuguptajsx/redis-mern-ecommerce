import User from "../models/user.model.js"
import Product from "../models/product.model.js"
import Order from "../models/order.model.js"
import { get } from "mongoose";
import e from "express";

export const  getAnalyticsData = async() =>{
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    const salesData = await Order.aggregate([
        {
            $group:{
                _id: null,
                totalSales: {$sum: 1},
                totalRevenue : {$sum:"$totalAmount"} 
            }
        }
    ])

    const {totalSales, totalRevenue} = salesData[0] || {totalSales: 0, totalRevenue: 0} ; 


    return {
        users: totalUsers,
        products: totalProducts,
        totalSales,
         totalRevenue

    }
}

export const getDailySalesData = async(startDate, endDate) =>{
   try {
    return Order.aggregate([
        {
            $match:{
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            }
        },
        {
            $group:{
                _id: {$dateToString: {format: "%Y-%m-%d", date: "$createdAt"}},
                sales: {$sum: 1},
                Revenue: {$sum: "$totalAmount"}
            }
        },
        { $sort: { _id: 1 } },
    ]);
   

    const dateArray =  getDateInRange(startDate, endDate);

    return dateArray.map(date =>{
        const foundData = getDailySalesData.find(item => item._id === date);
        return{
            date,
            sales:  foundData?.sales || 0,
            revenue : foundData?.revenue || 0 
        };
    });
   } catch (error) {
    console.log("Error in analytics controller", error.message);
    res.status(500).json({ message: "server error", error: error.message });
   }
};

function getDateInRange(startDate, endDate){
    const dates = [];
    let currentDate = new Date(startDate);
    while(currentDate <= endDate){
        dates.push(currentDate);
        currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
    }
    return dates;
}