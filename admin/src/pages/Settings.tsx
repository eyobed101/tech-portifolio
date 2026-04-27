import React, { useState, useEffect } from 'react';
import { Save, User, FileText, Globe, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import FileUpload from '../components/FileUpload';
import SkillsEditor from '../components/SkillsEditor';


interface Profile {
    name: string;
    intro: string;
    description: string;
    resumeUrl: string | null;
    aboutTitle: string;
    aboutContent: string;
    aboutImage: string | null;
    aboutSkills: string; // JSON string
    email: string;
    github: string;
    linkedin: string;
    twitter: string;
    instagram: string;
    codepen: string;
}

export default function Settings() {
    const [profile, setProfile] = useState<Profile>({
        name: '',
        intro: '',
        description: '',
        resumeUrl: '',
        aboutTitle: 'About Me',
        aboutContent: '',
        aboutImage: '',
        aboutSkills: '[]',
        email: '',
        github: '',
        linkedin: '',
        twitter: '',
        instagram: '',
        codepen: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { token } = useAuth();

    useEffect(() => {
        fetch('http://localhost:3001/api/profile')
            .then(res => res.json())
            .then(data => {
                setProfile({
                    name: data.name || '',
                    intro: data.intro || '',
                    description: data.description || '',
                    resumeUrl: data.resumeUrl || '',
                    aboutTitle: data.aboutTitle || 'About Me',
                    aboutContent: data.aboutContent || '',
                    aboutImage: data.aboutImage || '',
                    aboutSkills: data.aboutSkills || '[]',
                    email: data.email || '',
                    github: data.github || '',
                    linkedin: data.linkedin || '',
                    twitter: data.twitter || '',
                    instagram: data.instagram || '',
                    codepen: data.codepen || '',
                });
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            try {
                JSON.parse(profile.aboutSkills);
            } catch (e) {
                alert('Invalid Skills JSON. Please check your formatting.');
                setSaving(false);
                return;
            }

            const res = await fetch('http://localhost:3001/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(profile),
            });

            if (res.ok) {
                alert('Profile updated successfully!');
            } else {
                alert('Update failed');
            }
        } catch (err) {
            alert('Network error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Profile Settings</h2>
                    <p className="text-gray-400 mt-1">Manage your hero, about section, and personal documents</p>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="flex items-center justify-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                    Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Hero & About Section */}
                <div className="xl:col-span-2 space-y-8">
                    {/* Hero Section */}
                    <div className="bg-[#141a23] border border-[#1f2937] rounded-3xl p-8 space-y-6">
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                                <User className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-semibold text-white">Hero Section</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        value={profile.name}
                                        onChange={e => setProfile({ ...profile, name: e.target.value })}
                                        className="w-full bg-[#0e121a] border border-[#1f2937] rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                        placeholder="Eyobed Elias"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Hero Intro (One line)</label>
                                    <input
                                        type="text"
                                        value={profile.intro}
                                        onChange={e => setProfile({ ...profile, intro: e.target.value })}
                                        className="w-full bg-[#0e121a] border border-[#1f2937] rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                        placeholder="I build secure digital experiences."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Hero Description</label>
                                <textarea
                                    value={profile.description}
                                    onChange={e => setProfile({ ...profile, description: e.target.value })}
                                    rows={3}
                                    className="w-full bg-[#0e121a] border border-[#1f2937] rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                    placeholder="Describe your role and expertise..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* About Section */}
                    <div className="bg-[#141a23] border border-[#1f2937] rounded-3xl p-8 space-y-6">
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                                <FileText className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-semibold text-white">About Me Section</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">About Title</label>
                                <input
                                    type="text"
                                    value={profile.aboutTitle}
                                    onChange={e => setProfile({ ...profile, aboutTitle: e.target.value })}
                                    className="w-full bg-[#0e121a] border border-[#1f2937] rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                    placeholder="About Me"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">About Bio</label>
                                <textarea
                                    value={profile.aboutContent}
                                    onChange={e => setProfile({ ...profile, aboutContent: e.target.value })}
                                    rows={8}
                                    className="w-full bg-[#0e121a] border border-[#1f2937] rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                    placeholder="Write your professional bio..."
                                />
                            </div>

                            <div className="pt-4 border-t border-[#1f2937]">
                                <SkillsEditor
                                    value={profile.aboutSkills}
                                    onChange={val => setProfile({ ...profile, aboutSkills: val })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Social & Contact Links */}
                    <div className="bg-[#141a23] border border-[#1f2937] rounded-3xl p-8 space-y-6">
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
                                <Globe className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-semibold text-white">Social & Contact</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={profile.email}
                                    onChange={e => setProfile({ ...profile, email: e.target.value })}
                                    className="w-full bg-[#0e121a] border border-[#1f2937] rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                    placeholder="your@email.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">GitHub URL</label>
                                <input
                                    type="url"
                                    value={profile.github}
                                    onChange={e => setProfile({ ...profile, github: e.target.value })}
                                    className="w-full bg-[#0e121a] border border-[#1f2937] rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                    placeholder="https://github.com/..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">LinkedIn URL</label>
                                <input
                                    type="url"
                                    value={profile.linkedin}
                                    onChange={e => setProfile({ ...profile, linkedin: e.target.value })}
                                    className="w-full bg-[#0e121a] border border-[#1f2937] rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                    placeholder="https://linkedin.com/in/..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Twitter URL</label>
                                <input
                                    type="url"
                                    value={profile.twitter}
                                    onChange={e => setProfile({ ...profile, twitter: e.target.value })}
                                    className="w-full bg-[#0e121a] border border-[#1f2937] rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                    placeholder="https://twitter.com/..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Instagram URL</label>
                                <input
                                    type="url"
                                    value={profile.instagram}
                                    onChange={e => setProfile({ ...profile, instagram: e.target.value })}
                                    className="w-full bg-[#0e121a] border border-[#1f2937] rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                    placeholder="https://instagram.com/..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">CodePen URL</label>
                                <input
                                    type="url"
                                    value={profile.codepen}
                                    onChange={e => setProfile({ ...profile, codepen: e.target.value })}
                                    className="w-full bg-[#0e121a] border border-[#1f2937] rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                    placeholder="https://codepen.io/..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Assets */}
                <div className="space-y-8">
                    {/* Images */}
                    <div className="bg-[#141a23] border border-[#1f2937] rounded-3xl p-8 space-y-6">
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                                <Globe className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-semibold text-white">Assets</h3>
                        </div>

                        <div className="space-y-6">
                            <FileUpload
                                label="About Profile Image"
                                value={profile.aboutImage}
                                onChange={url => setProfile({ ...profile, aboutImage: url })}
                                accept="image/*"
                            />

                            <div className="pt-6 border-t border-[#1f2937]">
                                <FileUpload
                                    label="Resume PDF"
                                    value={profile.resumeUrl}
                                    onChange={url => setProfile({ ...profile, resumeUrl: url })}
                                    accept=".pdf"
                                />
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                            <div className="flex items-start space-x-3">
                                <Globe className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                                <p className="text-xs text-blue-200/60 leading-relaxed">
                                    All files uploaded here are stored securely and served directly to your portfolio.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
