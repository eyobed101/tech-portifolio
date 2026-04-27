import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ImageUpload from './ImageUpload';
import DynamicListInput from './DynamicListInput';

interface Project {
    id?: string;
    title: string;
    github: string | null;
    external: string | null;
    tech: string; // JSON string in DB
    cover: string | null;
    content: string; // Used as description
}

interface ProjectFormProps {
    project?: Project | null;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function ProjectForm({ project, onSuccess, onCancel }: ProjectFormProps) {
    const [formData, setFormData] = useState({
        title: '',
        github: '',
        external: '',
        cover: '',
        content: '',
    });
    const [tech, setTech] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();

    useEffect(() => {
        if (project) {
            setFormData({
                title: project.title,
                github: project.github || '',
                external: project.external || '',
                cover: project.cover || '',
                content: project.content || '',
            });
            try {
                const parsedTech = JSON.parse(project.tech);
                setTech(Array.isArray(parsedTech) ? parsedTech : []);
            } catch (e) {
                setTech([]);
            }
        }
    }, [project]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const dataToSend = {
            ...formData,
            tech: JSON.stringify(tech),
        };

        const url = project?.id
            ? `http://localhost:3001/api/projects/${project.id}`
            : 'http://localhost:3001/api/projects';
        const method = project?.id ? 'PUT' : 'POST';

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
            console.error(err);
            alert('Network error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Project Title</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        className="w-full bg-[#0e121a] border border-[#1f2937] rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">GitHub URL</label>
                    <input
                        type="url"
                        value={formData.github || ''}
                        onChange={e => setFormData({ ...formData, github: e.target.value })}
                        className="w-full bg-[#0e121a] border border-[#1f2937] rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">External URL</label>
                    <input
                        type="url"
                        value={formData.external || ''}
                        onChange={e => setFormData({ ...formData, external: e.target.value })}
                        className="w-full bg-[#0e121a] border border-[#1f2937] rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                </div>
                <div className="flex flex-col justify-end">
                    <ImageUpload
                        value={formData.cover}
                        onChange={(url) => setFormData({ ...formData, cover: url })}
                    />
                </div>
            </div>

            <DynamicListInput
                label="Technologies"
                value={tech}
                onChange={setTech}
                placeholder="Add a technology (e.g. React, Node.js)"
            />

            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                <textarea
                    value={formData.content}
                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                    rows={4}
                    className="w-full bg-[#0e121a] border border-[#1f2937] rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    required
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
                    {loading ? 'Saving...' : project?.id ? 'Update Project' : 'Create Project'}
                </button>
            </div>
        </form>
    );
}
