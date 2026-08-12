import React, { useContext } from 'react'
import { FiArrowLeft, FiCheckCircle, FiMapPin, FiHome, FiDollarSign, FiTag } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import { ListingDataContext } from '../Context/ListingContext';

function ListingPage3() {
    let navigate = useNavigate()
    let {
        title, description,
        frontEndImage1, frontEndImage2, frontEndImage3,
        rent, city, landmark, category,
        handleAddListing, adding
    } = useContext(ListingDataContext)

    return (
        <div style={styles.page}>
            <div style={styles.header}>
                <button onClick={() => navigate("/listingpage2")} style={styles.backBtn}>
                    <FiArrowLeft size={20} />
                </button>
                <div style={styles.progressContainer}>
                    <div style={styles.stepGroup}>
                        <div style={{ ...styles.stepCircle, ...styles.stepCompleted }}>✓</div>
                        <span style={styles.stepLabel}>Basics</span>
                    </div>
                    <div style={{ ...styles.stepLine, ...styles.lineActive }} />
                    <div style={styles.stepGroup}>
                        <div style={{ ...styles.stepCircle, ...styles.stepCompleted }}>✓</div>
                        <span style={styles.stepLabel}>Details</span>
                    </div>
                    <div style={{ ...styles.stepLine, ...styles.lineActive }} />
                    <div style={styles.stepGroup}>
                        <div style={{ ...styles.stepCircle, ...styles.stepActive }}>3</div>
                        <span style={styles.stepLabel}>Preview</span>
                    </div>
                </div>
            </div>

            <main style={styles.main}>
                <div style={styles.formCard}>
                    <div style={styles.previewHeader}>
                        <div style={styles.iconBox}><FiCheckCircle size={24} color="#10b981" /></div>
                        <div>
                            <h1 style={styles.title}>Review & Publish</h1>
                            <p style={styles.subtitle}>Check your details one last time before going live.</p>
                        </div>
                    </div>

                    <div style={styles.previewContent}>
                        {/* Image Gallery Preview */}
                        <div style={styles.gallery}>
                            <div style={styles.mainImgBox}>
                                {frontEndImage1 ? (
                                    <img src={frontEndImage1} alt="Main" style={styles.mainImg} />
                                ) : (
                                    <div style={styles.imgPlaceholder}><FiHome size={40} color="#cbd5e1" /></div>
                                )}
                            </div>
                            <div style={styles.sideImgs}>
                                <div style={styles.sideImgBox}>
                                    {frontEndImage2 ? <img src={frontEndImage2} alt="Side 1" style={styles.sideImg} /> : <div style={styles.imgPlaceholder}><FiCamera size={20} color="#cbd5e1" /></div>}
                                </div>
                                <div style={styles.sideImgBox}>
                                    {frontEndImage3 ? <img src={frontEndImage3} alt="Side 2" style={styles.sideImg} /> : <div style={styles.imgPlaceholder}><FiCamera size={20} color="#cbd5e1" /></div>}
                                </div>
                            </div>
                        </div>

                        {/* Details Summary */}
                        <div style={styles.infoGrid}>
                            <div style={styles.infoCard}>
                                <FiTag style={styles.infoIcon} />
                                <div>
                                    <span style={styles.infoLabel}>Title</span>
                                    <p style={styles.infoValue}>{title}</p>
                                </div>
                            </div>
                            <div style={styles.infoCard}>
                                <FiDollarSign style={styles.infoIcon} />
                                <div>
                                    <span style={styles.infoLabel}>Monthly Rent</span>
                                    <p style={styles.infoValue}>₹{rent}</p>
                                </div>
                            </div>
                            <div style={styles.infoCard}>
                                <FiMapPin style={styles.infoIcon} />
                                <div>
                                    <span style={styles.infoLabel}>Location</span>
                                    <p style={styles.infoValue}>{landmark}, {city}</p>
                                </div>
                            </div>
                            <div style={styles.infoCard}>
                                <FiHome style={styles.infoIcon} />
                                <div>
                                    <span style={styles.infoLabel}>Category</span>
                                    <p style={styles.infoValue}>{category.charAt(0).toUpperCase() + category.slice(1)}</p>
                                </div>
                            </div>
                        </div>

                        <div style={styles.descriptionSection}>
                            <h3 style={styles.subTitle}>Description</h3>
                            <p style={styles.descriptionText}>{description}</p>
                        </div>

                        <div style={styles.actions}>
                            <button 
                                style={styles.publishBtn} 
                                onClick={handleAddListing} 
                                disabled={adding}
                            >
                                {adding ? "Publishing..." : "Publish Listing"}
                            </button>
                            <p style={styles.disclaimer}>By publishing, you agree to our terms of service and hosting policies.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

const styles = {
    page: { minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif", padding: '20px' },
    header: { maxWidth: '900px', margin: '20px auto 40px', display: 'flex', alignItems: 'center', gap: '40px' },
    backBtn: { width: '44px', height: '44px', borderRadius: '14px', background: '#fff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', cursor: 'pointer' },
    progressContainer: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' },
    stepGroup: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' },
    stepCircle: { width: '32px', height: '32px', borderRadius: '50%', background: '#e2e8f0', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700 },
    stepActive: { background: '#e11d48', color: '#fff', boxShadow: '0 0 0 4px #fee2e2' },
    stepCompleted: { background: '#10b981', color: '#fff' },
    stepLabel: { fontSize: '12px', fontWeight: 600, color: '#64748b' },
    stepLine: { flex: 1, height: '2px', background: '#e2e8f0', margin: '0 15px', marginBottom: '20px' },
    lineActive: { background: '#10b981' },
    main: { maxWidth: '900px', margin: '0 auto' },
    formCard: { background: '#fff', borderRadius: '32px', padding: '48px', boxShadow: '0 20px 50px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.05)' },
    previewHeader: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' },
    iconBox: { width: '56px', height: '56px', background: '#ecfdf5', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    title: { fontSize: '24px', fontWeight: 800, color: '#1e293b', margin: 0 },
    subtitle: { fontSize: '14px', color: '#64748b', margin: '4px 0 0' },
    gallery: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '40px', height: '350px' },
    mainImgBox: { borderRadius: '24px', overflow: 'hidden', border: '1px solid #f1f5f9' },
    mainImg: { width: '100%', height: '100%', objectFit: 'cover' },
    imgPlaceholder: { width: '100%', height: '100%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    sideImgs: { display: 'grid', gridTemplateRows: '1fr 1fr', gap: '16px' },
    sideImgBox: { borderRadius: '20px', overflow: 'hidden', border: '1px solid #f1f5f9' },
    sideImg: { width: '100%', height: '100%', objectFit: 'cover' },
    infoGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '40px' },
    infoCard: { padding: '20px', borderRadius: '20px', background: '#f8fafc', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '16px' },
    infoIcon: { fontSize: '20px', color: '#e11d48' },
    infoLabel: { fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' },
    infoValue: { fontSize: '15px', fontWeight: 700, color: '#1e293b', margin: '2px 0 0' },
    subTitle: { fontSize: '18px', fontWeight: 800, color: '#1e293b', marginBottom: '16px' },
    descriptionSection: { marginBottom: '48px' },
    descriptionText: { fontSize: '15px', lineHeight: 1.7, color: '#475569' },
    actions: { textAlign: 'center' },
    publishBtn: { width: '100%', background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)', color: '#fff', padding: '18px', borderRadius: '18px', fontSize: '18px', fontWeight: 800, border: 'none', cursor: 'pointer', boxShadow: '0 10px 25px -5px rgba(225,29,72,0.3)', transition: 'transform 0.2s' },
    disclaimer: { fontSize: '12px', color: '#94a3b8', marginTop: '16px' }
}

export default ListingPage3

