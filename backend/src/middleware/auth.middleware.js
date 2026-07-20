import jwt from "jsonwebtoken"
import User from "../models/user.model.js   "

export const protectRoute = async (req, res, text) =>{
    try{
    const token = req.cookie.jwt_token 

    if(!token){
        return res.status(401).json({message: "No Valid User - No token"})
    }
    const decoded =jwt_token.verify(token,process.env.JWT_SECRET)
    if(!decoded){
     return res.status(401).json({message: "No Valid User - Invalidtoken"})
    }
    const user = await User.findById(decoded.userId).select("-password")
    if(!user){
        return res.status(404).json({message: "User not found"})
    }
    req.user = user
    next()
    }
    catch(error){
    console.log("error middleware protectRoute", error.message);
    res.status(500).json({message: "Internal server error"})
    }
}