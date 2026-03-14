import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import '../../css/public.css';
import CustomDropdown from '@/Components/Public/CustomDropdown';
import InquirySuccessModal from '@/Components/Public/InquirySuccessModal';

gsap.registerPlugin(ScrollTrigger);

// ────────────────────────────────────────────────────────────────
// Translations
// ────────────────────────────────────────────────────────────────
const t = {
    en: {
        nav_services: 'Services', nav_portfolio: 'Portfolio', nav_process: 'Process', nav_close: 'Close',
        hero_1: 'Intelligent', hero_2: 'Systems.', hero_3: 'Built to', hero_4: 'Think.',
        hero_desc: 'Transforming data into precise future predictions for your business through advanced AI and robust IoT architecture.',
        hero_cta: 'View Projects',
        about_tag: '// About Us', about_title: 'Our Story.',
        about_desc: 'Alenkosa is a laid-back conversation partner — but we never compromise on quality or real business impact. From enterprises to public institutions, we engineer technology built to face the future head-on.',
        about_vision_title: 'Our Vision',
        about_vision_desc: 'To be the driving force behind technology innovation, with a focus on building scalable products that transform industries and create sustainable economic value in Indonesia.',
        about_values_title: 'Our Values',
        svc_tag: '// Expertise', svc_title_1: 'Comprehensive', svc_title_2: 'Technology Solutions.',
        svc_desc: 'We don\u2019t just write code. We blend artificial intelligence, precision infrastructure, and deep data analysis to revolutionize your business processes in the digital era.',
        port_tag: '// Featured Work', port_title: 'Selected Projects.',
        proc_tag: '// Our Mission', proc_title: 'How We Drive Change.',
        proc_1_title: 'Intelligent Products',
        proc_1_desc: 'Creating and commercializing intelligent products powered by AI/ML, IoT, and real-time data analytics for business solutions.',
        proc_2_title: 'Smart Infrastructure',
        proc_2_desc: 'Implementing large-scale Smart Infrastructure and Intelligent Systems that are efficient and reliable for enterprises.',
        proc_3_title: 'Strategic Partnerships',
        proc_3_desc: 'Building strategic partnerships and expert teams committed to continuous innovation, data security, and real impact for business growth.',
        art_tag: '// Insights', art_title: 'Latest Articles.', art_read: 'Read Article', art_more: 'View All Articles',
        marquee: 'LET\u2019S BUILD SOMETHING GREAT \u2022 ',
        footer_cta_title: 'Ready to innovate?',
        footer_cta_desc: 'We are ready to be your discussion partner. Let\u2019s explore your data potential.',
        form_name: 'Full Name', form_email: 'Email Address', form_project: 'Tell us about your project...',
        form_submit: 'Send Inquiry',
        form_wa: 'WhatsApp Number', form_company: 'Company Name', form_service: 'Select Service',
        form_country: 'Country', form_city: 'City',
    },
    id: {
        nav_services: 'Layanan', nav_portfolio: 'Portofolio', nav_process: 'Proses', nav_close: 'Tutup',
        hero_1: 'Sistem', hero_2: 'Cerdas.', hero_3: 'Diciptakan', hero_4: 'untuk Berpikir.',
        hero_desc: 'Mengubah data menjadi prediksi masa depan yang presisi bagi bisnis Anda melalui AI canggih dan arsitektur IoT yang andal.',
        hero_cta: 'Lihat Proyek',
        about_tag: '// Tentang Kami', about_title: 'Cerita Kami.',
        about_desc: 'Alenkosa adalah mitra diskusi yang santai, namun tanpa kompromi soal kualitas dan dampak nyata bagi bisnis Anda. Dari enterprise hingga instansi publik, kami merancang teknologi yang tangguh menghadapi masa depan.',
        about_vision_title: 'Visi Kami',
        about_vision_desc: 'Menjadi motor penggerak inovasi teknologi, dengan fokus pada pengembangan scalable products yang mentransformasi industri dan menciptakan nilai ekonomi berkelanjutan di Indonesia.',
        about_values_title: 'Nilai Kami',
        svc_tag: '// Keahlian', svc_title_1: 'Solusi', svc_title_2: 'Teknologi Menyeluruh.',
        svc_desc: 'Kami tidak sekadar menulis baris kode. Kami memadukan kecerdasan buatan, jaringan infrastruktur yang presisi, dan analisis data mendalam untuk merevolusi proses bisnis Anda di era digital.',
        port_tag: '// Karya Unggulan', port_title: 'Proyek Terpilih.',
        svc_1: 'Perangkat Lunak Cerdas', svc_2: 'Infrastruktur Pintar', svc_3: 'Media Digital', svc_4: 'Lainnya',
        proc_tag: '// Misi Kami', proc_title: 'Cara Kami Mendorong Perubahan.',
        proc_1_title: 'Produk Cerdas',
        proc_1_desc: 'Menciptakan dan mengomersialkan Intelligent Products yang didukung AI/ML, IoT dan real-time data analytics untuk solusi bisnis.',
        proc_2_title: 'Infrastruktur Pintar',
        proc_2_desc: 'Mengimplementasikan Smart Infrastructure dan Intelligent Systems berskala besar yang efisien dan andal bagi enterprise.',
        proc_3_title: 'Kemitraan Strategis',
        proc_3_desc: 'Membangun kemitran strategis dan tim ahli yang berkomitmen pada continuous innovation, data security, dan dampak nyata bagi pertumbuhan bisnis.',
        art_tag: '// Wawasan', art_title: 'Artikel Terbaru.', art_read: 'Baca Artikel', art_more: 'Lihat Semua Artikel',
        marquee: 'AYO BANGUN SESUATU YANG HEBAT \u2022 ',
        footer_cta_title: 'Siap berinovasi?',
        footer_cta_desc: 'Kami siap menjadi mitra diskusi Anda. Mari jelajahi potensi data Anda.',
        form_name: 'Nama Lengkap', form_email: 'Alamat Email', form_project: 'Ceritakan tentang proyek Anda...',
        form_submit: 'Kirim Pertanyaan',
        form_wa: 'Nomor WhatsApp', form_company: 'Nama Perusahaan', form_service: 'Pilih Layanan',
        form_country: 'Negara', form_city: 'Kota',
    },
};

