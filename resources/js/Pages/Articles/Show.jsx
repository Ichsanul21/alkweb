import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import DOMPurify from 'dompurify';

export default function ArticleShow({ article, related }) {
    const lang = document.documentElement.lang || 'en';

    return (
        <PublicLayout>
            <Head>
                <title>{`${article.meta_title || article.title_en} - Alenkosa`}</title>
                <meta name="description" content={article.meta_description || article.excerpt_en || ''} />
                {article.og_image && <meta property="og:image" content={article.og_image} />}
                <meta property="og:title" content={article.meta_title || article.title_en} />
                <meta property="og:type" content="article" />
            </Head>

            {/* Hero */}
            {article.featured_image && (
                <div style={{ width: '100%', height: 'clamp(250px, 45vh, 450px)', position: 'relative', overflow: 'hidden' }}>
                    <img src={article.featured_image} alt={article.title_en} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.35)' }} />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', padding: 'clamp(30px, 6vw, 60px) 5vw' }}>
                        <div style={{ maxWidth: 800 }}>
                            <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                                {article.category && <span style={{ padding: '5px 14px', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 50, fontSize: 11, color: '#fff', backdropFilter: 'blur(10px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{article.category}</span>}
                                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontFamily: "'JetBrains Mono', monospace" }}>
                                    {article.published_at && new Date(article.published_at).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </span>
                                {article.author && <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontFamily: "'JetBrains Mono', monospace" }}>BY {article.author.name.toUpperCase()}</span>}
                            </div>
                            <h1 className="font-brand" style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)', fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>{article.title_en}</h1>
                        </div>
                    </div>
                </div>
            )}

            <section style={{ padding: 'clamp(40px, 8vw, 80px) 5vw' }}>
                <div style={{ maxWidth: 780, margin: '0 auto' }}>
                    <Link href="/articles" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600, fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 40 }}>← Back to Articles</Link>

                    {/* Excerpt */}
                    {article.excerpt_en && (
                        <p style={{ fontSize: 20, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 40, fontStyle: 'italic', borderLeft: '3px solid var(--accent)', paddingLeft: 20 }}>{article.excerpt_en}</p>
                    )}

                    {/* Tags */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 40 }}>
                            {article.tags.map(tag => (
                                <span key={tag} style={{ padding: '5px 12px', border: '1px solid var(--border-glass)', borderRadius: 50, fontSize: 11, color: 'var(--text-secondary)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>#{tag}</span>
                            ))}
                        </div>

                    {/* Article Content */}
                    <article className="prose" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content_en || '') }} style={{ color: 'var(--text-primary)', fontSize: 17, lineHeight: 1.8 }} />
                </div>
            </section>

            {/* Related Articles */}
            {related.length > 0 && (
                <section style={{ padding: 'clamp(40px, 6vw, 60px) 5vw', borderTop: '1px solid var(--border-glass)' }}>
                    <h3 className="font-brand" style={{ fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 30 }}>More Articles</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
                        {related.map(a => (
                            <Link key={a.id} href={`/articles/${a.slug}`} style={{ textDecoration: 'none', color: 'inherit', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: 14, overflow: 'hidden', transition: 'border-color 0.3s' }} onMouseOver={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')} onMouseOut={(e) => (e.currentTarget.style.borderColor = 'var(--border-glass)')}>
                                {a.featured_image && <img src={a.featured_image} alt={a.title_en} style={{ width: '100%', height: 180, objectFit: 'cover' }} />}
                                <div style={{ padding: 20 }}>
                                    <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8, fontFamily: "'JetBrains Mono', monospace" }}>
                                        {a.published_at && new Date(a.published_at).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </p>
                                    <h4 className="font-brand" style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.3 }}>{a.title_en}</h4>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            <style>{`
                .prose h2 { font-size: 1.5rem; font-weight: 700; margin: 2.5rem 0 1rem; font-family: 'Plus Jakarta Sans', sans-serif; }
                .prose h3 { font-size: 1.3rem; font-weight: 600; margin: 2rem 0 0.8rem; font-family: 'Plus Jakarta Sans', sans-serif; }
                .prose p { margin-bottom: 1.2rem; }
                .prose ul, .prose ol { padding-left: 1.5rem; margin-bottom: 1.2rem; }
                .prose li { margin-bottom: 0.5rem; }
                .prose img { max-width: 100%; border-radius: 12px; margin: 2rem 0; }
                .prose a { color: var(--accent); text-decoration: underline; }
                .prose blockquote { border-left: 3px solid var(--accent); padding-left: 20px; color: var(--text-secondary); margin: 2rem 0; font-style: italic; }
                .prose pre { background: rgba(255,255,255,0.03); border: 1px solid var(--border-glass); border-radius: 10px; padding: 16px; overflow-x: auto; margin: 1.5rem 0; font-size: 14px; }
                .prose code { background: rgba(255,255,255,0.05); padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
            `}</style>
        </PublicLayout>
    );
}
