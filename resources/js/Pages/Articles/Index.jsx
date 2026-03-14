import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import Skeleton from '@/Components/Skeleton';
import { useState, useMemo, useEffect } from 'react';

export default function ArticlesIndex({ articles, categories, filters }) {
    const lang = document.documentElement.lang || 'en';
    const [search, setSearch] = useState(filters.search || '');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const startLoading = () => setLoading(true);
        const stopLoading = () => setLoading(false);
        router.on('start', startLoading);
        router.on('finish', stopLoading);
        return () => {
            router.off('start', startLoading);
            router.off('finish', stopLoading);
        };
    }, []);

    const featuredArticle = useMemo(() => {
        return articles.data.find(a => a.is_featured) || articles.data[0];
    }, [articles.data]);

    const otherArticles = useMemo(() => {
        return articles.data.filter(a => a.id !== featuredArticle?.id);
    }, [articles.data, featuredArticle]);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/articles', { search, category: filters.category }, { preserveState: true });
    };

    return (
        <PublicLayout>
            <Head title="Articles - Alenkosa" />

            <section style={{ padding: 'clamp(40px, 8vw, 80px) 5vw' }}>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 16 }}>// Blog</div>
                <h1 className="font-brand" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 40 }}>Articles.</h1>

                {/* Search + Filters */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 40, alignItems: 'center' }}>
                    <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={lang === 'id' ? 'Cari artikel...' : 'Search articles...'} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', borderRadius: 10, padding: '10px 16px', color: 'var(--text-primary)', fontSize: 14, width: 250, outline: 'none', fontFamily: 'inherit' }} />
                    </form>
                    {categories.length > 0 && categories.map(cat => (
                        <button key={cat} onClick={() => router.get('/articles', { category: filters.category === cat ? '' : cat, search: filters.search }, { preserveState: true })} style={{ background: filters.category === cat ? 'var(--accent)' : 'transparent', color: filters.category === cat ? 'var(--bg-deep)' : 'var(--text-secondary)', border: '1px solid var(--border-glass)', padding: '8px 16px', borderRadius: 50, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{cat}</button>
                    ))}
                </div>

                {/* Featured Header */}
                {!filters.search && !filters.category && featuredArticle && (
                    <Link href={`/articles/${featuredArticle.slug}`} className="hover-trigger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: 24, overflow: 'hidden', marginBottom: 60, textDecoration: 'none', color: 'inherit' }}>
                        <div style={{ padding: 'clamp(24px, 5vw, 60px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                                <span style={{ background: 'var(--accent)', color: '#000', padding: '4px 12px', borderRadius: 20, fontSize: 10, fontWeight: 800, letterSpacing: 1, fontFamily: "'JetBrains Mono', monospace" }}>FEATURED</span>
                                <span style={{ fontSize: 11, color: 'var(--accent)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{featuredArticle.category.toUpperCase()}</span>
                            </div>
                            <h2 className="font-brand" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.8rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: 24 }}>{lang === 'id' ? featuredArticle.title_id : featuredArticle.title_en}</h2>
                            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 32, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {lang === 'id' ? (featuredArticle.excerpt_id || featuredArticle.excerpt_en) : featuredArticle.excerpt_en}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                {featuredArticle.author && <span style={{ fontSize: 13, fontWeight: 500 }}>BY {featuredArticle.author.name.toUpperCase()}</span>}
                                <span style={{ width: 1, height: 16, background: 'var(--border-glass)' }} />
                                <span style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'JetBrains Mono', monospace" }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                    {featuredArticle.view_count || 0} VIEWS
                                </span>
                            </div>
                        </div>
                        {featuredArticle.featured_image && (
                            <div style={{ minHeight: 300 }}>
                                <img src={featuredArticle.featured_image} alt={featuredArticle.title_en} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        )}
                    </Link>
                )}

                {/* Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'clamp(16px, 3vw, 30px)' }}>
                    {loading ? (
                        Array.from({ length: 6 }).map((_, i) => <Skeleton.Card key={i} />)
                    ) : articles.data.length === 0 ? (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '80px 20px', color: 'var(--text-secondary)' }}>
                            <p style={{ fontSize: 18 }}>{lang === 'id' ? 'Tidak ada artikel ditemukan.' : 'No articles found.'}</p>
                        </div>
                    ) : (filters.search || filters.category ? articles.data : otherArticles).map(article => (
                        <Link key={article.id} href={`/articles/${article.slug}`} style={{ textDecoration: 'none', color: 'inherit', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: 16, overflow: 'hidden', transition: 'transform 0.3s, border-color 0.3s', display: 'flex', flexDirection: 'column' }} className="hover-trigger" onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'var(--accent)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border-glass)'; }}>
                            {article.featured_image && (
                                <div style={{ position: 'relative' }}>
                                    <img src={article.featured_image} alt={lang === 'id' ? article.title_id : article.title_en} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                                    {article.is_featured && (
                                        <div style={{ position: 'absolute', top: 12, left: 12, background: 'var(--accent)', color: '#000', padding: '4px 12px', borderRadius: 20, fontSize: 10, fontWeight: 800, letterSpacing: 1 }}>FEATURED</div>
                                    )}
                                </div>
                            )}
                            <div style={{ padding: 'clamp(16px, 3vw, 24px)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                                    {article.category && <span style={{ padding: '3px 10px', border: '1px solid var(--border-glass)', borderRadius: 50, fontSize: 10, color: 'var(--accent)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{article.category.toUpperCase()}</span>}
                                    <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: "'JetBrains Mono', monospace" }}>
                                        {article.published_at && new Date(article.published_at).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                    <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'JetBrains Mono', monospace" }}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                        {article.view_count || 0}
                                    </span>
                                </div>
                                <h3 className="font-brand" style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)', fontWeight: 700, marginBottom: 10, lineHeight: 1.3 }}>{lang === 'id' ? (article.title_id || article.title_en) : article.title_en}</h3>
                                {article.excerpt_en && <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: 16 }}>{lang === 'id' ? (article.excerpt_id || article.excerpt_en) : article.excerpt_en}</p>}
                                {article.author && <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 'auto' }}>By {article.author.name}</p>}
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
