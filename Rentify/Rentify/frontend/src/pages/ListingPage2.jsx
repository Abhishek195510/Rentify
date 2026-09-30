import React, { useContext } from 'react'
import { FiArrowLeft, FiMapPin, FiCamera, FiUploadCloud } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import { GiFamilyHouse, GiWoodCabin } from "react-icons/gi";
import { MdBedroomParent, MdOutlinePool } from "react-icons/md";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import { IoBedOutline } from "react-icons/io5";
import { FaTreeCity } from "react-icons/fa6";
import { BiBuildingHouse } from "react-icons/bi";
import { ListingDataContext } from '../Context/ListingContext';

function ListingPage2() {
    let navigate = useNavigate()
    let { 
        category, setCategory, 
        city, setCity, 
        landmark, setLandmark,
        latitude, setLatitude,
        longitude, setLongitude,
        setFrontEndImage1, setFrontEndImage2, setFrontEndImage3,
        setBackEndImage1, setBackEndImage2, setBackEndImage3,
        frontEndImage1, frontEndImage2, frontEndImage3
    } = useContext(ListingDataContext)

    const handleImage = (e, index) => {
        let file = e.target.files[0]
        if (!file) return;
        const url = URL.createObjectURL(file)
        if (index === 1) { setBackEndImage1(file); setFrontEndImage1(url) }
        if (index === 2) { setBackEndImage2(file); setFrontEndImage2(url) }
        if (index === 3) { setBackEndImage3(file); setFrontEndImage3(url) }
    }

    const categories = [
        { id: 'villa', label: 'Villa', icon: <GiFamilyHouse size={24} /> },
        { id: 'farmHouse', label: 'Farm House', icon: <FaTreeCity size={24} /> },
        { id: 'poolHouse', label: 'Pool House', icon: <MdOutlinePool size={24} /> },
        { id: 'rooms', label: 'Rooms', icon: <MdBedroomParent size={24} /> },
        { id: 'flat', label: 'Flat', icon: <BiBuildingHouse size={24} /> },
        { id: 'pg', label: 'PG', icon: <IoBedOutline size={24} /> },
        { id: 'cabin', label: 'Cabin', icon: <GiWoodCabin size={24} /> },
        { id: 'shops', label: 'Shops', icon: <SiHomeassistantcommunitystore size={24} /> },
    ]

    return (
        <div style={styles.page}>
            <div style={styles.header}>
                <button onClick={() => navigate("/listingpage1")} style={styles.backBtn}>
                    <FiArrowLeft size={20} />
                </button>
                <div style={styles.progressContainer}>
                    <div style={styles.stepGroup}>
                        <div style={{ ...styles.stepCircle, ...styles.stepCompleted }}>✓</div>
                        <span style={styles.stepLabel}>Basics</span>
                    </div>
                    <div style={{ ...styles.stepLine, ...styles.lineActive }} />
                    <div style={styles.stepGroup}>
                        <div style={{ ...styles.stepCircle, ...styles.stepActive }}>2</div>
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
                    {/* Location Section */}
                    <section style={styles.section}>
                        <div style={styles.sectionHeader}>
                            <div style={styles.iconBox}><FiMapPin size={22} color="#3b82f6" /></div>
                            <div>
                                <h2 style={styles.sectionTitle}>Location Details</h2>
                                <p style={styles.sectionSubtitle}>Where is your property located?</p>
                            </div>
                        </div>

                        <div style={styles.row}>
                            <div style={{ ...styles.inputGroup, flex: 1 }}>
                                <label style={styles.label}>City & Country</label>
                                <input type="text" style={styles.input} required value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Mumbai, India" />
                            </div>
                            <div style={{ ...styles.inputGroup, flex: 1 }}>
                                <label style={styles.label}>Landmark</label>
                                <input type="text" style={styles.input} required value={landmark} onChange={e => setLandmark(e.target.value)} placeholder="e.g. Near Metro Station" />
                            </div>
                        </div>

                        <div style={styles.gpsBox}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <span style={styles.gpsLabel}>GPS Coordinates (Optional)</span>
                                <button type="button" style={styles.gpsBtn} onClick={() => {
                                    if (navigator.geolocation) {
                                        navigator.geolocation.getCurrentPosition(p => {
                                            setLatitude(p.coords.latitude)
                                            setLongitude(p.coords.longitude)
                                        })
                                    }
                                }}>Detect Location</button>
                            </div>
                            <div style={styles.row}>
                                <input type="number" step="any" style={{ ...styles.input, flex: 1 }} placeholder="Latitude" value={latitude} onChange={e => setLatitude(e.target.value)} />
                                <input type="number" step="any" style={{ ...styles.input, flex: 1 }} placeholder="Longitude" value={longitude} onChange={e => setLongitude(e.target.value)} />
                            </div>
                        </div>
                    </section>

                    {/* Category Section */}
                    <section style={styles.section}>
                        <h3 style={styles.subTitle}>Select Category</h3>
                        <div style={styles.categoryGrid}>
                            {categories.map(cat => (
                                <div 
                                    key={cat.id} 
                                    onClick={() => setCategory(cat.id)}
                                    style={{ 
                                        ...styles.catCard, 
                                        ...(category === cat.id ? styles.catActive : {}) 
                                    }}
                                >
                                    <div style={{ color: category === cat.id ? '#e11d48' : '#64748b' }}>{cat.icon}</div>
                                    <span style={{ ...styles.catLabel, ...(category === cat.id ? { color: '#e11d48' } : {}) }}>{cat.label}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Photos Section */}
                    <section style={styles.section}>
                        <div style={styles.sectionHeader}>
                            <div style={styles.iconBox}><FiCamera size={22} color="#10b981" /></div>
                            <div>
                                <h2 style={styles.sectionTitle}>Property Photos</h2>
                                <p style={styles.sectionSubtitle}>Upload at least 3 high-quality photos.</p>
                            </div>
                        </div>

                        <div style={styles.photoGrid}>
                            {[1, 2, 3].map(i => (
                                <div key={i} style={styles.photoUpload}>
                                    <input type="file" id={`img-${i}`} style={{ display: 'none' }} onChange={e => handleImage(e, i)} required={true} />
                                    <label htmlFor={`img-${i}`} style={styles.photoLabel}>
                                        {((i === 1 && frontEndImage1) || (i === 2 && frontEndImage2) || (i === 3 && frontEndImage3)) ? (
                                            <img src={i === 1 ? frontEndImage1 : i === 2 ? frontEndImage2 : frontEndImage3} style={styles.preview} />
                                        ) : (
                                            <div style={styles.uploadPlaceholder}>
                                                <FiUploadCloud size={24} />
                                                <span>Photo {i}</span>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </section>

                    <button 
                        style={{ ...styles.nextBtn, opacity: (!category || !city || !landmark) ? 0.5 : 1 }} 
                        disabled={!category || !city || !landmark}
                        onClick={() => navigate("/listingpage3")}
                    >
                        Review Listing
                    </button>
                </div>
            </main>
        </div>
    )
}

const styles = {
    page: { minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif", padding: '20px' },
    header: { maxWidth: '800px', margin: '20px auto 40px', display: 'flex', alignItems: 'center', gap: '40px' },
    backBtn: { width: '44px', height: '44px', borderRadius: '14px', background: '#fff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' },
    progressContainer: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' },
    stepGroup: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' },
    stepCircle: { width: '32px', height: '32px', borderRadius: '50%', background: '#e2e8f0', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700 },
    stepActive: { background: '#e11d48', color: '#fff', boxShadow: '0 0 0 4px #fee2e2' },
    stepCompleted: { background: '#10b981', color: '#fff' },
    stepLabel: { fontSize: '12px', fontWeight: 600, color: '#64748b' },
    stepLine: { flex: 1, height: '2px', background: '#e2e8f0', margin: '0 15px', marginBottom: '20px' },
    lineActive: { background: '#10b981' },
    main: { maxWidth: '800px', margin: '0 auto' },
    formCard: { background: '#fff', borderRadius: '32px', padding: '40px', boxShadow: '0 20px 50px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.05)' },
    section: { marginBottom: '40px' },
    sectionHeader: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' },
    iconBox: { width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' },
    sectionTitle: { fontSize: '18px', fontWeight: 800, color: '#1e293b', margin: 0 },
    sectionSubtitle: { fontSize: '13px', color: '#64748b', margin: '2px 0 0' },
    row: { display: 'flex', gap: '16px', marginBottom: '16px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '13px', fontWeight: 700, color: '#475569', marginLeft: '4px' },
    input: { padding: '12px 16px', borderRadius: '12px', border: '2px solid #f1f5f9', fontSize: '14px', fontWeight: 500, outline: 'none', background: '#f8fafc' },
    gpsBox: { background: '#f1f5f9', padding: '16px', borderRadius: '16px', marginTop: '8px' },
    gpsLabel: { fontSize: '12px', fontWeight: 700, color: '#64748b' },
    gpsBtn: { background: '#1e293b', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' },
    subTitle: { fontSize: '14px', fontWeight: 800, color: '#1e293b', marginBottom: '16px' },
    categoryGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' },
    catCard: { padding: '16px', borderRadius: '16px', border: '2px solid #f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s' },
    catActive: { borderColor: '#e11d48', background: '#fff1f2' },
    catLabel: { fontSize: '12px', fontWeight: 700, color: '#64748b' },
    photoGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
    photoUpload: { aspectRatio: '4/3' },
    photoLabel: { width: '100%', height: '100%', border: '2px dashed #e2e8f0', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden' },
    uploadPlaceholder: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '11px', fontWeight: 700 },
    preview: { width: '100%', height: '100%', objectFit: 'cover' },
    nextBtn: { width: '100%', background: '#1e293b', color: '#fff', padding: '16px', borderRadius: '16px', fontSize: '16px', fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
}

export default ListingPage2

