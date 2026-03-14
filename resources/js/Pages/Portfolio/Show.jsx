import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import DOMPurify from 'dompurify';

export default function PortfolioShow({ portfolio, related }) {
    return (
        <PublicLayout>
            <Head>
                <title>{`${portfolio.title_en} - Alenkosa Portfolio`}</title>
                <meta name="description" content={portfolio.description_en || portfolio.title_en} />
                {portfolio.meta_title && <meta property="og:title" content={portfolio.meta_title} />}
                {portfolio.featured_image && <meta property="og:image" content={portfolio.featured_image} />}
            </Head>

            {/* Hero Banner */}
            {portfolio.featured_image && (
                <div style={{ width: '100%', height: 'clamp(300px, 50vh, 500px)', position: 'relative', overflow: 'hidden' }}>
                    <img src={portfolio.featured_image} alt={portfolio.title_en} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.4)' }} />
                    <div style={{ position: 'absolute', bottom: 'clamp(30px, 6vw, 60px)', left: '5vw', color: '#fff', zIndex: 2 }}>
                        <span style={{ display: 'inline-block', padding: '6px 16px', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 50, fontSize: 11, marginBottom: 12, backdropFilter: 'blur(10px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{portfolio.category.toUpperCase()}</span>
                        <h1 className="font-brand" style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', fontWeight: 800, textTransform: 'uppercase', lineHeight: 1 }}>{portfolio.title_en}</h1>
                    </div>
                </div>
            )}

            <section style={{ padding: 'clamp(40px, 8vw, 80px) 5vw' }}>
                <div style={{ maxWidth: 900, margin: '0 auto' }}>
                    {/* Back link */}
                    <Link href="/portfolio" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600, fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 40 }}>← Back to Portfolio</Link>

                    {/* Description */}
                    {portfolio.description_en && (
                        <p style={{ fontSize: 20, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 40 }}>{portfolio.description_en}</p>
                    )}

                    {/* Tags */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 40 }}>
                            {portfolio.tags.map(tag => (
                                <span key={tag} style={{ padding: '6px 14px', border: '1px solid var(--border-glass)', borderRadius: 50, fontSize: 11, color: 'var(--text-secondary)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{tag}</span>
                            ))}
                        </div>

                    {/* Content */}
                    {portfolio.content_en && (
                        <div className="prose" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(portfolio.content_en || '') }} style={{ color: 'var(--text-primary)', fontSize: 16, lineHeight: 1.8 }} />
                    )}

                    {/* Gallery */}
                    {portfolio.gallery && portfolio.gallery.length > 0 && (
                        <div style={{ marginTop: 60 }}>
                            <h3 className="font-brand" style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Gallery</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                                {portfolio.gallery.map((img, i) => (
                                    <img key={i} src={img} alt={`Gallery ${i + 1}`} style={{ width: '100%', borderRadius: 12, objectFit: 'cover', height: 250 }} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Related Projects */}
            {related.length > 0 && (
                <section style={{ padding: 'clamp(40px, 6vw, 60px) 5vw', borderTop: '1px solid var(--border-glass)' }}>
                    <h3 className="font-brand" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 30 }}>Related Projects</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
                        {related.map(p => (
                            <Link key={p.id} href={`/portfolio/${p.slug}`} style={{ textDecoration: 'none', position: 'relative', borderRadius: 14, overflow: 'hidden', background: '#000', display: 'block', height: 280 }}>
                                <img src={p.featured_image} alt={p.title_en} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5, transition: 'opacity 0.4s' }} onMouseOver={(e) => (e.target.style.opacity = 0.3)} onMouseOut={(e) => (e.target.style.opacity = 0.5)} />
                                <div style={{ position: 'absolute', bottom: 20, left: 20, color: '#fff' }}>
                                    <span style={{ display: 'inline-block', padding: '4px 10px', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 50, fontSize: 10, marginBottom: 6, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{p.category.toUpperCase()}</span>
                                    <h4 className="font-brand" style={{ fontSize: 18, fontWeight: 700 }}>{p.title_en}</h4>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            <style>{`
                .prose h2 { font-size: 1.5rem; font-weight: 700; margin: 2rem 0 1rem; font-family: 'Plus Jakarta Sans', sans-serif; }
                .prose h3 { font-size: 1.25rem; font-weight: 600; margin: 1.5rem 0 0.8rem; font-family: 'Plus Jakarta Sans', sans-serif; }
                .prose p { margin-bottom: 1rem; }
                .prose ul, .prose ol { padding-left: 1.5rem; margin-bottom: 1rem; }
                .prose img { max-width: 100%; border-radius: 12px; margin: 1.5rem 0; }
                .prose a { color: var(--accent); }
                .prose blockquote { border-left: 3px solid var(--accent); padding-left: 16px; color: var(--text-secondary); margin: 1.5rem 0; }
            `}</style>
        </PublicLayout>
    );
}
