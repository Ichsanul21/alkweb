import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TptImage from '@tiptap/extension-image';
import TptLink from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

function Toolbar({ editor }) {
    if (!editor) return null;
    const btn = (action, active, label) => (
        <button type="button" onClick={action} className={`toolbar-btn ${active ? 'toolbar-btn-active' : ''}`}>{label}</button>
    );
    return (
        <div className="editor-toolbar">
            {btn(() => editor.chain().focus().toggleBold().run(), editor.isActive('bold'), 'B')}
            {btn(() => editor.chain().focus().toggleItalic().run(), editor.isActive('italic'), 'I')}
            {btn(() => editor.chain().focus().toggleUnderline().run(), editor.isActive('underline'), 'U')}
            {btn(() => editor.chain().focus().toggleHighlight().run(), editor.isActive('highlight'), 'H')}
            <span className="toolbar-sep" />
            {btn(() => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive('heading', { level: 2 }), 'H2')}
            {btn(() => editor.chain().focus().toggleHeading({ level: 3 }).run(), editor.isActive('heading', { level: 3 }), 'H3')}
            <span className="toolbar-sep" />
            {btn(() => editor.chain().focus().toggleBulletList().run(), editor.isActive('bulletList'), '• List')}
            {btn(() => editor.chain().focus().toggleOrderedList().run(), editor.isActive('orderedList'), '1. List')}
            {btn(() => editor.chain().focus().toggleBlockquote().run(), editor.isActive('blockquote'), '❝')}
            <span className="toolbar-sep" />
            {btn(() => { const url = prompt('Image URL:'); if (url) editor.chain().focus().setImage({ src: url }).run(); }, false, '🖼')}
            {btn(() => { const url = prompt('Link URL:'); if (url) editor.chain().focus().setLink({ href: url }).run(); }, editor.isActive('link'), '🔗')}
        </div>
    );
}

function WysiwygEditor({ content, onChange, placeholder }) {
    const editor = useEditor({
        extensions: [
            StarterKit, TptImage, TptLink.configure({ openOnClick: false }),
            Underline, TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Placeholder.configure({ placeholder: placeholder || 'Start writing...' }),
            Highlight,
        ],
        content: content || '',
        onUpdate: ({ editor }) => onChange(editor.getHTML()),
    });

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content || '');
        }
    }, [content, editor]);

    return (
        <div className="wysiwyg-wrap">
            <Toolbar editor={editor} />
            <EditorContent editor={editor} className="wysiwyg-content" />
        </div>
    );
}

