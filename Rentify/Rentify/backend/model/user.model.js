import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    listing:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Listing"
    }],
    booking:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Listing"
    }],
    role:{
        type:String,
        enum:["customer","owner"],
        default:"customer"
    },
    phone: {
        type: String,
        default: ""
    },
    address: {
        type: String,
        default: ""
    },
    gender: {
        type: String,
        enum:["male", "female", "other", "prefer not to say", ""],
        default: ""
    },
    dob: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    }


},{timestamps:true})

const User = mongoose.model("User",userSchema)

export default User

