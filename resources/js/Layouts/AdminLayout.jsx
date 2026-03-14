import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Toaster, toast } from 'react-hot-toast';
import {
    Bars3Icon,
    XMarkIcon,
    HomeIcon,
    RectangleGroupIcon,
    DocumentTextIcon,
    ChatBubbleLeftRightIcon,
    UsersIcon,
    Cog6ToothIcon,
    ArrowLeftOnRectangleIcon,
    GlobeAmericasIcon,
} from '@heroicons/react/24/outline';

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: HomeIcon, routeKey: 'admin.dashboard', roles: ['Admin', 'Editor', 'Author'] },
    { name: 'Visitors', href: '/admin/visitors', icon: GlobeAmericasIcon, routeKey: 'admin.visitors', roles: ['Admin'] },
    { name: 'Portfolios', href: '/admin/portfolios', icon: RectangleGroupIcon, routeKey: 'admin.portfolios', roles: ['Admin', 'Editor'] },
    { name: 'Articles', href: '/admin/articles', icon: DocumentTextIcon, routeKey: 'admin.articles', roles: ['Admin', 'Editor', 'Author'] },
    { name: 'Contacts', href: '/admin/contacts', icon: ChatBubbleLeftRightIcon, routeKey: 'admin.contacts', roles: ['Admin', 'Editor'] },
    { name: 'Users', href: '/admin/users', icon: UsersIcon, routeKey: 'admin.users', roles: ['Admin'] },
    { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon, routeKey: 'admin.settings', roles: ['Admin'] },
];

