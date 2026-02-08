import React, { useState, useEffect } from 'react';
import { useSheetStore } from '../store/useSheetStore';
import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import TopicCard from '../components/Topic/TopicCard';
import AddEditModal from '../components/Modals/AddEditModal';
import { Plus } from 'lucide-react';
import { createPortal } from 'react-dom';
import SubTopicCard from '../components/SubTopic/SubTopicCard';
import QuestionItem from '../components/Question/QuestionItem';
import { SortableWrapper } from '../components/DragAndDrop/SortableWrapper';
import NoteModal from '../components/Modals/NoteModal';

const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: '0.4',
            },
        },
    }),
};

export default function SheetPage() {
    const { topics, loadInitialData, reorderTopics, reorderSubTopics, reorderQuestions } = useSheetStore();
    const [activeId, setActiveId] = useState(null);
    const [activeItem, setActiveItem] = useState(null);

    // Modal State
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState('topic'); // topic, subTopic, question
    const [modalMode, setModalMode] = useState('add'); // add, edit
    const [modalParentIds, setModalParentIds] = useState({});
    const [modalInitialData, setModalInitialData] = useState(null);

    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Require 8px movement before drag starts (prevents accidental drags)
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleOpenModal = (type, mode, parentIds = {}, initialData = null) => {
        setModalType(type);
        setModalMode(mode);
        setModalParentIds(parentIds);
        setModalInitialData(initialData);
        setModalOpen(true);
    };

    // --- Drag & Drop Handlers ---

    const findItemType = (id) => {
        // 1. Check Topic
        if (topics.find(t => t.id === id)) return 'topic';

        // 2. Check SubTopic
        for (const topic of topics) {
            if (topic.subTopics.find(s => s.id === id)) return 'subTopic';
        }

        // 3. Check Question
        for (const topic of topics) {
            for (const sub of topic.subTopics) {
                if (sub.questions.find(q => q.id === id)) return 'question';
            }
        }
        return null;
    };

    const findContainer = (id, type) => {
        if (type === 'topic') return 'root';
        if (type === 'subTopic') {
            return topics.find(t => t.subTopics.find(s => s.id === id))?.id;
        }
        if (type === 'question') {
            for (const topic of topics) {
                const sub = topic.subTopics.find(s => s.questions.find(q => q.id === id));
                if (sub) return sub.id;
            }
        }
        return null;
    };

    const handleDragStart = (event) => {
        const { active } = event;
        setActiveId(active.id);

        // Find active item data for overlay
        const type = findItemType(active.id);
        let item = null;
        if (type === 'topic') item = topics.find(t => t.id === active.id);
        else if (type === 'subTopic') {
            for (const t of topics) {
                const s = t.subTopics.find(s => s.id === active.id);
                if (s) { item = s; break; }
            }
        } else if (type === 'question') {
            for (const t of topics) {
                for (const s of t.subTopics) {
                    const q = s.questions.find(q => q.id === active.id);
                    if (q) { item = q; break; }
                }
            }
        }
        setActiveItem(item);
    };

    const handleDragOver = (event) => {
        // This is mainly for moving items between containers (SubTopics -> Topics, Questions -> SubTopics)
        // Complex nested dnd logic would go here.
        // For this assignment, we primarily support reordering WITHIN the same list or compatible lists.
        const { active, over } = event;
        if (!over) return;
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveId(null);
        setActiveItem(null);

        if (!over) return;

        const activeType = findItemType(active.id);
        const overType = findItemType(over.id);

        if (active.id !== over.id) {
            if (activeType === 'topic' && overType === 'topic') {
                reorderTopics(active.id, over.id);
            } else if (activeType === 'subTopic' && overType === 'subTopic') {
                // Find parent topics
                const activeTopic = topics.find(t => t.subTopics.find(s => s.id === active.id));
                const overTopic = topics.find(t => t.subTopics.find(s => s.id === over.id));

                if (activeTopic && overTopic && activeTopic.id === overTopic.id) {
                    reorderSubTopics(activeTopic.id, active.id, over.id);
                }
            } else if (activeType === 'question' && overType === 'question') {
                // Find parent subtopics
                let activeSubId, activeTopicId;
                let overSubId, overTopicId;

                for (const t of topics) {
                    for (const s of t.subTopics) {
                        if (s.questions.find(q => q.id === active.id)) {
                            activeSubId = s.id;
                            activeTopicId = t.id;
                        }
                        if (s.questions.find(q => q.id === over.id)) {
                            overSubId = s.id;
                            overTopicId = t.id;
                        }
                    }
                }

                if (activeSubId === overSubId) {
                    reorderQuestions(activeTopicId, activeSubId, active.id, over.id);
                }
            }
        }
    };

    // Note Modal State
    const [noteModalOpen, setNoteModalOpen] = useState(false);
    const [currentNoteData, setCurrentNoteData] = useState({ topicId: null, subTopicId: null, questionId: null, initialNote: '' });

    // Note Actions from store
    const { saveNote, deleteNote } = useSheetStore();

    const handleOpenNoteModal = (topicId, subTopicId, questionId, initialNote) => {
        setCurrentNoteData({ topicId, subTopicId, questionId, initialNote });
        setNoteModalOpen(true);
    };

    const handleSaveNote = (note) => {
        const { topicId, subTopicId, questionId } = currentNoteData;
        saveNote(topicId, subTopicId, questionId, note);
    };

    const handleDeleteNote = () => {
        const { topicId, subTopicId, questionId } = currentNoteData;
        deleteNote(topicId, subTopicId, questionId);
    };

    // Bookmarks Filter
    const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

    // Calculate Progress
    const { totalQuestions, completedQuestions } = topics.reduce(
        (acc, topic) => {
            topic.subTopics.forEach((sub) => {
                sub.questions.forEach((q) => {
                    acc.totalQuestions++;
                    if (q.isCompleted) acc.completedQuestions++;
                });
            });
            return acc;
        },
        { totalQuestions: 0, completedQuestions: 0 }
    );

    const progressPercentage = totalQuestions === 0 ? 0 : Math.round((completedQuestions / totalQuestions) * 100);
    const circumference = 2 * Math.PI * 40; // radius 40
    const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

    return (
        <div className="min-h-screen bg-[#F0F8FF] dark:bg-slate-950 text-foreground p-4 md:p-8 font-sans transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
                {/* Branding & Progress Header */}
                <header className="mb-8 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-border/40 p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-orange-100 dark:bg-orange-900/20 p-2.5 rounded-xl border border-orange-200 dark:border-orange-800/30">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-orange-500"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><path d="M12 13v6" /><path d="M9 16h6" /></svg>
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
                                    Curated Codolio <span className="text-orange-500">Interactive Sheet</span>
                                </h1>
                                <p className="text-sm text-muted-foreground font-medium">
                                    Excel in your Competitive Journey
                                </p>
                            </div>
                        </div>
                        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl italic">
                            "Consistency is the key of success, so be consistent. Success has no shortcut but smart work."
                            <span className="block mt-2 not-italic">
                                This interactive sheet is designed to help you track your progress, revise important concepts with bookmarks, and master Data Structures & Algorithms efficiently with Codolio's premium tracking features.
                            </span>
                        </p>

                        <div className="mt-6 flex flex-wrap gap-4 items-center">
                            <button
                                onClick={() => handleOpenModal('topic', 'add')}
                                className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-slate-200 dark:shadow-none active:scale-95 font-semibold text-sm"
                            >
                                <Plus size={18} />
                                New Topic
                            </button>

                            <label className="flex items-center gap-2 cursor-pointer bg-slate-100 dark:bg-slate-800 px-4 py-2.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors select-none">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 border-gray-300"
                                    checked={showBookmarksOnly}
                                    onChange={(e) => setShowBookmarksOnly(e.target.checked)}
                                />
                                <span className="text-sm font-medium">Bookmarks Only</span>
                            </label>
                        </div>
                    </div>

                    {/* Progress Circle */}
                    <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div className="relative w-32 h-32 flex items-center justify-center">
                            {/* Background Circle */}
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="40"
                                    stroke="currentColor"
                                    strokeWidth="10"
                                    fill="transparent"
                                    className="text-slate-200 dark:text-slate-700"
                                />
                                {/* Progress Circle */}
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="40"
                                    stroke="currentColor"
                                    strokeWidth="10"
                                    fill="transparent"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={strokeDashoffset}
                                    strokeLinecap="round"
                                    className="text-orange-500 transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                                <span className="text-3xl font-bold text-slate-800 dark:text-white">
                                    {completedQuestions}
                                </span>
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    / {totalQuestions}
                                </span>
                            </div>
                        </div>
                        <span className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-400">Progress</span>
                    </div>
                </header>

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={topics.map(t => t.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {topics.length === 0 ? (
                            <div className="text-center py-20 bg-card border border-dashed border-border rounded-2xl mx-4">
                                <p className="text-xl text-muted-foreground">No topics found.</p>
                                <button
                                    onClick={() => handleOpenModal('topic', 'add')}
                                    className="mt-4 text-primary font-medium hover:underline"
                                >
                                    Start your journey by creating a topic
                                </button>
                            </div>
                        ) : (
                            topics.map((topic) => (
                                <SortableWrapper key={topic.id} id={topic.id}>
                                    <TopicCard
                                        topic={topic}
                                        onOpenModal={handleOpenModal}
                                        onOpenNoteModal={handleOpenNoteModal}
                                        showBookmarksOnly={showBookmarksOnly}
                                    />
                                </SortableWrapper>
                            ))
                        )}
                    </SortableContext>

                    {createPortal(
                        <DragOverlay dropAnimation={dropAnimation}>
                            {activeItem && (
                                <div className="opacity-90 rotate-2 cursor-grabbing scale-105">
                                    {findItemType(activeId) === 'topic' && (
                                        <div className="bg-card p-4 rounded-xl border border-primary shadow-2xl">
                                            <h2 className="text-lg font-bold">{activeItem.title}</h2>
                                        </div>
                                    )}
                                    {findItemType(activeId) === 'subTopic' && (
                                        <div className="bg-card p-3 rounded-lg border border-primary shadow-2xl">
                                            <h3 className="font-semibold">{activeItem.title}</h3>
                                        </div>
                                    )}
                                    {findItemType(activeId) === 'question' && (
                                        <div className="bg-card p-3 rounded-md border border-primary shadow-2xl flex items-center gap-2">
                                            <span className="font-medium">{activeItem.title}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </DragOverlay>,
                        document.body
                    )}
                </DndContext>
            </div>

            {/* Modals */}
            <AddEditModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setModalInitialData(null); }}
                type={modalType}
                mode={modalMode}
                parentIds={modalParentIds}
                initialData={modalInitialData}
            />

            <NoteModal
                isOpen={noteModalOpen}
                onClose={() => setNoteModalOpen(false)}
                onSave={handleSaveNote}
                onDelete={handleDeleteNote}
                initialNote={currentNoteData.initialNote}
            />

            {/* Footer */}
            <footer className="mt-12 py-8 border-t border-border/40 bg-white dark:bg-slate-900">
                <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="bg-orange-100 dark:bg-orange-900/20 p-1.5 rounded-lg border border-orange-200 dark:border-orange-800/30">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-orange-500"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><path d="M12 13v6" /><path d="M9 16h6" /></svg>
                        </div>
                        <span className="font-bold text-slate-700 dark:text-slate-200">Codolio</span>
                    </div>

                    <div className="text-sm text-slate-500 dark:text-slate-400">
                        &copy; {new Date().getFullYear()} Codolio. All rights reserved.
                    </div>

                    <div className="flex gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
                        <a href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-orange-500 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-orange-500 transition-colors">Contact Us</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
