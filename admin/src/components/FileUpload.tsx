import React, { useState } from 'react';
import { Upload, X, Loader2, FileText, Download } from 'lucide-react';
import { API_BASE_URL } from '../config';
import { useAuth } from '../context/AuthContext';

interface FileUploadProps {
    value: string | null;
    onChange: (url: string) => void;
    label?: string;
    accept?: string;
}

export default function FileUpload({ value, onChange, label = 'File', accept = "*/*" }: FileUploadProps) {
    const [uploading, setUploading] = useState(false);
    const { token } = useAuth();

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('image', file); // API expects 'image' key currently

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
            alert('Failed to upload file');
        } finally {
            setUploading(false);
        }
    };

    const fileName = value ? value.split('/').pop() : '';

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">{label}</label>

            {value ? (
                <div className="flex items-center p-4 bg-[#0e121a] border border-[#1f2937] rounded-2xl group">
                    <div className="p-3 bg-blue-500/10 rounded-xl mr-4 group-hover:bg-blue-500/20 transition-colors">
                        <FileText className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="flex-grow min-w-0">
                        <p className="text-sm font-medium text-gray-200 truncate">{fileName}</p>
                        <a
                            href={value}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-blue-500 hover:underline flex items-center mt-1"
                        >
                            <Download className="w-3 h-3 mr-1" /> View / Download
                        </a>
                    </div>
                    <button
                        onClick={() => onChange('')}
                        className="p-2 bg-[#141a23] hover:bg-red-500/10 text-gray-500 hover:text-red-500 rounded-xl transition-all ml-4"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            ) : (
                <label className="flex flex-col items-center justify-center w-full p-8 rounded-2xl border-2 border-dashed border-[#1f2937] hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer group">
                    <div className="flex flex-col items-center justify-center">
                        {uploading ? (
                            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                        ) : (
                            <>
                                <div className="p-4 rounded-full bg-[#1f2937] group-hover:bg-blue-500/10 transition-colors mb-3">
                                    <Upload className="w-6 h-6 text-gray-400 group-hover:text-blue-500" />
                                </div>
                                <p className="text-sm text-gray-400 group-hover:text-gray-300">
                                    <span className="font-semibold text-blue-500">Click to upload</span> {label.toLowerCase()}
                                </p>
                            </>
                        )}
                    </div>
                    <input type="file" className="hidden" onChange={handleUpload} accept={accept} disabled={uploading} />
                </label>
            )}
        </div>
    );
}
