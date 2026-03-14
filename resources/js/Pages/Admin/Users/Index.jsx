import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function UserIndex({ users, roles }) {
    const [showCreate, setShowCreate] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const createForm = useForm({ name: '', email: '', password: '', role: 'Author' });
    const editForm = useForm({ name: '', email: '', role: '', password: '' });

    const handleCreate = (e) => {
        e.preventDefault();
        createForm.post('/admin/users', { onSuccess: () => { setShowCreate(false); createForm.reset(); } });
    };

    const startEdit = (user) => {
        setEditingId(user.id);
        editForm.setData({ name: user.name, email: user.email, role: user.roles?.[0]?.name || 'Author', password: '' });
    };

    const handleEdit = (e) => {
        e.preventDefault();
        editForm.put(`/admin/users/${editingId}`, { onSuccess: () => setEditingId(null) });
    };

    const handleDelete = (id) => {
        if (confirm('Delete this user?')) router.delete(`/admin/users/${id}`);
    };

    return (
        <AdminLayout title="Users & Roles">
            <Head title="Users" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <p style={{ fontSize: 14, color: '#64748b' }}>{users.data.length} users</p>
                <button onClick={() => setShowCreate(!showCreate)} className="admin-btn admin-btn-primary">
                    {showCreate ? 'Cancel' : '+ New User'}
                </button>
            </div>

            {/* Create Form */}
            {showCreate && (
                <form onSubmit={handleCreate} className="admin-card" style={{ marginBottom: 24 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Create New User</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="admin-label">Name</label>
                            <input className="admin-input" value={createForm.data.name} onChange={(e) => createForm.setData('name', e.target.value)} />
                            {createForm.errors.name && <p style={{ color: '#ef4444', fontSize: 12 }}>{createForm.errors.name}</p>}
                        </div>
                        <div className="form-group">
                            <label className="admin-label">Email</label>
                            <input className="admin-input" type="email" value={createForm.data.email} onChange={(e) => createForm.setData('email', e.target.value)} />
                            {createForm.errors.email && <p style={{ color: '#ef4444', fontSize: 12 }}>{createForm.errors.email}</p>}
                        </div>
                        <div className="form-group">
                            <label className="admin-label">Password</label>
                            <input className="admin-input" type="password" value={createForm.data.password} onChange={(e) => createForm.setData('password', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="admin-label">Role</label>
                            <select className="admin-select" style={{ width: '100%' }} value={createForm.data.role} onChange={(e) => createForm.setData('role', e.target.value)}>
                                {roles.map((r) => <option key={r.id} value={r.name}>{r.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <button type="submit" disabled={createForm.processing} className="admin-btn admin-btn-primary">
                        {createForm.processing ? 'Creating...' : 'Create User'}
                    </button>
                </form>
            )}

            <div className="admin-card" style={{ padding: 0 }}>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Role</th>
                            <th>Joined</th>
                            <th style={{ width: 200 }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.data.map((user) => (
                            <tr key={user.id}>
                                {editingId === user.id ? (
                                    <>
                                        <td>
                                            <input className="admin-input" style={{marginBottom:4}} value={editForm.data.name} onChange={(e) => editForm.setData('name', e.target.value)} />
                                            <input className="admin-input" value={editForm.data.email} onChange={(e) => editForm.setData('email', e.target.value)} />
                                        </td>
                                        <td>
                                            <select className="admin-select" value={editForm.data.role} onChange={(e) => editForm.setData('role', e.target.value)}>
                                                {roles.map((r) => <option key={r.id} value={r.name}>{r.name}</option>)}
                                            </select>
                                        </td>
                                        <td>
                                            <input className="admin-input" type="password" placeholder="New password (optional)" value={editForm.data.password} onChange={(e) => editForm.setData('password', e.target.value)} />
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <button onClick={handleEdit} className="admin-btn admin-btn-primary admin-btn-sm">Save</button>
                                                <button 
                                                    onClick={(e) => {
                                                        if (window.confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
                                                            setEditingId(null);
                                                        }
                                                    }} 
                                                    className="admin-btn admin-btn-secondary admin-btn-sm"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>
                                            <p style={{ fontWeight: 600, fontSize: 14 }}>{user.name}</p>
                                            <p style={{ fontSize: 12, color: '#64748b' }}>{user.email}</p>
                                        </td>
                                        <td>
                                            <span className={`badge ${user.roles?.[0]?.name === 'Admin' ? 'badge-danger' : user.roles?.[0]?.name === 'Editor' ? 'badge-warning' : 'badge-info'}`}>
                                                {user.roles?.[0]?.name || 'No Role'}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: 13, color: '#64748b' }}>{new Date(user.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <button onClick={() => startEdit(user)} className="admin-btn admin-btn-secondary admin-btn-sm">Edit</button>
                                                <button onClick={() => handleDelete(user.id)} className="admin-btn admin-btn-danger admin-btn-sm">Delete</button>
                                            </div>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
