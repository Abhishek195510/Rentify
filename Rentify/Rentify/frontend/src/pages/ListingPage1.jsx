import React, { useContext } from 'react'
import { FiArrowLeft, FiCheck } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import { ListingDataContext } from '../Context/ListingContext';
import { MdOutlineHouse } from 'react-icons/md';

function ListingPage1() {
    let navigate = useNavigate()
    let { title, setTitle, description, setDescription, rent, setRent, roomType, setRoomType } = useContext(ListingDataContext)

    return (
        <div style={styles.page}>
            {/* ── Progress Bar ── */}
            <div style={styles.header}>
                <button onClick={() => navigate("/")} style={styles.backBtn}>
                    <FiArrowLeft size={20} />
                </button>
                <div style={styles.progressContainer}>
                    <div style={styles.stepGroup}>
                        <div style={{ ...styles.stepCircle, ...styles.stepActive }}>1</div>
                        <span style={styles.stepLabel}>Basics</span>
                    </div>
                    <div style={styles.stepLine} />
                    <div style={styles.stepGroup}>
                        <div style={styles.stepCircle}>2</div>
                        <span style={styles.stepLabel}>Details</span>
                    </div>
                    <div style={styles.stepLine} />
                    <div style={styles.stepGroup}>
                        <div style={styles.stepCircle}>3</div>
                        <span style={styles.stepLabel}>Preview</span>
                    </div>
                </div>
            </div>

            <main style={styles.main}>
                <div style={styles.formCard}>
                    <div style={styles.formHeader}>
                        <div style={styles.iconBox}><MdOutlineHouse size={24} color="#e11d48" /></div>
                        <div>
                            <h1 style={styles.title}>The Basics</h1>
                            <p style={styles.subtitle}>Start with the essential details of your property.</p>
                        </div>
                    </div>

                    <form style={styles.form} onSubmit={(e) => { e.preventDefault(); navigate("/listingpage2") }}>
                        
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Property Title</label>
                            <input 
                                type="text" 
                                style={styles.input} 
                                required 
                                onChange={(e) => setTitle(e.target.value)} 
                                value={title} 
                                placeholder="e.g., Luxury 2BHK Villa with Garden"
                            />
                        </div>

                        <div style={styles.row}>
                            <div style={{ ...styles.inputGroup, flex: 1 }}>
                                <label style={styles.label}>Monthly Rent (₹)</label>
                                <input 
                                    type="number" 
                                    style={styles.input} 
                                    required 
                                    onChange={(e) => setRent(e.target.value)} 
                                    value={rent} 
                                    placeholder="Enter amount"
                                />
                            </div>
                            <div style={{ ...styles.inputGroup, flex: 1 }}>
                                <label style={styles.label}>Room Type</label>
                                <select 
                                    style={styles.select} 
                                    required 
                                    onChange={(e) => setRoomType(e.target.value)} 
                                    value={roomType}
                                >
                                    <option value="single">Single Room</option>
                                    <option value="double">Double Room</option>
                                    <option value="entire home">Entire Home</option>
                                </select>
                            </div>
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Description</label>
                            <textarea 
                                style={styles.textarea} 
                                required 
                                onChange={(e) => setDescription(e.target.value)} 
                                value={description} 
                                placeholder="Tell guests what makes your place special..."
                            />
                        </div>

                        <button style={styles.nextBtn}>
                            Continue to Step 2
                        </button>
                    </form>
                </div>
            </main>
        </div>
    )
}

const styles = {
    page: {
        minHeight: '100vh',
        background: '#f8fafc',
        fontFamily: "'Inter', sans-serif",
        padding: '20px'
    },
    header: {
        maxWidth: '800px',
        margin: '20px auto 40px',
        display: 'flex',
        alignItems: 'center',
        gap: '40px'
    },
    backBtn: {
        width: '44px',
        height: '44px',
        borderRadius: '14px',
        background: '#fff',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: '#64748b'
    },
    progressContainer: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px'
    },
    stepGroup: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px'
    },
    stepCircle: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: '#e2e8f0',
        color: '#94a3b8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        fontWeight: 700,
        transition: 'all 0.3s'
    },
    stepActive: {
        background: '#e11d48',
        color: '#fff',
        boxShadow: '0 0 0 4px #fee2e2'
    },
    stepLabel: {
        fontSize: '12px',
        fontWeight: 600,
        color: '#64748b'
    },
    stepLine: {
        flex: 1,
        height: '2px',
        background: '#e2e8f0',
        margin: '0 15px',
        marginBottom: '20px'
    },
    main: {
        maxWidth: '800px',
        margin: '0 auto'
    },
    formCard: {
        background: '#fff',
        borderRadius: '32px',
        padding: '48px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.04)',
        border: '1px solid rgba(0,0,0,0.05)'
    },
    formHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '40px'
    },
    iconBox: {
        width: '56px',
        height: '56px',
        background: '#fff1f2',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: '24px',
        fontWeight: 800,
        color: '#1e293b',
        margin: 0
    },
    subtitle: {
        fontSize: '14px',
        color: '#64748b',
        margin: '4px 0 0'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
    },
    row: {
        display: 'flex',
        gap: '20px'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    label: {
        fontSize: '14px',
        fontWeight: 700,
        color: '#475569',
        marginLeft: '4px'
    },
    input: {
        padding: '14px 20px',
        borderRadius: '14px',
        border: '2px solid #f1f5f9',
        fontSize: '15px',
        fontWeight: 500,
        outline: 'none',
        transition: 'all 0.2s',
        background: '#f8fafc'
    },
    textarea: {
        padding: '16px 20px',
        borderRadius: '16px',
        border: '2px solid #f1f5f9',
        fontSize: '15px',
        fontWeight: 500,
        outline: 'none',
        minHeight: '120px',
        resize: 'vertical',
        transition: 'all 0.2s',
        background: '#f8fafc'
    },
    select: {
        padding: '14px 20px',
        borderRadius: '14px',
        border: '2px solid #f1f5f9',
        fontSize: '15px',
        fontWeight: 500,
        outline: 'none',
        background: '#f8fafc',
        cursor: 'pointer'
    },
    nextBtn: {
        marginTop: '20px',
        background: '#1e293b',
        color: '#fff',
        padding: '16px',
        borderRadius: '16px',
        fontSize: '16px',
        fontWeight: 700,
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }
}

export default ListingPage1

