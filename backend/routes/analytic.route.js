import express from 'express';
import { adminRoute, protectRoute } from '../middleware/auth.middleware.js';
import { getAnalytics, getDailySalesData } from '../controllers/analytic.controller.js';
const router = express.Router();


router.get('/', protectRoute, adminRoute, async (req, res) => {
    try {

        // yakam jar lera functionak man ka eshe awa man lo daka
        // data kan man lo ko dakatawa
        const analyticsData = await getAnalytics();

        // lera da dataman dawet lo chartakaman w dataya 7 rozh wardagrin
        
        // awrokaya 
        const endDate = new Date();
        // 7 rozh pesh estaya ba gweray aw endDate ay hamana
        // away awroka kami kolmala jaranak dakain ka daman bata bzabt 7 rozh pesh esta
        const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        // aw jara ba dast henani datay rozhana dakainawa
        const dailySalesData = await getDailySalesData(startDate, endDate);

        // return krdni harduk data
        res.json({
            analyticsData,
            dailySalesData
        });
    } catch (error) {
        console.log("Error in analytics route", error.message);
        res.status(500).json({ error: "Server erorr", error: error.message});
    }
})  


export default router;
