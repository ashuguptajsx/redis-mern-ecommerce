import User from "../models/user.model.js"
import Product from "../models/product.model.js"
import Order from "../models/order.model.js"

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
    // [
    //     {
    //         _id : "2025-08-02",
    //         sales: 5,
    //         Revenue: 500
    //     },
    // ]


    const dateArray = 
}

function getDateInRange(startDate, endDate){
    
}