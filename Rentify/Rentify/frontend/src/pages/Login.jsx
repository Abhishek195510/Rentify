import React, { useContext, useState } from 'react'
import { IoMdEye, IoMdEyeOff } from "react-icons/io"
import { useNavigate } from 'react-router-dom'
import { AuthDataContext } from '../Context/AuthContext'
import axios from 'axios'
import { UserDataContext } from '../Context/UserContext'
import { toast } from 'react-toastify'
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi'
import { MdOutlineHouse } from 'react-icons/md'
import { BsPeopleFill } from 'react-icons/bs'
import { FaHome } from 'react-icons/fa'

function Login() {
    const [show, setShow] = useState(false)
    const [role, setRole] = useState("customer")
    const { serverUrl, loading, setLoading } = useContext(AuthDataContext)
    const { setUserData } = useContext(UserDataContext)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const result = await axios.post(
                serverUrl + "/api/auth/login",
                { email, password, role },
                { withCredentials: true }
            )
            setLoading(false)
            setUserData(result.data)
            toast.success(`Welcome back! Logged in as ${result.data.role === "customer" ? "Customer" : "Owner"} 🎉`)
            if (result.data.role === "owner") {
                navigate("/mylisting")
            } else {
                navigate("/")
            }
        } catch (error) {
            setLoading(false)
            toast.error(error?.response?.data?.message || "Login failed")
        }
    }

    return (
        <div style={styles.page}>
            {/* ── Left Panel ── */}
            <div style={styles.leftPanel}>
                <div style={styles.overlay} />
                <div style={styles.leftContent}>
                    <div style={styles.logoWrap} onClick={() => navigate("/")}>
                        <MdOutlineHouse size={34} color="#fff" />
                        <span style={styles.logoText}>Rentify</span>
                    </div>
                    <h2 style={styles.tagline}>Find Your Perfect<br />Place to Stay</h2>
                    <p style={styles.subTagline}>
                        Thousands of verified rooms, flats & PGs.<br />
                        Login to explore and book your next home.
                    </p>
                    <div style={styles.featureList}>
                        {["Verified Listings", "Secure Payments", "24/7 Support", "Real-time Availability"].map(f => (
                            <div key={f} style={styles.featureItem}>
                                <span style={styles.dot} />
                                {f}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Right Panel ── */}
            <div style={styles.rightPanel}>
                <div style={styles.formCard}>
                    <div style={styles.formHeader}>
                        <h1 style={styles.formTitle}>Welcome Back</h1>
                        <p style={styles.formSub}>Sign in to continue your journey</p>
                    </div>

                    {/* ── Role Selector ── */}
                    <div style={styles.roleSection}>
                        <p style={styles.roleTitle}>Login as...</p>
                        <div style={styles.roleRow}>
                            {/* Customer Card */}
                            <button
                                id="login-role-customer"
                                type="button"
                                style={{ ...styles.roleCard, ...(role === "customer" ? styles.roleCardActive : {}) }}
                                onClick={() => setRole("customer")}
                            >
                                <div style={{ ...styles.roleIconWrap, ...(role === "customer" ? styles.roleIconActive : {}) }}>
                                    <BsPeopleFill size={24} color={role === "customer" ? "#fff" : "#999"} />
                                </div>
                                <span style={{ ...styles.roleCardLabel, ...(role === "customer" ? styles.roleCardLabelActive : {}) }}>
                                    Customer
                                </span>
                                <span style={{ ...styles.roleCardDesc, ...(role === "customer" ? { color: "#c62828" } : {}) }}>
                                    Browse & book rooms
                                </span>
                                {role === "customer" && <div style={styles.roleCheck}>✓</div>}
                            </button>

                            {/* Owner Card */}
                            <button
                                id="login-role-owner"
                                type="button"
                                style={{ ...styles.roleCard, ...(role === "owner" ? styles.roleCardActive : {}) }}
                                onClick={() => setRole("owner")}
                            >
                                <div style={{ ...styles.roleIconWrap, ...(role === "owner" ? styles.roleIconActive : {}) }}>
                                    <FaHome size={22} color={role === "owner" ? "#fff" : "#999"} />
                                </div>
                                <span style={{ ...styles.roleCardLabel, ...(role === "owner" ? styles.roleCardLabelActive : {}) }}>
                                    Owner
                                </span>
                                <span style={{ ...styles.roleCardDesc, ...(role === "owner" ? { color: "#c62828" } : {}) }}>
                                    Manage your listings
                                </span>
                                {role === "owner" && <div style={styles.roleCheck}>✓</div>}
                            </button>
                        </div>
                    </div>

                    {/* ── Form ── */}
                    <form onSubmit={handleLogin} style={styles.form}>
                        {/* Email */}
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Email Address</label>
                            <div style={styles.inputWrap}>
                                <FiMail style={styles.inputIcon} />
                                <input
                                    id="login-email"
                                    type="email"
                                    style={styles.input}
                                    placeholder="you@example.com"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Password</label>
                            <div style={styles.inputWrap}>
                                <FiLock style={styles.inputIcon} />
                                <input
                                    id="login-password"
                                    type={show ? "text" : "password"}
                                    style={{ ...styles.input, paddingRight: "48px" }}
                                    placeholder="Enter your password"
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                                <button type="button" style={styles.eyeBtn} onClick={() => setShow(p => !p)}>
                                    {show ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Role badge */}
                        <div style={styles.roleBadge}>
                            <span style={styles.roleBadgeIcon}>{role === "customer" ? "🏠" : "🏢"}</span>
                            <span style={styles.roleBadgeText}>
                                Signing in as <strong>{role === "customer" ? "Customer (Renter)" : "Owner (Host)"}</strong>
                            </span>
                        </div>

                        {/* Submit */}
                        <button
                            id="login-submit"
                            type="submit"
                            style={styles.submitBtn}
                            disabled={loading}
                            onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = "translateY(-2px)" }}
                            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)" }}
                        >
                            {loading ? "Signing in..." : (
                                <span style={styles.btnContent}>
                                    Sign In <FiArrowRight style={{ marginLeft: 8 }} />
                                </span>
                            )}
                        </button>
                    </form>

                    <div style={styles.divider}>
                        <span style={styles.dividerLine} />
                        <span style={styles.dividerText}>New to Rentify?</span>
                        <span style={styles.dividerLine} />
                    </div>

                    <button
                        id="go-signup"
                        style={styles.secondaryBtn}
                        onClick={() => navigate("/signup")}
                        onMouseEnter={e => { e.currentTarget.style.background = "#fff0f0"; e.currentTarget.style.borderColor = "#e53935" }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "#f0f0f0" }}
                    >
                        Create an Account
                    </button>

                    <p style={styles.backHome} onClick={() => navigate("/")}>← Back to Home</p>
                </div>
            </div>
        </div>
    )
}

