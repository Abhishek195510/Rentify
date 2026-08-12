import React, { useContext, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserDataContext } from '../Context/UserContext';
import Card from '../Component/Card';
import { FiArrowLeft, FiList, FiPlus, FiTrendingUp, FiHome, FiDollarSign, FiUsers, FiSettings, FiActivity, FiLogOut } from 'react-icons/fi';
import { MdOutlineHouse } from 'react-icons/md';
import { AuthDataContext } from '../Context/AuthContext';
import axios from 'axios';

function MyListing() {
    const navigate = useNavigate()
    const { userData, setUserData } = useContext(UserDataContext)
    const { serverUrl } = useContext(AuthDataContext)
    const [selectedGuest, setSelectedGuest] = React.useState(null)
    const listings = userData?.listing || []

    const handleLogOut = async () => {
        try {
            await axios.post(serverUrl + "/api/auth/logout", {}, { withCredentials: true })
            setUserData(null)
            navigate("/")
        } catch (error) {
            console.log(error)
        }
    }

    // Calculate stats
    const stats = useMemo(() => {
        const totalRevenue = listings.reduce((acc, curr) => acc + (Number(curr.rent) || 0), 0)
        const bookedCount = listings.filter(l => l.isBooked).length
        return {
            total: listings.length,
            revenue: totalRevenue,
            booked: bookedCount,
            occupancy: listings.length > 0 ? Math.round((bookedCount / listings.length) * 100) : 0
        }
    }, [listings])

    return (
        <div style={styles.container}>

            {/* ── Sidebar (Simulated) ── */}
            <div style={styles.sidebar}>
                <div style={styles.logoWrap} onClick={() => navigate("/")}>
                    <MdOutlineHouse size={28} color="#e53935" />
                    <span style={styles.logoText}>Rentify</span>
                </div>
                
                <nav style={styles.sideNav}>
                    <div style={{ ...styles.navItem, ...styles.navItemActive }}>
                        <FiActivity size={18} /> Dashboard
                    </div>
                    <div style={styles.navItem} onClick={() => navigate("/listingpage1")}>
                        <FiPlus size={18} /> Add New Listing
                    </div>
                    <div style={styles.navItem} onClick={() => navigate("/profile")}>
                        <FiSettings size={18} /> Settings
                    </div>
                    <div style={{ ...styles.navItem, color: '#ef4444' }} onClick={handleLogOut}>
                        <FiLogOut size={18} /> Logout
                    </div>
                </nav>

                <div style={styles.sidebarFooter}>
                    <p style={styles.roleLabel}>Owner Portal</p>
                    <div style={styles.ownerInfo}>
                        <div style={styles.avatar}>{userData?.name?.charAt(0).toUpperCase()}</div>
                        <span style={styles.ownerName}>{userData?.name}</span>
                    </div>
                </div>
            </div>

            {/* ── Main Content ── */}
            <div style={styles.mainContent}>
                
                {/* Header */}
                <header style={styles.header}>
                    <div>
                        <h1 style={styles.title}>Welcome back, {userData?.name?.split(' ')[0]}!</h1>
                        <p style={styles.subtitle}>Here's what's happening with your properties today.</p>
                    </div>
                    <button onClick={() => navigate("/listingpage1")} style={styles.ctaBtn}>
                        <FiPlus /> New Property
                    </button>
                </header>

                {/* Stats Grid */}
                <div style={styles.statsGrid}>
                    <div style={styles.statCard}>
                        <div style={{ ...styles.statIconWrap, background: '#fee2e2', color: '#ef4444' }}>
                            <FiHome size={20} />
                        </div>
                        <div>
                            <span style={styles.statVal}>{stats.total}</span>
                            <p style={styles.statLabel}>Total Listings</p>
                        </div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={{ ...styles.statIconWrap, background: '#ecfdf5', color: '#10b981' }}>
                            <FiDollarSign size={20} />
                        </div>
                        <div>
                            <span style={styles.statVal}>₹{stats.revenue.toLocaleString()}</span>
                            <p style={styles.statLabel}>Monthly Revenue</p>
                        </div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={{ ...styles.statIconWrap, background: '#eff6ff', color: '#3b82f6' }}>
                            <FiUsers size={20} />
                        </div>
                        <div>
                            <span style={styles.statVal}>{stats.booked}</span>
                            <p style={styles.statLabel}>Active Bookings</p>
                        </div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={{ ...styles.statIconWrap, background: '#faf5ff', color: '#8b5cf6' }}>
                            <FiTrendingUp size={20} />
                        </div>
                        <div>
                            <span style={styles.statVal}>{stats.occupancy}%</span>
                            <p style={styles.statLabel}>Occupancy Rate</p>
                        </div>
                    </div>
                </div>

                {/* Listings Section */}
                <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}>Your Properties</h2>
                    <span style={styles.badge}>{listings.length} Properties</span>
                </div>

                {listings.length === 0 ? (
                    <div style={styles.emptyState}>
                        <div style={styles.emptyIcon}><FiHome size={40} /></div>
                        <h3>No listings yet</h3>
                        <p>Start your hosting journey by adding your first property.</p>
                        <button onClick={() => navigate("/listingpage1")} style={styles.emptyBtn}>Add Property</button>
                    </div>
                ) : (
                    <div style={styles.grid}>
                        {listings.map((list) => (
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
                                isBooked={list.isBooked}
                                ratings={list.ratings}
                                host={list.host}
                                category={list.category}
                                hideCompare={true}
                                onBookedClick={() => setSelectedGuest(list.guest)}
                            />
                        ))}
                    </div>
                )}

                {/* ── Guest Info Modal ── */}
                {selectedGuest && (
                    <div style={styles.modalOverlay} onClick={() => setSelectedGuest(null)}>
                        <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                            <div style={styles.modalHeader}>
                                <h2 style={styles.modalTitle}>Guest Information</h2>
                                <button onClick={() => setSelectedGuest(null)} style={styles.closeBtn}>✕</button>
                            </div>
                            
                            <div style={styles.modalBody}>
                                <div style={styles.guestAvatar}>
                                    {selectedGuest.name?.charAt(0).toUpperCase()}
                                </div>
                                <h3 style={styles.guestName}>{selectedGuest.name}</h3>
                                <p style={styles.guestRole}>Verified Customer</p>

                                <div style={styles.infoList}>
                                    <div style={styles.infoRow}>
                                        <span style={styles.infoTag}>Email</span>
                                        <span style={styles.infoText}>{selectedGuest.email}</span>
                                    </div>
                                    <div style={styles.infoRow}>
                                        <span style={styles.infoTag}>Phone</span>
                                        <span style={styles.infoText}>{selectedGuest.phone || 'Not provided'}</span>
                                    </div>
                                    <div style={styles.infoRow}>
                                        <span style={styles.infoTag}>Address</span>
                                        <span style={styles.infoText}>{selectedGuest.address || 'Not provided'}</span>
                                    </div>
                                </div>

                                <button style={styles.contactBtn} onClick={() => window.location.href = `mailto:${selectedGuest.email}`}>
                                    Contact Guest
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

const styles = {
    container: {
        display: 'flex',
        minHeight: '100vh',
        background: '#f8fafc',
        fontFamily: "'Inter', sans-serif"
    },
    sidebar: {
        width: '260px',
        background: '#fff',
        borderRight: '1px solid #e2e8f0',
        padding: '32px 24px',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        zIndex: 10
    },
    logoWrap: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '48px',
        cursor: 'pointer'
    },
    logoText: {
        fontSize: '22px',
        fontWeight: 800,
        color: '#1e293b',
        letterSpacing: '-0.5px'
    },
    sideNav: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        flex: 1
    },
    navItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: '12px',
        color: '#64748b',
        fontSize: '14px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s'
    },
    navItemActive: {
        background: '#fff1f2',
        color: '#e11d48'
    },
    sidebarFooter: {
        borderTop: '1px solid #f1f5f9',
        paddingTop: '24px'
    },
    roleLabel: {
        fontSize: '11px',
        fontWeight: 700,
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: '12px'
    },
    ownerInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    avatar: {
        width: '36px',
        height: '36px',
        borderRadius: '10px',
        background: '#1e293b',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: '14px'
    },
    ownerName: {
        fontSize: '14px',
        fontWeight: 700,
        color: '#1e293b',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    mainContent: {
        flex: 1,
        marginLeft: '260px',
        padding: '40px 48px'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px'
    },
    title: {
        fontSize: '28px',
        fontWeight: 800,
        color: '#0f172a',
        margin: 0
    },
    subtitle: {
        fontSize: '15px',
        color: '#64748b',
        marginTop: '6px'
    },
    ctaBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: '#e11d48',
        color: '#fff',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '12px',
        fontWeight: 700,
        fontSize: '14px',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(225,29,72,0.25)',
        transition: 'all 0.2s'
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '24px',
        marginBottom: '48px'
    },
    statCard: {
        background: '#fff',
        padding: '24px',
        borderRadius: '20px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    },
    statIconWrap: {
        width: '48px',
        height: '48px',
        borderRadius: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    statVal: {
        fontSize: '24px',
        fontWeight: 800,
        color: '#1e293b',
        display: 'block'
    },
    statLabel: {
        fontSize: '13px',
        color: '#64748b',
        fontWeight: 600,
        margin: 0
    },
    sectionHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '24px'
    },
    sectionTitle: {
        fontSize: '20px',
        fontWeight: 800,
        color: '#1e293b',
        margin: 0
    },
    badge: {
        background: '#f1f5f9',
        color: '#475569',
        padding: '4px 12px',
        fontSize: '12px',
        fontWeight: 700,
        borderRadius: '20px'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '24px'
    },
    emptyState: {
        background: '#fff',
        borderRadius: '24px',
        padding: '80px 40px',
        textAlign: 'center',
        border: '2px dashed #e2e8f0'
    },
    emptyIcon: {
        width: '80px',
        height: '80px',
        background: '#f8fafc',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 24px',
        color: '#cbd5e1'
    },
    emptyBtn: {
        marginTop: '24px',
        background: '#1e293b',
        color: '#fff',
        border: 'none',
        padding: '12px 32px',
        borderRadius: '12px',
        fontWeight: 700,
        cursor: 'pointer'
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        animation: 'fadeIn 0.2s ease'
    },
    modalContent: {
        background: '#fff',
        width: '400px',
        borderRadius: '24px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        padding: '32px',
        position: 'relative'
    },
    modalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
    },
    modalTitle: {
        fontSize: '18px',
        fontWeight: 800,
        color: '#1e293b',
        margin: 0
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        fontSize: '18px',
        color: '#94a3b8',
        cursor: 'pointer',
        fontWeight: 600
    },
    modalBody: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    guestAvatar: {
        width: '72px',
        height: '72px',
        background: '#f1f5f9',
        color: '#e11d48',
        borderRadius: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '28px',
        fontWeight: 800,
        marginBottom: '16px'
    },
    guestName: {
        fontSize: '20px',
        fontWeight: 800,
        color: '#1e293b',
        margin: 0
    },
    guestRole: {
        fontSize: '13px',
        color: '#64748b',
        fontWeight: 600,
        marginTop: '4px',
        marginBottom: '32px'
    },
    infoList: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginBottom: '32px'
    },
    infoRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        background: '#f8fafc',
        borderRadius: '12px'
    },
    infoTag: {
        fontSize: '11px',
        fontWeight: 700,
        color: '#94a3b8',
        textTransform: 'uppercase'
    },
    infoText: {
        fontSize: '13px',
        fontWeight: 700,
        color: '#1e293b'
    },
    contactBtn: {
        width: '100%',
        background: '#1e293b',
        color: '#fff',
        padding: '14px',
        borderRadius: '12px',
        fontWeight: 700,
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s'
    }
}

export default MyListing

