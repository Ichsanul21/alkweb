import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import Skeleton from '@/Components/Skeleton';
import useLanguage from '@/Hooks/useLanguage';
import { useState, useMemo, useEffect } from 'react';

export default function PortfolioIndex({ portfolios, categories, filters }) {
    const { lang } = useLanguage();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const startLoading = () => setLoading(true);
        const stopLoading = () => setLoading(false);
        const removeStart = router.on('start', startLoading);
        const removeFinish = router.on('finish', stopLoading);
        return () => {
            removeStart();
            removeFinish();
        };
    }, []);

    const featuredProject = useMemo(() => {
        return portfolios.data.find(p => p.is_featured) || portfolios.data[0];
    }, [portfolios.data]);

    const otherProjects = useMemo(() => {
        return portfolios.data.filter(p => p.id !== featuredProject?.id);
    }, [portfolios.data, featuredProject]);
    return (
        <PublicLayout>
            <Head title="Portfolio - Alenkosa" />

            <section style={{ padding: 'clamp(40px, 8vw, 80px) 5vw' }}>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 16 }}>// Portfolio</div>
                <h1 className="font-brand" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 40 }}>Our Work.</h1>

                {/* Category Filter */}
                {categories.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 40 }}>
                        <button className={`tag ${!filters.category ? 'tag-active' : ''}`} onClick={() => router.get('/portfolio', {}, { preserveState: true })} style={{ background: !filters.category ? 'var(--accent)' : 'transparent', color: !filters.category ? 'var(--bg-deep)' : 'var(--text-secondary)', border: '1px solid var(--border-glass)', padding: '8px 20px', borderRadius: 50, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{lang === 'id' ? 'Semua' : 'All'}</button>
                        {categories.map(cat => (
                            <button key={cat} className="tag" onClick={() => router.get('/portfolio', { category: cat }, { preserveState: true })} style={{ background: filters.category === cat ? 'var(--accent)' : 'transparent', color: filters.category === cat ? 'var(--bg-deep)' : 'var(--text-secondary)', border: '1px solid var(--border-glass)', padding: '8px 20px', borderRadius: 50, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{cat}</button>
                        ))}
                    </div>
                )}

                {/* Featured Showcase */}
                {!filters.category && featuredProject && (
                    <Link href={`/portfolio/${featuredProject.slug}`} className="hover-trigger" style={{ display: 'block', position: 'relative', borderRadius: 24, overflow: 'hidden', height: 'clamp(350px, 60vh, 600px)', marginBottom: 60, background: '#000' }}>
                        <img src={featuredProject.featured_image} alt={lang === 'id' ? featuredProject.title_id : featuredProject.title_en} width="1200" height="800" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />
                        <div style={{ position: 'absolute', bottom: 'clamp(30px, 6vw, 60px)', left: 'clamp(30px, 6vw, 60px)', right: 'clamp(30px, 6vw, 60px)', zIndex: 2 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                <span style={{ background: 'var(--accent)', color: '#000', padding: '4px 12px', borderRadius: 20, fontSize: 10, fontWeight: 800, letterSpacing: 1, fontFamily: "'JetBrains Mono', monospace" }}>FEATURED PROJECT</span>
                                {featuredProject.category && <span style={{ padding: '4px 12px', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 50, fontSize: 10, backdropFilter: 'blur(10px)', color: '#fff', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{featuredProject.category.toUpperCase()}</span>}
                            </div>
                            <h2 className="font-brand" style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)', color: '#fff', fontWeight: 800, lineHeight: 1, marginBottom: 20 }}>{lang === 'id' ? featuredProject.title_id : featuredProject.title_en}</h2>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 20, color: 'rgba(255,255,255,0.7)' }}>
                                <span style={{ fontSize: 14 }}>{lang === 'id' ? 'Lihat Detail Proyek' : 'View Project Details'} →</span>
                                <span style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.2)' }} />
                                <span style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'JetBrains Mono', monospace" }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                    {featuredProject.view_count || 0} VIEWS
                                </span>
                            </div>
                        </div>
                    </Link>
                )}

                {/* Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'clamp(16px, 3vw, 30px)' }}>
                    {loading ? (
                        Array.from({ length: 6 }).map((_, i) => <Skeleton.PortfolioCard key={i} />)
                    ) : portfolios.data.length === 0 ? (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '80px 20px', color: 'var(--text-secondary)' }}>
                            <p style={{ fontSize: 18 }}>{lang === 'id' ? 'Tidak ada proyek ditemukan.' : 'No projects found.'}</p>
                        </div>
                    ) : (filters.category ? portfolios.data : otherProjects).map(p => (
                        <Link key={p.id} href={`/portfolio/${p.slug}`} style={{ textDecoration: 'none', position: 'relative', borderRadius: 16, overflow: 'hidden', background: '#000', display: 'block', height: 'clamp(280px, 45vh, 450px)' }} className="hover-trigger">
                            <img src={p.featured_image} alt={lang === 'id' ? p.title_id : p.title_en} width="800" height="600" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6, transition: 'opacity 0.4s, transform 0.4s' }} onMouseOver={(e) => { e.target.style.opacity = 0.3; e.target.style.transform = 'scale(1.05)'; }} onMouseOut={(e) => { e.target.style.opacity = 0.6; e.target.style.transform = 'scale(1)'; }} />
                            {p.is_featured && (
                                <div style={{ position: 'absolute', top: 20, right: 20, background: 'var(--accent)', color: '#000', padding: '4px 12px', borderRadius: 20, fontSize: 10, fontWeight: 800, letterSpacing: 1, zIndex: 2 }}>FEATURED</div>
                            )}
                            <div style={{ position: 'absolute', bottom: 'clamp(15px, 3vw, 30px)', left: 'clamp(15px, 3vw, 30px)', right: 'clamp(15px, 3vw, 30px)', color: '#fff', zIndex: 2 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                    <div>
                                        {p.category && <span style={{ display: 'inline-block', padding: '5px 12px', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 50, fontSize: 10, marginBottom: 8, backdropFilter: 'blur(10px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{p.category.toUpperCase()}</span>}
                                        <h3 className="font-brand" style={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', fontWeight: 700, lineHeight: 1.1 }}>{lang === 'id' ? (p.title_id || p.title_en) : p.title_en}</h3>
                                    </div>
                                    <div style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4, opacity: 0.8, marginBottom: 4, fontFamily: "'JetBrains Mono', monospace" }}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                        {p.view_count || 0}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Pagination */}
                {portfolios.links && portfolios.links.length > 3 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 40 }}>
                        {portfolios.links.map((link, i) => (
                            <span key={i}>
                                {link.url ? (
                                    <Link href={link.url} preserveScroll preserveState style={{ padding: '8px 14px', borderRadius: 8, background: link.active ? 'var(--accent)' : 'rgba(255,255,255,0.05)', color: link.active ? 'var(--bg-deep)' : 'var(--text-secondary)', textDecoration: 'none', fontSize: 14, fontWeight: link.active ? 700 : 400 }}>{link.label.replace(/&laquo;/g, '«').replace(/&raquo;/g, '»')}</Link>
                                ) : (
                                    <span style={{ padding: '8px 14px', opacity: 0.3, fontSize: 14 }}>{link.label.replace(/&laquo;/g, '«').replace(/&raquo;/g, '»')}</span>
                                )}
                            </span>
                        ))}
                    </div>
                )}
            </section>
        </PublicLayout>
    );
}
