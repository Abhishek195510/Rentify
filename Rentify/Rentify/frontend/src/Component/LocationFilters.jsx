import React, { useState, useContext } from 'react';
import { FiTarget, FiMap, FiList, FiFilter, FiLoader } from 'react-icons/fi';
import { MdMyLocation, MdWhatshot, MdBedroomParent } from 'react-icons/md';
import { BiBuildingHouse } from "react-icons/bi";
import { IoBedOutline } from "react-icons/io5";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import { ListingDataContext } from '../Context/ListingContext';

const LocationFilters = ({ onSearch, onToggleView, viewMode, onGetLocation, nearbyLoading, hasLocation }) => {
    const { listingData, setNewListData } = useContext(ListingDataContext);
    const [cate, setCate] = useState("");
    const [radius, setRadius] = useState(2);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [type, setType] = useState("");
    const [rating, setRating] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    const handleCategory = (category) => {
        setCate(category);
        if (category === "trending") {
            setNewListData(listingData);
        } else {
            setNewListData(listingData.filter((list) => list.category === category));
        }
    };

    const categories = [
        { name: "Trending", id: "trending", icon: <MdWhatshot className='w-6 h-6' /> },
        { name: "Rooms", id: "rooms", icon: <MdBedroomParent className='w-6 h-6' /> },
        { name: "Flat", id: "flat", icon: <BiBuildingHouse className='w-6 h-6' /> },
        { name: "PG", id: "pg", icon: <IoBedOutline className='w-6 h-6' /> },
        { name: "Shops", id: "shops", icon: <SiHomeassistantcommunitystore className='w-6 h-6' /> },
    ];

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        onSearch({ radius, minPrice, maxPrice, type, rating });
    };

    return (
        <div className="w-full bg-white border-b border-gray-100 py-4 sticky top-[144px] md:top-[120px] z-40 transition-all duration-300 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 flex flex-col xl:flex-row gap-4 items-center justify-between">
                
                {/* ── Categories ── */}
                <div className='flex items-center w-full xl:w-auto justify-start xl:justify-center gap-3 overflow-x-auto overflow-y-hidden no-scrollbar pb-2 xl:pb-0'>
                    {categories.map((item) => {
                        const isActive = cate === item.id || (item.id === "trending" && !cate);
                        return (
                            <div
                                key={item.id}
                                onClick={() => {
                                    handleCategory(item.id);
                                    if (item.id === "trending") setCate("");
                                }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all cursor-pointer whitespace-nowrap border
                                ${isActive 
                                    ? 'bg-red-50 text-red-600 border-red-200 shadow-sm' 
                                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-800'}`}
                            >
                                <span className={`transition-transform ${isActive ? 'scale-110' : ''}`}>
                                    {React.cloneElement(item.icon, { className: 'w-4 h-4' })}
                                </span>
                                {item.name}
                            </div>
                        );
                    })}
                </div>

                <div className="flex gap-3 w-full xl:w-auto flex-wrap justify-start xl:justify-end shrink-0">

                    {/* ── Find Near Me button ── */}
                    <button
                        id="find-near-me-btn"
                        onClick={onGetLocation}
                        disabled={nearbyLoading}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold transition-all shadow-lg active:scale-95 whitespace-nowrap
                            ${nearbyLoading
                                ? 'bg-red-400 text-white cursor-not-allowed'
                                : 'bg-red-500 text-white hover:bg-red-600 hover:shadow-red-200'
                            }`}
                        style={nearbyLoading ? {} : { boxShadow: "0 4px 14px rgba(229,57,53,0.35)" }}
                    >
                        {nearbyLoading ? (
                            <>
                                {/* Spinner */}
                                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Locating...</span>
                            </>
                        ) : (
                            <>
                                {/* Pulsing icon when location is active */}
                                {hasLocation ? (
                                    <span className="relative flex items-center justify-center w-5 h-5">
                                        <span className="absolute w-5 h-5 rounded-full bg-white opacity-40 animate-ping" />
                                        <MdMyLocation className="w-5 h-5 relative" />
                                    </span>
                                ) : (
                                    <FiTarget className="w-5 h-5" />
                                )}
                                <span>{hasLocation ? 'Refresh Location' : 'Find Near Me'}</span>
                            </>
                        )}
                    </button>

                    {/* ── Filters toggle ── */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center justify-center gap-2 px-5 py-3 rounded-full font-bold transition-all border
                            ${showFilters ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-900'}`}
                    >
                        <FiFilter className="w-5 h-5" />
                        Filters
                        {showFilters && (
                            <span className="ml-1 w-4 h-4 bg-white text-black text-[10px] rounded-full flex items-center justify-center font-black">✕</span>
                        )}
                    </button>
                </div>

                {/* ── Filter panel ── */}
                {showFilters && (
                    <div className="w-full md:w-auto flex flex-wrap gap-3 items-end animate-in fade-in slide-in-from-right-4 duration-300 pt-2 md:pt-0">

                        {/* Radius */}
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] uppercase font-black text-gray-400 ml-2">Radius (km)</span>
                            <select
                                value={radius}
                                onChange={(e) => setRadius(e.target.value)}
                                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-red-500"
                            >
                                <option value="1">1 km</option>
                                <option value="2">2 km</option>
                                <option value="5">5 km</option>
                                <option value="10">10 km</option>
                                <option value="25">25 km</option>
                                <option value="50">50 km</option>
                            </select>
                        </div>

                        {/* Price */}
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] uppercase font-black text-gray-400 ml-2">Price (₹/month)</span>
                            <div className="flex items-center gap-2">
                                <input
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    placeholder="Min"
                                    className="w-20 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-red-500"
                                />
                                <span className="text-gray-400 text-sm">–</span>
                                <input
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    placeholder="Max"
                                    className="w-20 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-red-500"
                                />
                            </div>
                        </div>

                        {/* Type */}
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] uppercase font-black text-gray-400 ml-2">Type</span>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-red-500"
                            >
                                <option value="">Any Type</option>
                                <option value="single">Single</option>
                                <option value="double">Double</option>
                                <option value="entire home">Entire Home</option>
                            </select>
                        </div>

                        {/* Rating */}
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] uppercase font-black text-gray-400 ml-2">Min Rating</span>
                            <select
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-red-500"
                            >
                                <option value="">Any</option>
                                <option value="3">3+ ★</option>
                                <option value="4">4+ ★</option>
                                <option value="4.5">4.5+ ★</option>
                            </select>
                        </div>

                        {/* Apply */}
                        <button
                            onClick={handleSubmit}
                            className="bg-black text-white px-6 py-2.5 rounded-xl text-sm font-bold self-end hover:bg-gray-800 transition-colors"
                        >
                            Apply Filters
                        </button>
                    </div>
                )}
            </div>

            {/* ── Hint bar (shown when location is not yet granted) ── */}
            {!hasLocation && !nearbyLoading && (
                <div className="max-w-7xl mx-auto px-6 mt-3">
                    <p className="text-xs text-gray-400 flex items-center gap-1.5">
                        <FiTarget className="w-3.5 h-3.5 text-red-400" />
                        Click <strong className="text-gray-600">Find Near Me</strong> to discover rooms within <strong className="text-red-500">2 km</strong> of your current location.
                    </p>
                </div>
            )}
        </div>
    );
};

export default LocationFilters;
