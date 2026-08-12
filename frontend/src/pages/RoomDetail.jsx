import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ListingDataContext } from '../Context/ListingContext';
import { UserDataContext } from '../Context/UserContext';
import { AuthDataContext } from '../Context/AuthContext';
import { bookingDataContext } from '../Context/BookingContext';
import Nav from '../Component/Nav';
import MapView from '../Component/MapView';
import Card from '../Component/Card';

import {
    FaStar, FaWifi, FaParking, FaSnowflake, FaTv, FaBath,
    FaMapMarkerAlt, FaUserCircle, FaShieldAlt, FaRulerCombined
} from "react-icons/fa";
import {
    FiHeart, FiShare2, FiChevronLeft, FiChevronRight,
    FiX, FiArrowLeft, FiEdit3, FiTrash2, FiCheck, FiClock,
    FiCalendar, FiZap
} from "react-icons/fi";
import { MdVerified, MdOutlineKingBed } from "react-icons/md";
import { useTheme } from '../Context/ThemeContext';

function RoomDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { serverUrl } = useContext(AuthDataContext);
    const { userData } = useContext(UserDataContext);
    const { updating, setUpdating, deleting, setDeleting, setCardDetails } = useContext(ListingDataContext);
    const { checkIn, setCheckIn, checkOut, setCheckOut, total, setTotal, night, setNight, handleBooking, booking } = useContext(bookingDataContext);

    const [room, setRoom] = useState(null);
    const [similarRooms, setSimilarRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [imgIdx, setImgIdx] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [bookingPopUp, setBookingPopUp] = useState(false);
    const [updatePopUp, setUpdatePopUp] = useState(false);
    const { isDark } = useTheme();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [backEndImage1, setBackEndImage1] = useState(null);
    const [backEndImage2, setBackEndImage2] = useState(null);
    const [backEndImage3, setBackEndImage3] = useState(null);
    const [rent, setRent] = useState('');
    const [city, setCity] = useState('');
    const [landmark, setLandmark] = useState('');
    const [minDate, setMinDate] = useState('');

    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${serverUrl}/api/listing/findlistingbyid/${id}`, { withCredentials: true });
                const r = res.data;
                setRoom(r);
                setCardDetails(r);
                setTitle(r.title); setDescription(r.description);
                setRent(r.rent); setCity(r.city); setLandmark(r.landMark);
                if (r.location?.coordinates?.length === 2) {
                    const similarRes = await axios.get(`${serverUrl}/api/listing/nearby?latitude=${r.location.coordinates[1]}&longitude=${r.location.coordinates[0]}&radius=10&roomType=${r.roomType}`);
                    setSimilarRooms(similarRes.data.filter(item => item._id !== id).slice(0, 4));
                }
            } catch (e) {
                toast.error('Error loading room details'); navigate('/');
            } finally { setLoading(false); }
        };
        fetchRoom();
    }, [id, serverUrl]);

    useEffect(() => { setMinDate(new Date().toISOString().split('T')[0]); }, []);

    useEffect(() => {
        if (checkIn && checkOut && room) {
            const n = (new Date(checkOut) - new Date(checkIn)) / 86400000;
            setNight(n);
            if (n > 0) setTotal((room.rent * n) + room.rent * 0.14);
            else setTotal(0);
        }
    }, [checkIn, checkOut, room]);

    const handleUpdateListing = async () => {
        setUpdating(true);
        try {
            const fd = new FormData();
            fd.append('title', title); fd.append('description', description);
            fd.append('rent', rent); fd.append('city', city); fd.append('landMark', landmark);
            if (backEndImage1) fd.append('image1', backEndImage1);
            if (backEndImage2) fd.append('image2', backEndImage2);
            if (backEndImage3) fd.append('image3', backEndImage3);
            await axios.post(`${serverUrl}/api/listing/update/${id}`, fd, { withCredentials: true });
            toast.success('Listing Updated');
            setUpdatePopUp(false);
            const res = await axios.get(`${serverUrl}/api/listing/findlistingbyid/${id}`, { withCredentials: true });
            setRoom(res.data); setCardDetails(res.data);
        } catch (e) { toast.error(e.response?.data?.message || 'Update failed'); }
        finally { setUpdating(false); }
    };

    const handleDeleteListing = async () => {
        setDeleting(true);
        try {
            await axios.delete(`${serverUrl}/api/listing/delete/${id}`, { withCredentials: true });
            toast.success('Listing Deleted'); navigate('/');
        } catch (e) { toast.error(e.response?.data?.message || 'Delete failed'); }
        finally { setDeleting(false); }
    };

    const confirmBooking = async () => {
        if (!checkIn || !checkOut || night <= 0) { toast.error('Please select valid dates!'); return; }
        await handleBooking(room._id);
        if (!booking) setBookingPopUp(false);
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!reviewComment.trim()) return toast.error('Please enter a comment');
        setSubmittingReview(true);
        try {
            const res = await axios.post(`${serverUrl}/api/listing/review/${id}`, {
                rating: reviewRating,
                comment: reviewComment
            }, { withCredentials: true });
            toast.success('Review added successfully');
            setRoom(res.data);
            setReviewComment('');
            setReviewRating(5);
            setCardDetails(res.data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading || !room) return (
        <div style={{ minHeight: '100vh', background: isDark ? '#0a0a0f' : '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20 }}>
            <div style={{ width: 48, height: 48, border: '3px solid #ffffff15', borderTopColor: '#e63946', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ color: '#ffffff40', fontSize: 14, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Loading room details</p>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
    );

    const images = [room.image1, room.image2, room.image3].filter(Boolean);
    const mockSize = Math.floor(room.rent / 15) + 200;
    const isOwner = room.host === userData?._id;

    // ─── THEME TOKENS ───
    const T = {
        bg:          isDark ? '#0b0c10'                : '#ffffff',
        bgSub:       isDark ? '#0f1117'                : '#f9fafb',
        card:        isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
        cardBorder:  isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)',
        panel:       isDark ? 'rgba(11,12,16,0.95)'   : '#ffffff',
        panelBorder: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)',
        text1:       isDark ? '#f0f2f8'                : '#0f172a',
        text2:       isDark ? '#9ca3af'                : '#475569',
        text3:       isDark ? '#4b5563'                : '#94a3b8',
        divider:     isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
        inputBg:     isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc',
        inputBdr:    isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)',
        btnSecBg:    isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
        btnSecBdr:   isDark ? 'rgba(255,255,255,0.1)'  : 'rgba(0,0,0,0.1)',
        btnSecClr:   isDark ? '#9ca3af'                : '#475569',
        shadow:      isDark ? 'none'                   : '0 20px 60px rgba(0,0,0,0.08)',
        sidebarShadow: isDark ? 'none'                 : '0 8px 40px rgba(0,0,0,0.12)',
    };

    const amenities = [
        { icon: <FaWifi />, label: 'Fast WiFi', color: '#3b82f6' },
        { icon: <FaSnowflake />, label: 'Air Conditioning', color: '#06b6d4' },
        { icon: <FaParking />, label: 'Free Parking', color: '#10b981' },
        { icon: <FaTv />, label: 'Smart TV', color: '#8b5cf6' },
        { icon: <FaBath />, label: 'Private Bath', color: '#f59e0b' },
        { icon: <FaShieldAlt />, label: 'Security 24/7', color: '#e63946' },
    ];

    const highlights = [
        { icon: <MdOutlineKingBed size={22} />, title: 'Premium Bedding', desc: 'Hotel-grade linen & pillows', bg: '#1a1a2e' },
        { icon: <FiZap size={20} />, title: 'Instant Booking', desc: 'No waiting for approval', bg: '#1a1a2e' },
        { icon: <FaShieldAlt size={18} />, title: 'Verified Listing', desc: 'ID-checked & inspected', bg: '#1a1a2e' },
    ];

    return (
        <div style={{ minHeight: '100vh', background: T.bg, fontFamily: "'Inter', system-ui, sans-serif", color: T.text1, transition: 'background 0.35s, color 0.35s' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
                @keyframes spin{to{transform:rotate(360deg)}}
                @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
                @keyframes heartbeat{0%,100%{transform:scale(1)}50%{transform:scale(1.3)}}
                @keyframes toggleSlide{from{transform:translateX(0)}to{transform:translateX(24px)}}
                .hero-img { transition: transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94); }
                .hero-img:hover { transform: scale(1.04); }
                .btn-glow:hover { box-shadow: 0 0 30px #e6394640, 0 8px 25px #e6394630; }
                .am-card:hover { transform: translateY(-2px); }
                .fade-in { animation: fadeUp 0.6s ease forwards; }
                input[type="date"]::-webkit-calendar-picker-indicator { filter: ${isDark ? 'invert(1)' : 'none'}; opacity: 0.5; cursor: pointer; }
                ::-webkit-scrollbar{width:4px}
                ::-webkit-scrollbar-track{background:${T.bg}}
                ::-webkit-scrollbar-thumb{background:${isDark ? '#ffffff20' : '#00000015'};border-radius:2px}
            `}</style>

            <Nav />

            {/* ─── HERO SECTION ─── */}
            <div style={{ paddingTop: 80 }}>
                <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px 0' }}>

                    {/* Back + Title Row */}
                    <div className="fade-in" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
                        <div style={{ flex: 1 }}>
                            <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: T.btnSecBg, border: `1px solid ${T.btnSecBdr}`, borderRadius: 12, padding: '8px 16px', color: T.btnSecClr, fontSize: 13, fontWeight: 600, cursor: 'pointer', marginBottom: 20, transition: 'all 0.2s' }}>
                                <FiArrowLeft size={14} /> Back
                            </button>

                            {/* Category badge */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                                <span style={{ background: 'linear-gradient(135deg, #e63946, #c1121f)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                                    {room.category}
                                </span>
                                {room.ratings ? (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b', fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>
                                        <FaStar size={10} /> {room.ratings}
                                    </span>
                                ) : (
                                    <span style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>NEW</span>
                                )}
                                <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6b7280', fontSize: 13 }}>
                                    <MdVerified style={{ color: '#3b82f6' }} /> Verified
                                </span>
                            </div>

                            <h1 style={{ fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 900, color: T.text1, lineHeight: 1.2, margin: '0 0 12px', letterSpacing: '-0.02em' }}>
                                {room.title}
                            </h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: T.text2, fontSize: 14, fontWeight: 500 }}>
                                <FaMapMarkerAlt style={{ color: '#e63946', flexShrink: 0 }} />
                                <span style={{ color: T.text2 }}>{room.landMark}, {room.city}</span>
                                <span style={{ color: T.text3 }}>•</span>
                                <span style={{ color: T.text2 }}>{mockSize} sq ft</span>
                                <span style={{ color: T.text3 }}>•</span>
                                <span style={{ color: T.text2 }}>{room.roomType}</span>
                            </div>
                        </div>

                        {/* Action buttons (no toggle here — moved to Nav) */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 48 }}>
                            <button style={{ display: 'flex', alignItems: 'center', gap: 7, background: T.btnSecBg, border: `1px solid ${T.btnSecBdr}`, borderRadius: 14, padding: '10px 18px', color: T.btnSecClr, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                                <FiShare2 size={14} /> Share
                            </button>
                            <button onClick={() => setIsFavorite(f => !f)} style={{ display: 'flex', alignItems: 'center', gap: 7, background: isFavorite ? 'rgba(230,57,70,0.15)' : T.btnSecBg, border: `1px solid ${isFavorite ? 'rgba(230,57,70,0.4)' : T.btnSecBdr}`, borderRadius: 14, padding: '10px 18px', color: isFavorite ? '#e63946' : T.btnSecClr, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', animation: isFavorite ? 'heartbeat 0.4s ease' : 'none' }}>
                                <FiHeart size={14} style={{ fill: isFavorite ? '#e63946' : 'none' }} /> {isFavorite ? 'Saved' : 'Save'}
                            </button>
                        </div>
                    </div>

                    {/* ─── PHOTO GRID ─── */}
                    <div className="fade-in" style={{ borderRadius: 24, overflow: 'hidden', marginBottom: 56, position: 'relative', height: 'clamp(280px, 50vw, 540px)', display: 'grid', gridTemplateColumns: '2fr 1fr', gridTemplateRows: '1fr 1fr', gap: 3, boxShadow: T.shadow }}>
                        {/* Main Image */}
                        <div style={{ gridRow: '1 / 3', overflow: 'hidden', position: 'relative' }}>
                            <img src={images[0]} alt={room.title} className="hero-img" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(11,12,16,0.4) 0%, transparent 50%)' }} />
                        </div>
                        {/* Sub images */}
                        <div style={{ overflow: 'hidden', position: 'relative' }}>
                            <img src={images[1] || images[0]} alt="" className="hero-img" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        </div>
                        <div style={{ overflow: 'hidden', position: 'relative' }}>
                            <img src={images[2] || images[0]} alt="" className="hero-img" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                            {/* Show all photos */}
                            <button style={{ position: 'absolute', bottom: 16, right: 16, background: 'rgba(11,12,16,0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, padding: '8px 14px', color: '#e8eaf0', fontSize: 12, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.04em' }}>
                                All Photos
                            </button>
                        </div>
                    </div>

                    {/* ─── MAIN LAYOUT ─── */}
                    <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start', flexWrap: 'wrap' }}>

                        {/* LEFT — Main Content */}
                        <div style={{ flex: 1, minWidth: 300 }} className="fade-in">

                        {/* HIGHLIGHTS */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 40 }}>
                                {highlights.map((h, i) => (
                                    <div key={i} style={{ borderRadius: 16, padding: '16px 18px', display: 'flex', gap: 12, alignItems: 'flex-start', background: T.card, border: `1px solid ${T.cardBorder}` }}>
                                        <div style={{ color: '#e63946', marginTop: 2 }}>{h.icon}</div>
                                        <div>
                                            <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: T.text1 }}>{h.title}</p>
                                            <p style={{ margin: 0, fontSize: 11, color: T.text3, marginTop: 2 }}>{h.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* HOST ROW */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 0', borderTop: `1px solid ${T.divider}`, borderBottom: `1px solid ${T.divider}`, marginBottom: 32 }}>
                                <div>
                                    <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 800, color: T.text1 }}>{room.category?.charAt(0).toUpperCase() + room.category?.slice(1)} in {room.city}</h2>
                                    <p style={{ margin: 0, fontSize: 14, color: T.text2, display: 'flex', gap: 8, alignItems: 'center' }}>
                                        <FaRulerCombined style={{ color: T.text3 }} /> {mockSize} sq ft
                                        <span style={{ color: T.text3 }}>•</span>
                                        {room.roomType}
                                    </p>
                                </div>
                                <div style={{ width: 56, height: 56, borderRadius: '50%', background: isDark ? 'linear-gradient(135deg, #1f2937, #111827)' : 'linear-gradient(135deg, #e2e8f0, #f1f5f9)', border: `2px solid ${T.cardBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <FaUserCircle style={{ width: 40, height: 40, color: isDark ? '#4b5563' : '#94a3b8' }} />
                                </div>
                            </div>

                            {/* DESCRIPTION */}
                            <div style={{ marginBottom: 40 }}>
                                <h2 style={{ margin: '0 0 16px', fontSize: 20, fontWeight: 800, color: T.text1 }}>About this space</h2>
                                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.8, color: T.text2, whiteSpace: 'pre-wrap' }}>{room.description}</p>
                            </div>

                            {/* AMENITIES */}
                            <div style={{ marginBottom: 40, paddingBottom: 40, borderBottom: `1px solid ${T.divider}` }}>
                                <h2 style={{ margin: '0 0 20px', fontSize: 20, fontWeight: 800, color: T.text1 }}>What this place offers</h2>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
                                    {amenities.map((am, i) => (
                                        <div key={i} className="am-card" style={{ borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.2s', cursor: 'default', background: T.card, border: `1px solid ${T.cardBorder}` }}>
                                            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${am.color}20`, border: `1px solid ${am.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: am.color, fontSize: 15, flexShrink: 0 }}>
                                                {am.icon}
                                            </div>
                                            <span style={{ fontSize: 13, fontWeight: 600, color: T.text2 }}>{am.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* MAP */}
                            <div style={{ marginBottom: 40 }}>
                                <h2 style={{ margin: '0 0 20px', fontSize: 20, fontWeight: 800, color: T.text1 }}>
                                    Where you'll be
                                </h2>
                                <div style={{ borderRadius: 20, overflow: 'hidden', border: `1px solid ${T.cardBorder}` }}>
                                    {room.location?.coordinates?.length === 2 ? (
                                        <MapView listings={[room]} center={[room.location.coordinates[1], room.location.coordinates[0]]} onMarkerClick={() => {}} />
                                    ) : (
                                        <div style={{ background: T.card, border: `1px solid ${T.cardBorder}`, height: 280, borderRadius: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                                            <FaMapMarkerAlt style={{ fontSize: 32, color: T.text3 }} />
                                            <p style={{ margin: 0, color: T.text3, fontSize: 14, fontWeight: 600 }}>Map data not available</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* REVIEWS */}
                            <div style={{ marginBottom: 40, borderTop: `1px solid ${T.divider}`, paddingTop: 40 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                                    <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: T.text1 }}>Reviews</h2>
                                    {room.reviews && room.reviews.length > 0 && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b', fontSize: 13, fontWeight: 700, padding: '4px 12px', borderRadius: 20 }}>
                                            <FaStar size={12} /> {room.ratings} ({room.reviews.length})
                                        </div>
                                    )}
                                </div>
                                
                                <div style={{ display: 'grid', gap: 20, marginBottom: 32 }}>
                                    {room.reviews && room.reviews.length > 0 ? (
                                        room.reviews.map((rev, index) => (
                                            <div key={index} style={{ padding: 20, background: T.card, border: `1px solid ${T.cardBorder}`, borderRadius: 16 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #e2e8f0, #f1f5f9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <FaUserCircle size={28} color="#94a3b8" />
                                                        </div>
                                                        <div>
                                                            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T.text1 }}>{rev.user?.name || "User"}</p>
                                                            <p style={{ margin: 0, fontSize: 12, color: T.text3 }}>{new Date(rev.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#f59e0b' }}>
                                                        {[...Array(5)].map((_, i) => (
                                                            <FaStar key={i} size={12} color={i < rev.rating ? "#f59e0b" : T.cardBorder} />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p style={{ margin: 0, fontSize: 14, color: T.text2, lineHeight: 1.6 }}>{rev.comment}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p style={{ fontSize: 14, color: T.text3, margin: 0 }}>No reviews yet. Be the first to review!</p>
                                    )}
                                </div>

                                {/* Review Form */}
                                {!isOwner && (
                                    <div style={{ padding: 24, background: T.inputBg, border: `1px solid ${T.inputBdr}`, borderRadius: 16 }}>
                                        <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: T.text1 }}>Leave a Review</h3>
                                        <form onSubmit={handleReviewSubmit}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                                                <span style={{ fontSize: 13, color: T.text2, fontWeight: 600 }}>Rating</span>
                                                <div style={{ display: 'flex', gap: 4 }}>
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <FaStar 
                                                            key={star} 
                                                            size={20} 
                                                            style={{ cursor: 'pointer', color: star <= reviewRating ? "#f59e0b" : (isDark ? '#333' : '#e2e8f0'), transition: 'color 0.2s' }} 
                                                            onClick={() => setReviewRating(star)} 
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <textarea 
                                                rows="3" 
                                                placeholder="Share your experience..." 
                                                value={reviewComment}
                                                onChange={(e) => setReviewComment(e.target.value)}
                                                style={{ width: '100%', padding: '12px 16px', background: T.bg, border: `1px solid ${T.inputBdr}`, borderRadius: 12, color: T.text1, fontSize: 14, outline: 'none', resize: 'vertical', marginBottom: 16, boxSizing: 'border-box' }}
                                            />
                                            <button 
                                                type="submit" 
                                                disabled={submittingReview}
                                                style={{ background: 'linear-gradient(135deg, #e63946, #c1121f)', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: submittingReview ? 'wait' : 'pointer', opacity: submittingReview ? 0.7 : 1 }}
                                            >
                                                {submittingReview ? 'Submitting...' : 'Submit Review'}
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RIGHT — Booking Sidebar */}
                        <div style={{ width: 360, flexShrink: 0 }}>
                            <div style={{ borderRadius: 24, padding: 28, position: 'sticky', top: 110, background: T.panel, border: `1px solid ${T.panelBorder}`, boxShadow: T.sidebarShadow, backdropFilter: 'blur(24px)' }}>
                                {/* Price */}
                                <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: `1px solid ${T.divider}` }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                                        <span style={{ fontSize: 38, fontWeight: 900, color: T.text1, lineHeight: 1, letterSpacing: '-0.02em' }}>₹{room.rent?.toLocaleString()}</span>
                                        <span style={{ fontSize: 14, color: T.text2, fontWeight: 600, paddingBottom: 6 }}>/month</span>
                                    </div>
                                    {room.ratings && (
                                        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <FaStar style={{ color: '#f59e0b', fontSize: 13 }} />
                                            <span style={{ fontSize: 14, fontWeight: 700, color: T.text1 }}>{room.ratings}</span>
                                            <span style={{ color: T.text3, fontSize: 13 }}>rating</span>
                                        </div>
                                    )}
                                </div>

                                {/* Availability badge */}
                                <div style={{ marginBottom: 20 }}>
                                    {room.isBooked ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 12, padding: '12px 16px' }}>
                                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
                                            <span style={{ fontSize: 13, fontWeight: 700, color: '#ef4444' }}>Currently Occupied</span>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 12, padding: '12px 16px' }}>
                                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                                            <span style={{ fontSize: 13, fontWeight: 700, color: '#10b981' }}>Available Now</span>
                                        </div>
                                    )}
                                </div>

                                {/* CTA */}
                                {isOwner ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 12, padding: '12px 16px', marginBottom: 4 }}>
                                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', animation: 'heartbeat 2s ease infinite' }} />
                                            <span style={{ fontSize: 13, fontWeight: 700, color: '#3b82f6' }}>You own this property</span>
                                        </div>
                                        <button onClick={() => setUpdatePopUp(true)} style={{ width: '100%', padding: '15px 0', background: 'linear-gradient(135deg, #1f2937, #111827)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, color: '#f0f2f8', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s' }}>
                                            <FiEdit3 size={16} /> Edit Listing
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <button
                                            disabled={room.isBooked}
                                            onClick={() => setBookingPopUp(true)}
                                            className="btn-glow"
                                            style={{ width: '100%', padding: '16px 0', background: room.isBooked ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #e63946, #c1121f)', border: 'none', borderRadius: 14, color: room.isBooked ? '#4b5563' : '#fff', fontSize: 16, fontWeight: 800, cursor: room.isBooked ? 'not-allowed' : 'pointer', letterSpacing: '-0.01em', transition: 'all 0.25s', marginBottom: 12 }}
                                        >
                                            {room.isBooked ? 'Not Available' : 'Reserve Now'}
                                        </button>
                                        {!room.isBooked && (
                                            <p style={{ textAlign: 'center', fontSize: 12, color: '#4b5563', fontWeight: 600, margin: 0 }}>No charges until after your stay</p>
                                        )}
                                    </>
                                )}

                                {/* Key stats */}
                                <div style={{ marginTop: 24, paddingTop: 24, borderTop: `1px solid ${T.divider}`, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                    {[
                                        { label: 'Size', value: `${mockSize} sq ft`, icon: <FaRulerCombined size={12} /> },
                                        { label: 'Type', value: room.roomType, icon: <MdOutlineKingBed size={14} /> },
                                        { label: 'Category', value: room.category, icon: <FiCheck size={12} /> },
                                        { label: 'Status', value: room.isBooked ? 'Booked' : 'Free', icon: <FiClock size={12} /> },
                                    ].map((s, i) => (
                                        <div key={i} style={{ background: T.card, borderRadius: 12, padding: '12px 14px', border: `1px solid ${T.cardBorder}` }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: T.text3, fontSize: 11, fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                                {s.icon} {s.label}
                                            </div>
                                            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: T.text1, textTransform: 'capitalize' }}>{s.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ─── SIMILAR ROOMS ─── */}
                    {similarRooms.length > 0 && (
                        <div style={{ marginTop: 80, paddingTop: 48, borderTop: `1px solid ${T.divider}` }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                                <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: T.text1 }}>More rooms nearby</h2>
                                <span style={{ background: 'rgba(230,57,70,0.12)', border: '1px solid rgba(230,57,70,0.3)', color: '#e63946', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>{similarRooms.length} found</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
                                {similarRooms.map(r => (
                                    <Card key={r._id} id={r._id} title={r.title} landMark={r.landMark} city={r.city} image1={r.image1} image2={r.image2} image3={r.image3} rent={r.rent} ratings={r.ratings} isBooked={r.isBooked} category={r.category} host={r.host} distanceKm={null} />
                                ))}
                            </div>
                        </div>
                    )}

                    <div style={{ height: 80 }} />
                </div>
            </div>

            {/* ─── BOOKING MODAL ─── */}
            {bookingPopUp && (
                <div onClick={() => setBookingPopUp(false)} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                    <div onClick={e => e.stopPropagation()} style={{ borderRadius: 28, padding: 36, maxWidth: 460, width: '100%', position: 'relative', background: T.panel, border: `1px solid ${T.panelBorder}`, backdropFilter: 'blur(24px)', boxShadow: '0 30px 80px rgba(0,0,0,0.5)' }}>
                        <button onClick={() => setBookingPopUp(false)} style={{ position: 'absolute', top: 20, right: 20, width: 34, height: 34, borderRadius: '50%', background: T.btnSecBg, border: `1px solid ${T.btnSecBdr}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: T.text2 }}>
                            <FiX size={16} />
                        </button>

                        <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 900, color: T.text1 }}>Confirm & Reserve</h2>
                        <p style={{ margin: '0 0 28px', fontSize: 14, color: T.text2 }}>{room.title}</p>

                        {/* Date pickers */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                            {[{ label: 'Check-in', val: checkIn, fn: setCheckIn }, { label: 'Check-out', val: checkOut, fn: setCheckOut }].map((d, i) => (
                                <div key={i} style={{ background: T.inputBg, border: `1.5px solid ${T.inputBdr}`, borderRadius: 14, padding: '12px 14px' }}>
                                    <p style={{ margin: '0 0 8px', fontSize: 11, color: T.text3, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 5 }}>
                                        <FiCalendar size={10} /> {d.label}
                                    </p>
                                    <input type="date" min={minDate} value={d.val} onChange={e => d.fn(e.target.value)} style={{ background: 'transparent', border: 'none', outline: 'none', color: T.text1, fontSize: 14, fontWeight: 600, width: '100%', cursor: 'pointer' }} />
                                </div>
                            ))}
                        </div>

                        {/* Price breakdown */}
                        <div style={{ background: T.card, border: `1px solid ${T.cardBorder}`, borderRadius: 16, padding: '18px 20px', marginBottom: 24 }}>
                            {[
                                { label: `₹${room.rent?.toLocaleString()} × ${night || 0} nights`, value: `₹${(room.rent * (night || 0))?.toLocaleString()}` },
                                { label: 'Tax + Rentify fee (14%)', value: `₹${(room.rent * 0.14 * (night ? 1 : 0))?.toFixed(0)}` },
                            ].map((row, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i === 0 ? `1px solid ${T.divider}` : 'none' }}>
                                    <span style={{ fontSize: 14, color: T.text2 }}>{row.label}</span>
                                    <span style={{ fontSize: 14, fontWeight: 600, color: T.text1 }}>{row.value}</span>
                                </div>
                            ))}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, marginTop: 6 }}>
                                <span style={{ fontSize: 15, fontWeight: 800, color: T.text1 }}>Total</span>
                                <span style={{ fontSize: 20, fontWeight: 900, color: T.text1 }}>₹{total?.toLocaleString() || 0}</span>
                            </div>
                        </div>

                        <button onClick={confirmBooking} disabled={booking} className="btn-glow" style={{ width: '100%', padding: '16px 0', background: 'linear-gradient(135deg, #e63946, #c1121f)', border: 'none', borderRadius: 14, color: '#fff', fontSize: 16, fontWeight: 800, cursor: booking ? 'wait' : 'pointer', transition: 'all 0.25s', letterSpacing: '-0.01em' }}>
                            {booking ? 'Processing...' : 'Confirm Booking'}
                        </button>
                    </div>
                </div>
            )}

            {/* ─── UPDATE MODAL ─── */}
            {updatePopUp && (
                <div onClick={() => setUpdatePopUp(false)} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                    <div onClick={e => e.stopPropagation()} className="glass-dark" style={{ borderRadius: 28, padding: 36, maxWidth: 600, width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
                        <button onClick={() => setUpdatePopUp(false)} style={{ position: 'absolute', top: 20, right: 20, width: 34, height: 34, borderRadius: '50%', background: T.btnSecBg, border: `1px solid ${T.btnSecBdr}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: T.text2 }}>
                            <FiX size={16} />
                        </button>

                        <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 900, color: T.text1 }}>Edit Listing</h2>
                        <p style={{ margin: '0 0 28px', fontSize: 14, color: T.text2 }}>Update your property details below</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {/* Fields */}
                            {[
                                { label: 'Title', val: title, fn: setTitle, type: 'text' },
                                { label: 'Rent (₹/month)', val: rent, fn: setRent, type: 'number' },
                                { label: 'City', val: city, fn: setCity, type: 'text' },
                                { label: 'Landmark', val: landmark, fn: setLandmark, type: 'text' },
                            ].map(f => (
                                <div key={f.label}>
                                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: T.text3, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{f.label}</label>
                                    <input type={f.type} value={f.val} onChange={e => f.fn(e.target.value)} style={{ width: '100%', background: T.inputBg, border: `1.5px solid ${T.inputBdr}`, borderRadius: 12, padding: '12px 16px', color: T.text1, fontSize: 14, fontWeight: 500, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }} />
                                </div>
                            ))}

                            {/* Description */}
                            <div>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: T.text3, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Description</label>
                                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} style={{ width: '100%', background: T.inputBg, border: `1.5px solid ${T.inputBdr}`, borderRadius: 12, padding: '12px 16px', color: T.text1, fontSize: 14, fontWeight: 500, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                            </div>

                            {/* Image uploads */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                                {[{ label: 'Image 1', fn: setBackEndImage1 }, { label: 'Image 2', fn: setBackEndImage2 }, { label: 'Image 3', fn: setBackEndImage3 }].map((img, i) => (
                                    <div key={i}>
                                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: T.text3, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{img.label}</label>
                                        <input type="file" onChange={e => img.fn(e.target.files[0])} style={{ width: '100%', fontSize: 12, color: T.text2 }} />
                                    </div>
                                ))}
                            </div>

                            {/* Action buttons */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8 }}>
                                <button onClick={handleUpdateListing} disabled={updating} style={{ padding: '14px 0', background: 'linear-gradient(135deg, #1f2937, #111827)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, color: '#f0f2f8', fontSize: 14, fontWeight: 700, cursor: updating ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s' }}>
                                    <FiEdit3 size={14} /> {updating ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button onClick={handleDeleteListing} disabled={deleting} style={{ padding: '14px 0', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 14, color: '#ef4444', fontSize: 14, fontWeight: 700, cursor: deleting ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s' }}>
                                    <FiTrash2 size={14} /> {deleting ? 'Deleting...' : 'Delete Listing'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RoomDetail;
