import User from "../models/user.model.js"
import { generateToken } from "../lib/utils.js"
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js"

export const signup = async (req, res) => {
  const {fullname,email,password} = req.body
  try{
    if(!fullname || !email || !password){
      return res.status(400).json({message: "All fields are required"})
    }

    // hash the password
    if(password.length < 6){
      return res.status(400).json({message: "Password must be at least 6 characters"})
    }
    const user = await User.findOne({email})

      if(user){
        return res.status(400).json({message: "User already exsist"})
      }

      const salt =  await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password,salt)
      
      const newUser = new User({
        fullname: fullname,
        email: email,
        password: hashedPassword,
      })

      if(newUser){
        // generate the jwt 
        generateToken(newUser._id, res)
        await newUser.save()

        res.status(201).json({
          _id: newUser._id,
          fullname: newUser.fullname,
          email: newUser.email,
          profilePic: newUser.profilePic,
        })

      }else{  
        res.status(400).json({message: "Invalid user data"})
      }
    }catch (error) {
      console.log("error in signup controller", error.message);
      res.status(500).json({message: "Internal server error signup"})

  }
  
}

export const login  = async (req, res) => {
  const {email,password} = req.body
  try{
    const user = await User.findOne({email})

    if(!user){
      return res.status(400).json({message: "Invalid credeantials"})
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if(!isPasswordCorrect){
    return res.status(400).json({message: "Invalid credeantials"})
    }
    generateToken(user._id,res)
     res.status(200).json({
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
          profilePic: user.profilePic,
        })
  }
  catch(error){
  console.log("error in login controller", error.message);
    res.status(500).json({message: "Internal server error login"})
  }
}

export const logout = (req, res) => {
  try{
    res.cookie("jwt_token","",{maxAge:0})
    res.status(200).json({message: "Logged out successfully"})

  }
  catch(error){
console.log("error in logout controller", error.message);
    res.status(500).json({message: "Internal server error logout"})
  }
}  

export const updateProfile = async (req, res) => {
  try{
    const profilePic = req.body;
    const user_id =req.user._id;

    if(!profilePic){
      return res.status(400).json({message: "no image uploaded"})
    }
    const uploadprofilePic = await cloudinary.uploader.apload(profilePic)
    const updatedUser = await User.findByIdAndUpdate(user_id,{profilePic: uploadResponse.secure_url}, {new: true})
    
    res.status(200).json({message: "updated profilePic successfully"})
  }
  catch(error){
    console.log("error in profilePic update ", error.message);
    res.status(500).json({message: "Internal server error profilePic"})
  }
}

export const checkAuth = (req, res)=> {
  try{
    res.status(200).json(req.user);
  }
  catch(error){
    console.log("checkAuth controller error ", error.message);
    res.status(500).json({message: "Internal server error checkAuths"})
  }

}