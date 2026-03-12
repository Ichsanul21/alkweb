import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function ArticleIndex({ articles, categories, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/articles', { search, status: filters.status, category: filters.category }, { preserveState: true });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this article?')) {
            router.delete(`/admin/articles/${id}`);
        }
    };

    return (
        <AdminLayout title="Articles">
            <Head title="Articles" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <form onSubmit={handleSearch} className="search-bar" style={{ marginBottom: 0 }}>
                    <input type="text" className="admin-input" placeholder="Search articles..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: 280 }} />
                    <select className="admin-select" value={filters.status || ''} onChange={(e) => router.get('/admin/articles', { ...filters, status: e.target.value }, { preserveState: true })}>
                        <option value="">All Status</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                    </select>
                </form>
                <Link href="/admin/articles/create" className="admin-btn admin-btn-primary">
                    <PlusIcon style={{ width: 18, height: 18 }} /> New Article
                </Link>
            </div>

            <div className="admin-card" style={{ padding: 0 }}>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Article</th>
                            <th>Author</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Published</th>
                            <th style={{ width: 120 }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articles.data.length === 0 ? (
                            <tr><td colSpan={6}><div className="empty-state"><h3>No articles found</h3><p>Create your first article to get started.</p></div></td></tr>
                        ) : articles.data.map((article) => (
                            <tr key={article.id}>
                                <td>
                                    <p style={{ fontWeight: 600, fontSize: 14 }}>{article.title_en}</p>
                                    <p style={{ fontSize: 12, color: '#64748b' }}>{article.slug}</p>
                                </td>
                                <td style={{ fontSize: 13, color: '#94a3b8' }}>{article.author?.name || '—'}</td>
                                <td><span className="badge badge-neutral">{article.category || '—'}</span></td>
                                <td><span className={`badge ${article.status === 'published' ? 'badge-success' : 'badge-warning'}`}>{article.status}</span></td>
                                <td style={{ fontSize: 13, color: '#64748b' }}>{article.published_at ? new Date(article.published_at).toLocaleDateString() : '—'}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <Link href={`/admin/articles/${article.id}/edit`} className="admin-btn admin-btn-secondary admin-btn-sm"><PencilIcon style={{ width: 14, height: 14 }} /></Link>
                                        <button onClick={() => handleDelete(article.id)} className="admin-btn admin-btn-danger admin-btn-sm"><TrashIcon style={{ width: 14, height: 14 }} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {articles.links && articles.links.length > 3 && (
                <div className="pagination">
                    {articles.links.map((link, i) => (
                        <span key={i}>
                            {link.url ? <Link href={link.url} className={link.active ? 'active' : ''} dangerouslySetInnerHTML={{ __html: link.label }} /> : <span dangerouslySetInnerHTML={{ __html: link.label }} style={{ opacity: 0.4 }} />}
                        </span>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
