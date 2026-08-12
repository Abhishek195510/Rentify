import React, { useContext, useState } from 'react'
import { UserDataContext } from '../Context/UserContext'
import { ListingDataContext } from '../Context/ListingContext';
import { useNavigate } from 'react-router-dom'
import { FaStar } from "react-icons/fa";
import { FiMapPin, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { MdOutlineVerified } from "react-icons/md";
import { bookingDataContext } from '../Context/BookingContext';
import { CompareContext } from '../Context/CompareContext';

function Card({ title, landMark, image1, image2, image3, rent, city, id, ratings, isBooked, host, distanceKm, category, onBookedClick, hideCompare }) {
    const navigate = useNavigate()
    const { userData } = useContext(UserDataContext)
    const { handleViewCard } = useContext(ListingDataContext)
    const [popUp, setPopUp] = useState(false)
    const [imgIdx, setImgIdx] = useState(0)
    const { cancelBooking } = useContext(bookingDataContext)
    const { compareList, toggleCompare } = useContext(CompareContext)
    const images = [image1, image2, image3].filter(Boolean)
    
    const isCompared = compareList.some(item => item._id === id);

    const handleClick = () => {
        if (userData) handleViewCard(id)
        else navigate("/login")
    }

    const prevImg = (e) => { e.stopPropagation(); setImgIdx(i => (i - 1 + images.length) % images.length) }
    const nextImg = (e) => { e.stopPropagation(); setImgIdx(i => (i + 1) % images.length) }

    const catColors = {
        rooms: "bg-blue-100 text-blue-700",
        flat: "bg-purple-100 text-purple-700",
        pg: "bg-amber-100 text-amber-700",
        shops: "bg-green-100 text-green-700",
    }
    const catLabel = category ? category.charAt(0).toUpperCase() + category.slice(1) : null

    return (
        <div
            className="group relative w-full h-full flex flex-col rounded-2xl overflow-hidden bg-white cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl shadow-md border border-gray-100"
            style={{ fontFamily: "'Inter', sans-serif" }}
            onClick={() => {
                if (isBooked) {
                    if (onBookedClick) onBookedClick();
                } else {
                    handleClick();
                }
            }}
        >
            {/* ── Image section ── */}
            <div className="relative w-full h-[210px] overflow-hidden bg-gray-100">
                {images.map((img, i) => (
                    <img
                        key={i}
                        src={img}
                        alt={title}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${i === imgIdx ? 'opacity-100' : 'opacity-0'}`}
                    />
                ))}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Prev / Next arrows */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={prevImg}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <FiChevronLeft className="w-4 h-4 text-gray-800" />
                        </button>
                        <button
                            onClick={nextImg}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <FiChevronRight className="w-4 h-4 text-gray-800" />
                        </button>
                    </>
                )}

                {/* Image dots */}
                {images.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                        {images.map((_, i) => (
                            <div
                                key={i}
                                className={`rounded-full transition-all ${i === imgIdx ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50'}`}
                            />
                        ))}
                    </div>
                )}

                {/* Booked badge */}
                {isBooked && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
                        <MdOutlineVerified className="w-3.5 h-3.5" />
                        Booked
                    </div>
                )}

                {/* Category badge */}
                {catLabel && !isBooked && (
                    <div className={`absolute top-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-full ${catColors[category] || 'bg-gray-100 text-gray-600'}`}>
                        {catLabel}
                    </div>
                )}

                {/* Distance badge */}
                {distanceKm !== null && distanceKm !== undefined && (
                    <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm text-red-600 text-[11px] font-bold px-2.5 py-1 rounded-full shadow">
                        <FiMapPin className="w-3 h-3" />
                        {distanceKm < 1 ? `${Math.round(distanceKm * 1000)} m` : `${distanceKm.toFixed(1)} km`} away
                    </div>
                )}

                {/* Cancel booking (owner view) */}
                {isBooked && host === userData?._id && (
                    <button
                        onClick={(e) => { e.stopPropagation(); setPopUp(true) }}
                        className="absolute bottom-3 right-3 text-[11px] font-bold bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition-colors"
                    >
                        Cancel
                    </button>
                )}

                {/* Compare Checkbox Toggle */}
                {!isBooked && !hideCompare && (
                    <div 
                        className={`absolute top-12 right-3 z-20 flex items-center gap-1.5 backdrop-blur-sm px-2.5 py-1 rounded-full shadow transition-all ${isCompared ? 'bg-black text-white' : 'bg-white/95 text-gray-800 hover:bg-gray-100'}`}
                        onClick={(e) => { 
                            e.stopPropagation(); 
                            toggleCompare({ _id: id, title, city, landMark, image1, rent, category, ratings, isBooked }); 
                        }}
                    >
                        <input 
                            type="checkbox" 
                            checked={isCompared} 
                            onChange={()=>{}} 
                            className="w-3.5 h-3.5 accent-white cursor-pointer pointer-events-none" 
                        />
                        <span className="text-[11px] font-bold">Compare</span>
                    </div>
                )}
            </div>

            {/* ── Cancel confirm popup ── */}
            {popUp && (
                <div className="absolute inset-0 z-30 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-2xl" onClick={e => e.stopPropagation()}>
                    <div className="bg-white rounded-2xl p-6 mx-4 text-center shadow-xl">
                        <h3 className="font-bold text-gray-800 text-base mb-1">Cancel Booking?</h3>
                        <p className="text-gray-500 text-sm mb-4">This action cannot be undone.</p>
                        <div className="flex gap-3 justify-center">
                            <button className="px-5 py-2 bg-red-500 text-white text-sm font-bold rounded-xl hover:bg-red-600 transition-colors" onClick={() => { cancelBooking(id); setPopUp(false) }}>Yes, Cancel</button>
                            <button className="px-5 py-2 bg-gray-100 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-200 transition-colors" onClick={() => setPopUp(false)}>Keep it</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Info section ── */}
            <div className="p-4">
                {/* Location */}
                <div className="flex items-center gap-1 text-gray-500 text-[12px] mb-1">
                    <FiMapPin className="w-3 h-3 text-red-400 flex-shrink-0" />
                    <span className="truncate font-medium">{landMark}, {city}</span>
                </div>

                {/* Title + Rating */}
                <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-gray-900 text-[15px] leading-tight line-clamp-2 flex-1">{title}</h3>
                    <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-lg flex-shrink-0">
                        <FaStar className="w-3 h-3 text-amber-400" />
                        <span className="text-[12px] font-bold text-amber-700">{ratings || "New"}</span>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-100 mb-3" />

                {/* Price */}
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-[11px] text-gray-400 font-medium">Monthly Rent</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-[20px] font-black text-gray-900">₹{rent?.toLocaleString?.() ?? rent}</span>
                            <span className="text-[12px] text-gray-400 font-medium">/month</span>
                        </div>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-red-500 flex items-center justify-center group-hover:bg-red-600 transition-colors shadow-sm">
                        <FiChevronRight className="w-5 h-5 text-white" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Card
