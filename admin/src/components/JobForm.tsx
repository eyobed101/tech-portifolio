import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import DynamicListInput from './DynamicListInput';

interface Job {
    id?: string;
    title: string;
    company: string;
    location: string;
    range: string;
    url: string | null;
    content: string; // JSON string
}

interface JobFormProps {
    job?: Job | null;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function JobForm({ job, onSuccess, onCancel }: JobFormProps) {
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        range: '',
        url: '',
    });
    const [functions, setFunctions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();

    useEffect(() => {
        if (job) {
            setFormData({
                title: job.title,
                company: job.company,
                location: job.location,
                range: job.range,
                url: job.url || '',
            });
            try {
                const parsed = JSON.parse(job.content);
                setFunctions(Array.isArray(parsed) ? parsed : []);
            } catch (e) {
                setFunctions([]);
            }
        }
    }, [job]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const dataToSend = {
            ...formData,
            content: JSON.stringify(functions),
        };

        const url = job?.id
            ? `http://localhost:3001/api/jobs/${job.id}`
            : 'http://localhost:3001/api/jobs';
        const method = job?.id ? 'PUT' : 'POST';

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
                    <label className="block text-sm font-medium text-gray-400 mb-2">Job Title</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        className="w-full bg-[#0e121a] border border-[#1f2937] rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Company</label>
                    <input
                        type="text"
                        value={formData.company}
                        onChange={e => setFormData({ ...formData, company: e.target.value })}
                        className="w-full bg-[#0e121a] border border-[#1f2937] rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
                    <input
                        type="text"
                        value={formData.location}
                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                        placeholder="Remote / City, Country"
                        className="w-full bg-[#0e121a] border border-[#1f2937] rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Date Range</label>
                    <input
                        type="text"
                        value={formData.range}
                        onChange={e => setFormData({ ...formData, range: e.target.value })}
                        placeholder="May 2021 - Present"
                        className="w-full bg-[#0e121a] border border-[#1f2937] rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Company URL (optional)</label>
                <input
                    type="url"
                    value={formData.url || ''}
                    onChange={e => setFormData({ ...formData, url: e.target.value })}
                    className="w-full bg-[#0e121a] border border-[#1f2937] rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
            </div>

            <DynamicListInput
                label="Main Functions"
                value={functions}
                onChange={setFunctions}
                placeholder="Add a responsibility..."
            />

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
                    {loading ? 'Saving...' : job?.id ? 'Update Job' : 'Create Job'}
                </button>
            </div>
        </form>
    );
}