export default function ArticleForm({ article }) {
    const isEditing = !!article;
    const [activeTab, setActiveTab] = useState('en');
    const [isTranslating, setIsTranslating] = useState(false);
    const [seoOpen, setSeoOpen] = useState(false);
    const [tagInput, setTagInput] = useState('');

    const { data, setData, post, put, processing, errors } = useForm({
        title_en: article?.title_en || '',
        title_id: article?.title_id || '',
        excerpt_en: article?.excerpt_en || '',
        excerpt_id: article?.excerpt_id || '',
        content_en: article?.content_en || '',
        content_id: article?.content_id || '',
        featured_image: article?.featured_image || '',
        category: article?.category || '',
        tags: article?.tags || [],
        meta_title: article?.meta_title || '',
        meta_description: article?.meta_description || '',
        og_image: article?.og_image || '',
        status: article?.status || 'draft',
        published_at: article?.published_at ? article.published_at.slice(0, 16) : '',
    });

    const handleAutoTranslate = async () => {
        if (!data.title_id && !data.excerpt_id && !data.content_id) {
            toast.error('Isi konten bahasa Indonesia dulu ya!');
            return;
        }

        setIsTranslating(true);
        const t = toast.loading('Sedang menerjemahkan...');

        try {
            const fields = [
                { key: 'title', text: data.title_id },
                { key: 'excerpt', text: data.excerpt_id },
                { key: 'content', text: data.content_id },
            ];

            const results = {};
            for (const field of fields) {
                if (field.text) {
                    const response = await axios.post('/admin/translate', {
                        text: field.text,
                        from: 'id',
                        to: 'en'
                    });
                    results[`${field.key}_en`] = response.data.translated;
                }
            }

            // Using functional update to ensure we don't lose other fields
            setData(prev => ({ 
                ...prev, 
                ...results 
            }));
            
            setActiveTab('en');
            toast.success('Berhasil diterjemahkan!', { id: t });
        } catch (error) {
            console.error(error);
            toast.error('Gagal menerjemahkan', { id: t });
        } finally {
            setIsTranslating(false);
        }
    };

    const addTag = () => {
        if (tagInput.trim() && !data.tags.includes(tagInput.trim())) {
            setData('tags', [...data.tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) put(`/admin/articles/${article.id}`);
        else post('/admin/articles');
    };

    return (
        <AdminLayout title={isEditing ? 'Edit Article' : 'New Article'}>
            <Head title={isEditing ? 'Edit Article' : 'New Article'} />
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
                    <div>
                        <div className="admin-card">
                            <div className="tab-buttons" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: 4 }}>
                                    <button type="button" className={`tab-btn ${activeTab === 'en' ? 'active' : ''}`} onClick={() => setActiveTab('en')}>🇬🇧 English</button>
                                    <button type="button" className={`tab-btn ${activeTab === 'id' ? 'active' : ''}`} onClick={() => setActiveTab('id')}>🇮🇩 Indonesian</button>
                                </div>
                                <button 
                                    type="button" 
                                    onClick={handleAutoTranslate} 
                                    disabled={isTranslating}
                                    style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: 6, 
                                        fontSize: 12, 
                                        fontWeight: 600, 
                                        color: '#00E5FF', 
                                        background: 'rgba(0,229,255,0.1)', 
                                        border: '1px solid rgba(0,229,255,0.2)', 
                                        padding: '4px 10px', 
                                        borderRadius: 8,
                                        cursor: 'pointer',
                                        opacity: isTranslating ? 0.5 : 1
                                    }}
                                >
                                    <SparklesIcon style={{ width: 14, height: 14 }} />
                                    {isTranslating ? 'Translating...' : 'Magic Translate (ID → EN)'}
                                </button>
                            </div>

                            <div style={{ display: activeTab === 'en' ? 'block' : 'none' }}>
                                <div className="form-group">
                                    <label className="admin-label">Title (English)</label>
                                    <input className="admin-input" value={data.title_en} onChange={(e) => setData('title_en', e.target.value)} />
                                    {errors.title_en && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.title_en}</p>}
                                </div>
                                <div className="form-group">
                                    <label className="admin-label">Excerpt (English)</label>
                                    <textarea className="admin-input" rows={2} value={data.excerpt_en} onChange={(e) => setData('excerpt_en', e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label className="admin-label">Content (English)</label>
                                    <WysiwygEditor content={data.content_en} onChange={(val) => setData('content_en', val)} placeholder="Write article content in English..." />
                                </div>
                            </div>

                            <div style={{ display: activeTab === 'id' ? 'block' : 'none' }}>
                                <div className="form-group">
                                    <label className="admin-label">Title (Indonesian)</label>
                                    <input className="admin-input" value={data.title_id} onChange={(e) => setData('title_id', e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label className="admin-label">Excerpt (Indonesian)</label>
                                    <textarea className="admin-input" rows={2} value={data.excerpt_id} onChange={(e) => setData('excerpt_id', e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label className="admin-label">Content (Indonesian)</label>
                                    <WysiwygEditor content={data.content_id} onChange={(val) => setData('content_id', val)} placeholder="Tulis konten artikel dalam Bahasa Indonesia..." />
                                </div>
                            </div>
                        </div>

                        {/* SEO Panel */}
                        <div className="admin-card" style={{ marginTop: 20 }}>
                            <button type="button" onClick={() => setSeoOpen(!seoOpen)} style={{ background: 'none', border: 'none', color: '#e2e8f0', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8 }}>
                                🔍 SEO Settings {seoOpen ? '▼' : '▶'}
                            </button>
                            {seoOpen && (
                                <div style={{ marginTop: 16 }}>
                                    <div className="form-group">
                                        <label className="admin-label">Meta Title</label>
                                        <input className="admin-input" value={data.meta_title} onChange={(e) => setData('meta_title', e.target.value)} placeholder="Custom page title for search engines" />
                                        <p style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>{data.meta_title.length}/60 characters</p>
                                    </div>
                                    <div className="form-group">
                                        <label className="admin-label">Meta Description</label>
                                        <textarea className="admin-input" rows={2} value={data.meta_description} onChange={(e) => setData('meta_description', e.target.value)} placeholder="Custom description for search engines" />
                                        <p style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>{data.meta_description.length}/160 characters</p>
                                    </div>
                                    <div className="form-group">
                                        <label className="admin-label">OG Image URL</label>
                                        <input className="admin-input" value={data.og_image} onChange={(e) => setData('og_image', e.target.value)} placeholder="Social sharing image URL" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div className="admin-card">
                            <div className="form-group">
                                <label className="admin-label">Status</label>
                                <select className="admin-select" style={{ width: '100%' }} value={data.status} onChange={(e) => setData('status', e.target.value)}>
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="admin-label">Publish Date</label>
                                <input className="admin-input" type="datetime-local" value={data.published_at} onChange={(e) => setData('published_at', e.target.value)} />
                            </div>
                            <div style={{ display: 'flex', gap: 10 }}>
                                <button type="submit" disabled={processing} className="admin-btn admin-btn-primary" style={{ flex: 1 }}>
                                    {processing ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
                                </button>
                                <Link 
                                    href="/admin/articles" 
                                    className="admin-btn admin-btn-secondary"
                                    onClick={(e) => {
                                        if (!window.confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
                                            e.preventDefault();
                                        }
                                    }}
                                >
                                    Cancel
                                </Link>
                            </div>
                        </div>

                        <div className="admin-card">
                            <label className="admin-label">Featured Image URL</label>
                            <input className="admin-input" value={data.featured_image} onChange={(e) => setData('featured_image', e.target.value)} placeholder="https://..." />
                            {data.featured_image && <img src={data.featured_image} alt="Preview" style={{ width: '100%', borderRadius: 10, marginTop: 12, objectFit: 'cover', maxHeight: 180 }} />}
                        </div>

                        <div className="admin-card">
                            <div className="form-group">
                                <label className="admin-label">Category</label>
                                <input className="admin-input" value={data.category} onChange={(e) => setData('category', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="admin-label">Tags</label>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <input className="admin-input" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} placeholder="Add tag..." />
                                    <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={addTag}>+</button>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                                    {data.tags.map((tag) => <span key={tag} className="badge badge-info" style={{ cursor: 'pointer' }} onClick={() => setData('tags', data.tags.filter(t => t !== tag))}>{tag} ×</span>)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            <style>{`
                .wysiwyg-wrap { border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; overflow: hidden; }
                .editor-toolbar { display: flex; flex-wrap: wrap; gap: 4px; padding: 10px; background: rgba(255,255,255,0.03); border-bottom: 1px solid rgba(255,255,255,0.06); }
                .toolbar-btn { padding: 6px 10px; border: none; border-radius: 6px; background: none; color: #94a3b8; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.15s; }
                .toolbar-btn:hover { background: rgba(255,255,255,0.06); color: #e2e8f0; }
                .toolbar-btn-active { background: rgba(0,229,255,0.15); color: #00E5FF; }
                .toolbar-sep { width: 1px; background: rgba(255,255,255,0.06); margin: 0 4px; }
                .wysiwyg-content .tiptap { min-height: 250px; padding: 16px; color: #e2e8f0; font-size: 14px; line-height: 1.7; outline: none; }
                .wysiwyg-content .tiptap p.is-editor-empty:first-child::before { color: #475569; content: attr(data-placeholder); float: left; height: 0; pointer-events: none; }
                .wysiwyg-content .tiptap h2 { font-size: 1.5rem; font-weight: 700; margin: 1rem 0 0.5rem; }
                .wysiwyg-content .tiptap h3 { font-size: 1.25rem; font-weight: 600; margin: 0.8rem 0 0.4rem; }
                .wysiwyg-content .tiptap ul, .wysiwyg-content .tiptap ol { padding-left: 1.5rem; }
                .wysiwyg-content .tiptap blockquote { border-left: 3px solid #00E5FF; padding-left: 16px; color: #94a3b8; margin: 1rem 0; }
                .wysiwyg-content .tiptap img { max-width: 100%; border-radius: 10px; margin: 1rem 0; }
                .wysiwyg-content .tiptap a { color: #00E5FF; text-decoration: underline; }
                @media (max-width: 1023px) { form > div { grid-template-columns: 1fr !important; } }
            `}</style>
        </AdminLayout>
    );
}
