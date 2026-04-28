import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, FileText } from 'lucide-react';
import Modal from '../components/Modal';
import PostForm from '../components/PostForm';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';
import { getImageUrl } from '../utils/url';

interface Post {
    id: string;
    title: string;
    date: string;
    slug: string;
    tags: string;
    content: string;
    cover: string | null;
}

export default function PostsPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const { token } = useAuth();

    const fetchPosts = () => {
        setLoading(true);
        fetch(`${API_BASE_URL}/api/posts`)
            .then(res => res.json())
            .then(data => {
                setPosts(data);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const deletePost = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setPosts(posts.filter(p => p.id !== id));
            }
        } catch (err) {
            alert('Delete failed');
        }
    };

    const handleEdit = (post: Post) => {
        setSelectedPost(post);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setSelectedPost(null);
        setIsModalOpen(true);
    };

    const handleSuccess = () => {
        setIsModalOpen(false);
        fetchPosts();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">Manage Posts</h2>
                <button
                    onClick={handleAdd}
                    className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    New Post
                </button>
            </div>

            <div className="bg-[#141a23] rounded-2xl border border-[#1f2937] overflow-hidden overflow-x-auto">
                <table className="w-full text-left min-w-[700px]">
                    <thead>
                        <tr className="border-b border-[#1f2937] text-gray-400 text-sm">
                            <th className="px-6 py-4 font-medium">Title</th>
                            <th className="px-6 py-4 font-medium">Date</th>
                            <th className="px-6 py-4 font-medium">Slug</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1f2937]">
                        {loading ? (
                            <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading posts...</td></tr>
                        ) : posts.length === 0 ? (
                            <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No posts found.</td></tr>
                        ) : (
                            posts.map((post) => (
                                <tr key={post.id} className="hover:bg-[#1f2937]/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            {post.cover ? (
                                                <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#1f2937] mr-3 flex-shrink-0">
                                                    <img src={getImageUrl(post.cover)} alt="" className="w-full h-full object-cover" />
                                                </div>
                                            ) : (
                                                <FileText className="w-4 h-4 mr-3 text-gray-500" />
                                            )}
                                            <div className="font-medium text-gray-200">{post.title}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-sm">{new Date(post.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-gray-500 text-xs font-mono">{post.slug}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end space-x-2">
                                            <button onClick={() => handleEdit(post)} className="p-2 text-gray-400 hover:text-blue-400 transition-colors"><Edit2 className="w-4 h-4" /></button>
                                            <button onClick={() => deletePost(post.id)} className="p-2 text-gray-400 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedPost ? 'Edit Post' : 'Add New Post'}
            >
                <PostForm
                    post={selectedPost}
                    onSuccess={handleSuccess}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
}
