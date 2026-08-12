import React, { useContext } from 'react'
import { Navigate, Route, Routes, useNavigate, useLocation } from 'react-router-dom'
import Home from './pages/Home'

import { ToastContainer, toast } from 'react-toastify';
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import ListingPage1 from './pages/ListingPage1'
import ListingPage2 from './pages/ListingPage2'
import ListingPage3 from './pages/ListingPage3'
import { UserDataContext } from './Context/UserContext'
import MyListing from './pages/MyListing'
import RoomDetail from './pages/RoomDetail'
import MyBooking from './pages/MyBooking'
import MyProfile from './pages/MyProfile'
import Booked from './pages/Booked'
import Compare from './pages/Compare'
import { CompareContext } from './Context/CompareContext'
import { FiLayers } from 'react-icons/fi'


function App() {
  let {userData} = useContext(UserDataContext)
  let {compareList} = useContext(CompareContext)
  let navigate = useNavigate()
  const location = useLocation()
  const isComparePage = location.pathname === '/compare'
 
  return (
    <>
    <ToastContainer />
    
    {/* Floating Compare Banner */}
    {compareList.length > 0 && !isComparePage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
            <button 
                onClick={() => navigate('/compare')}
                className="flex items-center gap-2 bg-black text-white px-6 py-4 rounded-full font-bold shadow-2xl hover:scale-105 active:scale-95 transition-all text-sm md:text-base border border-gray-800"
            >
                <div className="relative">
                    <FiLayers className="w-5 h-5" />
                    <span className="absolute -top-3 -right-3 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black shadow-sm ring-2 ring-black">
                        {compareList.length}
                    </span>
                </div>
                Compare Now
            </button>
        </div>
    )}

    <Routes>
      <Route path='/' element={userData?.role === "owner" ? <Navigate to="/mylisting" /> : <Home/>}/>
      <Route path='/compare' element={<Compare/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<SignUp/>}/>
      
      {/* Owner Only Routes */}
      <Route path='/listingpage1' 
      element={userData?.role === "owner" ? <ListingPage1/>:<Navigate to={"/"}/>}/>
      <Route path='/listingpage2' 
      element={userData?.role === "owner" ? <ListingPage2/>:<Navigate to={"/"}/>}/>
      <Route path='/listingpage3'
       element={userData?.role === "owner" ? <ListingPage3/>:<Navigate to={"/"}/>}/>
      <Route path='/mylisting'
       element={userData?.role === "owner" ? <MyListing/>:<Navigate to={"/"}/>}/>

      {/* Customer Only Routes */}
      <Route path='/mybooking'
       element={userData?.role === "customer" ? <MyBooking/>:<Navigate to={"/"}/>}/>
      <Route path='/booked'
       element={userData?.role === "customer" ? <Booked/>:<Navigate to={"/"}/>}/>

      {/* Shared Authenticated Routes */}
      <Route path='/room/:id'
        element={userData != null ? <RoomDetail/>:<Navigate to={"/login"}/>}/>
      <Route path='/profile'
       element={userData != null ? <MyProfile/>:<Navigate to={"/login"}/>}/>
    </Routes>
    </>
  )
}

export default App
