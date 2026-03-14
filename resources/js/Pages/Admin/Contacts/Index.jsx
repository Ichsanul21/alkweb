import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function ContactIndex({ contacts, statusCounts, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/contacts', { search, status: filters.status }, { preserveState: true });
    };

    const statusBadge = (status) => {
        const map = { new: 'badge-success', contacted: 'badge-warning', converted: 'badge-info' };
        return map[status] || 'badge-neutral';
    };

    const handleDelete = (id) => {
        if (confirm('Delete this contact?')) router.delete(`/admin/contacts/${id}`);
    };

    return (
        <AdminLayout title="Contacts (CRM)">
            <Head title="Contacts" />

            {/* Status Tabs */}
            <div className="tab-buttons" style={{ marginBottom: 20 }}>
                <button className={`tab-btn ${!filters.status ? 'active' : ''}`}
                    onClick={() => router.get('/admin/contacts', { search: filters.search }, { preserveState: true })}>
                    All ({statusCounts.all})
                </button>
                <button className={`tab-btn ${filters.status === 'new' ? 'active' : ''}`}
                    onClick={() => router.get('/admin/contacts', { ...filters, status: 'new' }, { preserveState: true })}>
                    🟢 New ({statusCounts.new})
                </button>
                <button className={`tab-btn ${filters.status === 'contacted' ? 'active' : ''}`}
                    onClick={() => router.get('/admin/contacts', { ...filters, status: 'contacted' }, { preserveState: true })}>
                    🟡 Contacted ({statusCounts.contacted})
                </button>
                <button className={`tab-btn ${filters.status === 'converted' ? 'active' : ''}`}
                    onClick={() => router.get('/admin/contacts', { ...filters, status: 'converted' }, { preserveState: true })}>
                    🔵 Converted ({statusCounts.converted})
                </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <form onSubmit={handleSearch} className="search-bar" style={{ marginBottom: 0 }}>
                    <input type="text" className="admin-input" placeholder="Search contacts..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: 280 }} />
                </form>
                <a href="/admin/contacts/export" className="admin-btn admin-btn-secondary" target="_blank">📥 Export CSV</a>
            </div>

            <div className="admin-card" style={{ padding: 0 }}>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Contact</th>
                            <th>Message</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th style={{ width: 120 }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.data.length === 0 ? (
                            <tr><td colSpan={5}><div className="empty-state"><h3>No contacts found</h3></div></td></tr>
                        ) : contacts.data.map((contact) => (
                            <tr key={contact.id}>
                                <td>
                                    <p style={{ fontWeight: 600, fontSize: 14 }}>{contact.name}</p>
                                    <p style={{ fontSize: 12, color: '#64748b' }}>{contact.email}</p>
                                </td>
                                <td style={{ fontSize: 13, color: '#94a3b8', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {contact.message}
                                </td>
                                <td><span className={`badge ${statusBadge(contact.status)}`}>{contact.status}</span></td>
                                <td style={{ fontSize: 13, color: '#64748b' }}>{new Date(contact.created_at).toLocaleDateString()}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <Link href={`/admin/contacts/${contact.id}`} className="admin-btn admin-btn-secondary admin-btn-sm">View</Link>
                                        <button onClick={() => handleDelete(contact.id)} className="admin-btn admin-btn-danger admin-btn-sm">✕</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {contacts.links && contacts.links.length > 3 && (
                <div className="pagination">
                    {contacts.links.map((link, i) => (
                        <span key={i}>
                            {link.url ? <Link href={link.url} preserveScroll preserveState className={link.active ? 'active' : ''}>{link.label.replace(/&laquo;/g, '«').replace(/&raquo;/g, '»')}</Link> : <span style={{ opacity: 0.4 }}>{link.label.replace(/&laquo;/g, '«').replace(/&raquo;/g, '»')}</span>}
                        </span>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
