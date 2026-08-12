import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import authRouter from "./routes/auth.route.js"
import cookieParser from "cookie-parser"
dotenv.config()
import cors from "cors"
import userRouter from "./routes/user.route.js"
import listingRouter from "./routes/listing.route.js"
import bookingRouter from "./routes/booking.route.js"
let port = process.env.PORT || 6000

let app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176", "http://localhost:1573"],
    credentials:true
}))

app.use("/api/auth", authRouter )
app.use("/api/user", userRouter )
app.use("/api/listing",listingRouter )
app.use("/api/booking",bookingRouter )


const server = app.listen(port, () => {
    connectDb()
    console.log(`Server started on port ${port}`)
})

server.on('error', (err) => {
    console.error('Server failed to start:', err.message)
})