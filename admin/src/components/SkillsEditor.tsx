import { useState, useEffect } from 'react';
import { Plus, Trash2, Layout, Tag } from 'lucide-react';

interface SkillCategory {
    category: string;
    items: string[];
}

interface SkillsEditorProps {
    value: string; // JSON string
    onChange: (value: string) => void;
}

export default function SkillsEditor({ value, onChange }: SkillsEditorProps) {
    const [categories, setCategories] = useState<SkillCategory[]>([]);

    useEffect(() => {
        try {
            const parsed = JSON.parse(value || '[]');
            setCategories(Array.isArray(parsed) ? parsed : []);
        } catch (e) {
            setCategories([]);
        }
    }, [value]);

    const updateCategories = (newCategories: SkillCategory[]) => {
        setCategories(newCategories);
        onChange(JSON.stringify(newCategories));
    };

    const addCategory = () => {
        updateCategories([...categories, { category: 'New Category', items: [] }]);
    };

    const removeCategory = (index: number) => {
        const newCats = [...categories];
        newCats.splice(index, 1);
        updateCategories(newCats);
    };

    const updateCategoryName = (index: number, name: string) => {
        const newCats = [...categories];
        newCats[index].category = name;
        updateCategories(newCats);
    };

    const addItem = (catIndex: number) => {
        const newCats = [...categories];
        newCats[catIndex].items.push('New Skill');
        updateCategories(newCats);
    };

    const removeItem = (catIndex: number, itemIndex: number) => {
        const newCats = [...categories];
        newCats[catIndex].items.splice(itemIndex, 1);
        updateCategories(newCats);
    };

    const updateItemValue = (catIndex: number, itemIndex: number, val: string) => {
        const newCats = [...categories];
        newCats[catIndex].items[itemIndex] = val;
        updateCategories(newCats);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-gray-400">
                    <Layout className="w-4 h-4" />
                    <span className="text-sm font-medium uppercase tracking-wider">Skill Categories</span>
                </div>
                <button
                    onClick={addCategory}
                    type="button"
                    className="flex items-center px-3 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 rounded-lg text-xs font-semibold transition-colors border border-blue-500/20"
                >
                    <Plus className="w-3 h-3 mr-1.5" />
                    Add Category
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((cat, catIndex) => (
                    <div key={catIndex} className="bg-[#0e121a] border border-[#1f2937] rounded-2xl p-5 space-y-4 relative group">
                        <div className="flex items-center justify-between">
                            <input
                                type="text"
                                value={cat.category}
                                onChange={(e) => updateCategoryName(catIndex, e.target.value)}
                                className="bg-transparent border-none text-white font-semibold text-sm focus:ring-0 p-0 w-full placeholder-gray-600"
                                placeholder="Category Name..."
                            />
                            <button
                                onClick={() => removeCategory(catIndex)}
                                className="p-1.5 text-gray-500 hover:text-red-500 transition-colors"
                                title="Remove Category"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-2">
                            {cat.items.map((item, itemIndex) => (
                                <div key={itemIndex} className="flex items-center group/item space-x-2">
                                    <Tag className="w-3 h-3 text-gray-600 flex-shrink-0" />
                                    <input
                                        type="text"
                                        value={item}
                                        onChange={(e) => updateItemValue(catIndex, itemIndex, e.target.value)}
                                        className="bg-transparent border-none text-gray-400 text-xs focus:ring-0 p-0 w-full placeholder-gray-700"
                                        placeholder="Skill name..."
                                    />
                                    <button
                                        onClick={() => removeItem(catIndex, itemIndex)}
                                        className="opacity-0 group-hover/item:opacity-100 p-1 text-gray-600 hover:text-red-500 transition-all"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => addItem(catIndex)}
                            className="w-full flex items-center justify-center py-2 border border-dashed border-[#1f2937] hover:border-blue-500/40 hover:bg-blue-500/5 text-gray-500 hover:text-blue-400 rounded-xl text-xs transition-all mt-2"
                        >
                            <Plus className="w-3 h-3 mr-2" />
                            Add Item
                        </button>
                    </div>
                ))}
            </div>

            {categories.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-[#1f2937] rounded-3xl">
                    <Layout className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No skill categories added yet.</p>
                </div>
            )}
        </div>
    );
}
