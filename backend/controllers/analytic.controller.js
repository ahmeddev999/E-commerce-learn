import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js"


// tanha functionaka ka datakan man lo dabat
export const getAnalytics = async () => {
    try {
        // yakam jar damanawe bzanin chand user man haya w productesh
        // la rey conuntDocuments ka zhmaray doc kaman dazhmeret
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();

        // pasham sales data man dawe ka zhmaray froshtna
        const salesData = await Order.aggregate([
            {
                // manay awa documentakan group bka banda lasar away ama daway dakain
                $group: {
                    _id: null, // hamu documentkan
                    totalSales: { $sum: 1 }, // yak manay true det ka zhmaray hamu orderkan pe bllet
                    totalRevenue: { $sum: "$totalAmount"},
                }
            }
        ])

        // lerada salesData return array kman pe dadat ama lanawe da
        // 2 objecte le war dagrin w agar nabu backup kaman haya ka harduki bbta 0
        const {totalSales, totalRevenue} = salesData[0] || { totalSales: 0, totalRevenue: 0}
        
        // kotasht ama esta datakan loyan return dakain
        return {
           users: totalUsers,
           products: totalProducts,
           totalSales,
           totalRevenue,
        }
    } catch (error) {
        throw error;
    }
}


export const getDailySalesData = async (startDate, endDate) => {
    try {

        // lerada datakan lanaw bashi order da dawa dakai bapey away dawaman krdya
        const dailySalesData = await Order.aggregate([
            {
                // manay awaya awanay match dabn ka createdAt kayan 
                // la pash startDate w la pesh endDate buwa yani la newan harduki bet 
                $match: {
                    createdAt:{
                        $gte: startDate,
                        $lte: endDate,
                    },
                },

                // group e bka loman ba formati sallu mangu rozh la fielde createdAt
                // koy froshtnakan w koy gshti paraka
                $group: {
                    _id: { $dateToString : { format: "%Y-%m-%d", date: "$createdAt"}},
                    sales: { $sum: 1 },
                    revenue: { $sum: "$totalAmount"}
                }
            },
            { $sort: 1}
        ]);
           
        // output for each day
        // [
        //     {
        //         id: "2026-3-27",
        //         sales: 12,
        //         revenue: 1450.60
        //     }
        // ]

        // lerada ama datakan man ba dast gaysht ballam pewesta
        // katakanish ba dast man kawet ba gweray startDate w endDate
        const dateArray = getDatesInRange(startDate, endDate);


        // lera da return aki dakain dallain lanaw dateArray da har 
        // datek man yaksan bu baway ka lanaw dailySalesData haya ka ama
        // id kaman krdete awa returne bka

        return dateArray.map((date) => {

            // ladu aw itema dagarain ka _id kay haman shta lagal date kaman
            // ama waman krdya id bbta date agar yaksan bu lagal away ka hamana return dakat 
            const foundData = dailySalesData.find(item => item._id == date);

            return {
                date,
                sales: foundData?.sales || 0,
                revenue: foundData?.revenue || 0,
            }
        })
        
    } catch (error) {
        throw error;
    }
}


// arraykman haya pashan letak ka kota rozha la haftakaman dway loopaki while man haya
// dallain hata kataka bchuk tr bet la awroka awa bexa naw arrayaka 
function getDatesInRange(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);

    // hata aw katay currentDate bchuktra bexa naw arrayaka
    while (currentDate <= endDate) {
        // bexa naw arrayaka
        dates.push(currentDate.toISOString().split("T")[0]);
        // aw daytay krdnamana nawe daygorin lo rozhak peshtr
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
}




// 1. Do I need all data? → no → $match
// 2. Do I need grouping? → yes → $group
// 3. Do I need math? → yes → $sum / $multiply
// 4. Do I need order? → yes → $sort