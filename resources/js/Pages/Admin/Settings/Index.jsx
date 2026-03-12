import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function SettingsIndex({ settings, statistics, services }) {
    const [activeSection, setActiveSection] = useState('general');

    // Settings form
    const settingsForm = useForm({
        settings: {
            ...settings.general,
            ...settings.social,
            ...settings.seo,
        },
    });

    const handleSettingsSubmit = (e) => {
        e.preventDefault();
        settingsForm.put('/admin/settings');
    };

    const updateSetting = (key, value) => {
        settingsForm.setData('settings', { ...settingsForm.data.settings, [key]: value });
    };

    const sections = {
        general: [
            { key: 'company_name', label: 'Company Name' },
            { key: 'company_tagline_en', label: 'Tagline (English)' },
            { key: 'company_tagline_id', label: 'Tagline (Indonesian)' },
            { key: 'company_email', label: 'Email' },
            { key: 'company_phone', label: 'Phone' },
            { key: 'company_address', label: 'Address' },
        ],
        social: [
            { key: 'social_instagram', label: 'Instagram URL' },
            { key: 'social_linkedin', label: 'LinkedIn URL' },
        ],
        seo: [
            { key: 'seo_title', label: 'Default Page Title' },
            { key: 'seo_description', label: 'Default Meta Description', textarea: true },
            { key: 'seo_keywords', label: 'Keywords (comma-separated)' },
        ],
    };

    return (
        <AdminLayout title="Settings">
            <Head title="Settings" />

            <div className="tab-buttons" style={{ marginBottom: 24 }}>
                {['general', 'social', 'seo', 'statistics', 'services'].map((s) => (
                    <button key={s} className={`tab-btn ${activeSection === s ? 'active' : ''}`} onClick={() => setActiveSection(s)}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                ))}
            </div>

            {/* Settings Sections */}
            {['general', 'social', 'seo'].includes(activeSection) && (
                <form onSubmit={handleSettingsSubmit}>
                    <div className="admin-card">
                        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 24, color: '#e2e8f0', textTransform: 'capitalize' }}>
                            {activeSection} Settings
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 600 }}>
                            {sections[activeSection].map(({ key, label, textarea }) => (
                                <div key={key} className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="admin-label">{label}</label>
                                    {textarea ? (
                                        <textarea className="admin-input" rows={3} value={settingsForm.data.settings[key] || ''} onChange={(e) => updateSetting(key, e.target.value)} />
                                    ) : (
                                        <input className="admin-input" value={settingsForm.data.settings[key] || ''} onChange={(e) => updateSetting(key, e.target.value)} />
                                    )}
                                </div>
                            ))}
                        </div>
                        <button type="submit" disabled={settingsForm.processing} className="admin-btn admin-btn-primary" style={{ marginTop: 24 }}>
                            {settingsForm.processing ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>
                </form>
            )}

            {/* Statistics */}
            {activeSection === 'statistics' && (
                <div className="admin-card">
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 24, color: '#e2e8f0' }}>Homepage Statistics</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {statistics.map((stat) => (
                            <StatisticRow key={stat.id} stat={stat} />
                        ))}
                    </div>
                </div>
            )}

            {/* Services */}
            {activeSection === 'services' && (
                <div className="admin-card">
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 24, color: '#e2e8f0' }}>Services</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {services.map((service) => (
                            <ServiceRow key={service.id} service={service} />
                        ))}
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

function StatisticRow({ stat }) {
    const { data, setData, put, processing } = useForm({
        value: stat.value,
        suffix: stat.suffix || '',
        label_en: stat.label_en,
        label_id: stat.label_id,
        sort_order: stat.sort_order,
        is_visible: stat.is_visible,
    });

    const save = (e) => { e.preventDefault(); put(`/admin/settings/statistics/${stat.id}`); };

    return (
        <form onSubmit={save} style={{ padding: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="form-row">
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-label">Value</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <input className="admin-input" value={data.value} onChange={(e) => setData('value', e.target.value)} style={{ width: 100 }} />
                        <input className="admin-input" value={data.suffix} onChange={(e) => setData('suffix', e.target.value)} placeholder="Suffix" style={{ width: 80 }} />
                    </div>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-label">Label (English)</label>
                    <input className="admin-input" value={data.label_en} onChange={(e) => setData('label_en', e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-label">Label (Indonesian)</label>
                    <input className="admin-input" value={data.label_id} onChange={(e) => setData('label_id', e.target.value)} />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                    <button type="submit" disabled={processing} className="admin-btn admin-btn-primary admin-btn-sm">
                        {processing ? '...' : 'Save'}
                    </button>
                </div>
            </div>
        </form>
    );
}

function ServiceRow({ service }) {
    const { data, setData, put, processing } = useForm({
        title_en: service.title_en,
        title_id: service.title_id,
        description_en: service.description_en || '',
        description_id: service.description_id || '',
        number: service.number,
        sort_order: service.sort_order,
        is_visible: service.is_visible,
    });

    const save = (e) => { e.preventDefault(); put(`/admin/settings/services/${service.id}`); };

    return (
        <form onSubmit={save} style={{ padding: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <span style={{ color: '#00E5FF', fontWeight: 700, fontSize: 18 }}>{data.number}</span>
                <h4 style={{ fontWeight: 600 }}>{data.title_en}</h4>
            </div>
            <div className="form-row">
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-label">Title (English)</label>
                    <input className="admin-input" value={data.title_en} onChange={(e) => setData('title_en', e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-label">Title (Indonesian)</label>
                    <input className="admin-input" value={data.title_id} onChange={(e) => setData('title_id', e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-label">Description (English)</label>
                    <textarea className="admin-input" rows={2} value={data.description_en} onChange={(e) => setData('description_en', e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-label">Description (Indonesian)</label>
                    <textarea className="admin-input" rows={2} value={data.description_id} onChange={(e) => setData('description_id', e.target.value)} />
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#94a3b8', cursor: 'pointer' }}>
                    <input type="checkbox" checked={data.is_visible} onChange={(e) => setData('is_visible', e.target.checked)} /> Visible
                </label>
                <button type="submit" disabled={processing} className="admin-btn admin-btn-primary admin-btn-sm">
                    {processing ? '...' : 'Save'}
                </button>
            </div>
        </form>
    );
}
