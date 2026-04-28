import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ExternalLink, Code } from 'lucide-react';
import Modal from '../components/Modal';
import ProjectForm from '../components/ProjectForm';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';
import { getImageUrl } from '../utils/url';

interface Project {
    id: string;
    title: string;
    tech: string;
    github: string | null;
    external: string | null;
    content: string; // Match form
    cover: string | null;
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const { token } = useAuth();

    const fetchProjects = () => {
        setLoading(true);
        fetch(`${API_BASE_URL}/api/projects`)
            .then(res => res.json())
            .then(data => {
                setProjects(data);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const deleteProject = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setProjects(projects.filter(p => p.id !== id));
            }
        } catch (err) {
            alert('Delete failed');
        }
    };

    const handleEdit = (project: Project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setSelectedProject(null);
        setIsModalOpen(true);
    };

    const handleSuccess = () => {
        setIsModalOpen(false);
        fetchProjects();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">Manage Projects</h2>
                <button
                    onClick={handleAdd}
                    className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
                </button>
            </div>

            <div className="bg-[#141a23] rounded-2xl border border-[#1f2937] overflow-hidden overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                    <thead>
                        <tr className="border-b border-[#1f2937] text-gray-400 text-sm">
                            <th className="px-6 py-4 font-medium">Project</th>
                            <th className="px-6 py-4 font-medium">Technologies</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1f2937]">
                        {loading ? (
                            <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-500">Loading projects...</td></tr>
                        ) : projects.length === 0 ? (
                            <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-500">No projects found.</td></tr>
                        ) : (
                            projects.map((project) => (
                                <tr key={project.id} className="hover:bg-[#1f2937]/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            {project.cover && (
                                                <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#1f2937] flex-shrink-0">
                                                    <img src={getImageUrl(project.cover)} alt="" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-medium text-gray-200">{project.title}</div>
                                                <div className="flex items-center space-x-3 mt-1">
                                                    {project.github && <a href={project.github} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white"><Code className="w-3 h-3" /></a>}
                                                    {project.external && <a href={project.external} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white"><ExternalLink className="w-3 h-3" /></a>}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-2">
                                            {JSON.parse(project.tech || '[]').map((t: string) => (
                                                <span key={t} className="px-2 py-0.5 bg-[#1f2937] text-gray-400 text-xs rounded-md">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end space-x-2">
                                            <button onClick={() => handleEdit(project)} className="p-2 text-gray-400 hover:text-blue-400 transition-colors"><Edit2 className="w-4 h-4" /></button>
                                            <button onClick={() => deleteProject(project.id)} className="p-2 text-gray-400 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
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
                title={selectedProject ? 'Edit Project' : 'Add New Project'}
            >
                <ProjectForm
                    project={selectedProject}
                    onSuccess={handleSuccess}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
}
