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
import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import CustomDropdown from '@/Components/Public/CustomDropdown';

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
            StarterKit,
            TptImage,
            TptLink.configure({ openOnClick: false }),
            Underline,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
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

export default function PortfolioForm({ portfolio }) {
    const isEditing = !!portfolio;
    const [activeTab, setActiveTab] = useState('en');
    const [isTranslating, setIsTranslating] = useState(false);
    const [isGeneratingTags, setIsGeneratingTags] = useState(false);
    const [tagInput, setTagInput] = useState('');

    const { data, setData, post, put, processing, errors } = useForm({
        title_en: portfolio?.title_en || '',
        title_id: portfolio?.title_id || '',
        description_en: portfolio?.description_en || '',
        description_id: portfolio?.description_id || '',
        content_en: portfolio?.content_en || '',
        content_id: portfolio?.content_id || '',
        category: portfolio?.category || '',
        tags: portfolio?.tags || [],
        featured_image: portfolio?.featured_image || '',
        gallery: portfolio?.gallery || [],
        is_featured: portfolio?.is_featured || false,
        sort_order: portfolio?.sort_order || 0,
        status: portfolio?.status || 'draft',
    });

    const handleAutoTranslate = async (from = 'id', to = 'en') => {
        const sourceFields = from === 'id' ? ['title_id', 'description_id', 'content_id'] : ['title_en', 'description_en', 'content_en'];
        const hasContent = sourceFields.some(f => data[f]);

        if (!hasContent) {
            toast.error(`Isi konten bahasa ${from === 'id' ? 'Indonesia' : 'Inggris'} dulu ya!`);
            return;
        }

        setIsTranslating(true);
        const t = toast.loading('Sedang menerjemahkan...');

        try {
            const fieldMap = from === 'id' 
                ? [
                    { src: 'title_id', dest: 'title_en' },
                    { src: 'description_id', dest: 'description_en' },
                    { src: 'content_id', dest: 'content_en' },
                  ]
                : [
                    { src: 'title_en', dest: 'title_id' },
                    { src: 'description_en', dest: 'description_id' },
                    { src: 'content_en', dest: 'content_id' },
                  ];

            const results = {};
            for (const field of fieldMap) {
                if (data[field.src]) {
                    const response = await axios.post('/admin/translate', {
                        text: data[field.src],
                        from: from,
                        to: to
                    });
                    results[field.dest] = response.data.translated;
                }
            }

            setData(prev => ({ ...prev, ...results }));
            toast.success('Berhasil diterjemahkan!', { id: t });
        } catch (error) {
            console.error(error);
            toast.error('Gagal menerjemahkan', { id: t });
        } finally {
            setIsTranslating(false);
        }
    };

    const handleGenerateTags = async () => {
        const hasContent = data.title_id || data.title_en || data.content_id || data.content_en || data.description_id || data.description_en;
        if (!hasContent) {
            toast.error('Isi konten (judul, deskripsi, atau isi) dulu ya untuk generate tag!');
            return;
        }

        setIsGeneratingTags(true);
        const t = toast.loading('Sedang meracik tag...');

        try {
            const response = await axios.post('/admin/generate-tags', {
                title: data.title_id || data.title_en,
                excerpt: data.description_id || data.description_en,
                content: data.content_id || data.content_en
            });

            if (response.data.tags) {
                setData('tags', response.data.tags);
                toast.success('Tag berhasil digenerate!', { id: t });
            }
        } catch (error) {
            console.error(error);
            toast.error('Gagal generate tag', { id: t });
        } finally {
            setIsGeneratingTags(false);
        }
    };

    const addTag = () => {
        if (tagInput.trim() && !data.tags.includes(tagInput.trim())) {
            setData('tags', [...data.tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const removeTag = (tag) => setData('tags', data.tags.filter((t) => t !== tag));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(`/admin/portfolios/${portfolio.id}`);
        } else {
            post('/admin/portfolios');
        }
    };

    return (
        <AdminLayout title={isEditing ? 'Edit Portfolio' : 'New Portfolio'}>
            <Head title={isEditing ? 'Edit Portfolio' : 'New Portfolio'} />

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
                    {/* Main Column */}
                    <div>
                        <div className="admin-card">
                            {/* Language Tabs */}
                            <div className="tab-buttons" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: 4 }}>
                                    <button type="button" className={`tab-btn ${activeTab === 'en' ? 'active' : ''}`} onClick={() => setActiveTab('en')}>
                                        🇬🇧 English
                                    </button>
                                    <button type="button" className={`tab-btn ${activeTab === 'id' ? 'active' : ''}`} onClick={() => setActiveTab('id')}>
                                        🇮🇩 Indonesian
                                    </button>
                                </div>
                                <button 
                                    type="button" 
                                    onClick={() => handleAutoTranslate(activeTab === 'en' ? 'id' : 'en', activeTab)} 
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
                                    {isTranslating ? 'Translating...' : `Magic Translate (${activeTab === 'en' ? 'ID → EN' : 'EN → ID'})`}
                                </button>
                            </div>

                            {/* English Fields */}
                            <div style={{ display: activeTab === 'en' ? 'block' : 'none' }}>
                                <div className="form-group">
                                    <label className="admin-label">Title (English)</label>
                                    <input className="admin-input" value={data.title_en} onChange={(e) => setData('title_en', e.target.value)} />
                                    {errors.title_en && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.title_en}</p>}
                                </div>
                                <div className="form-group">
                                    <label className="admin-label">Description (English)</label>
                                    <textarea className="admin-input" rows={3} value={data.description_en} onChange={(e) => setData('description_en', e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label className="admin-label">Content (English)</label>
                                    <WysiwygEditor content={data.content_en} onChange={(val) => setData('content_en', val)} placeholder="Write portfolio content in English..." />
                                </div>
                            </div>

                            {/* Indonesian Fields */}
                            <div style={{ display: activeTab === 'id' ? 'block' : 'none' }}>
                                <div className="form-group">
                                    <label className="admin-label">Title (Indonesian)</label>
                                    <input className="admin-input" value={data.title_id} onChange={(e) => setData('title_id', e.target.value)} />
                                    {errors.title_id && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.title_id}</p>}
                                </div>
                                <div className="form-group">
                                    <label className="admin-label">Description (Indonesian)</label>
                                    <textarea className="admin-input" rows={3} value={data.description_id} onChange={(e) => setData('description_id', e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label className="admin-label">Content (Indonesian)</label>
                                    <WysiwygEditor content={data.content_id} onChange={(val) => setData('content_id', val)} placeholder="Tulis konten portofolio dalam Bahasa Indonesia..." />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {/* Actions */}
                        <div className="admin-card">
                            <div className="form-group">
                                <label className="admin-label">Status</label>
                                <CustomDropdown 
                                    options={[
                                        { value: 'draft', label: 'Draft' },
                                        { value: 'published', label: 'Published' }
                                    ]}
                                    value={data.status}
                                    onChange={(val) => setData('status', val)}
                                    placeholder="Select Status"
                                />
                            </div>
                            <div style={{ display: 'flex', gap: 10 }}>
                                <button type="submit" disabled={processing} className="admin-btn admin-btn-primary" style={{ flex: 1 }}>
                                    {processing ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
                                </button>
                                <Link 
                                    href="/admin/portfolios" 
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

                        {/* Featured Image */}
                        <div className="admin-card">
                            <label className="admin-label">Featured Image URL</label>
                            <input className="admin-input" value={data.featured_image} onChange={(e) => setData('featured_image', e.target.value)} placeholder="https://..." />
                            {data.featured_image && (
                                <img src={data.featured_image} alt="Preview" style={{ width: '100%', borderRadius: 10, marginTop: 12, objectFit: 'cover', maxHeight: 180 }} />
                            )}
                        </div>

                        {/* Category & Tags */}
                        <div className="admin-card">
                            <div className="form-group">
                                <label className="admin-label">Category</label>
                                <input className="admin-input" value={data.category} onChange={(e) => setData('category', e.target.value)} placeholder="e.g., HealthTech AI" />
                            </div>
                            <div className="admin-card" style={{ marginTop: 24 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <label className="admin-label" style={{ marginBottom: 0 }}>Tags</label>
                                <button 
                                    type="button" 
                                    onClick={handleGenerateTags}
                                    disabled={isGeneratingTags}
                                    style={{ 
                                        fontSize: 11, 
                                        color: '#00E5FF', 
                                        background: 'transparent', 
                                        border: 'none', 
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 4,
                                        opacity: isGeneratingTags ? 0.5 : 1
                                    }}
                                >
                                    <SparklesIcon style={{ width: 12, height: 12 }} />
                                    {isGeneratingTags ? 'Generating...' : 'Auto-Generate Tags'}
                                </button>
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <input
                                    className="admin-input"
                                    placeholder="Add tag and press Enter"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                />
                                <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={addTag}>+</button>
                            </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                                    {data.tags.map((tag) => (
                                        <span key={tag} className="badge badge-info" style={{ cursor: 'pointer' }} onClick={() => removeTag(tag)}>
                                            {tag} ×
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                                    <input type="checkbox" checked={data.is_featured} onChange={(e) => setData('is_featured', e.target.checked)} />
                                    <span className="admin-label" style={{ margin: 0 }}>Featured Portfolio</span>
                                </label>
                            </div>
                            <div className="form-group">
                                <label className="admin-label">Sort Order</label>
                                <input className="admin-input" type="number" value={data.sort_order} onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)} />
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            <style>{`
                .wysiwyg-wrap {
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 10px;
                    overflow: hidden;
                }
                .editor-toolbar {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 4px;
                    padding: 10px;
                    background: rgba(255,255,255,0.03);
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                }
                .toolbar-btn {
                    padding: 6px 10px;
                    border: none;
                    border-radius: 6px;
                    background: none;
                    color: #94a3b8;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    font-family: inherit;
                    transition: all 0.15s;
                }
                .toolbar-btn:hover { background: rgba(255,255,255,0.06); color: #e2e8f0; }
                .toolbar-btn-active { background: rgba(0,229,255,0.15); color: #00E5FF; }
                .toolbar-sep { width: 1px; background: rgba(255,255,255,0.06); margin: 0 4px; }
                .wysiwyg-content .tiptap {
                    min-height: 200px;
                    padding: 16px;
                    color: #e2e8f0;
                    font-size: 14px;
                    line-height: 1.7;
                    outline: none;
                }
                .wysiwyg-content .tiptap p.is-editor-empty:first-child::before {
                    color: #475569;
                    content: attr(data-placeholder);
                    float: left;
                    height: 0;
                    pointer-events: none;
                }
                .wysiwyg-content .tiptap h2 { font-size: 1.5rem; font-weight: 700; margin: 1rem 0 0.5rem; }
                .wysiwyg-content .tiptap h3 { font-size: 1.25rem; font-weight: 600; margin: 0.8rem 0 0.4rem; }
                .wysiwyg-content .tiptap ul, .wysiwyg-content .tiptap ol { padding-left: 1.5rem; }
                .wysiwyg-content .tiptap blockquote {
                    border-left: 3px solid #00E5FF;
                    padding-left: 16px;
                    color: #94a3b8;
                    margin: 1rem 0;
                }
                .wysiwyg-content .tiptap img { max-width: 100%; border-radius: 10px; margin: 1rem 0; }
                .wysiwyg-content .tiptap a { color: #00E5FF; text-decoration: underline; }
                .wysiwyg-content .tiptap mark { background: rgba(0,229,255,0.2); color: inherit; padding: 0 4px; border-radius: 2px; }

                @media (max-width: 1023px) {
                    form > div { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </AdminLayout>
    );
}
