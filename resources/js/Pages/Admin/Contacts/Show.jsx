import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function ContactShow({ contact }) {
    const { data, setData, put, processing } = useForm({
        status: contact.status,
        notes: contact.notes || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin/contacts/${contact.id}`);
    };

    return (
        <AdminLayout title="Contact Detail">
            <Head title={`Contact - ${contact.name}`} />

            <Link href="/admin/contacts" className="admin-btn admin-btn-secondary admin-btn-sm" style={{ marginBottom: 24, display: 'inline-flex' }}>
                ← Back to Contacts
            </Link>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                {/* Contact Info */}
                <div className="admin-card">
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, color: '#e2e8f0' }}>Contact Information</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                            <p className="admin-label">Name</p>
                            <p style={{ fontSize: 16, fontWeight: 600 }}>{contact.name}</p>
                        </div>
                        <div>
                            <p className="admin-label">Email</p>
                            <a href={`mailto:${contact.email}`} style={{ color: '#00E5FF', fontSize: 14 }}>{contact.email}</a>
                        </div>
                        {contact.phone && (
                            <div>
                                <p className="admin-label">Phone</p>
                                <p style={{ fontSize: 14 }}>{contact.phone}</p>
                            </div>
                        )}
                        {contact.company && (
                            <div>
                                <p className="admin-label">Company</p>
                                <p style={{ fontSize: 14 }}>{contact.company}</p>
                            </div>
                        )}
                        <div>
                            <p className="admin-label">Message</p>
                            <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6 }}>{contact.message}</p>
                        </div>
                        <div>
                            <p className="admin-label">Source</p>
                            <span className="badge badge-neutral">{contact.source}</span>
                        </div>
                        <div>
                            <p className="admin-label">Received</p>
                            <p style={{ fontSize: 13, color: '#64748b' }}>{new Date(contact.created_at).toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* Status & Notes */}
                <div>
                    <form onSubmit={handleSubmit}>
                        <div className="admin-card">
                            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, color: '#e2e8f0' }}>Status & Notes</h3>

                            <div className="form-group">
                                <label className="admin-label">Lead Status</label>
                                <select className="admin-select" style={{ width: '100%' }} value={data.status} onChange={(e) => setData('status', e.target.value)}>
                                    <option value="new">🟢 New</option>
                                    <option value="contacted">🟡 Contacted</option>
                                    <option value="converted">🔵 Converted</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="admin-label">Internal Notes</label>
                                <textarea
                                    className="admin-input"
                                    rows={6}
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Add follow-up notes, call history, etc..."
                                />
                            </div>

                            <button type="submit" disabled={processing} className="admin-btn admin-btn-primary" style={{ width: '100%' }}>
                                {processing ? 'Saving...' : 'Update Contact'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <style>{`
                @media (max-width: 1023px) {
                    div[style*="grid-template-columns: 1fr 1fr"] {
                        display: flex !important;
                        flex-direction: column !important;
                    }
                }
            `}</style>
        </AdminLayout>
    );
}
