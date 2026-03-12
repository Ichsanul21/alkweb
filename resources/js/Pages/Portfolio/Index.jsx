import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function PortfolioIndex({ portfolios, categories, filters }) {
    return (
        <PublicLayout>
            <Head title="Portfolio - Alenkosa" />

            <section style={{ padding: 'clamp(40px, 8vw, 80px) 5vw' }}>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 16 }}>// Portfolio</div>
                <h1 className="font-syne" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 40 }}>Our Work.</h1>

                {/* Category Filter */}
                {categories.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 40 }}>
                        <button className={`tag ${!filters.category ? 'tag-active' : ''}`} onClick={() => router.get('/portfolio', {}, { preserveState: true })} style={{ background: !filters.category ? 'var(--accent)' : 'transparent', color: !filters.category ? 'var(--bg-deep)' : 'var(--text-secondary)', border: '1px solid var(--border-glass)', padding: '8px 20px', borderRadius: 50, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>All</button>
                        {categories.map(cat => (
                            <button key={cat} className="tag" onClick={() => router.get('/portfolio', { category: cat }, { preserveState: true })} style={{ background: filters.category === cat ? 'var(--accent)' : 'transparent', color: filters.category === cat ? 'var(--bg-deep)' : 'var(--text-secondary)', border: '1px solid var(--border-glass)', padding: '8px 20px', borderRadius: 50, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{cat}</button>
                        ))}
                    </div>
                )}

                {/* Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'clamp(16px, 3vw, 30px)' }}>
                    {portfolios.data.length === 0 ? (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '80px 20px', color: 'var(--text-secondary)' }}>
                            <p style={{ fontSize: 18 }}>No projects found.</p>
                        </div>
                    ) : portfolios.data.map(p => (
                        <Link key={p.id} href={`/portfolio/${p.slug}`} style={{ textDecoration: 'none', position: 'relative', borderRadius: 16, overflow: 'hidden', background: '#000', display: 'block', height: 'clamp(280px, 45vh, 450px)' }} className="hover-trigger">
                            <img src={p.featured_image} alt={p.title_en} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6, transition: 'opacity 0.4s, transform 0.4s' }} onMouseOver={(e) => { e.target.style.opacity = 0.3; e.target.style.transform = 'scale(1.05)'; }} onMouseOut={(e) => { e.target.style.opacity = 0.6; e.target.style.transform = 'scale(1)'; }} />
                            <div style={{ position: 'absolute', bottom: 'clamp(15px, 3vw, 30px)', left: 'clamp(15px, 3vw, 30px)', color: '#fff', zIndex: 2 }}>
                                <span style={{ display: 'inline-block', padding: '5px 12px', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 50, fontSize: 11, marginBottom: 8, backdropFilter: 'blur(10px)' }}>{p.category}</span>
                                <h3 className="font-syne" style={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', fontWeight: 700, lineHeight: 1.1 }}>{p.title_en}</h3>
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
                                    <Link href={link.url} style={{ padding: '8px 14px', borderRadius: 8, background: link.active ? 'var(--accent)' : 'rgba(255,255,255,0.05)', color: link.active ? 'var(--bg-deep)' : 'var(--text-secondary)', textDecoration: 'none', fontSize: 14, fontWeight: link.active ? 700 : 400 }} dangerouslySetInnerHTML={{ __html: link.label }} />
                                ) : (
                                    <span style={{ padding: '8px 14px', opacity: 0.3, fontSize: 14 }} dangerouslySetInnerHTML={{ __html: link.label }} />
                                )}
                            </span>
                        ))}
                    </div>
                )}
            </section>
        </PublicLayout>
    );
}