const processImages = [
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
];

export default function Home({ statistics, services, portfolios, articles, settings }) {
    const [lang, setLang] = useState('en');
    const [isLight, setIsLight] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const mainRef = useRef(null);
    const cursorRef = useRef(null);
    const lenisRef = useRef(null);
    const { flash } = usePage().props;
    const i = t[lang]; // current language

    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    // Contact form
    const contactForm = useForm({ 
        name: '', email: '', whatsapp_number: '', 
        company_name: '', country: '', city: '',
        service_type: '', message: '' 
    });

    const handleContact = (e) => {
        e.preventDefault();
        contactForm.post('/contact', {
            preserveScroll: true,
            onSuccess: () => {
                setIsSuccessModalOpen(true);
            }
        });
    };

    // Theme toggle
    const toggleTheme = useCallback(() => {
        setIsLight(v => {
            const next = !v;
            document.documentElement.classList.toggle('light', next);
            return next;
        });
    }, []);

    const toggleLang = useCallback(() => setLang(v => v === 'en' ? 'id' : 'en'), []);

    // ── GSAP + Lenis init ──────────────────────────────────────
    useEffect(() => {
        const ctx = gsap.context(() => {
            // Lenis
            const lenis = new Lenis({ smoothWheel: true, duration: 1.2 });
            lenisRef.current = lenis;
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => lenis.raf(time * 1000));
            gsap.ticker.lagSmoothing(0);

            // -- Preloader --
            const tl = gsap.timeline();
            const statuses = ['INIT', 'CONNECTING', 'COMPILING', 'READY'];
            let statusObj = { val: 0 }, loadObj = { val: 0 };

            tl.to('.preloader-sys-info, .preloader-counter', { opacity: 1, duration: 1, ease: 'power2.out' })
              .to('#loaderIcon', { opacity: 1, scale: 1, duration: 1, ease: 'expo.out' }, '<')
              .to('#loaderRingProgress', { strokeDashoffset: 0, duration: 2.5, ease: 'power3.inOut' }, '<')
              .to(loadObj, {
                  val: 100, duration: 2.5, ease: 'power3.inOut',
                  onUpdate: () => { const el = document.getElementById('loadCount'); if (el) el.innerText = Math.floor(loadObj.val).toString().padStart(2, '0'); }
              }, '<')
              .to(statusObj, {
                  val: 3.99, duration: 2.5, ease: 'none',
                  onUpdate: () => { const el = document.getElementById('bootStatus'); if (el) el.innerText = statuses[Math.floor(statusObj.val)]; }
              }, '<')
              .to('#preloader', { clipPath: 'inset(100% 0 0 0)', duration: 1.2, ease: 'power4.inOut', delay: 0.2 })
              .to('.hero-text', { y: '0%', duration: 1, stagger: 0.1, ease: 'power4.out' }, '-=0.5')
              .to('.hero-fade', { opacity: 1, y: 0, duration: 1, ease: 'power2.out', stagger: 0.2 }, '-=0.8')
              .to('.hero-img', { opacity: 1, duration: 1.5, ease: 'power2.out' }, '-=1');

            // Navbar scroll
            ScrollTrigger.create({ start: 'top -50', end: 99999, toggleClass: { className: 'scrolled', targets: '#navbar' } });

            // Stats counter
            document.querySelectorAll('.counter').forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                const suffix = counter.getAttribute('data-suffix') || '+';
                ScrollTrigger.create({
                    trigger: counter, start: 'top 85%', once: true,
                    onEnter: () => gsap.to(counter, {
                        innerHTML: target, duration: 2, snap: { innerHTML: 1 },
                        onUpdate() { counter.innerHTML = Math.round(this.targets()[0].innerHTML).toString() + suffix; }
                    })
                });
            });

            // Services title reveal
            gsap.to('.svc-header', { scrollTrigger: { trigger: '#services', start: 'top 80%' }, y: '0%', duration: 1, stagger: 0.1, ease: 'power4.out' });

            // Portfolio horizontal scroll
            const portWrap = document.querySelector('.portfolio-wrapper');
            if (portWrap) {
                const getScrollAmount = () => -(portWrap.scrollWidth - window.innerWidth + window.innerWidth * 0.1);
                const tween = gsap.to(portWrap, { x: getScrollAmount, duration: 3, ease: 'none' });
                ScrollTrigger.create({
                    trigger: '#portfolio', start: 'top top', end: () => `+=${getScrollAmount() * -1}`,
                    pin: true, animation: tween, scrub: 1, invalidateOnRefresh: true, pinSpacing: true
                });
            }

            // Process steps
            gsap.utils.toArray('.step').forEach(step => {
                ScrollTrigger.create({ trigger: step, start: 'top 60%', end: 'bottom 40%', toggleClass: 'active' });
                const pImg = step.querySelector('.p-img');
                if (pImg) gsap.fromTo(pImg, { y: 100 }, { y: -100, scrollTrigger: { trigger: step, start: 'top bottom', end: 'bottom top', scrub: 1 } });
            });

            // Gradient orb
            gsap.to('#gradientOrb', { x: '+=100', y: '+=80', duration: 8, ease: 'sine.inOut', repeat: -1, yoyo: true });

            // Marquee
            gsap.to('.marquee-text', { xPercent: -50, ease: 'none', duration: 10, repeat: -1 });

            // Section reveal
            gsap.utils.toArray('section').forEach(sec => {
                if (!sec.classList.contains('hero') && sec.id !== 'portfolio' && sec.id !== 'process') {
                    gsap.from(sec.querySelectorAll(':scope > div, :scope > h2, :scope > p, :scope > .grid-2'), {
                        scrollTrigger: { trigger: sec, start: 'top 85%' },
                        y: 40, opacity: 0, duration: 1, stagger: 0.1, ease: 'power2.out'
                    });
                }
            });

            // Process heading
            gsap.from('#process > h2', { scrollTrigger: { trigger: '#process', start: 'top 85%' }, y: 40, opacity: 0, duration: 1, ease: 'power2.out' });

            // Footer reveal
            gsap.to('.footer-reveal', {
                scrollTrigger: { trigger: 'footer', start: 'top 85%' },
                y: 0, opacity: 1, duration: 1, ease: 'power2.out'
            });

            // Nav scroll progress
            gsap.to(document.documentElement, {
                '--scroll-percent': '100%', ease: 'none',
                scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true }
            });

            // Matrix background
            const canvas = document.getElementById('codeBg');
            if (canvas) {
                const ctx2d = canvas.getContext('2d');
                let cw = window.innerWidth, ch = window.innerHeight;
                canvas.width = cw; canvas.height = ch;
                window.addEventListener('resize', () => { cw = window.innerWidth; ch = window.innerHeight; canvas.width = cw; canvas.height = ch; });
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*</>?=+-';
                const fontSize = 18;
                let columns = Math.floor(cw / fontSize);
                let drops = Array.from({ length: columns }, () => 1);
                const getBg = () => document.documentElement.classList.contains('light') ? 'rgba(245,245,247,0.04)' : 'rgba(2,12,21,0.04)';
                const getAccent = () => getComputedStyle(document.documentElement).getPropertyValue('--accent');
                const interval = setInterval(() => {
                    ctx2d.fillStyle = getBg();
                    ctx2d.fillRect(0, 0, cw, ch);
                    ctx2d.fillStyle = getAccent();
                    ctx2d.font = `bold ${fontSize}px monospace`;
                    for (let x = 0; x < drops.length; x++) {
                        ctx2d.fillText(chars[Math.floor(Math.random() * chars.length)], x * fontSize, drops[x] * fontSize);
                        if (drops[x] * fontSize > ch && Math.random() > 0.975) drops[x] = 0;
                        drops[x]++;
                    }
                }, 50);
                return () => clearInterval(interval);
            }
        }, mainRef);

        return () => ctx.revert();
    }, []);

    // Custom cursor
    useEffect(() => {
        const cursor = cursorRef.current;
        if (!cursor) return;
        const onMove = (e) => gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1, ease: 'power2.out' });
        document.addEventListener('mousemove', onMove);

        const triggers = document.querySelectorAll('.hover-trigger, a, button, input, textarea');
        const onEnter = () => document.body.classList.add('cursor-hover');
        const onLeave = () => document.body.classList.remove('cursor-hover');
        triggers.forEach(t => { t.addEventListener('mouseenter', onEnter); t.addEventListener('mouseleave', onLeave); });

        return () => {
            document.removeEventListener('mousemove', onMove);
            triggers.forEach(t => { t.removeEventListener('mouseenter', onEnter); t.removeEventListener('mouseleave', onLeave); });
        };
    }, []);

    const scrollTo = (id) => {
        setMenuOpen(false);
        document.body.style.overflow = '';
        const el = document.getElementById(id);
        if (el) lenisRef.current?.scrollTo(el, { offset: -80 });
    };

    const toggleMenu = () => {
        setMenuOpen(v => {
            document.body.style.overflow = !v ? 'hidden' : '';
            return !v;
        });
    };

    const seo = settings?.seo || {};
    const general = settings?.general || {};
    const social = settings?.social || {};

    // JSON-LD structured data
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: general.company_name || 'Alenkosa',
        url: window.location.origin,
        logo: `${window.location.origin}/images/logo.png`,
        description: seo.seo_description || '',
        address: general.company_address ? { '@type': 'PostalAddress', streetAddress: general.company_address } : undefined,
        contactPoint: { '@type': 'ContactPoint', email: general.company_email || 'hello@alenkosa.id', contactType: 'customer service' },
        sameAs: [social.social_instagram, social.social_linkedin, social.social_twitter, social.social_github].filter(Boolean),
    };

    return (
        <div ref={mainRef}>
            <Head>
                <title>{seo.seo_title || 'Alenkosa - Tech & Intelligence'}</title>
                <meta name="description" content={seo.seo_description || ''} />
                <meta name="keywords" content={seo.seo_keywords || ''} />
                <link rel="canonical" href={typeof window !== 'undefined' ? window.location.origin : ''} />
                {/* Open Graph */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content={seo.seo_title || 'Alenkosa - Tech & Intelligence'} />
                <meta property="og:description" content={seo.seo_description || ''} />
                <meta property="og:image" content={`${typeof window !== 'undefined' ? window.location.origin : ''}/images/logo.png`} />
                <meta property="og:site_name" content={general.company_name || 'Alenkosa'} />
                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={seo.seo_title || 'Alenkosa - Tech & Intelligence'} />
                <meta name="twitter:description" content={seo.seo_description || ''} />
                <link rel="icon" type="image/png" href="/images/favicon.png" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            </Head>

            <div className="gradient-orb" id="gradientOrb" />
            <canvas id="codeBg" />
            <div id="cursor" ref={cursorRef} />

            {/* ── PRELOADER ── */}
            <div id="preloader">
                <div className="preloader-sys-info font-syne" style={{ position: 'absolute', top: 'clamp(20px, 4vw, 40px)', left: 'clamp(20px, 4vw, 40px)', fontSize: 11, letterSpacing: 2, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                    SYS_BOOT_SEQ // <span id="bootStatus" style={{ color: 'var(--text-primary)' }}>INIT</span>
                </div>
                <div className="preloader-counter font-syne" style={{ position: 'absolute', bottom: 'clamp(20px, 4vw, 40px)', right: 'clamp(20px, 4vw, 40px)', fontSize: 'clamp(3rem, 12vw, 8rem)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 0.85, letterSpacing: '-0.05em' }}>
                    <span id="loadCount">00</span><span style={{ fontSize: '0.5em', verticalAlign: 'top', color: 'var(--accent)' }}>%</span>
                </div>
                <div className="loader-module">
                    <svg className="loader-ring" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="48" fill="none" stroke="var(--border-glass)" strokeWidth="0.5" />
                        <circle cx="50" cy="50" r="48" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="301.59" strokeDashoffset="301.59" id="loaderRingProgress" strokeLinecap="round" />
                    </svg>
                    <img src="/images/favicon.png" alt="Alenkosa" className="loader-icon" id="loaderIcon" />
                </div>
            </div>

            {/* ── NAV ── */}
            <nav id="navbar">
                <a href="#" className="nav-logo hover-trigger" style={{ display: 'flex', alignItems: 'center' }}>
                    <img src="/images/logo.png" alt="Alenkosa" style={{ height: 'clamp(32px, 6vw, 44px)', width: 'auto' }} />
                </a>
                <div className="nav-links" style={{ alignItems: 'center' }}>
                    <a href="#services" className="hover-trigger" onClick={(e) => { e.preventDefault(); scrollTo('services'); }}>{i.nav_services}</a>
                    <a href="#portfolio" className="hover-trigger" onClick={(e) => { e.preventDefault(); scrollTo('portfolio'); }}>{i.nav_portfolio}</a>
                    <a href="#process" className="hover-trigger" onClick={(e) => { e.preventDefault(); scrollTo('process'); }}>{i.nav_process}</a>
                    
                    <CustomDropdown 
                        options={[{ value: 'en', label: 'EN' }, { value: 'id', label: 'ID' }]}
                        value={lang}
                        onChange={(val) => setLang(val)}
                        placeholder="LANG"
                        className="hover-trigger"
                        style={{ width: 80, fontSize: 12 }}
                    />

                    <a href="#" className="hover-trigger" onClick={(e) => { e.preventDefault(); toggleTheme(); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, marginLeft: 20 }}>
                        {isLight ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                        )}
                    </a>
                </div>
                <div className="menu-btn hover-trigger" style={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: 14 }} onClick={toggleMenu}>Menu</div>
            </nav>

            {/* ── MOBILE MENU ── */}
            <div className={`mobile-menu ${menuOpen ? 'active' : ''}`}>
                <a href="#services" className="mobile-link hover-trigger" onClick={(e) => { e.preventDefault(); scrollTo('services'); }}>{i.nav_services}</a>
                <a href="#portfolio" className="mobile-link hover-trigger" onClick={(e) => { e.preventDefault(); scrollTo('portfolio'); }}>{i.nav_portfolio}</a>
                <a href="#process" className="mobile-link hover-trigger" onClick={(e) => { e.preventDefault(); scrollTo('process'); }}>{i.nav_process}</a>
                <a href="#" className="mobile-link hover-trigger" onClick={(e) => { e.preventDefault(); toggleLang(); }} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                    <span>{lang === 'en' ? 'Bahasa Indonesia' : 'English'}</span>
                </a>
                <a href="#" className="mobile-link hover-trigger" onClick={(e) => { e.preventDefault(); toggleTheme(); }} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                    Theme
                </a>
                <div className="close-btn hover-trigger" onClick={toggleMenu} style={{ marginTop: 50, fontSize: 14, textTransform: 'uppercase' }}>{i.nav_close}</div>
            </div>

            <main>
                {/* ── HERO ── */}
                <section className="hero">
                    <div>
                        <h1 className="font-syne title-huge">
                            <span className="text-reveal"><span className="hero-text">{i.hero_1}</span></span>
                            <span className="text-reveal"><span className="hero-text" style={{ color: 'var(--accent)' }}>{i.hero_2}</span></span>
                            <span className="text-reveal"><span className="hero-text">{i.hero_3}</span></span>
                            <span className="text-reveal"><span className="hero-text">{i.hero_4}</span></span>
                        </h1>
                        <p className="hero-fade" style={{ marginTop: 32, fontSize: 16, color: 'var(--text-secondary)', maxWidth: 480, opacity: 0 }}>
                            {i.hero_desc}
                        </p>
                        <div className="hero-fade" style={{ marginTop: 40, opacity: 0 }}>
                            <a href="#portfolio" className="btn hover-trigger" onClick={(e) => { e.preventDefault(); scrollTo('portfolio'); }}>{i.hero_cta}</a>
                        </div>
                    </div>
                    <div className="hero-img-wrap">
                        <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070" className="hero-img" alt="Tech" />
                    </div>
                </section>

                {/* ── STATS ── */}
                <section className="stats">
                    {statistics.map(stat => (
                        <div key={stat.id}>
                            <div className="stat-val font-syne counter" data-target={stat.value} data-suffix={stat.suffix}>0</div>
                            <div className="stat-label" dangerouslySetInnerHTML={{ __html: (lang === 'id' ? stat.label_id : stat.label_en).replace(/\n/g, '<br>') }} />
                        </div>
                    ))}
                </section>

                {/* ── ABOUT ── */}
                <section id="story">
                    <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 16 }}>{i.about_tag}</div>
                    <h2 className="title-large font-syne" style={{ marginBottom: 40 }}>{i.about_title}</h2>
                    <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }}>
                        <div>
                            <p style={{ fontSize: 20, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 24 }}>{i.about_desc}</p>
                        </div>
                        <div>
                            <h3 className="font-syne" style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>{i.about_vision_title}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: 18, marginBottom: 32 }}>{i.about_vision_desc}</p>
                            <h3 className="font-syne" style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>{i.about_values_title}</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                                <span className="tag" style={{ border: '1px solid var(--text-primary)', color: 'var(--text-primary)', padding: '8px 20px' }}>Innovation</span>
                                <span className="tag" style={{ border: '1px solid var(--text-primary)', color: 'var(--text-primary)', padding: '8px 20px' }}>Scalability</span>
                                <span className="tag" style={{ border: '1px solid var(--text-primary)', color: 'var(--text-primary)', padding: '8px 20px' }}>Data-Driven</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── PROCESS / MISSION (moved after About) ── */}
                <section id="process">
                    <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 16 }}>{i.proc_tag}</div>
                    <h2 className="title-large font-syne" style={{ marginBottom: 80, textAlign: 'center' }}>{i.proc_title}</h2>
                    {[1, 2, 3].map(n => (
                        <div key={n} className="process-item step">
                            <div className="process-img-col">
                                <img src={processImages[n - 1]} className="process-img p-img" alt="" />
                            </div>
                            <div className="p-text">
                                <div className="process-num-large font-syne">{String(n).padStart(2, '0')}</div>
                                <h3 className="font-syne" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 700, marginBottom: 16, marginTop: -20 }}>{i[`proc_${n}_title`]}</h3>
                                <p style={{ fontSize: 18, color: 'var(--text-secondary)' }}>{i[`proc_${n}_desc`]}</p>
                            </div>
                        </div>
                    ))}
                </section>

                {/* ── SERVICES ── */}
                <section id="services">
                    <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 16 }}>{i.svc_tag}</div>
                    <div className="services-layout">
                        <div className="services-nav">
                            <h2 className="title-large font-syne text-reveal"><span className="svc-header">{i.svc_title_1}</span></h2>
                            <h2 className="title-large font-syne text-reveal"><span className="svc-header">{i.svc_title_2}</span></h2>
                            <p style={{ marginTop: 32, fontSize: 20, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 450 }}>{i.svc_desc}</p>
                        </div>
                        <div className="services-list">
                            {services.map(svc => (
                                <div key={svc.id} className="service-item hover-trigger">
                                    <div className="service-num font-syne">{svc.number}</div>
                                    <div>
                                        <div className="font-syne">{lang === 'id' ? svc.title_id : svc.title_en}</div>
                                        <div className="service-desc">{lang === 'id' ? svc.description_id : svc.description_en}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── PORTFOLIO ── */}
                <section id="portfolio" style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 16 }}>{i.port_tag}</div>
                    <h2 className="title-large font-syne" style={{ marginBottom: 40 }}>{i.port_title}</h2>
                    <div className="portfolio-container" style={{ width: '100vw', marginLeft: 'calc(-1 * clamp(20px, 5vw, 50px))' }}>
                        <div className="portfolio-wrapper" style={{ paddingLeft: 'clamp(20px, 5vw, 50px)', paddingRight: 'clamp(20px, 5vw, 50px)' }}>
                            {portfolios.map(p => (
                                <a key={p.id} href={`/portfolio/${p.slug}`} className="portfolio-card hover-trigger">
                                    <img src={p.featured_image} className="portfolio-img" alt={p.title_en} />
                                    <div className="portfolio-info">
                                        <div className="tag" style={{ marginBottom: 8 }}>{p.category}</div>
                                        <h3 className="font-syne">{lang === 'id' ? p.title_id : p.title_en}</h3>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── ARTICLES ── */}
                {articles && articles.length > 0 && (
                    <section id="articles">
                        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 16 }}>{i.art_tag}</div>
                        <h2 className="title-large font-syne" style={{ marginBottom: 40 }}>{i.art_title}</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'clamp(16px, 3vw, 30px)' }}>
                            {articles.map(article => (
                                <Link key={article.id} href={`/articles/${article.slug}`} style={{ textDecoration: 'none', color: 'inherit', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: 16, overflow: 'hidden', transition: 'transform 0.3s, border-color 0.3s' }} className="hover-trigger" onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'var(--accent)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border-glass)'; }}>
                                    {article.featured_image && (
                                        <img src={article.featured_image} alt={lang === 'id' ? article.title_id : article.title_en} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                                    )}
                                    <div style={{ padding: 'clamp(16px, 3vw, 24px)' }}>
                                        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                                            {article.category && <span style={{ padding: '3px 10px', border: '1px solid var(--border-glass)', borderRadius: 50, fontSize: 11, color: 'var(--accent)' }}>{article.category}</span>}
                                            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                                                {article.published_at && new Date(article.published_at).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                        <h3 className="font-syne" style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', fontWeight: 700, marginBottom: 10, lineHeight: 1.3 }}>{lang === 'id' ? article.title_id : article.title_en}</h3>
                                        {article.excerpt_en && <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{lang === 'id' ? (article.excerpt_id || article.excerpt_en) : article.excerpt_en}</p>}
                                        {article.author && <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 12 }}>By {article.author.name}</p>}
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div style={{ textAlign: 'center', marginTop: 40 }}>
                            <Link href="/articles" className="btn hover-trigger">{i.art_more}</Link>
                        </div>
                    </section>
                )}

                {/* ── FOOTER ── */}
                <footer>
                    <div className="marquee hover-trigger">
                        <div className="marquee-text font-syne">{i.marquee}</div>
                        <div className="marquee-text font-syne">{i.marquee}</div>
                    </div>

                    <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 80, padding: '40px 0' }}>
                        <div>
                            <h3 className="font-syne" style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>{i.footer_cta_title}</h3>
                            <p style={{ fontSize: 20, color: 'var(--text-secondary)', maxWidth: 380, marginBottom: 40 }}>{i.footer_cta_desc}</p>
                            <a href={`mailto:${settings?.general?.company_email || 'hello@alenkosa.id'}`} className="hover-trigger" style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Syne', sans-serif", borderBottom: '1px solid var(--text-primary)', paddingBottom: 8, transition: 'color 0.3s, border-color 0.3s' }}>
                                {settings?.general?.company_email || 'hello@alenkosa.id'}
                            </a>
                        </div>
                        <form onSubmit={handleContact} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                            {flash?.success && <div style={{ padding: '12px 20px', borderRadius: 10, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', fontSize: 14 }}>{flash.success}</div>}
                            
                            <input type="text" className="hover-trigger premium-input" placeholder={i.form_name} value={contactForm.data.name} onChange={e => contactForm.setData('name', e.target.value)} required style={{ background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-glass)', padding: '16px 0', fontSize: 20, color: 'var(--text-primary)', outline: 'none' }} />
                            {contactForm.errors.name && <span style={{ color: '#ef4444', fontSize: 12 }}>{contactForm.errors.name}</span>}
                            
                            <input type="email" className="hover-trigger premium-input" placeholder={i.form_email} value={contactForm.data.email} onChange={e => contactForm.setData('email', e.target.value)} required style={{ background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-glass)', padding: '16px 0', fontSize: 20, color: 'var(--text-primary)', outline: 'none' }} />
                            {contactForm.errors.email && <span style={{ color: '#ef4444', fontSize: 12 }}>{contactForm.errors.email}</span>}

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                                <div>
                                    <input type="text" className="hover-trigger premium-input" placeholder={i.form_wa} value={contactForm.data.whatsapp_number} onChange={e => contactForm.setData('whatsapp_number', e.target.value)} required style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-glass)', padding: '16px 0', fontSize: 20, color: 'var(--text-primary)', outline: 'none' }} />
                                    {contactForm.errors.whatsapp_number && <span style={{ color: '#ef4444', fontSize: 12 }}>{contactForm.errors.whatsapp_number}</span>}
                                </div>
                                <div>
                                    <input type="text" className="hover-trigger premium-input" placeholder={i.form_company} value={contactForm.data.company_name} onChange={e => contactForm.setData('company_name', e.target.value)} style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-glass)', padding: '16px 0', fontSize: 20, color: 'var(--text-primary)', outline: 'none' }} />
                                    {contactForm.errors.company_name && <span style={{ color: '#ef4444', fontSize: 12 }}>{contactForm.errors.company_name}</span>}
                                </div>
                            </div>

                             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                                <div>
                                    <input type="text" className="hover-trigger premium-input" placeholder={i.form_country} value={contactForm.data.country} onChange={e => contactForm.setData('country', e.target.value)} required style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-glass)', padding: '16px 0', fontSize: 20, color: 'var(--text-primary)', outline: 'none' }} />
                                    {contactForm.errors.country && <span style={{ color: '#ef4444', fontSize: 12 }}>{contactForm.errors.country}</span>}
                                </div>
                                <div>
                                    <input type="text" className="hover-trigger premium-input" placeholder={i.form_city} value={contactForm.data.city} onChange={e => contactForm.setData('city', e.target.value)} required style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-glass)', padding: '16px 0', fontSize: 20, color: 'var(--text-primary)', outline: 'none' }} />
                                    {contactForm.errors.city && <span style={{ color: '#ef4444', fontSize: 12 }}>{contactForm.errors.city}</span>}
                                </div>
                            </div>

                            <CustomDropdown 
                                options={[
                                    { value: 'Intelligent Software', label: lang === 'id' ? 'Perangkat Lunak Cerdas' : 'Intelligent Software' },
                                    { value: 'Smart Infrastructure', label: lang === 'id' ? 'Infrastruktur Pintar' : 'Smart Infrastructure' },
                                    { value: 'Digital Media', label: lang === 'id' ? 'Media Digital' : 'Digital Media' },
                                    { value: 'Other', label: lang === 'id' ? 'Lainnya' : 'Other' },
                                ]}
                                value={contactForm.data.service_type}
                                onChange={(val) => contactForm.setData('service_type', val)}
                                placeholder={i.form_service}
                                className="hover-trigger premium-input"
                            />
                            {contactForm.errors.service_type && <span style={{ color: '#ef4444', fontSize: 12 }}>{contactForm.errors.service_type}</span>}
                            
                            <textarea className="hover-trigger premium-input" placeholder={i.form_project} rows={3} value={contactForm.data.message} onChange={e => contactForm.setData('message', e.target.value)} required style={{ background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-glass)', padding: '16px 0', fontSize: 20, color: 'var(--text-primary)', outline: 'none', resize: 'none' }} />
                            {contactForm.errors.message && <span style={{ color: '#ef4444', fontSize: 12 }}>{contactForm.errors.message}</span>}
                            
                            <div className="footer-reveal" style={{ opacity: 0, transform: 'translateY(40px)' }}>
                                <button type="submit" className="btn hover-trigger" disabled={contactForm.processing} style={{ alignSelf: 'flex-start', marginTop: 16 }}>
                                    {contactForm.processing ? '...' : i.form_submit}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', paddingTop: 40, borderTop: '1px solid var(--border-glass)', marginTop: 40, color: 'var(--text-secondary)', fontSize: 14, gap: 16 }}>
                        <p>© 2026 {settings?.general?.company_name || 'Alenkosa'} Studio. All rights reserved.</p>
                        <div style={{ display: 'flex', gap: 24 }}>
                            <a href={settings?.social?.social_instagram || '#'} className="hover-trigger" style={{ color: 'inherit', transition: 'color 0.3s' }}>Instagram</a>
                            <a href={settings?.social?.social_linkedin || '#'} className="hover-trigger" style={{ color: 'inherit', transition: 'color 0.3s' }}>LinkedIn</a>
                        </div>
                    </div>
                </footer>

                <InquirySuccessModal 
                    isOpen={isSuccessModalOpen} 
                    onClose={() => {
                        setIsSuccessModalOpen(false);
                        contactForm.reset();
                    }}
                    formData={contactForm.data}
                    lang={lang}
                />
            </main>
        </div>
    );
}
