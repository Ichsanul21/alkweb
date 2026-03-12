import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useState } from 'react';

export default function ArticlesIndex({ articles, categories, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/articles', { search, category: filters.category }, { preserveState: true });
    };

    return (
        <PublicLayout>
            <Head title="Articles - Alenkosa" />

            <section style={{ padding: 'clamp(40px, 8vw, 80px) 5vw' }}>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 16 }}>// Blog</div>
                <h1 className="font-syne" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 40 }}>Articles.</h1>

                {/* Search + Filters */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 40, alignItems: 'center' }}>
                    <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search articles..." style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', borderRadius: 10, padding: '10px 16px', color: 'var(--text-primary)', fontSize: 14, width: 250, outline: 'none', fontFamily: 'inherit' }} />
                    </form>
                    {categories.length > 0 && categories.map(cat => (
                        <button key={cat} onClick={() => router.get('/articles', { category: filters.category === cat ? '' : cat, search: filters.search }, { preserveState: true })} style={{ background: filters.category === cat ? 'var(--accent)' : 'transparent', color: filters.category === cat ? 'var(--bg-deep)' : 'var(--text-secondary)', border: '1px solid var(--border-glass)', padding: '8px 16px', borderRadius: 50, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{cat}</button>
                    ))}
                </div>

                {/* Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'clamp(16px, 3vw, 30px)' }}>
                    {articles.data.length === 0 ? (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '80px 20px', color: 'var(--text-secondary)' }}>
                            <p style={{ fontSize: 18 }}>No articles found.</p>
                        </div>
                    ) : articles.data.map(article => (
                        <Link key={article.id} href={`/articles/${article.slug}`} style={{ textDecoration: 'none', color: 'inherit', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: 16, overflow: 'hidden', transition: 'transform 0.3s, border-color 0.3s' }} className="hover-trigger" onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'var(--accent)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border-glass)'; }}>
                            {article.featured_image && (
                                <img src={article.featured_image} alt={article.title_en} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                            )}
                            <div style={{ padding: 'clamp(16px, 3vw, 24px)' }}>
                                <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                                    {article.category && <span style={{ padding: '3px 10px', border: '1px solid var(--border-glass)', borderRadius: 50, fontSize: 11, color: 'var(--accent)' }}>{article.category}</span>}
                                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                                        {article.published_at && new Date(article.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>
                                <h3 className="font-syne" style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', fontWeight: 700, marginBottom: 10, lineHeight: 1.3 }}>{article.title_en}</h3>
                                {article.excerpt_en && <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{article.excerpt_en}</p>}
                                {article.author && <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 12 }}>By {article.author.name}</p>}
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Pagination */}
                {articles.links && articles.links.length > 3 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 40 }}>
                        {articles.links.map((link, i) => (
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
