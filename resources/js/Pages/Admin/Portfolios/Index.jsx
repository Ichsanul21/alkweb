import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function PortfolioIndex({ portfolios, categories, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/portfolios', { search, status: filters.status, category: filters.category }, { preserveState: true });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this portfolio?')) {
            router.delete(`/admin/portfolios/${id}`);
        }
    };

    return (
        <AdminLayout title="Portfolios">
            <Head title="Portfolios" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <form onSubmit={handleSearch} className="search-bar" style={{ marginBottom: 0 }}>
                    <input
                        type="text"
                        className="admin-input"
                        placeholder="Search portfolios..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ width: 280 }}
                    />
                    <select
                        className="admin-select"
                        value={filters.status || ''}
                        onChange={(e) => router.get('/admin/portfolios', { ...filters, status: e.target.value }, { preserveState: true })}
                    >
                        <option value="">All Status</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                    </select>
                </form>
                <Link href="/admin/portfolios/create" className="admin-btn admin-btn-primary">
                    <PlusIcon style={{ width: 18, height: 18 }} /> New Portfolio
                </Link>
            </div>

            <div className="admin-card" style={{ padding: 0 }}>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Portfolio</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Featured</th>
                            <th style={{ width: 120 }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {portfolios.data.length === 0 ? (
                            <tr>
                                <td colSpan={5}>
                                    <div className="empty-state">
                                        <h3>No portfolios found</h3>
                                        <p>Create your first portfolio to get started.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            portfolios.data.map((portfolio) => (
                                <tr key={portfolio.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                            {portfolio.featured_image && (
                                                <img
                                                    src={portfolio.featured_image}
                                                    alt=""
                                                    style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }}
                                                />
                                            )}
                                            <div>
                                                <p style={{ fontWeight: 600, fontSize: 14 }}>{portfolio.title_en}</p>
                                                <p style={{ fontSize: 12, color: '#64748b' }}>{portfolio.slug}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge badge-neutral">{portfolio.category || '—'}</span>
                                    </td>
                                    <td>
                                        <span className={`badge ${portfolio.status === 'published' ? 'badge-success' : 'badge-warning'}`}>
                                            {portfolio.status}
                                        </span>
                                    </td>
                                    <td>{portfolio.is_featured ? '⭐' : '—'}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <Link href={`/admin/portfolios/${portfolio.id}/edit`} className="admin-btn admin-btn-secondary admin-btn-sm">
                                                <PencilIcon style={{ width: 14, height: 14 }} />
                                            </Link>
                                            <button onClick={() => handleDelete(portfolio.id)} className="admin-btn admin-btn-danger admin-btn-sm">
                                                <TrashIcon style={{ width: 14, height: 14 }} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {portfolios.links && portfolios.links.length > 3 && (
                <div className="pagination">
                    {portfolios.links.map((link, i) => (
                        <span key={i}>
                            {link.url ? (
                                <Link
                                    href={link.url}
                                    className={link.active ? 'active' : ''}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ) : (
                                <span dangerouslySetInnerHTML={{ __html: link.label }} style={{ opacity: 0.4 }} />
                            )}
                        </span>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
