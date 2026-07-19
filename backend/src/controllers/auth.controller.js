import User from "../models/user.model.js"
import { generateToken } from "../lib/utils.js"

export const signup = async (req, res) => {
  const {fullname,email,password} = req.body
  try{
    // hash the password
    if(password < 6){
      return status(400).json({message: "Password must be at least 6 characters"})

      const user = await User.findOne({email})

      if(user){
        return status(400).json({message: "User already exsist"})
      }

      const salt =  await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hashedPassword(password,salt)
      
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
    }

  }
  catch (error) {
    console.log("error in signup controller", error.message);
    res.status(500).json({message: "Internal server error"})

  }
  
}

export const login = (req, res) => {
  res.send("Login route");
}

export const logout = (req, res) => {
  res.send("Logout route");
}   