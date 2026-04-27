import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Briefcase } from 'lucide-react';
import Modal from '../components/Modal';
import JobForm from '../components/JobForm';
import { useAuth } from '../context/AuthContext';

interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    range: string;
    url: string | null;
    content: string;
}

export default function JobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const { token } = useAuth();

    const fetchJobs = () => {
        setLoading(true);
        fetch('http://localhost:3001/api/jobs')
            .then(res => res.json())
            .then(data => {
                setJobs(data);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const deleteJob = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this job?')) return;
        try {
            const res = await fetch(`http://localhost:3001/api/jobs/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setJobs(jobs.filter(j => j.id !== id));
            }
        } catch (err) {
            alert('Delete failed');
        }
    };

    const handleEdit = (job: Job) => {
        setSelectedJob(job);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setSelectedJob(null);
        setIsModalOpen(true);
    };

    const handleSuccess = () => {
        setIsModalOpen(false);
        fetchJobs();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">Manage Jobs</h2>
                <button
                    onClick={handleAdd}
                    className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Job
                </button>
            </div>

            <div className="bg-[#141a23] rounded-2xl border border-[#1f2937] overflow-hidden overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                    <thead>
                        <tr className="border-b border-[#1f2937] text-gray-400 text-sm">
                            <th className="px-6 py-4 font-medium">Role</th>
                            <th className="px-6 py-4 font-medium">Company</th>
                            <th className="px-6 py-4 font-medium">Range</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1f2937]">
                        {loading ? (
                            <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading jobs...</td></tr>
                        ) : jobs.length === 0 ? (
                            <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No jobs found.</td></tr>
                        ) : (
                            jobs.map((job) => (
                                <tr key={job.id} className="hover:bg-[#1f2937]/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <Briefcase className="w-4 h-4 mr-3 text-gray-500" />
                                            <div className="font-medium text-gray-200">{job.title}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-gray-200">{job.company}</div>
                                        <div className="text-gray-500 text-xs">{job.location}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-sm">{job.range}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end space-x-2">
                                            <button onClick={() => handleEdit(job)} className="p-2 text-gray-400 hover:text-blue-400 transition-colors"><Edit2 className="w-4 h-4" /></button>
                                            <button onClick={() => deleteJob(job.id)} className="p-2 text-gray-400 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
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
                title={selectedJob ? 'Edit Job' : 'Add New Job'}
            >
                <JobForm
                    job={selectedJob}
                    onSuccess={handleSuccess}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
}
