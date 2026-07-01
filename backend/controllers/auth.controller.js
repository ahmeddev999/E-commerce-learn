import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { redis } from '../lib/redis.js';
//harwaha token la jwt esh pe dadyn

const generateToken = (userId) => {
// yakam bash userId kaya ka damanawet token bdayne duwam aw secretaya ka daman naya lo aw tokena 3yam lo waxtakaya
// katak userId danern lo jwt aw baw secret key hamana shtake decoded drust dakat pashan store dkaian la cookies w redis
const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
});

const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
});

return { accessToken, refreshToken }
}

//function kman dawet hata key-value kay la redis set bkat
//aw userId war dagren ka he userkaya w lagal refresh token kay
const storeRefreshToken = async (userId, refreshToken) => {
    // lera da ka daxil dakain lo naw redis dallainyakamyan key ka ka userId lo bakr daynin
    // duwam aw refreshToken ka pay dadayn seyam ayde kati expire buna 
    await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60);
}

// baw functiona danani cookie pe dakain
const setCookies = async (res, accessToken, refreshToken) => {
    // response dakainawa ba cookie lo danet la 3 bash pek det 
    // yakam nawak lo cookie kaman duwam tokenaka baxoy
    // seyam away ka bxoman damnwet lasar aw tokena bkain 
    res.cookie("accessToken", accessToken, {
        httpOnly: true, // la XSS daman parezet
        secure:process.env.NODE_ENV === "production", // ka la production buin dabta true
        sameSite: "strict", // la CSRF daman parezet
        maxAge:  15 * 60 * 1000,
    }),
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true, // la XSS daman parezet
        secure:process.env.NODE_ENV === "production", // ka la production buin dabta true
        sameSite: "strict", // la CSRF daman parezet
        maxAge:  7 * 24 * 60 * 60 * 1000,
    })
}



export const    signup = async (req, res) => {
    // away ka nardraya 
    const {name, email, password} = req.body;    
   
    try {
    // lera check dakain aya buni haya ba findOne
    const userExists = await User.findOne({ email });

    // agar buni habu 
    if (userExists) {
        return res.status(400).json({ message: "User already exists"})
    }

    // agar buni nabu ba .create drusti dakain
    const user = await User.create({name, email, password});

    // pesh away res bnerenawa dast ba pedani token dakain
    // la mongoDB baw jora id bang dakre  _id
    // aw id 2 Token haya accessToken w refreshToken
    const {accessToken, refreshToken} = generateToken(user._id);
    // lerada ama ID userka daneren w returne aw refreshTokenash daneren ka la returne generaToken warman grtya
    await storeRefreshToken(user._id, refreshToken);



    //set cookies aw functiona eshi awaya baw token pey ddayin cookies dadat b user
    // la response w hardu token pek det
    // setCookies(res, accessToken, refreshToken);
    setCookies(res, accessToken, refreshToken);
   

    res.status(201).json({user:{
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    }, message: "User created successfully"});

    } catch (error) {    
    console.error("Error in Signiup controller:",error);
    res.status(500).json({ message: error.message });
    }

}

export const login = async (req, res) => {
    try {
    // la regay aw dwa dtwanin user bnasinawa 
     const { email, password } = req.body;
     // katak bange User dakain yani law schema e User lanaw database
     // ba kurti lanaw database w lanaw aw userayn w agar aw user buni habet
     // awa ba tawawi datay sar aw usera deta naw varible user
     const user = await User.findOne({ email });
    
     // agar userka buni haya w password kayan yaksana ama aw password lo danern ka esta warman grtya
     // w ama peshtr aw methodaman drust krdya la UserSchema
     // lo comparePassword awya dallain user nak User chunka katak return Obj user man lo det aw function tedaya
     // awa methoda nak statics w labar instance method a awa bas lasar user doc barasti esh dakat nak model
     if ( user && (await user.comparePassword( password )) ) {
        const { accessToken, refreshToken } = generateToken(user._id);

        await storeRefreshToken(user._id, refreshToken);

        setCookies(res, accessToken, refreshToken);

        res.status(200).json({ user:{
            _id: user.__id,
            name: user.name,
            email: user.email,
            role: user.role,
        }, message: "User loged in successfuly"});

     } else {
       return res.status(401).json({ message: "Invalid email or password" });
     }
        
    } catch (error) {
        console.error("Error in Login controller:",error);
        res.status(500).json({ message: "Login went wrong", error: error.message });        
    }
}

export const logout = async (req, res) => {
    try {
        // lo away cookies e user kaman ba dast kawet loya
        // refreshToken bakar daynin chunka ama har ba refreshToken store man krdya la cookies 
        const refresh_token = req.cookies.refreshToken;

        // lera numna gar buni habu ama deyn tokenaka decode dakain 
        // jwt bakar daynin lo decode krdni chunka har baxoy incode krdya
        if (refresh_token) {
            // lo away decode bkain pewesta ba ch incode man krdya bawash decode bkain
            const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
            // lera da ama aw token man la redis delete dakain ba haman sheway ku
            // set man krd awha delete dakain la return e jwt ka daman date ka lera
            // chueta naw decoded ama userId hal dabzheren 
            await redis.del(`refresh_token:${decoded.userId}`);
        } 

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.status(200).json({ message: "logout successfully"})
    } catch (error) {
        console.error("Error in Logout controller:",error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const refreshToken = async (req, res) => {
    try {
        // yakam jar refreshToken e user ka wardagrin
        const refreshToken = req.cookies.refreshToken;

        // agar refreshToken buni nabu awa aw kat dabet user login bkat
        if (!refreshToken) {
            return res.status(401).json({message: "No refreshToken provided"});
        }

        //agar buni habu dayn decode dakain hata refreshToken e user kaman ba dast kawe
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        //lerash refreshToken naw redis bang dakainawa la regay userId kaman
        const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

        //lera check dakain aya aw token ka store kraya haman token 
        if (storedToken !== refreshToken) {
            return res.status(401).json({ message: "Invalid refresh token"});
        }

        //agaresh haman sht bun awa accessToken ke nwe drust bka         
        const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });


        //danani cookies lo browser 
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        });

        res.status(200).json({ message: "Token refreshed successfully"});

    } catch (error) {
        console.log("Error in refresToken controller");
        res.status(500).json({ error: error.message });
    }
}


export const getProfile = async (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        
    }
}






//also this way is valid too
// export async function logoutAuth(req, res, next) {
    
// }