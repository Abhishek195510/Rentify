import React, { useContext, useState } from 'react'
import { GiConfirmed } from "react-icons/gi";
import { bookingDataContext } from '../Context/BookingContext';
import { useNavigate } from 'react-router-dom';
import Star from '../Component/Star';
import { UserDataContext } from '../Context/UserContext';
import { AuthDataContext } from '../Context/AuthContext';
import { ListingDataContext } from '../Context/ListingContext';
import axios from 'axios';
import { FiHome, FiMail, FiDollarSign, FiStar, FiCheck } from 'react-icons/fi';
import { MdOutlineHouse } from 'react-icons/md';

function Booked() {
    const { bookingData } = useContext(bookingDataContext)
    const [star, setStar] = useState(0)
    const { serverUrl } = useContext(AuthDataContext)
    const { getCurrentUser } = useContext(UserDataContext)
    const { getListing, cardDetails } = useContext(ListingDataContext)
    const navigate = useNavigate()

    const handleRating = async (id) => {
        try {
            await axios.post(serverUrl + `/api/listing/ratings/${id}`, { ratings: star }, { withCredentials: true })
            await getListing()
            await getCurrentUser()
            navigate("/")
        } catch (error) {
            console.log(error)
        }
    }

    const handleStar = (value) => setStar(value)

    return (
        <div style={{
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            minHeight: "100vh",
            background: "linear-gradient(135deg, #f0fdf4 0%, #f8fafc 50%, #fef2f2 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
        }}>
            {/* Back home button */}
            <button
                onClick={() => navigate("/")}
                style={{
                    position: "fixed", top: 20, left: 20,
                    display: "flex", alignItems: "center", gap: 8,
                    background: "white", border: "1.5px solid #e8e8e8",
                    borderRadius: 12, padding: "10px 18px",
                    fontSize: 14, fontWeight: 700, cursor: "pointer",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    color: "#333",
                }}
            >
                <MdOutlineHouse size={18} color="#e53935" /> Back to Home
            </button>

            <div style={{ width: "100%", maxWidth: 520, display: "flex", flexDirection: "column", gap: 20 }}>

                {/* ── Confirmation Card ── */}
                <div style={{
                    background: "#fff",
                    borderRadius: 24,
                    boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
                    overflow: "hidden",
                }}>
                    {/* Green top banner */}
                    <div style={{
                        background: "linear-gradient(135deg, #16a34a, #15803d)",
                        padding: "32px 32px 24px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 12,
                    }}>
                        <div style={{
                            width: 72, height: 72, borderRadius: "50%",
                            background: "rgba(255,255,255,0.2)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            <GiConfirmed size={40} color="#fff" />
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 900, margin: 0 }}>Booking Confirmed!</h2>
                            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, margin: "6px 0 0" }}>Your reservation is set. Get ready to move in!</p>
                        </div>
                    </div>

                    {/* Details list */}
                    <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 0 }}>
                        {[
                            {
                                icon: <FiCheck size={16} color="#16a34a" />,
                                bg: "#f0fdf4",
                                label: "Booking ID",
                                value: bookingData?._id,
                                mono: true
                            },
                            {
                                icon: <FiMail size={16} color="#2563eb" />,
                                bg: "#eff6ff",
                                label: "Owner Contact",
                                value: bookingData?.host?.email || "—"
                            },
                            {
                                icon: <FiDollarSign size={16} color="#d97706" />,
                                bg: "#fffbeb",
                                label: "Total Rent",
                                value: bookingData?.totalRent ? `₹${Number(bookingData.totalRent).toLocaleString()}` : "—",
                                bold: true,
                            },
                        ].map(({ icon, bg, label, value, mono, bold }) => (
                            <div key={label} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: "1px solid #f3f4f6" }}>
                                <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    {icon}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, margin: 0, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</p>
                                    <p style={{ fontSize: mono ? 12 : 14, color: "#111", fontWeight: bold ? 800 : 600, margin: "2px 0 0", fontFamily: mono ? "monospace" : "inherit", wordBreak: "break-all" }}>{value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Rating Card ── */}
                <div style={{
                    background: "#fff",
                    borderRadius: 24,
                    boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
                    padding: "28px",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <FiStar size={20} color="#f59e0b" />
                        <h3 style={{ fontSize: 17, fontWeight: 800, color: "#111", margin: 0 }}>Rate Your Stay</h3>
                    </div>
                    <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>How was the listing? Your feedback helps others.</p>

                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                        <Star onRate={handleStar} />
                    </div>

                    {star > 0 && (
                        <p style={{ textAlign: "center", fontSize: 13, color: "#6b7280", marginBottom: 16 }}>
                            You rated: <strong style={{ color: "#f59e0b" }}>{"★".repeat(star)}{"☆".repeat(5 - star)}</strong> ({star}/5)
                        </p>
                    )}

                    <button
                        onClick={() => handleRating(cardDetails?._id)}
                        disabled={star === 0}
                        style={{
                            width: "100%", height: 50,
                            background: star > 0 ? "linear-gradient(135deg,#e53935,#b71c1c)" : "#f3f4f6",
                            color: star > 0 ? "#fff" : "#9ca3af",
                            border: "none", borderRadius: 14,
                            fontSize: 15, fontWeight: 800,
                            cursor: star > 0 ? "pointer" : "not-allowed",
                            transition: "all 0.2s",
                            boxShadow: star > 0 ? "0 4px 14px rgba(229,57,53,0.3)" : "none",
                        }}
                    >
                        {star > 0 ? "Submit Rating" : "Select a Rating First"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Booked
