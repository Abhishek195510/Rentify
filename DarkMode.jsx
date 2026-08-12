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
