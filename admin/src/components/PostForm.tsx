import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';
import ImageUpload from './ImageUpload';
import RichTextEditor from './RichTextEditor';

interface Post {
    id?: string;
    title: string;
    date: string;
    slug: string;
    tags: string; // JSON string in DB
    cover: string | null;
    content: string;
}

interface PostFormProps {
    post?: Post | null;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function PostForm({ post, onSuccess, onCancel }: PostFormProps) {
    const [formData, setFormData] = useState<Post>({
        title: '',
        date: new Date().toISOString().split('T')[0],
        slug: '',
        tags: '',
        cover: '',
        content: '',
    });
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();

    useEffect(() => {
        if (post) {
            setFormData({
                ...post,
                date: new Date(post.date).toISOString().split('T')[0],
                tags: Array.isArray(JSON.parse(post.tags || '[]')) ? JSON.parse(post.tags).join(', ') : post.tags,
                cover: post.cover || '',
            });
        }
    }, [post]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const dataToSend = {
            ...formData,
            date: new Date(formData.date).toISOString(),
            tags: JSON.stringify(formData.tags.split(',').map(t => t.trim()).filter(Boolean)),
        };

        const url = post?.id ? `${API_BASE_URL}/api/posts/${post.id}` : `${API_BASE_URL}/api/posts`;
        const method = post?.id ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(dataToSend),
            });

            if (res.ok) {
                onSuccess();
            } else {
                const err = await res.json();
                alert(err.error || 'Operation failed');
            }
        } catch (err) {
            alert('Network error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Post Title</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        className="w-full bg-[#0e121a] border border-[#1f2937] rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Publish Date</label>
                    <input
                        type="date"
                        value={formData.date}
                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                        className="w-full bg-[#0e121a] border border-[#1f2937] rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Slug</label>
                    <input
                        type="text"
                        value={formData.slug}
                        onChange={e => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="my-first-post"
                        className="w-full bg-[#0e121a] border border-[#1f2937] rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Tags (comma separated)</label>
                    <input
                        type="text"
                        value={formData.tags}
                        onChange={e => setFormData({ ...formData, tags: e.target.value })}
                        className="w-full bg-[#0e121a] border border-[#1f2937] rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                </div>
            </div>

            <ImageUpload
                value={formData.cover}
                onChange={(url) => setFormData({ ...formData, cover: url })}
            />

            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Post Content</label>
                <RichTextEditor
                    value={formData.content}
                    onChange={content => setFormData({ ...formData, content })}
                    placeholder="Start writing your amazing blog post..."
                />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2.5 rounded-xl border border-[#1f2937] text-gray-400 hover:text-white hover:bg-[#1f2937] transition-all"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all disabled:opacity-50"
                >
                    {loading ? 'Saving...' : post?.id ? 'Update Post' : 'Create Post'}
                </button>
            </div>
        </form>
    );
}
