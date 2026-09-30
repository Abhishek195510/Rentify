import React, { useContext, useEffect, useRef, useState } from 'react'
import logo from '../assets/logo.png'
import { FiSearch, FiX } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";
import { MdWhatshot, MdBedroomParent, MdLocationOn } from "react-icons/md";
import { BiBuildingHouse } from "react-icons/bi";
import { IoBedOutline } from "react-icons/io5";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import { BsSunFill, BsMoonStarsFill } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import { AuthDataContext } from '../Context/AuthContext';
import axios from 'axios';
import { UserDataContext } from '../Context/UserContext';
import { ListingDataContext } from '../Context/ListingContext';
import { useTheme } from '../Context/ThemeContext';

function Nav() {
    const [showpopup, setShowpopup] = useState(false)
    const { userData, setUserData } = useContext(UserDataContext)
    const navigate = useNavigate()
    const { serverUrl } = useContext(AuthDataContext)
    const [cate, setCate] = useState("")
    const { listingData, setNewListData, searchData, setSearchData, handleSearch, handleViewCard } = useContext(ListingDataContext)
    const [input, setInput] = useState("")
    const [isSearching, setIsSearching] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)
    const searchRef = useRef(null)
    const dropdownRef = useRef(null)
    const debounceRef = useRef(null)
    const { isDark, toggleTheme } = useTheme()

    const handleLogOut = async () => {
        try {
            await axios.post(serverUrl + "/api/auth/logout", {}, { withCredentials: true })
            setUserData(null)
        } catch (error) {
            console.log(error)
        }
    }

    const handleCategory = (category) => {
        setCate(category)
        clearSearch()
        if (category === "trending") {
            setNewListData(listingData)
        } else {
            setNewListData(listingData.filter((list) => list.category === category))
        }
    }

    const handleClick = (id) => {
        if (userData) {
            handleViewCard(id)
        } else {
            navigate("/login")
        }
        clearSearch()
    }

    const clearSearch = () => {
        setInput("")
        setSearchData([])
        setShowDropdown(false)
    }

    // Apply search results to the main listing grid
    const applySearch = (results) => {
        if (results && results.length > 0) {
            setNewListData(results)
        }
        setShowDropdown(false)
    }

    // Debounced search as user types → shows dropdown only
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current)
        if (input.trim().length >= 1) {
            setIsSearching(true)
            debounceRef.current = setTimeout(async () => {
                await handleSearch(input.trim())
                setIsSearching(false)
                setShowDropdown(true)
            }, 350)
        } else {
            setSearchData([])
            setShowDropdown(false)
            setIsSearching(false)
            // If cleared, restore listing based on active category
            if (cate && cate !== "trending") {
                setNewListData(listingData.filter(l => l.category === cate))
            } else {
                setNewListData(listingData)
            }
        }
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
    }, [input])

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (
                searchRef.current && !searchRef.current.contains(e.target) &&
                dropdownRef.current && !dropdownRef.current.contains(e.target)
            ) {
                setShowDropdown(false)
            }
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])

    // Enter key → push results to grid
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault()
            if (searchData.length > 0) {
                applySearch(searchData)
            }
        }
        if (e.key === "Escape") {
            clearSearch()
        }
    }

    const highlightMatch = (text, query) => {
        if (!query || !text) return text
        const idx = text.toLowerCase().indexOf(query.toLowerCase())
        if (idx === -1) return text
        return (
            <>
                {text.slice(0, idx)}
                <mark style={{ background: "#fce4e4", color: "#b71c1c", borderRadius: 2, padding: "0 1px" }}>
                    {text.slice(idx, idx + query.length)}
                </mark>
                {text.slice(idx + query.length)}
            </>
        )
    }

    const categories = [
        { name: "Trending", id: "trending", icon: <MdWhatshot className='w-6 h-6' /> },
        { name: "Rooms", id: "rooms", icon: <MdBedroomParent className='w-6 h-6' /> },
        { name: "Flat", id: "flat", icon: <BiBuildingHouse className='w-6 h-6' /> },
        { name: "PG", id: "pg", icon: <IoBedOutline className='w-6 h-6' /> },
        { name: "Shops", id: "shops", icon: <SiHomeassistantcommunitystore className='w-6 h-6' /> },
    ];

    const SearchBox = ({ mobile = false }) => (
        <div className={mobile ? 'w-full relative' : 'w-[35%] relative hidden md:block'} ref={!mobile ? searchRef : undefined}>
            <div className={`flex items-center w-full border rounded-full transition-all ${showDropdown || document.activeElement === searchRef.current?.querySelector("input")
                ? "border-red-400 ring-4 ring-red-500/10 shadow-md"
                : "border-gray-200 shadow-sm"
                } bg-white overflow-hidden`}>
                {/* Search icon */}
                <span className="pl-4 text-gray-400 flex-shrink-0">
                    {isSearching
                        ? <span className="inline-block w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                        : <FiSearch className="w-5 h-5" />
                    }
                </span>

                {/* Input */}
                <input
                    id={mobile ? "search-input-mobile" : "search-input"}
                    type="text"
                    className={`flex-1 px-3 outline-none bg-transparent text-gray-800 placeholder:text-gray-400 ${mobile ? "py-2.5 text-sm" : "py-3 text-base"}`}
                    placeholder="Search city, landmark, room title..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => { if (searchData.length > 0) setShowDropdown(true) }}
                    autoComplete="off"
                />

                {/* Clear button */}
                {input && (
                    <button
                        type="button"
                        onClick={clearSearch}
                        className="px-2 text-gray-400 hover:text-gray-600 flex-shrink-0 transition-colors"
                        tabIndex={-1}
                    >
                        <FiX className="w-4 h-4" />
                    </button>
                )}

                {/* Search button */}
                <button
                    id={mobile ? "search-btn-mobile" : "search-btn"}
                    type="button"
                    className={`flex-shrink-0 bg-red-500 hover:bg-red-600 active:scale-95 transition-all rounded-full text-white m-1 flex items-center justify-center ${mobile ? "w-8 h-8" : "w-9 h-9"}`}
                    onClick={() => applySearch(searchData)}
                >
                    <FiSearch className={mobile ? "w-4 h-4" : "w-5 h-5"} />
                </button>
            </div>

            {/* ── Dropdown ── */}
            {showDropdown && (
                <div
                    ref={!mobile ? dropdownRef : undefined}
                    className="absolute top-[calc(100%+8px)] left-0 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                    style={{ maxHeight: 360, overflowY: "auto" }}
                >
                    {isSearching ? (
                        <div className="flex items-center justify-center py-8 text-gray-400 gap-3">
                            <span className="inline-block w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                            Searching...
                        </div>
                    ) : searchData.length === 0 ? (
                        <div className="flex flex-col items-center py-8 text-gray-400 gap-2">
                            <FiSearch className="w-8 h-8 opacity-30" />
                            <span className="text-sm">No results for "<strong>{input}</strong>"</span>
                        </div>
                    ) : (
                        <>
                            {/* Header */}
                            <div className="px-4 pt-3 pb-1 flex items-center justify-between">
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                    {searchData.length} result{searchData.length > 1 ? "s" : ""} found
                                </span>
                                <button
                                    className="text-xs text-red-500 font-semibold hover:underline"
                                    onClick={() => applySearch(searchData)}
                                >
                                    Show all →
                                </button>
                            </div>

                            {/* Results list */}
                            {searchData.map((item) => (
                                <div
                                    key={item._id}
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-t border-gray-50 first:border-0"
                                    onClick={() => handleClick(item._id)}
                                >
                                    {/* Thumbnail */}
                                    {item.image1 ? (
                                        <img
                                            src={item.image1}
                                            alt={item.title}
                                            className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                                            <MdLocationOn className="w-6 h-6 text-red-400" />
                                        </div>
                                    )}

                                    {/* Text */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-800 text-sm truncate">
                                            {highlightMatch(item.title, input)}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            <MdLocationOn className="inline w-3 h-3 mr-0.5 text-red-400" />
                                            {highlightMatch(item.landMark, input)}, {highlightMatch(item.city, input)}
                                        </p>
                                    </div>

                                    {/* Rent */}
                                    <span className="text-sm font-bold text-red-500 flex-shrink-0">
                                        ₹{item.rent}<span className="text-xs font-normal text-gray-400">/month</span>
                                    </span>
                                </div>
                            ))}

                            {/* Footer: push to grid */}
                            <div
                                className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-center cursor-pointer hover:bg-red-50 transition-colors"
                                onClick={() => applySearch(searchData)}
                            >
                                <span className="text-sm font-semibold text-red-500">
                                    View all {searchData.length} results in grid ↓
                                </span>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    )

    return (
        <div className='fixed top-0 bg-white z-[50] w-full shadow-sm'>
            <div className='w-full min-h-[80px] border-b border-gray-100 px-5 flex items-center justify-between md:px-10'>
                {/* Logo */}
                <div className='flex items-center h-full'>
                    <img 
                        src={logo} 
                        alt="Rentify Logo" 
                        className='h-[80px] md:h-[120px] w-auto object-contain active:scale-95 transition-transform cursor-pointer' 
                        onClick={() => {
                            if (userData?.role === 'owner') {
                                navigate("/mylisting");
                            } else {
                                navigate("/");
                            }
                        }} 
                    />
                </div>

                {/* Desktop search */}
                <SearchBox />

                {/* Right side */}
                <div className='flex items-center gap-4 relative'>

                    {/* ─── DARK / LIGHT ICON TOGGLE ─── */}
                    <button
                        id="theme-toggle-btn"
                        onClick={toggleTheme}
                        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        className='w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 hover:shadow-md transition-all active:scale-90'
                        style={{
                            background: isDark ? '#1e1b2e' : '#fdf6e3',
                            borderColor: isDark ? 'rgba(139,92,246,0.4)' : 'rgba(251,191,36,0.5)',
                            boxShadow: isDark
                                ? '0 0 10px rgba(139,92,246,0.25)'
                                : '0 0 10px rgba(251,191,36,0.2)',
                            transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                        }}
                    >
                        {isDark
                            ? <BsSunFill className='w-4 h-4' style={{ color: '#fbbf24' }} />
                            : <BsMoonStarsFill className='w-4 h-4' style={{ color: '#7c3aed' }} />
                        }
                    </button>
                    <button
                        className='px-4 py-2 flex items-center gap-3 border border-gray-200 rounded-full hover:shadow-md transition-shadow active:scale-95 bg-white'
                        onClick={() => setShowpopup(prev => !prev)}
                    >
                        <GiHamburgerMenu className='w-4 h-4 text-gray-600' />
                        {userData == null ? (
                            <div className='w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500'>
                                <CgProfile className='w-6 h-6' />
                            </div>
                        ) : (
                            <div className='w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm'>
                                {userData?.name?.slice(0, 1)?.toUpperCase()}
                            </div>
                        )}
                    </button>

                    {showpopup && (
                        <div className='w-56 absolute bg-white top-[120%] right-0 border border-gray-100 shadow-xl z-10 rounded-2xl overflow-hidden py-2 animate-in fade-in slide-in-from-top-2'>
                            <ul className='flex flex-col'>
                                {!userData ? (
                                    <li className='px-4 py-3 hover:bg-gray-50 cursor-pointer font-medium' onClick={() => { navigate("/login"); setShowpopup(false) }}>Login</li>
                                ) : (
                                    <li className='px-4 py-3 hover:bg-gray-50 cursor-pointer font-medium text-red-500' onClick={() => { handleLogOut(); setShowpopup(false) }}>Logout</li>
                                )}
                                <div className='h-[1px] bg-gray-100 my-1' />
                                <li className='px-4 py-3 hover:bg-gray-50 cursor-pointer' onClick={() => { navigate("/profile"); setShowpopup(false) }}>My Profile</li>
                                {userData?.role === "owner" ? (
                                    <li className='px-4 py-3 hover:bg-gray-50 cursor-pointer' onClick={() => { navigate("/mylisting"); setShowpopup(false) }}>My Listing</li>
                                ) : (
                                    <li className='px-4 py-3 hover:bg-gray-50 cursor-pointer' onClick={() => { navigate("/mybooking"); setShowpopup(false) }}>My Booking</li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile search bar */}
            <div className='w-full h-16 flex items-center justify-center md:hidden border-b border-gray-100 px-4'>
                <SearchBox mobile={true} />
            </div>

        </div>
    );
}

export default Nav
