import { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface DynamicListInputProps {
    value: string[];
    onChange: (value: string[]) => void;
    label: string;
    placeholder?: string;
}

export default function DynamicListInput({ value, onChange, label, placeholder }: DynamicListInputProps) {
    const [newItem, setNewItem] = useState('');

    const addItem = () => {
        if (newItem.trim()) {
            onChange([...value, newItem.trim()]);
            setNewItem('');
        }
    };

    const removeItem = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addItem();
        }
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-400">{label}</label>

            <div className="space-y-2">
                {value.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 group">
                        <div className="flex-grow flex items-center bg-[#0e121a] border border-[#1f2937] rounded-xl px-4 py-2 text-gray-300">
                            <span className="flex-grow">{item}</span>
                            <button
                                type="button"
                                onClick={() => removeItem(index)}
                                className="p-1 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center space-x-2">
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder || "Add an item..."}
                    className="flex-grow bg-[#0e121a] border border-[#1f2937] rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
                <button
                    type="button"
                    onClick={addItem}
                    className="p-3 bg-[#1f2937] hover:bg-blue-600 text-gray-400 hover:text-white rounded-xl transition-all"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
