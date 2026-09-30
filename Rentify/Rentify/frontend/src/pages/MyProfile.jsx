import React, { useContext, useState } from 'react';
import { UserDataContext } from '../Context/UserContext';
import { AuthDataContext } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiEdit3 } from 'react-icons/fi';
import { MdOutlineHouse } from 'react-icons/md';
import { CgProfile } from 'react-icons/cg';

function MyProfile() {
    const { userData, setUserData } = useContext(UserDataContext);
    const { serverUrl } = useContext(AuthDataContext);
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(userData?.name || '');
    const [email, setEmail] = useState(userData?.email || '');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState(userData?.phone || '');
    const [address, setAddress] = useState(userData?.address || '');
    const [gender, setGender] = useState(userData?.gender || '');
    const [dob, setDob] = useState(userData?.dob || '');
    const [bio, setBio] = useState(userData?.bio || '');
    const [loading, setLoading] = useState(false);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.put(`${serverUrl}/api/user/update`, {
                name,
                email,
                phone,
                address,
                gender,
                dob,
                bio,
                ...(password && { password })
            }, { withCredentials: true });
            setUserData(res.data);
            toast.success('Profile updated successfully');
            setIsEditing(false);
            setPassword('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (!userData) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", minHeight: "100vh", background: "#f8f8fa" }}>
            {/* ── Header ── */}
            <div style={{
                background: "linear-gradient(135deg, #e53935 0%, #b71c1c 100%)",
                padding: "0 0 48px 0",
                position: "relative",
                overflow: "hidden",
            }}>
                <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.06) 0%, transparent 60%)" }} />
                
                {/* Top bar */}
                <div style={{ padding: "20px 32px", display: "flex", alignItems: "center", gap: 16 }}>
                    <button
                        onClick={() => navigate("/")}
                        style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyItems: "center", color: "#fff", transition: "background 0.2s" }}
                    >
                        <FiArrowLeft size={18} />
                    </button>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => navigate("/")}>
                        <MdOutlineHouse size={26} color="#fff" />
                        <span style={{ color: "#fff", fontWeight: 800, fontSize: 20, letterSpacing: "-0.5px" }}>Rentify</span>
                    </div>
                </div>

                {/* Title area */}
                <div style={{ padding: "12px 32px 0", position: "relative", zIndex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <CgProfile size={22} color="#fff" />
                        </div>
                        <div>
                            <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 900, margin: 0, letterSpacing: "-0.5px" }}>My Profile</h1>
                            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, margin: "4px 0 0" }}>Manage your account settings</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Content Grid ── */}
            <div style={{ maxWidth: 800, margin: "-32px auto 0", padding: "0 24px 60px", position: "relative", zIndex: 2 }}>
                
                {/* Profile Details */}
                <div style={{ background: "#fff", borderRadius: 24, boxShadow: "0 4px 40px rgba(0,0,0,0.08)", padding: "32px 36px" }}>
                    
                    {!isEditing ? (
                        <>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                                <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111", margin: 0 }}>Client Information</h2>
                                <button onClick={() => setIsEditing(true)} style={{ display: "flex", alignItems: "center", gap: 8, background: "#f8fafc", border: "1px solid #e2e8f0", padding: "10px 16px", borderRadius: 12, color: "#475569", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "#f1f5f9"} onMouseLeave={e => e.currentTarget.style.background = "#f8fafc"}>
                                    <FiEdit3 /> Edit Details
                                </button>
                            </div>
                            
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                                <div>
                                    <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase" }}>Full Name</p>
                                    <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e293b" }}>{userData.name}</p>
                                </div>
                                <div>
                                    <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase" }}>Email Address</p>
                                    <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e293b" }}>{userData.email}</p>
                                </div>
                                <div>
                                    <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase" }}>Role</p>
                                    <span style={{ display: "inline-block", background: "rgba(59,130,246,0.1)", color: "#3b82f6", padding: "6px 12px", borderRadius: 8, fontSize: 14, fontWeight: 700 }}>
                                        {userData.role ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1) : "Customer"}
                                    </span>
                                </div>
                                <div>
                                    <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase" }}>Phone Number</p>
                                    <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e293b" }}>{userData.phone || 'Not provided'}</p>
                                </div>
                                <div>
                                    <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase" }}>Gender</p>
                                    <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e293b", textTransform: "capitalize" }}>{userData.gender || 'Not provided'}</p>
                                </div>
                                <div>
                                    <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase" }}>Date of Birth</p>
                                    <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e293b" }}>{userData.dob || 'Not provided'}</p>
                                </div>
                                <div style={{ gridColumn: "1 / -1" }}>
                                    <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase" }}>Address</p>
                                    <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e293b" }}>{userData.address || 'Not provided'}</p>
                                </div>
                                <div style={{ gridColumn: "1 / -1" }}>
                                    <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase" }}>Bio / About me</p>
                                    <p style={{ margin: 0, fontSize: 16, fontWeight: 500, color: "#475569", lineHeight: 1.6 }}>{userData.bio || 'This user has not written a bio yet.'}</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <form onSubmit={handleUpdate}>
                            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111", margin: "0 0 24px" }}>Edit Information</h2>
                            
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                                <div>
                                    <label style={{ display: "block", margin: "0 0 8px", fontSize: 13, fontWeight: 600, color: "#64748b" }}>Full Name</label>
                                    <input type="text" value={name} onChange={e => setName(e.target.value)} required style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
                                </div>
                                <div>
                                    <label style={{ display: "block", margin: "0 0 8px", fontSize: 13, fontWeight: 600, color: "#64748b" }}>Email Address</label>
                                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
                                </div>
                                <div>
                                    <label style={{ display: "block", margin: "0 0 8px", fontSize: 13, fontWeight: 600, color: "#64748b" }}>Phone Number</label>
                                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 234 567 8900" style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
                                </div>
                                <div>
                                    <label style={{ display: "block", margin: "0 0 8px", fontSize: 13, fontWeight: 600, color: "#64748b" }}>Date of Birth</label>
                                    <input type="date" value={dob} onChange={e => setDob(e.target.value)} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 15, outline: "none", boxSizing: "border-box", color: dob ? "#111" : "#64748b" }} />
                                </div>
                                <div>
                                    <label style={{ display: "block", margin: "0 0 8px", fontSize: 13, fontWeight: 600, color: "#64748b" }}>Gender</label>
                                    <select value={gender} onChange={e => setGender(e.target.value)} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 15, outline: "none", boxSizing: "border-box", background: "#fff", color: gender ? "#111" : "#64748b" }}>
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                        <option value="prefer not to say">Prefer not to say</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: "block", margin: "0 0 8px", fontSize: 13, fontWeight: 600, color: "#64748b" }}>New Password (optional)</label>
                                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
                                </div>
                                <div style={{ gridColumn: "1 / -1" }}>
                                    <label style={{ display: "block", margin: "0 0 8px", fontSize: 13, fontWeight: 600, color: "#64748b" }}>Full Address</label>
                                    <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="123 Main St, City, Country" style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
                                </div>
                                <div style={{ gridColumn: "1 / -1" }}>
                                    <label style={{ display: "block", margin: "0 0 8px", fontSize: 13, fontWeight: 600, color: "#64748b" }}>Bio / About Me</label>
                                    <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell us about yourself..." rows={4} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 15, outline: "none", boxSizing: "border-box", resize: "vertical" }} />
                                </div>
                            </div>

                            <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
                                <button type="submit" disabled={loading} style={{ background: "linear-gradient(135deg,#e53935,#b71c1c)", color: "#fff", border: "none", padding: "12px 32px", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading ? "wait" : "pointer" }}>
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button type="button" onClick={() => setIsEditing(false)} style={{ background: "#f1f5f9", color: "#475569", border: "none", padding: "12px 32px", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MyProfile;
