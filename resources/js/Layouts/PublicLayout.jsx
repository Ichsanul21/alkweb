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
        const onMove = (e) => gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1, ease: 'power2.out' });
        document.addEventListener('mousemove', onMove);
        return () => document.removeEventListener('mousemove', onMove);
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
                    <img src="/images/logo.png" alt="Alenkosa" style={{ height: 'clamp(28px, 4vw, 36px)', width: 'auto' }} />
                </Link>
                <div className="nav-links" style={{ alignItems: 'center' }}>
                    <Link href="/portfolio" className="hover-trigger" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500, fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 }}>Portfolio</Link>
                    <Link href="/articles" className="hover-trigger" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500, fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 }}>Articles</Link>
                    <Link href="/" className="hover-trigger" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500, fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 }}>Home</Link>
                    <div className="hover-trigger" onClick={toggleLang} style={{ cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-primary)', marginLeft: 10, opacity: 0.8, transition: 'opacity 0.3s' }} onMouseOver={(e) => e.currentTarget.style.opacity = '1'} onMouseOut={(e) => e.currentTarget.style.opacity = '0.8'}>
                        {lang.toUpperCase()}
                    </div>
                    <a href="#" className="hover-trigger" onClick={(e) => { e.preventDefault(); toggleTheme(); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, color: 'var(--text-primary)' }}>
                        {isLight ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                        )}
                    </a>
                </div>
                <div className="menu-btn hover-trigger" style={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: 14 }} onClick={toggleMenu}>Menu</div>
            </nav>

            <div className={`mobile-menu ${menuOpen ? 'active' : ''}`}>
                <Link href="/portfolio" className="mobile-link hover-trigger" onClick={() => { setMenuOpen(false); document.body.style.overflow = ''; }}>Portfolio</Link>
                <Link href="/articles" className="mobile-link hover-trigger" onClick={() => { setMenuOpen(false); document.body.style.overflow = ''; }}>Articles</Link>
                <Link href="/" className="mobile-link hover-trigger" onClick={() => { setMenuOpen(false); document.body.style.overflow = ''; }}>Home</Link>
                <div className="close-btn hover-trigger" onClick={toggleMenu} style={{ marginTop: 50, fontSize: 14, textTransform: 'uppercase' }}>Close</div>
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