export default function AdminLayout({ children, title }) {
    const { auth, flash } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const currentPath = window.location.pathname;

    const isActive = (href) => {
        if (href === '/admin') return currentPath === '/admin';
        return currentPath.startsWith(href);
    };

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success, {
                style: { background: '#111827', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' },
                iconTheme: { primary: '#10b981', secondary: '#111827' },
            });
        }
        if (flash?.error) {
            toast.error(flash.error, {
                style: { background: '#111827', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' },
                iconTheme: { primary: '#ef4444', secondary: '#111827' },
            });
        }
    }, [flash]);

    return (
        <div className="admin-layout">
            <Toaster position="top-right" />
            
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
                <div className="sidebar-header">
                    <Link href="/admin" className="sidebar-logo">
                        <span className="logo-text">ALK</span>
                        <span className="logo-sub">Admin</span>
                    </Link>
                    <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
                        <XMarkIcon className="icon-sm" />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {navigation.filter(item => {
                        const userRoles = auth.user?.roles || [];
                        return item.roles.some(r => userRoles.includes(r));
                    }).map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`nav-item ${isActive(item.href) ? 'nav-item-active' : ''}`}
                        >
                            <item.icon className="icon-sm" />
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <Link href="/profile" className="user-info" style={{ textDecoration: 'none' }}>
                        <div className="user-avatar">
                            {auth.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-details">
                            <p className="user-name">{auth.user.name}</p>
                            <p className="user-email">{auth.user.email}</p>
                        </div>
                    </Link>
                    <Link href={route('logout')} method="post" as="button" className="logout-btn">
                        <ArrowLeftOnRectangleIcon className="icon-sm" />
                    </Link>
                </div>
            </aside>

            {/* Main content */}
            <div className="main-content">
                <header className="top-bar">
                    <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>
                        <Bars3Icon className="icon-md" />
                    </button>
                    <h1 className="page-title">{title}</h1>
                    <div className="top-bar-actions">
                        <Link href="/" target="_blank" className="view-site-btn">
                            View Site ↗
                        </Link>
                    </div>
                </header>

                <main className="page-content">
                    {children}
                </main>
            </div>

            <style>{`
                .admin-layout {
                    display: flex;
                    min-height: 100vh;
                    background: #0a0f1a;
                    color: #e2e8f0;
                    font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif;
                }

                .icon-sm { width: 20px; height: 20px; }
                .icon-md { width: 24px; height: 24px; }

                /* Sidebar */
                .sidebar {
                    width: 260px;
                    background: #0d1321;
                    border-right: 1px solid rgba(255,255,255,0.06);
                    display: flex;
                    flex-direction: column;
                    position: fixed;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    z-index: 50;
                    transition: transform 0.3s ease;
                }

                .sidebar-header {
                    padding: 24px 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                }

                .sidebar-close {
                    display: none;
                    background: none;
                    border: none;
                    color: #94a3b8;
                    cursor: pointer;
                }

                .sidebar-logo {
                    display: flex;
                    align-items: baseline;
                    gap: 8px;
                    text-decoration: none;
                }

                .logo-text {
                    font-size: 24px;
                    font-weight: 800;
                    color: #00E5FF;
                    letter-spacing: -0.5px;
                }

                .logo-sub {
                    font-size: 12px;
                    font-weight: 500;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                }

                .sidebar-nav {
                    flex: 1;
                    padding: 16px 12px;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    overflow-y: auto;
                }

                .nav-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 10px 14px;
                    border-radius: 10px;
                    color: #94a3b8;
                    text-decoration: none;
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.2s;
                }

                .nav-item:hover {
                    background: rgba(255,255,255,0.05);
                    color: #e2e8f0;
                }

                .nav-item-active {
                    background: rgba(0, 229, 255, 0.1);
                    color: #00E5FF;
                }

                .sidebar-footer {
                    padding: 16px 20px;
                    border-top: 1px solid rgba(255,255,255,0.06);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .user-info {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .user-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    background: linear-gradient(135deg, #00E5FF, #0071e3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 14px;
                    color: #0a0f1a;
                }

                .user-name { font-size: 13px; font-weight: 600; color: #e2e8f0; }
                .user-email { font-size: 11px; color: #64748b; }

                .logout-btn {
                    background: none;
                    border: none;
                    color: #64748b;
                    cursor: pointer;
                    padding: 6px;
                    border-radius: 6px;
                    transition: all 0.2s;
                }
                .logout-btn:hover { color: #ef4444; background: rgba(239,68,68,0.1); }

                /* Main Content */
                .main-content {
                    flex: 1;
                    margin-left: 260px;
                    min-height: 100vh;
                }

                .top-bar {
                    position: sticky;
                    top: 0;
                    z-index: 40;
                    padding: 16px 32px;
                    background: rgba(10,15,26,0.85);
                    backdrop-filter: blur(12px);
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .menu-toggle {
                    display: none;
                    background: none;
                    border: none;
                    color: #94a3b8;
                    cursor: pointer;
                }

                .page-title {
                    font-size: 20px;
                    font-weight: 700;
                    color: #e2e8f0;
                    flex: 1;
                }

                .view-site-btn {
                    font-size: 13px;
                    padding: 6px 16px;
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 8px;
                    color: #94a3b8;
                    text-decoration: none;
                    transition: all 0.2s;
                }
                .view-site-btn:hover {
                    border-color: #00E5FF;
                    color: #00E5FF;
                }

                .page-content {
                    padding: 32px;
                }

                /* Flash Messages */
                .flash {
                    margin: 16px 32px 0;
                    padding: 12px 20px;
                    border-radius: 10px;
                    font-size: 14px;
                    font-weight: 500;
                    animation: flashIn 0.3s ease;
                }
                .flash-success {
                    background: rgba(16, 185, 129, 0.1);
                    border: 1px solid rgba(16, 185, 129, 0.3);
                    color: #10b981;
                }
                .flash-error {
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    color: #ef4444;
                }

                @keyframes flashIn {
                    from { opacity: 0; transform: translateY(-8px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* Sidebar overlay for mobile */
                .sidebar-overlay {
                    display: none;
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.6);
                    z-index: 40;
                }

                @media (max-width: 1023px) {
                    .sidebar {
                        transform: translateX(-100%);
                    }
                    .sidebar-open {
                        transform: translateX(0);
                    }
                    .sidebar-close { display: block; }
                    .sidebar-overlay { display: block; }
                    .main-content { margin-left: 0; }
                    .menu-toggle { display: block; }
                    .page-content { padding: 20px; }
                    .top-bar { padding: 12px 20px; }
                }

                /* ── Shared Admin Styles ── */
                .admin-card {
                    background: #111827;
                    border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 14px;
                    padding: 24px;
                }

                .admin-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                    gap: 20px;
                }

                .stat-card {
                    background: #111827;
                    border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 14px;
                    padding: 24px;
                    transition: all 0.2s;
                }
                .stat-card:hover {
                    border-color: rgba(0, 229, 255, 0.2);
                }
                .stat-card .stat-value {
                    font-size: 32px;
                    font-weight: 800;
                    color: #00E5FF;
                    line-height: 1;
                }
                .stat-card .stat-label {
                    font-size: 13px;
                    color: #64748b;
                    margin-top: 8px;
                }

                .admin-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 20px;
                    border-radius: 10px;
                    font-size: 14px;
                    font-weight: 600;
                    border: none;
                    cursor: pointer;
                    transition: all 0.2s;
                    text-decoration: none;
                }
                .admin-btn-primary {
                    background: #00E5FF;
                    color: #0a0f1a;
                }
                .admin-btn-primary:hover { background: #00bcd4; }
                .admin-btn-secondary {
                    background: rgba(255,255,255,0.06);
                    color: #e2e8f0;
                    border: 1px solid rgba(255,255,255,0.1);
                }
                .admin-btn-secondary:hover { border-color: rgba(255,255,255,0.2); }
                .admin-btn-danger {
                    background: rgba(239,68,68,0.1);
                    color: #ef4444;
                    border: 1px solid rgba(239,68,68,0.2);
                }
                .admin-btn-danger:hover { background: rgba(239,68,68,0.2); }
                .admin-btn-sm {
                    padding: 6px 14px;
                    font-size: 13px;
                }

                .admin-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .admin-table th {
                    text-align: left;
                    padding: 12px 16px;
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    color: #64748b;
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                }
                .admin-table td {
                    padding: 14px 16px;
                    font-size: 14px;
                    border-bottom: 1px solid rgba(255,255,255,0.04);
                }
                .admin-table tr:hover td {
                    background: rgba(255,255,255,0.02);
                }

                .admin-input {
                    width: 100%;
                    padding: 10px 14px;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 10px;
                    color: #e2e8f0;
                    font-size: 14px;
                    font-family: inherit;
                    transition: border-color 0.2s;
                }
                .admin-input:focus {
                    outline: none;
                    border-color: #00E5FF;
                }
                .admin-input::placeholder { color: #475569; }

                .admin-label {
                    display: block;
                    font-size: 13px;
                    font-weight: 600;
                    color: #94a3b8;
                    margin-bottom: 6px;
                }

                .admin-select {
                    appearance: none;
                    padding: 10px 14px;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 10px;
                    color: #e2e8f0;
                    font-size: 14px;
                    font-family: inherit;
                    cursor: pointer;
                }
                .admin-select:focus {
                    outline: none;
                    border-color: #00E5FF;
                }

                .badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 3px 10px;
                    border-radius: 100px;
                    font-size: 12px;
                    font-weight: 600;
                }
                .badge-success { background: rgba(16,185,129,0.15); color: #10b981; }
                .badge-warning { background: rgba(245,158,11,0.15); color: #f59e0b; }
                .badge-info { background: rgba(0,229,255,0.15); color: #00E5FF; }
                .badge-danger { background: rgba(239,68,68,0.15); color: #ef4444; }
                .badge-neutral { background: rgba(148,163,184,0.15); color: #94a3b8; }

                .pagination {
                    display: flex;
                    gap: 4px;
                    margin-top: 24px;
                    justify-content: center;
                }
                .pagination a, .pagination span {
                    padding: 8px 14px;
                    border-radius: 8px;
                    font-size: 13px;
                    text-decoration: none;
                    color: #94a3b8;
                    border: 1px solid rgba(255,255,255,0.06);
                    transition: all 0.2s;
                }
                .pagination a:hover {
                    border-color: #00E5FF;
                    color: #00E5FF;
                }
                .pagination .active {
                    background: #00E5FF;
                    color: #0a0f1a;
                    border-color: #00E5FF;
                    font-weight: 600;
                }

                .form-group {
                    margin-bottom: 20px;
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }
                @media (max-width: 767px) {
                    .form-row { grid-template-columns: 1fr; }
                }

                .tab-buttons {
                    display: flex;
                    gap: 4px;
                    background: rgba(255,255,255,0.03);
                    border-radius: 10px;
                    padding: 4px;
                    margin-bottom: 16px;
                }
                .tab-btn {
                    padding: 8px 16px;
                    border-radius: 8px;
                    border: none;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 600;
                    font-family: inherit;
                    transition: all 0.2s;
                    background: transparent;
                    color: #64748b;
                }
                .tab-btn.active {
                    background: rgba(0,229,255,0.1);
                    color: #00E5FF;
                }

                .search-bar {
                    display: flex;
                    gap: 12px;
                    margin-bottom: 24px;
                    flex-wrap: wrap;
                    align-items: center;
                }

                .empty-state {
                    text-align: center;
                    padding: 60px 20px;
                    color: #475569;
                }
                .empty-state h3 {
                    font-size: 18px;
                    color: #94a3b8;
                    margin-bottom: 8px;
                }
            `}</style>
        </div>
    );
}
