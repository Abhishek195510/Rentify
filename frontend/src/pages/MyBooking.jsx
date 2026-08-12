import React, { useContext, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserDataContext } from '../Context/UserContext';
import Card from '../Component/Card';
import { FiArrowLeft, FiCalendar, FiMapPin, FiCreditCard, FiClock, FiCheckCircle } from 'react-icons/fi';
import { MdOutlineHouse } from 'react-icons/md';

function MyBooking() {
    const navigate = useNavigate()
    const { userData } = useContext(UserDataContext)
    const bookings = userData?.booking || []

    const summary = useMemo(() => {
        const totalSpent = bookings.reduce((acc, curr) => acc + (Number(curr.rent) || 0), 0)
        return {
            count: bookings.length,
            totalSpent: totalSpent
        }
    }, [bookings])

    return (
        <div style={styles.container}>
            
            {/* ── Header ── */}
            <header style={styles.header}>
                <div style={styles.headerContent}>
                    <div style={styles.topNav}>
                        <button onClick={() => navigate("/")} style={styles.backBtn}>
                            <FiArrowLeft size={18} />
                        </button>
                        <div style={styles.logo} onClick={() => navigate("/")}>
                            <MdOutlineHouse size={24} color="#e53935" />
                            <span>Rentify</span>
                        </div>
                    </div>
                    
                    <div style={styles.titleSection}>
                        <h1 style={styles.title}>My Stays</h1>
                        <p style={styles.subtitle}>Manage your bookings and travel history</p>
                    </div>

                    <div style={styles.summaryGrid}>
                        <div style={styles.summaryCard}>
                            <FiCalendar style={styles.summaryIcon} />
                            <div>
                                <span style={styles.summaryVal}>{summary.count}</span>
                                <p style={styles.summaryLabel}>Total Bookings</p>
                            </div>
                        </div>
                        <div style={styles.summaryCard}>
                            <FiCreditCard style={styles.summaryIcon} />
                            <div>
                                <span style={styles.summaryVal}>₹{summary.totalSpent.toLocaleString()}</span>
                                <p style={styles.summaryLabel}>Total Investment</p>
                            </div>
                        </div>
                        <div style={styles.summaryCard}>
                            <FiCheckCircle style={styles.summaryIcon} />
                            <div>
                                <span style={styles.summaryVal}>Active</span>
                                <p style={styles.summaryLabel}>Membership Status</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Content ── */}
            <main style={styles.main}>
                <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}>Your Booked Properties</h2>
                    <div style={styles.filterTabs}>
                        <span style={{ ...styles.tab, ...styles.tabActive }}>All Stays</span>
                        <span style={styles.tab}>Upcoming</span>
                        <span style={styles.tab}>Completed</span>
                    </div>
                </div>

                {bookings.length === 0 ? (
                    <div style={styles.emptyState}>
                        <div style={styles.emptyIcon}><FiCalendar size={40} /></div>
                        <h3>No bookings yet</h3>
                        <p>Your next adventure is just a click away. Start exploring rooms!</p>
                        <button onClick={() => navigate("/")} style={styles.emptyBtn}>Explore Rooms</button>
                    </div>
                ) : (
                    <div style={styles.grid}>
                        {bookings.map((list) => (
                            <div key={list._id} style={styles.cardWrapper}>
                                <div style={styles.bookingBadge}>
                                    <FiClock size={12} /> Confirmed
                                </div>
                                <Card
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
                                />
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}

const styles = {
    container: {
        minHeight: '100vh',
        background: '#f1f5f9',
        fontFamily: "'Inter', sans-serif"
    },
    header: {
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: '#fff',
        paddingBottom: '60px'
    },
    headerContent: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '24px 24px 0'
    },
    topNav: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '40px'
    },
    backBtn: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.1)',
        border: 'none',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer'
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        cursor: 'pointer',
        fontSize: '18px',
        fontWeight: 800
    },
    titleSection: {
        marginBottom: '40px'
    },
    title: {
        fontSize: '32px',
        fontWeight: 900,
        margin: 0,
        letterSpacing: '-1px'
    },
    subtitle: {
        fontSize: '16px',
        opacity: 0.6,
        marginTop: '8px'
    },
    summaryGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
        marginBottom: '-30px'
    },
    summaryCard: {
        background: '#fff',
        borderRadius: '20px',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        color: '#1e293b',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'
    },
    summaryIcon: {
        fontSize: '24px',
        color: '#e11d48'
    },
    summaryVal: {
        fontSize: '20px',
        fontWeight: 800,
        display: 'block'
    },
    summaryLabel: {
        fontSize: '12px',
        fontWeight: 600,
        color: '#94a3b8',
        margin: 0,
        textTransform: 'uppercase'
    },
    main: {
        maxWidth: '1200px',
        margin: '60px auto 0',
        padding: '0 24px 80px'
    },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px'
    },
    sectionTitle: {
        fontSize: '22px',
        fontWeight: 800,
        color: '#0f172a',
        margin: 0
    },
    filterTabs: {
        display: 'flex',
        gap: '8px',
        background: '#e2e8f0',
        padding: '4px',
        borderRadius: '12px'
    },
    tab: {
        padding: '8px 16px',
        fontSize: '13px',
        fontWeight: 700,
        color: '#64748b',
        cursor: 'pointer',
        borderRadius: '8px'
    },
    tabActive: {
        background: '#fff',
        color: '#1e293b',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '32px'
    },
    cardWrapper: {
        position: 'relative'
    },
    bookingBadge: {
        position: 'absolute',
        top: '12px',
        left: '12px',
        zIndex: 5,
        background: '#10b981',
        color: '#fff',
        padding: '4px 10px',
        borderRadius: '6px',
        fontSize: '10px',
        fontWeight: 800,
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        textTransform: 'uppercase'
    },
    emptyState: {
        background: '#fff',
        borderRadius: '32px',
        padding: '80px 40px',
        textAlign: 'center',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
    },
    emptyIcon: {
        width: '80px',
        height: '80px',
        background: '#fff1f2',
        color: '#e11d48',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 24px'
    },
    emptyBtn: {
        marginTop: '24px',
        background: 'linear-gradient(135deg, #e11d48, #be123c)',
        color: '#fff',
        border: 'none',
        padding: '12px 32px',
        borderRadius: '12px',
        fontWeight: 700,
        cursor: 'pointer'
    }
}

export default MyBooking

