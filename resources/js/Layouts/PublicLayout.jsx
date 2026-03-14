import { Link, usePage, Head } from '@inertiajs/react';
import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import '../../css/public.css';

export default function PublicLayout({ children, title }) {
    const [lang, setLang] = useState('en');
    const [isLight, setIsLight] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const cursorRef = useRef(null);

    const toggleTheme = useCallback(() => {
        setIsLight(v => { const next = !v; document.documentElement.classList.toggle('light', next); return next; });
    }, []);
    const toggleLang = useCallback(() => setLang(v => v === 'en' ? 'id' : 'en'), []);
    const toggleMenu = () => { setMenuOpen(v => { document.body.style.overflow = !v ? 'hidden' : ''; return !v; }); };

    useEffect(() => {
        const cursor = cursorRef.current;
        if (!cursor) return;

        const onMove = (e) => {
            gsap.to(cursor, { 
                x: e.clientX, 
                y: e.clientY, 
                duration: 0.15, 
                ease: 'power2.out' 
            });
        };

        const onOver = (e) => {
            if (e.target.closest('.hover-trigger, a, button, input, textarea')) {
                document.body.classList.add('cursor-hover');
            }
        };

        const onOut = (e) => {
            if (e.target.closest('.hover-trigger, a, button, input, textarea')) {
                document.body.classList.remove('cursor-hover');
            }
        };

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseover', onOver);
        document.addEventListener('mouseout', onOut);

        return () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseover', onOver);
            document.removeEventListener('mouseout', onOut);
            document.body.classList.remove('cursor-hover');
        };
    }, []);

    return (
        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet" />
            </Head>
            <div className="gradient-orb" />
            <div id="cursor" ref={cursorRef} />

            <nav id="navbar" className="scrolled">
                <Link href="/" className="nav-logo hover-trigger" style={{ display: 'flex', alignItems: 'center' }}>
                    <img src="/images/logo.png" alt="Alenkosa" style={{ height: 'clamp(32px, 6vw, 44px)', width: 'auto' }} />
                </Link>
                <div className="nav-links" style={{ alignItems: 'center' }}>
                    <Link href="/" className="hover-trigger">{lang === 'id' ? 'Beranda' : 'Home'}</Link>
                    <Link href="/portfolio" className="hover-trigger">{lang === 'id' ? 'Portofolio' : 'Portfolio'}</Link>
                    <Link href="/articles" className="hover-trigger">{lang === 'id' ? 'Artikel' : 'Articles'}</Link>
                    
                    <div className="hover-trigger" onClick={toggleLang} style={{ cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-primary)', marginLeft: 10, opacity: 0.8, transition: 'opacity 0.3s' }} onMouseOver={(e) => e.currentTarget.style.opacity = '1'} onMouseOut={(e) => e.currentTarget.style.opacity = '0.8'}>
                        {lang.toUpperCase()}
                    </div>

                    <a href="#" className="hover-trigger" onClick={(e) => { e.preventDefault(); toggleTheme(); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, marginLeft: 20, color: 'var(--text-primary)' }}>
                        {isLight ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                        )}
                    </a>
                </div>
                <div className="menu-btn hover-trigger" style={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: 14 }} onClick={toggleMenu}>Menu</div>
            </nav>

            <div className={`mobile-menu ${menuOpen ? 'active' : ''}`}>
                <Link href="/" className="mobile-link hover-trigger" onClick={() => { setMenuOpen(false); document.body.style.overflow = ''; }}>{lang === 'id' ? 'Beranda' : 'Home'}</Link>
                <Link href="/portfolio" className="mobile-link hover-trigger" onClick={() => { setMenuOpen(false); document.body.style.overflow = ''; }}>{lang === 'id' ? 'Portofolio' : 'Portfolio'}</Link>
                <Link href="/articles" className="mobile-link hover-trigger" onClick={() => { setMenuOpen(false); document.body.style.overflow = ''; }}>{lang === 'id' ? 'Artikel' : 'Articles'}</Link>
                <a href="#" className="mobile-link hover-trigger" onClick={(e) => { e.preventDefault(); toggleLang(); }} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                    <span>{lang === 'en' ? 'Bahasa Indonesia' : 'English'}</span>
                </a>
                <a href="#" className="mobile-link hover-trigger" onClick={(e) => { e.preventDefault(); toggleTheme(); }} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                    Theme
                </a>
                <div className="close-btn hover-trigger" onClick={toggleMenu} style={{ marginTop: 50, fontSize: 14, textTransform: 'uppercase' }}>{lang === 'id' ? 'Tutup' : 'Close'}</div>
            </div>

            <main style={{ minHeight: '100vh', paddingTop: 100 }}>
                {children}
            </main>

            <footer style={{ padding: 'clamp(40px, 6vw, 60px) 5vw 30px', borderTop: '1px solid var(--border-glass)' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: 14, gap: 16 }}>
                    <p>© 2026 Alenkosa Studio. All rights reserved.</p>
                    <div style={{ display: 'flex', gap: 24 }}>
                        <Link href="/" className="hover-trigger" style={{ color: 'inherit' }}>Home</Link>
                        <Link href="/portfolio" className="hover-trigger" style={{ color: 'inherit' }}>Portfolio</Link>
                        <Link href="/articles" className="hover-trigger" style={{ color: 'inherit' }}>Articles</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