const styles = {
    page: {
        display: "flex", minHeight: "100vh",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
    },
    leftPanel: {
        flex: "1 1 42%",
        background: "linear-gradient(135deg, #e53935 0%, #b71c1c 40%, #880e0e 100%)",
        position: "relative", display: "flex",
        alignItems: "center", justifyContent: "center", overflow: "hidden",
    },
    overlay: {
        position: "absolute", inset: 0,
        background: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='20'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
    },
    leftContent: {
        position: "relative", zIndex: 1,
        padding: "48px", maxWidth: "420px", color: "#fff",
    },
    logoWrap: {
        display: "flex", alignItems: "center", gap: "10px",
        marginBottom: "48px", cursor: "pointer",
    },
    logoText: { fontSize: "28px", fontWeight: 800, letterSpacing: "-0.5px", color: "#fff" },
    tagline: { fontSize: "36px", fontWeight: 800, lineHeight: 1.25, marginBottom: "16px" },
    subTagline: { fontSize: "15px", opacity: 0.82, lineHeight: 1.7, marginBottom: "40px" },
    featureList: { display: "flex", flexDirection: "column", gap: "14px" },
    featureItem: {
        display: "flex", alignItems: "center", gap: "12px",
        fontSize: "15px", fontWeight: 500, opacity: 0.9,
    },
    dot: {
        width: "8px", height: "8px", borderRadius: "50%",
        background: "rgba(255,255,255,0.6)", flexShrink: 0,
    },
    rightPanel: {
        flex: "1 1 58%", display: "flex",
        alignItems: "center", justifyContent: "center",
        background: "#fafafa", padding: "24px", overflowY: "auto",
    },
    formCard: {
        background: "#fff", borderRadius: "24px",
        padding: "40px 36px", width: "100%", maxWidth: "460px",
        boxShadow: "0 4px 40px rgba(0,0,0,0.08)",
    },
    formHeader: { marginBottom: "24px" },
    formTitle: { fontSize: "26px", fontWeight: 800, color: "#111", margin: 0, marginBottom: "6px" },
    formSub: { fontSize: "14px", color: "#888", margin: 0 },
    /* Role selector */
    roleSection: { marginBottom: "24px" },
    roleTitle: { fontSize: "13px", fontWeight: 600, color: "#666", marginBottom: "12px", letterSpacing: "0.3px" },
    roleRow: { display: "flex", gap: "12px" },
    roleCard: {
        flex: 1, padding: "16px 12px", border: "2px solid #f0f0f0",
        borderRadius: "14px", background: "#fff", cursor: "pointer",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
        transition: "all 0.2s", position: "relative",
    },
    roleCardActive: {
        border: "2px solid #e53935", background: "#fff8f8",
        boxShadow: "0 4px 16px rgba(229,57,53,0.12)",
    },
    roleIconWrap: {
        width: "48px", height: "48px", borderRadius: "12px",
        background: "#f5f5f5", display: "flex",
        alignItems: "center", justifyContent: "center", marginBottom: "4px",
    },
    roleIconActive: { background: "linear-gradient(135deg,#e53935,#b71c1c)" },
    roleCardLabel: { fontSize: "15px", fontWeight: 700, color: "#444" },
    roleCardLabelActive: { color: "#c62828" },
    roleCardDesc: { fontSize: "11px", color: "#bbb", textAlign: "center" },
    roleCheck: {
        position: "absolute", top: "8px", right: "10px",
        width: "18px", height: "18px", borderRadius: "50%",
        background: "#e53935", color: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "10px", fontWeight: 700,
    },
    /* Form */
    form: { display: "flex", flexDirection: "column", gap: "18px" },
    inputGroup: { display: "flex", flexDirection: "column", gap: "7px" },
    label: { fontSize: "13px", fontWeight: 600, color: "#444", letterSpacing: "0.3px" },
    inputWrap: { position: "relative", display: "flex", alignItems: "center" },
    inputIcon: { position: "absolute", left: "14px", color: "#bbb", fontSize: "18px", pointerEvents: "none" },
    input: {
        width: "100%", paddingLeft: "44px", paddingRight: "16px",
        height: "48px", border: "1.5px solid #e8e8e8", borderRadius: "12px",
        fontSize: "15px", color: "#222", outline: "none",
        boxSizing: "border-box", background: "#fafafa",
    },
    eyeBtn: {
        position: "absolute", right: "12px", background: "none",
        border: "none", cursor: "pointer", color: "#999", display: "flex",
    },
    roleBadge: {
        display: "flex", alignItems: "center", gap: "10px",
        background: "#fff8f8", border: "1px solid #fce4e4",
        borderRadius: "10px", padding: "10px 16px",
    },
    roleBadgeIcon: { fontSize: "18px" },
    roleBadgeText: { fontSize: "13px", color: "#666" },
    submitBtn: {
        width: "100%", height: "52px",
        background: "linear-gradient(135deg, #e53935, #b71c1c)",
        color: "#fff", border: "none", borderRadius: "12px",
        fontSize: "16px", fontWeight: 700, cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s",
        boxShadow: "0 4px 20px rgba(229,57,53,0.35)",
        marginTop: "2px",
    },
    btnContent: { display: "flex", alignItems: "center", justifyContent: "center" },
    divider: { display: "flex", alignItems: "center", gap: "12px", margin: "22px 0" },
    dividerLine: { flex: 1, height: "1px", background: "#f0f0f0" },
    dividerText: { fontSize: "12px", color: "#bbb", whiteSpace: "nowrap" },
    secondaryBtn: {
        width: "100%", height: "48px",
        background: "transparent", color: "#e53935",
        border: "1.5px solid #f0f0f0", borderRadius: "12px",
        fontSize: "15px", fontWeight: 600, cursor: "pointer",
        transition: "all 0.2s",
    },
    backHome: {
        textAlign: "center", marginTop: "18px", fontSize: "13px",
        color: "#bbb", cursor: "pointer",
    },
}

export default Login
