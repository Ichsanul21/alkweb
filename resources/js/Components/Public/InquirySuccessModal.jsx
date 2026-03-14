import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function InquirySuccessModal({ isOpen, onClose, formData, lang }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted || !isOpen) return null;

    const generateWhatsAppLink = () => {
        const phone = '628114002131'; // Example Alenkosa WhatsApp number
        
        const messageEn = `Hello Alenkosa Team,\n\nI'm ${formData.name} from ${formData.company_name || 'N/A'}, located in ${formData.city}, ${formData.country}. I'm interested in your ${formData.service_type} services.\n\nMy Message: ${formData.message}\n\nLooking forward to hearing from you!`;
        const messageId = `Halo Tim Alenkosa,\n\nSaya ${formData.name} dari ${formData.company_name || 'N/A'}, berlokasi di ${formData.city}, ${formData.country}. Saya tertarik dengan layanan ${formData.service_type}.\n\nPesan Saya: ${formData.message}\n\nMohon kabari ya! Terima kasih.`;
        
        const fullMessage = `Bilingual Inquiry:\n------------------\n${messageId}\n\n------------------\n${messageEn}`;
        
        return `https://wa.me/${phone}?text=${encodeURIComponent(fullMessage)}`;
    };

    return createPortal(
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            background: 'rgba(2, 12, 21, 0.85)',
            backdropFilter: 'blur(10px)'
        }}>
            <div 
                className="modal-appear"
                style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: 30,
                    padding: 'clamp(30px, 8vw, 60px)',
                    maxWidth: 500,
                    width: '100%',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                }}
            >
                <div style={{
                    width: 80,
                    height: 80,
                    background: 'rgba(0, 229, 255, 0.1)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 30px',
                    color: 'var(--accent)',
                    fontSize: 40
                }}>
                    ✓
                </div>

                <h2 className="font-syne" style={{ fontSize: 32, fontWeight: 800, marginBottom: 20 }}>
                    {lang === 'id' ? 'Inquiry Terkirim!' : 'Inquiry Sent!'}
                </h2>
                <p style={{ fontSize: 18, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 40 }}>
                    {lang === 'id' 
                        ? 'Inquiry telah kami terima, mau respon lebih cepat? Klik tombol di bawah ini untuk konsultasi via WhatsApp.' 
                        : 'We have received your inquiry. Want a faster response? Click the button below to consult via WhatsApp.'}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <a 
                        href={generateWhatsAppLink()} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn" 
                        style={{ 
                            background: 'var(--text-primary)', 
                            color: 'var(--bg-deep)', 
                            width: '100%',
                            justifyContent: 'center'
                        }}
                    >
                        {lang === 'id' ? 'Hubungi via WhatsApp' : 'Contact via WhatsApp'}
                    </a>
                    <button 
                        onClick={onClose}
                        style={{ 
                            background: 'transparent', 
                            border: 'none', 
                            color: 'var(--text-secondary)', 
                            fontSize: 14, 
                            cursor: 'pointer',
                            textDecoration: 'underline'
                        }}
                    >
                        {lang === 'id' ? 'Tutup' : 'Close'}
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes modalAppear {
                    from { opacity: 0; transform: scale(0.9) translateY(20px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .modal-appear {
                    animation: modalAppear 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </div>,
        document.body
    );
}
