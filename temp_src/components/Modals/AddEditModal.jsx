import React, { useState, useEffect } from 'react';
import { useSheetStore } from '../../store/useSheetStore';
import { X } from 'lucide-react';

export default function AddEditModal({ isOpen, onClose, type, mode, parentIds, initialData }) {
    const [title, setTitle] = useState('');
    const [links, setLinks] = useState([{ platform: 'LeetCode', url: '' }]);
    const [difficulty, setDifficulty] = useState('Easy'); // For questions

    // Note: We are not handling notes in this modal, that will be a separate interaction.

    const { addTopic, editTopic, addSubTopic, editSubTopic, addQuestion, editQuestion } = useSheetStore();

    useEffect(() => {
        if (isOpen && initialData) {
            setTitle(initialData.title || '');
            // Handle legacy single link or new links array
            if (initialData.links && initialData.links.length > 0) {
                setLinks(initialData.links);
            } else if (initialData.link) {
                setLinks([{ platform: 'Other', url: initialData.link }]);
            } else {
                setLinks([{ platform: 'LeetCode', url: '' }]);
            }
            setDifficulty(initialData.difficulty || 'Easy');
        } else {
            setTitle('');
            setLinks([{ platform: 'LeetCode', url: '' }]);
            setDifficulty('Easy');
        }
    }, [isOpen, initialData]);

    const handleLinkChange = (index, field, value) => {
        const newLinks = [...links];
        newLinks[index][field] = value;
        setLinks(newLinks);
    };

    const addLink = () => {
        setLinks([...links, { platform: 'LeetCode', url: '' }]);
    };

    const removeLink = (index) => {
        const newLinks = links.filter((_, i) => i !== index);
        setLinks(newLinks);
    };

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        if (type === 'topic') {
            if (mode === 'add') addTopic(title);
            else editTopic(initialData.id, title);
        } else if (type === 'subTopic') {
            if (mode === 'add') addSubTopic(parentIds.topicId, title);
            else editSubTopic(parentIds.topicId, initialData.id, title);
        } else if (type === 'question') {
            // Filter out empty links
            const validLinks = links.filter(l => l.url.trim() !== '');
            const data = { title, links: validLinks, difficulty };
            if (mode === 'add') addQuestion(parentIds.topicId, parentIds.subTopicId, data);
            else editQuestion(parentIds.topicId, parentIds.subTopicId, initialData.id, data);
        }

        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md bg-card p-6 rounded-lg shadow-xl border border-border">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold capitalize">{mode} {type}</h2>
                    <button onClick={onClose} className="p-1 hover:bg-muted rounded-full">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none"
                            placeholder={`Enter ${type} title`}
                            required
                            autoFocus
                        />
                    </div>

                    {type === 'question' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-1">Links</label>
                                <div className="space-y-2">
                                    {(links || []).map((link, index) => (
                                        <div key={index} className="flex gap-2">
                                            <select
                                                value={link.platform}
                                                onChange={(e) => handleLinkChange(index, 'platform', e.target.value)}
                                                className="w-1/3 p-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none text-sm"
                                            >
                                                <option value="LeetCode">LeetCode</option>
                                                <option value="CodingNinjas">CodingNinjas</option>
                                                <option value="GeeksforGeeks">GeeksforGeeks</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            <input
                                                type="url"
                                                value={link.url}
                                                onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                                                className="flex-1 p-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none text-sm"
                                                placeholder="https://..."
                                            />
                                            {links.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeLink(index)}
                                                    className="p-2 text-muted-foreground hover:text-destructive"
                                                >
                                                    <X size={16} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addLink}
                                        className="text-xs text-primary hover:underline flex items-center gap-1"
                                    >
                                        + Add another link
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Difficulty</label>
                                <select
                                    value={difficulty}
                                    onChange={(e) => setDifficulty(e.target.value)}
                                    className="w-full p-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none"
                                >
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                            </div>
                        </>
                    )}

                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                        >
                            {mode === 'add' ? 'Create' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
