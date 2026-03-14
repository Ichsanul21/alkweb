import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Dashboard({ stats, recentContacts, recentArticles, contactsByMonth, todayVisitors, totalVisitors, visitorsByMonth }) {
    const chartData = {
        labels: contactsByMonth.map((c) => months[c.month - 1] + ' ' + c.year),
        datasets: [
            {
                label: 'Contacts',
                data: contactsByMonth.map((c) => c.count),
                backgroundColor: 'rgba(0, 229, 255, 0.3)',
                borderColor: '#00E5FF',
                borderWidth: 1,
                borderRadius: 6,
            },
        ],
    };

    const visitorChartData = {
        labels: (visitorsByMonth || []).map((v) => months[v.month - 1] + ' ' + v.year),
        datasets: [
            {
                label: 'Visitors',
                data: (visitorsByMonth || []).map((v) => v.count),
                backgroundColor: 'rgba(16, 185, 129, 0.3)',
                borderColor: '#10b981',
                borderWidth: 1,
                borderRadius: 6,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
            x: { ticks: { color: '#64748b' }, grid: { display: false } },
            y: { ticks: { color: '#64748b', stepSize: 1 }, grid: { color: 'rgba(255,255,255,0.04)' } },
        },
    };

    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard" />

            {/* Stats Grid */}
            <div className="admin-grid" style={{ marginBottom: 32 }}>
                <div className="stat-card">
                    <div className="stat-value">{stats.total_portfolios}</div>
                    <div className="stat-label">Total Portfolios ({stats.published_portfolios} published)</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'JetBrains Mono', monospace" }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        {stats.portfolio_views.toLocaleString()} TOTAL VIEWS
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{stats.total_articles}</div>
                    <div className="stat-label">Total Articles ({stats.published_articles} published)</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'JetBrains Mono', monospace" }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        {stats.article_views.toLocaleString()} TOTAL VIEWS
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{stats.total_contacts}</div>
                    <div className="stat-label">Total Contacts</div>
                </div>
                <div className="stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div className="stat-value" style={{ color: '#10b981' }}>{todayVisitors}</div>
                            <div className="stat-label">Visitors Today (Total: {totalVisitors})</div>
                        </div>
                        <Link href="/admin/visitors" className="admin-btn admin-btn-secondary admin-btn-sm" style={{ padding: '4px 8px' }}>
                            Details
                        </Link>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                {/* Contact Chart */}
                <div className="admin-card">
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, color: '#e2e8f0' }}>
                        Contact Submissions
                    </h3>
                    {contactsByMonth.length > 0 ? (
                        <Bar data={chartData} options={chartOptions} />
                    ) : (
                        <p style={{ color: '#475569', fontSize: 14 }}>No data yet</p>
                    )}
                </div>

                {/* Visitors Chart */}
                <div className="admin-card">
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, color: '#e2e8f0' }}>
                        Unique Visitors
                    </h3>
                    {visitorsByMonth && visitorsByMonth.length > 0 ? (
                        <Bar data={visitorChartData} options={chartOptions} />
                    ) : (
                        <p style={{ color: '#475569', fontSize: 14 }}>No visitor data yet</p>
                    )}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
                {/* Recent Contacts */}
                <div className="admin-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#e2e8f0' }}>Recent Contacts</h3>
                        <Link href="/admin/contacts" className="admin-btn admin-btn-secondary admin-btn-sm">View All</Link>
                    </div>
                    {recentContacts.map((contact) => (
                        <div key={contact.id} style={{
                            padding: '12px 0',
                            borderBottom: '1px solid rgba(255,255,255,0.04)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <p style={{ fontWeight: 600, fontSize: 14 }}>{contact.name}</p>
                                <p style={{ fontSize: 12, color: '#64748b' }}>{contact.email}</p>
                            </div>
                            <span className={`badge ${
                                contact.status === 'new' ? 'badge-success' :
                                contact.status === 'contacted' ? 'badge-warning' : 'badge-info'
                            }`}>
                                {contact.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @media (max-width: 1023px) {
                    .admin-card + .admin-card { margin-top: 20px; }
                    div[style*="grid-template-columns: 1fr 1fr"] {
                        display: flex !important;
                        flex-direction: column !important;
                    }
                }
            `}</style>
        </AdminLayout>
    );
}
