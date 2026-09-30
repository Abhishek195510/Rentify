import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CompareContext } from '../Context/CompareContext';
import { ListingDataContext } from '../Context/ListingContext';
import { FiArrowLeft, FiTrash2, FiMapPin, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { FaStar } from "react-icons/fa";

function Compare() {
    const { compareList, toggleCompare, clearCompare } = useContext(CompareContext);
    const { handleViewCard } = useContext(ListingDataContext);
    const navigate = useNavigate();

    if (compareList.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
                    <FiMapPin className="w-10 h-10 text-gray-400" />
                </div>
                <h2 className="text-2xl font-black text-gray-800 mb-2">No Rooms Selected</h2>
                <p className="text-gray-500 mb-6 max-w-md text-center">You haven't selected any rooms to compare. Go back to the home page and select "Compare" on the rooms you like.</p>
                <button
                    onClick={() => navigate('/')}
                    className="px-8 py-3 bg-red-500 text-white font-bold rounded-full hover:bg-red-600 transition-colors shadow-md hover:-translate-y-1"
                >
                    Browse Rooms
                </button>
            </div>
        );
    }

    // Helper to extract or mock data
    const getMockData = (room) => ({
        size: Math.floor(Math.random() * (1200 - 400 + 1) + 400) + ' sq ft',
        amenities: ['WiFi', 'AC', 'Parking', 'Kitchen'].sort(() => 0.5 - Math.random()).slice(0, 3)
    });

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <FiArrowLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <h1 className="text-xl md:text-2xl font-black text-gray-900">Compare Rooms</h1>
                </div>
                <button
                    onClick={() => { clearCompare(); navigate('/'); }}
                    className="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-700 hover:underline px-4 py-2 rounded-lg"
                >
                    <FiTrash2 className="w-4 h-4" />
                    <span className="hidden sm:block">Clear All</span>
                </button>
            </div>

            {/* Comparison Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 overflow-x-auto">
                <div className="min-w-[800px] flex gap-6">
                    {/* Attributes Column */}
                    <div className="w-48 flex-shrink-0 flex flex-col pt-64 divide-y divide-gray-100">
                        <div className="h-16 flex items-center text-sm font-bold text-gray-400 uppercase tracking-wider">Monthly Rent</div>
                        <div className="h-16 flex items-center text-sm font-bold text-gray-400 uppercase tracking-wider">Location</div>
                        <div className="h-16 flex items-center text-sm font-bold text-gray-400 uppercase tracking-wider">Rating</div>
                        <div className="h-16 flex items-center text-sm font-bold text-gray-400 uppercase tracking-wider">Room Type</div>
                        <div className="h-16 flex items-center text-sm font-bold text-gray-400 uppercase tracking-wider">Est. Size</div>
                        <div className="h-24 flex items-center text-sm font-bold text-gray-400 uppercase tracking-wider">Amenities</div>
                        <div className="h-16 flex items-center text-sm font-bold text-gray-400 uppercase tracking-wider">Availability</div>
                    </div>

                    {/* Room Columns */}
                    {compareList.map((room) => {
                        const mock = getMockData(room);
                        const isCheapest = Math.min(...compareList.map(r => r.rent)) === room.rent;
                        const isHighestRated = Math.max(...compareList.map(r => r.ratings || 0)) === (room.ratings || 0) && room.ratings > 0;

                        return (
                            <div key={room._id} className="flex-1 min-w-[280px] max-w-[350px] flex flex-col bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all relative group">
                                {/* Remove button */}
                                <button
                                    onClick={() => toggleCompare(room)}
                                    className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-white shadow-sm transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <FiTrash2 className="w-4 h-4" />
                                </button>

                                {/* Image & Title */}
                                <div className="h-64 flex flex-col">
                                    <div className="h-40 w-full relative">
                                        <img src={room.image1} alt={room.title} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col justify-center border-b border-gray-100">
                                        <h3 className="font-bold text-lg text-gray-900 line-clamp-2 leading-tight">{room.title}</h3>
                                    </div>
                                </div>

                                {/* Comparison Stats */}
                                <div className="flex flex-col divide-y divide-gray-50">
                                    {/* Rent */}
                                    <div className={`h-16 px-4 flex items-center justify-center ${isCheapest ? 'bg-green-50' : ''}`}>
                                        <span className={`text-2xl font-black ${isCheapest ? 'text-green-600' : 'text-gray-900'}`}>
                                            ₹{room.rent?.toLocaleString()}
                                            {isCheapest && <span className="ml-2 text-[10px] uppercase font-bold bg-green-200 text-green-800 px-2 py-1 rounded-md">Best</span>}
                                        </span>
                                    </div>

                                    {/* Location */}
                                    <div className="h-16 px-4 flex items-center justify-center text-center">
                                        <span className="text-sm font-medium text-gray-700">{room.landMark}, {room.city}</span>
                                    </div>

                                    {/* Rating */}
                                    <div className={`h-16 px-4 flex items-center justify-center gap-1 ${isHighestRated ? 'bg-amber-50' : ''}`}>
                                        <FaStar className={`w-4 h-4 ${isHighestRated ? 'text-amber-500' : 'text-gray-300'}`} />
                                        <span className={`font-bold ${isHighestRated ? 'text-amber-700 text-lg' : 'text-gray-600 text-base'}`}>
                                            {room.ratings ? room.ratings : 'New'}
                                        </span>
                                        {isHighestRated && <span className="ml-1 text-[10px] uppercase font-bold bg-amber-200 text-amber-800 px-2 py-1 rounded-md">Top</span>}
                                    </div>

                                    {/* Room Type */}
                                    <div className="h-16 px-4 flex items-center justify-center">
                                        <span className="text-sm font-bold text-gray-700 capitalize bg-gray-100 px-3 py-1.5 rounded-lg">{room.category}</span>
                                    </div>

                                    {/* Size (Mocked) */}
                                    <div className="h-16 px-4 flex items-center justify-center">
                                        <span className="text-sm font-medium text-gray-600">{mock.size}</span>
                                    </div>

                                    {/* Amenities (Mocked) */}
                                    <div className="h-24 px-4 flex items-center justify-center">
                                        <div className="flex flex-wrap gap-1.5 justify-center">
                                            {mock.amenities.map(am => (
                                                <span key={am} className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-1 rounded-md">{am}</span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Availability */}
                                    <div className="h-16 px-4 flex items-center justify-center">
                                        {room.isBooked ? (
                                            <div className="flex items-center gap-1.5 text-gray-400 font-bold text-sm bg-gray-50 px-3 py-1.5 rounded-lg">
                                                <FiXCircle className="w-4 h-4" /> Booked
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-sm bg-emerald-50 px-3 py-1.5 rounded-lg">
                                                <FiCheckCircle className="w-4 h-4" /> Available
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Bottom Action */}
                                <div className="p-4 mt-auto">
                                   <button 
                                      onClick={() => handleViewCard(room._id)} 
                                      className={`w-full py-3 rounded-xl font-bold text-white transition-transform active:scale-95 ${room.isBooked ? 'bg-gray-300 cursor-not-allowed' : 'bg-black hover:bg-gray-800 shadow-lg glow'}`}
                                      disabled={room.isBooked}
                                   >
                                       {room.isBooked ? 'Unavailable' : 'View Details'}
                                   </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Final Verdict Section */}
            {compareList.length >= 2 && (() => {
                const sortedByRent = [...compareList].sort((a, b) => a.rent - b.rent);
                const sortedByRating = [...compareList].sort((a, b) => (b.ratings || 0) - (a.ratings || 0));
                
                const cheapest = sortedByRent[0];
                const mostExpensive = sortedByRent[sortedByRent.length - 1];
                const highestRated = sortedByRating[0];
                
                const savings = mostExpensive.rent - cheapest.rent;
                const isSameWinner = cheapest._id === highestRated._id;

                return (
                    <div className="mt-12 mb-24 max-w-5xl mx-auto px-6">
                        <div className="bg-gray-900 rounded-[40px] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                            {/* Decorative background glow */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-[120px] -mr-48 -mt-48" />
                            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -ml-48 -mb-48" />

                            <div className="relative z-10">
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                                    <div>
                                        <h2 className="text-3xl md:text-4xl font-black mb-2 flex items-center gap-3">
                                            <span className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-600 rounded-2xl shadow-lg transform -rotate-3">🏆</span>
                                            Final Verdict
                                        </h2>
                                        <p className="text-gray-400 text-lg">We've compared the data to find your perfect match.</p>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
                                        <span className="text-gray-400 text-sm">Comparing</span>
                                        <div className="text-xl font-black">{compareList.length} Properties</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Best Value Card */}
                                    <div className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="text-xs font-black text-green-400 uppercase tracking-[0.2em]">The Budget Choice</div>
                                            <div className="w-10 h-10 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center font-bold">₹</div>
                                        </div>
                                        <h3 className="text-2xl font-bold mb-3 group-hover:text-green-400 transition-colors">{cheapest.title}</h3>
                                        <p className="text-gray-400 leading-relaxed mb-6">
                                            This is your best financial move. You'll save <span className="text-white font-bold">₹{savings.toLocaleString()}</span> every month compared to the most expensive option.
                                        </p>
                                        <button onClick={() => handleViewCard(cheapest._id)} className="text-sm font-bold text-white border-b-2 border-green-500 pb-1 hover:text-green-400 transition-colors">
                                            Select Best Value →
                                        </button>
                                    </div>

                                    {/* Premium Choice Card */}
                                    <div className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="text-xs font-black text-amber-400 uppercase tracking-[0.2em]">The Top Rated</div>
                                            <div className="w-10 h-10 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center font-bold">★</div>
                                        </div>
                                        <h3 className="text-2xl font-bold mb-3 group-hover:text-amber-400 transition-colors">{highestRated.title}</h3>
                                        <p className="text-gray-400 leading-relaxed mb-6">
                                            With a rating of <span className="text-white font-bold">{highestRated.ratings || '5.0'}</span>, this property offers superior comfort and verified quality.
                                        </p>
                                        <button onClick={() => handleViewCard(highestRated._id)} className="text-sm font-bold text-white border-b-2 border-amber-500 pb-1 hover:text-amber-400 transition-colors">
                                            Select Premium →
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-10 p-8 bg-gradient-to-r from-red-600 to-orange-600 rounded-[32px] text-center shadow-xl">
                                    <p className="text-xs font-black uppercase tracking-[0.3em] text-white/80 mb-2">Our Recommendation</p>
                                    <h3 className="text-2xl md:text-3xl font-black">
                                        {isSameWinner 
                                            ? `Go for ${cheapest.title} – it's the clear winner for both price and quality!` 
                                            : `Choose ${cheapest.title} for maximum savings, or invest in ${highestRated.title} for a better living experience.`}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}

export default Compare;
