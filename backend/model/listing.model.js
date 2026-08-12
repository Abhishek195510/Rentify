import mongoose from "mongoose";


const listingSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    host:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    guest:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
        
    },
    image1:{
        type:String,
        required:true
    },
    image2:{
        type:String,
        required:true
    },
    image3:{
        type:String,
        required:true
    },
    rent:{
        type:Number,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    landMark:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    roomType: {
        type: String,
        enum: ["single", "double", "entire home"],
        default: "single"
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    },
    ratings:{
        type:Number,
        min:0,
        max:5,
        default:0
    },
    isBooked:{
        type:Boolean,
        default:false
    },
    reviews: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }]
},{timestamps:true})

listingSchema.index({ location: '2dsphere' });

const Listing = mongoose.model( "Listing" , listingSchema)

export default Listing
