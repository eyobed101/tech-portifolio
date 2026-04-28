import React, { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../config';
import { getImageUrl } from '../utils/url';
import { useAuth } from '../context/AuthContext';

interface ImageUploadProps {
    value: string | null;
    onChange: (url: string) => void;
    label?: string;
}

export default function ImageUpload({ value, onChange, label = 'Cover Image' }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const { token } = useAuth();

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await fetch(`${API_BASE_URL}/api/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!res.ok) throw new Error('Upload failed');

            const data = await res.json();
            onChange(data.url);
        } catch (err) {
            console.error(err);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">{label}</label>

            {value ? (
                <div className="relative group rounded-2xl overflow-hidden border border-[#1f2937] aspect-video bg-[#0e121a]">
                    <img src={getImageUrl(value)} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                            onClick={() => onChange('')}
                            className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-all transform hover:scale-110"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            ) : (
                <label className="flex flex-col items-center justify-center w-full aspect-video rounded-2xl border-2 border-dashed border-[#1f2937] hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {uploading ? (
                            <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-3" />
                        ) : (
                            <>
                                <div className="p-4 rounded-full bg-[#1f2937] group-hover:bg-blue-500/10 transition-colors mb-3">
                                    <Upload className="w-6 h-6 text-gray-400 group-hover:text-blue-500" />
                                </div>
                                <p className="text-sm text-gray-400 group-hover:text-gray-300">
                                    <span className="font-semibold text-blue-500">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP (MAX. 5MB)</p>
                            </>
                        )}
                    </div>
                    <input type="file" className="hidden" onChange={handleUpload} accept="image/*" disabled={uploading} />
                </label>
            )}
        </div>
    );
}
