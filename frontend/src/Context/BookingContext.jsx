import axios from 'axios'
import React, { createContext, useContext, useState } from 'react'
import { AuthDataContext } from './AuthContext'
import { UserDataContext } from './UserContext'
import { ListingDataContext } from './ListingContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
export const bookingDataContext= createContext()
function BookingContext({children}) {
    let [checkIn,setCheckIn]=useState("")
    let [checkOut,setCheckOut]=useState("")
    let [total,setTotal]=useState(0)
    let [night,setNight]=useState(0)
    let {serverUrl} = useContext(AuthDataContext)
    let {getCurrentUser} = useContext(UserDataContext)
    let {getListing} = useContext(ListingDataContext)
    let [bookingData,setBookingData]= useState([])
    let [booking,setbooking]= useState(false)
    let navigate = useNavigate()

    const handleBooking = async (id) => {
         setbooking(true)
        try {
            let result = await axios.post( serverUrl + `/api/booking/create/${id}`,{
                checkIn,checkOut,totalRent:total
            },{withCredentials:true})
            await getCurrentUser()
            await getListing()
            setBookingData(result.data)
            console.log(result.data)
            setbooking(false)
            navigate("/booked")
            toast.success("Booking Successfully")

           

        } catch (error) {
            console.log(error)
            setBookingData(null)
            toast.error(error.response.data.message)


        }

        
    }
    const cancelBooking = async (id) => {
        try {
            let result = await axios.delete( serverUrl + `/api/booking/cancel/${id}`,{withCredentials:true})
        await getCurrentUser()
        await getListing()
        console.log(result.data)
        toast.success("CancelBooking Successfully")

            
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        }
        
    }

    let value={
        checkIn,setCheckIn,
        checkOut,setCheckOut,
        total,setTotal,
        night,setNight,
        bookingData,setBookingData,
        handleBooking,cancelBooking,booking,setbooking

    }
  return (
    <div>
      <bookingDataContext.Provider value={value}>
        {children}
      </bookingDataContext.Provider>
    </div>
  )
}

export default BookingContext
