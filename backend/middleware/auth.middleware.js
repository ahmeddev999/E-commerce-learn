import jwt from "jsonwebtoken";
import User from '../models/user.model.js';

// hokare danane next() awaya nmuna ktak la protectRoutes tawaw bu awa brwata sar bashi duwam ka adminRoutes a
export const protectRoute = async (req, res, next) => {
try {
    //check dakain aya auth buwa laregay accesstoken
    const accessToken = req.cookies.accessToken;

    // agar nabu
    if (!accessToken) {
        return res.status(401).json({ message: "Unauthorized - No access token provided"});
    }

    //datwanin lera try catch ke deka bakar benin numna agar accesstoken ka haw nabu yan har shtak
    try {

    // decode dakain hata user ID kaman ba dast kawe
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    //detnaway user larey ID labar away 
    // select kamle user Doc dakat ama dallain password mayna ba .select()
    const user = await User.findById(decoded.userId).select("-password");

    //agar user nadetrawa
    if (!user) {
        return res.status(401).json({ message: "User not found"});
    }

    //ballam agar habu dayxaynawa request
    //madam bune haya aw usera daxyna request
    req.user = user;

    next();
        
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Unauthorized - access token expired"});
        } else {
            throw error // datwanin catche bkain la catche duwam
        }
    }

} catch (error) {
    console.log("Something went wrong with protectRoute", error.message);
    return res.status(401).json({ message: "Unauthorized - No access token provided"});
}
    
}


export const adminRoute = async (req, res, next) => {
    // agar user buni habu w agar role yaksan bu ba admin
    // tawawa biba function dabet ka yani tawaw bu hamu product kan lo det
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({ message: "Access denied - Admin only"});
    }
}