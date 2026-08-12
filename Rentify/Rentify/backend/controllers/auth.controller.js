import genToken from "../config/token.js"
import User from "../model/user.model.js"
import bcrypt from "bcryptjs"

export const sighUp=async (req,res) => {
    try {
        let {name,email,password,role} = req.body
        let existUser = await User.findOne({email})
        if(existUser){
            return res.status(400).json({message:"User is already exist"})
        }

        // Email validation: only @gmail.com allowed
        if(!email.endsWith("@gmail.com")){
            return res.status(400).json({message:"Only @gmail.com email addresses are allowed for registration."})
        }
        let hashPassword = await bcrypt.hash(password,10)
        let user = await User.create({name , email , password:hashPassword, role: role || "customer"})
        let token = await genToken(user._id)
        res.cookie("token",token,{
            httpOnly:true,
            secure: process.env.NODE_ENVIRONMENT === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        let newUser = await User.findById(user._id).populate({
            path: 'listing',
            populate: { path: 'guest', select: 'name email phone address' }
        }).populate("booking")
        return res.status(201).json(newUser)

    } catch (error) {
        return res.status(500).json({message:`sighup error ${error}`})
    }
    
}
export const login = async (req,res) => {
    try {
        let {email,password,role} = req.body
        let user= await User.findOne({email}).populate({
            path: 'listing',
            populate: { path: 'guest', select: 'name email phone address' }
        }).populate("booking")
        if(!user){
            return res.status(400).json({message:"User does not exist"})
        }
        let isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({message:"Incorrect password"})
        }
        // Role validation: if a role is provided, ensure it matches the registered role
        if(role && user.role !== role){
            return res.status(403).json({
                message: `Access denied. This account is registered as a ${user.role}. Please select the correct role.`
            })
        }
        let token = await genToken(user._id)
        res.cookie("token",token,{
            httpOnly:true,
            secure: process.env.NODE_ENVIRONMENT === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.status(200).json(user)
        
    } catch (error) {
        return res.status(500).json({message:`login error ${error}`})
    }
    
}
export const logOut = async (req,res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({message:"Logout Successfully"})
    } catch (error) {
        return res.status(500).json({message:`logout error ${error}`})
    }
}