import React, { useState, useEffect } from 'react';
import { X, Trash2, Save } from 'lucide-react';

export default function NoteModal({ isOpen, onClose, initialNote, onSave, onDelete }) {
    const [note, setNote] = useState('');

    useEffect(() => {
        if (isOpen) {
            setNote(initialNote || '');
        }
    }, [isOpen, initialNote]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(note);
        onClose();
    };

    const handleDelete = () => {
        onDelete();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-card p-6 rounded-lg shadow-xl border border-border animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Notes</h2>
                    <button onClick={onClose} className="p-1 hover:bg-muted rounded-full">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full h-32 p-3 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none resize-none"
                            placeholder="Add your notes here... (e.g. key insights, time complexity)"
                            autoFocus
                        />
                    </div>

                    <div className="flex justify-between items-center mt-6">
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="flex items-center gap-2 px-3 py-2 text-destructive hover:bg-destructive/10 rounded-md text-sm font-medium transition-colors"
                            title="Delete Note"
                        >
                            <Trash2 size={16} />
                            Delete Note
                        </button>

                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                            >
                                <Save size={16} />
                                Save Note
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
