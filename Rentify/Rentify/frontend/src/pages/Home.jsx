import React, { useContext, useState, useEffect } from 'react'
import Nav from '../Component/Nav'
import Card from '../Component/Card';
import { ListingDataContext } from '../Context/ListingContext';
import { UserDataContext } from '../Context/UserContext';
import { useNavigate } from 'react-router-dom';
import MapView from '../Component/MapView';
import LocationFilters from '../Component/LocationFilters';
import { toast } from 'react-toastify';
import { FiSearch, FiMapPin, FiLoader } from 'react-icons/fi';

// Haversine formula – distance in km between two lat/lng points
function getDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function Home() {
    const { listingData, newListData, setNewListData, handleNearbySearch, nearbyListData, setNearbyListData, handleViewCard } = useContext(ListingDataContext);
    const { userData } = useContext(UserDataContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (userData?.role === 'owner') {
            navigate('/mylisting');
        }
    }, [userData, navigate]);

    const [viewMode, setViewMode] = useState('list');
    const [userLocation, setUserLocation] = useState(null);
    const [isSearchingNearby, setIsSearchingNearby] = useState(false);
    const [nearbyLoading, setNearbyLoading] = useState(false);
    const [nearbyRadius, setNearbyRadius] = useState(2); // default 2 km
    const isSearchResult = !isSearchingNearby && newListData.length > 0 && newListData !== listingData;

    // ── Find Near Me (fixed 2 km) ──────────────────────────────────────────
    const getBrowserLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }
        setNearbyLoading(true);
        toast.info("📍 Detecting your location...", { autoClose: 2000 });

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const loc = { lat: latitude, lng: longitude };
                setUserLocation(loc);
                setIsSearchingNearby(true);

                try {
                    // Always search 2km radius when using Find Near Me button
                    await handleNearbySearch({ lat: latitude, lng: longitude, radius: 2 });
                    setNearbyRadius(2);
                    toast.success("🏠 Showing rooms within 2 km of your location!");
                } catch (e) {
                    toast.error("Could not fetch nearby rooms. Try again.");
                } finally {
                    setNearbyLoading(false);
                }
            },
            (error) => {
                setNearbyLoading(false);
                if (error.code === 1) {
                    toast.error("📍 Location access denied. Please allow GPS in browser settings.");
                } else if (error.code === 2) {
                    toast.error("📍 Location unavailable. Make sure GPS is enabled.");
                } else {
                    toast.error("📍 Could not get location. Please try again.");
                }
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    // ── Filter search (uses custom radius from Filters panel) ──────────────
    const handleFilterSearch = (params) => {
        if (!userLocation) {
            toast.warning("📍 Click 'Find Near Me' first to get your location.");
            return;
        }
        setNearbyRadius(params.radius || 2);
        handleNearbySearch({ ...params, lat: userLocation.lat, lng: userLocation.lng });
    };

    const clearNearbySearch = () => {
        setIsSearchingNearby(false);
        setUserLocation(null);
        setNearbyListData([]);
    };

    const displayData = isSearchingNearby ? nearbyListData : newListData;

    return (
        <div className="min-h-screen bg-white">
            <Nav />
            <div className="pt-[144px] md:pt-[120px]">
                <LocationFilters
                    onSearch={handleFilterSearch}
                    onToggleView={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
                    viewMode={viewMode}
                    onGetLocation={getBrowserLocation}
                    nearbyLoading={nearbyLoading}
                    hasLocation={!!userLocation}
                />

                <div className="max-w-7xl mx-auto px-6 py-8">

                    {/* ── Nearby loading skeleton ── */}
                    {nearbyLoading && (
                        <div className="flex flex-col items-center justify-center py-20 gap-6">
                            <div className="relative w-20 h-20">
                                <div className="absolute inset-0 rounded-full bg-red-100 animate-ping opacity-60" />
                                <div className="relative w-20 h-20 rounded-full bg-red-500 flex items-center justify-center">
                                    <FiMapPin className="w-9 h-9 text-white" />
                                </div>
                            </div>
                            <div className="text-center">
                                <h3 className="text-xl font-black text-gray-800">Finding rooms near you...</h3>
                                <p className="text-gray-500 mt-1">Searching within <strong>2 km</strong> of your location</p>
                            </div>
                            {/* Skeleton cards */}
                            <div className="flex flex-wrap gap-6 justify-center mt-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-[300px] h-[380px] rounded-2xl bg-gray-100 animate-pulse" />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Nearby results banner ── */}
                    {!nearbyLoading && isSearchingNearby && (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-3 p-4 rounded-2xl bg-gradient-to-r from-red-50 to-orange-50 border border-red-100">
                            <div className="flex items-center gap-3">
                                {/* Pulsing dot */}
                                <div className="relative flex-shrink-0">
                                    <div className="w-3 h-3 bg-red-500 rounded-full animate-ping absolute" />
                                    <div className="w-3 h-3 bg-red-500 rounded-full relative" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-gray-900">
                                        {nearbyListData.length > 0
                                            ? `${nearbyListData.length} Room${nearbyListData.length > 1 ? 's' : ''} Found Near You`
                                            : 'No Rooms Found Nearby'}
                                    </h2>
                                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                                        <FiMapPin className="w-3.5 h-3.5 text-red-400" />
                                        Within <strong className="text-red-500 mx-1">{nearbyRadius} km</strong> of your location
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={clearNearbySearch}
                                className="text-sm text-red-500 font-bold border border-red-200 bg-white px-4 py-2 rounded-full hover:bg-red-500 hover:text-white transition-all flex-shrink-0"
                            >
                                ✕ Clear Nearby Search
                            </button>
                        </div>
                    )}

                    {/* ── Text search results banner ── */}
                    {isSearchResult && (
                        <div className="flex items-center justify-between mb-6 py-3 px-4 rounded-2xl bg-red-50 border border-red-100">
                            <div className="flex items-center gap-2 text-gray-700">
                                <FiSearch className="w-4 h-4 text-red-500" />
                                <span className="font-semibold">{newListData.length}</span>
                                <span className="text-sm">search result{newListData.length !== 1 ? 's' : ''} found</span>
                            </div>
                            <button
                                onClick={() => setNewListData(listingData)}
                                className="text-red-500 text-sm font-bold hover:underline"
                            >
                                ✕ Clear search
                            </button>
                        </div>
                    )}

                    {/* ── No nearby results empty state ── */}
                    {!nearbyLoading && isSearchingNearby && nearbyListData.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                                <FiMapPin className="w-9 h-9 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-black text-gray-700">No rooms within {nearbyRadius} km</h3>
                            <p className="text-gray-400 max-w-sm">There are no listings near your current location. Try expanding the radius using Filters, or explore all listings.</p>
                            <button
                                onClick={clearNearbySearch}
                                className="mt-2 bg-red-500 text-white px-6 py-3 rounded-full font-bold hover:bg-red-600 transition-all"
                            >
                                Browse All Listings
                            </button>
                        </div>
                    )}

                    {/* ── Grid / Map view ── */}
                    {!nearbyLoading && (
                        viewMode === 'map' ? (
                            <MapView
                                listings={displayData}
                                center={userLocation ? [userLocation.lat, userLocation.lng] : null}
                                onMarkerClick={handleViewCard}
                            />
                        ) : (
                            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                                {displayData.length > 0 ? (
                                    displayData.map((list) => {
                                        // Calculate distance if we have user location & listing coords
                                        let distKm = null;
                                        if (userLocation && list.location?.coordinates?.length === 2) {
                                            const [lng, lat] = list.location.coordinates;
                                            distKm = getDistanceKm(userLocation.lat, userLocation.lng, lat, lng);
                                        }
                                        return (
                                            <Card
                                                key={list._id}
                                                title={list.title}
                                                landMark={list.landMark}
                                                city={list.city}
                                                image1={list.image1}
                                                image2={list.image2}
                                                image3={list.image3}
                                                rent={list.rent}
                                                id={list._id}
                                                ratings={list.ratings}
                                                isBooked={list.isBooked}
                                                host={list.host}
                                                distanceKm={distKm}
                                            />
                                        );
                                    })
                                ) : (
                                    !isSearchingNearby && (
                                        <div className="text-center w-full py-20">
                                            <h3 className="text-xl font-bold text-gray-400">No listings found.</h3>
                                            <p className="text-gray-400">Try a different search or category.</p>
                                        </div>
                                    )
                                )}
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
