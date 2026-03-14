import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ visitors }) {
    return (
        <AdminLayout title="Visitors Tracking">
            <Head title="Visitors Tracking" />

            <div className="admin-card">
                <div style={{ marginBottom: '24px' }}>
                    <p style={{ color: '#64748b', fontSize: '14px' }}>
                        Track unique daily visits, geolocation, and session duration.
                    </p>
                </div>

                <div className="admin-table-container" style={{ overflowX: 'auto' }}>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>IP Address</th>
                                <th>Location</th>
                                <th>Device / Browser</th>
                                <th>Visited Date</th>
                                <th>Duration</th>
                                <th>Visit Freq</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visitors.data.length > 0 ? (
                                visitors.data.map((visitor) => (
                                    <tr key={visitor.id}>
                                        <td>
                                            <div style={{ fontWeight: 600, color: '#00E5FF' }}>{visitor.ip_address}</div>
                                            <div style={{ fontSize: '11px', color: '#64748b' }}>
                                                {visitor.timezone || 'UTC'}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontSize: '14px' }}>
                                                    {visitor.city ? `${visitor.city}, ` : ''}
                                                    {visitor.region ? `${visitor.region}, ` : ''}
                                                    {visitor.country || 'Unknown'}
                                                </span>
                                                <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                                                    {visitor.zipcode ? `Zip: ${visitor.zipcode}` : 'No Zip'} 
                                                    {visitor.latitude && (
                                                        <a 
                                                            href={`https://www.google.com/maps?q=${visitor.latitude},${visitor.longitude}`} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            style={{ marginLeft: '12px', color: '#00E5FF', textDecoration: 'none', borderBottom: '1px solid rgba(0,229,255,0.3)' }}
                                                        >
                                                            Maps ↗
                                                        </a>
                                                    )}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                                <span className={`badge ${visitor.device_type === 'Desktop' ? 'badge-info' : 'badge-warning'}`}>
                                                    {visitor.device_type}
                                                </span>
                                                <span className="badge badge-neutral">
                                                    {visitor.browser}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontSize: '14px' }}>{visitor.visited_date}</div>
                                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                                                Active: {visitor.last_seen_at || '-'}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge badge-success" style={{ padding: '4px 12px' }}>
                                                {visitor.duration} min
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <div style={{ 
                                                display: 'inline-block', 
                                                minWidth: '32px',
                                                padding: '4px 8px', 
                                                background: 'rgba(255,255,255,0.05)', 
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '8px',
                                                fontWeight: '700',
                                                color: '#e2e8f0'
                                            }}>
                                                {visitor.frequency}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="empty-state">
                                        <div style={{ padding: '40px 0' }}>
                                            <h3 style={{ color: '#94a3b8', fontSize: '18px', marginBottom: '8px' }}>No visitors recorded yet</h3>
                                            <p style={{ color: '#64748b', fontSize: '14px' }}>Tracking will start as soon as people visit the site.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {visitors.links && visitors.links.length > 3 && (
                    <div className="pagination" style={{ marginTop: '32px', display: 'flex', justifyContent: 'center', gap: '6px' }}>
                        {visitors.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url}
                                className={link.active ? 'active' : ''}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '10px',
                                    fontSize: '13px',
                                    background: link.active ? '#00E5FF' : 'rgba(255,255,255,0.05)',
                                    color: link.active ? '#0a0f1a' : '#94a3b8',
                                    textDecoration: 'none',
                                    border: link.active ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                    pointerEvents: link.url ? 'auto' : 'none',
                                    opacity: link.url ? 1 : 0.5
                                }}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
