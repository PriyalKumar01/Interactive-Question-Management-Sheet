import { create } from 'zustand';
import { sampleTopics } from '../data/sampleData';
import { persist } from 'zustand/middleware';
import { arrayMove } from '@dnd-kit/sortable';
import { v4 as uuidv4 } from 'uuid'; // We might need uuid, or custom ID generator. Let's use simple random string for now to avoid extra dependency if not installed, but uuid is standard. I'll use a simple helper.

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useSheetStore = create(
    persist(
        (set) => ({
            topics: [],

            // --- Actions ---

            loadInitialData: () => set({ topics: sampleTopics }),

            // Topics
            addTopic: (title) => set((state) => ({
                topics: [...state.topics, { id: generateId(), title, subTopics: [] }]
            })),
            editTopic: (id, title) => set((state) => ({
                topics: state.topics.map((t) => (t.id === id ? { ...t, title } : t))
            })),
            deleteTopic: (id) => set((state) => ({
                topics: state.topics.filter((t) => t.id !== id)
            })),
            reorderTopics: (activeId, overId) => set((state) => {
                const oldIndex = state.topics.findIndex((t) => t.id === activeId);
                const newIndex = state.topics.findIndex((t) => t.id === overId);
                return { topics: arrayMove(state.topics, oldIndex, newIndex) };
            }),

            // SubTopics
            addSubTopic: (topicId, title) => set((state) => ({
                topics: state.topics.map((t) =>
                    t.id === topicId
                        ? { ...t, subTopics: [...t.subTopics, { id: generateId(), title, questions: [] }] }
                        : t
                )
            })),
            editSubTopic: (topicId, subTopicId, title) => set((state) => ({
                topics: state.topics.map((t) =>
                    t.id === topicId
                        ? { ...t, subTopics: t.subTopics.map((s) => s.id === subTopicId ? { ...s, title } : s) }
                        : t
                )
            })),
            deleteSubTopic: (topicId, subTopicId) => set((state) => ({
                topics: state.topics.map((t) =>
                    t.id === topicId
                        ? { ...t, subTopics: t.subTopics.filter((s) => s.id !== subTopicId) }
                        : t
                )
            })),
            reorderSubTopics: (topicId, activeId, overId) => set((state) => ({
                topics: state.topics.map((t) => {
                    if (t.id !== topicId) return t;
                    const oldIndex = t.subTopics.findIndex((s) => s.id === activeId);
                    const newIndex = t.subTopics.findIndex((s) => s.id === overId);
                    return { ...t, subTopics: arrayMove(t.subTopics, oldIndex, newIndex) };
                })
            })),

            // Questions
            addQuestion: (topicId, subTopicId, questionData) => set((state) => ({
                topics: state.topics.map((t) =>
                    t.id === topicId
                        ? {
                            ...t,
                            subTopics: t.subTopics.map((s) =>
                                s.id === subTopicId
                                    ? { ...s, questions: [...s.questions, { id: generateId(), bookmarked: false, note: null, ...questionData }] }
                                    : s
                            )
                        }
                        : t
                )
            })),
            editQuestion: (topicId, subTopicId, questionId, questionData) => set((state) => ({
                topics: state.topics.map((t) =>
                    t.id === topicId
                        ? {
                            ...t,
                            subTopics: t.subTopics.map((s) =>
                                s.id === subTopicId
                                    ? {
                                        ...s,
                                        questions: s.questions.map((q) => q.id === questionId ? { ...q, ...questionData } : q)
                                    }
                                    : s
                            )
                        }
                        : t
                )
            })),
            deleteQuestion: (topicId, subTopicId, questionId) => set((state) => ({
                topics: state.topics.map((t) =>
                    t.id === topicId
                        ? {
                            ...t,
                            subTopics: t.subTopics.map((s) =>
                                s.id === subTopicId
                                    ? { ...s, questions: s.questions.filter((q) => q.id !== questionId) }
                                    : s
                            )
                        }
                        : t
                )
            })),
            reorderQuestions: (topicId, subTopicId, activeId, overId) => set((state) => ({
                topics: state.topics.map((t) => {
                    if (t.id !== topicId) return t;
                    return {
                        ...t,
                        subTopics: t.subTopics.map((s) => {
                            if (s.id !== subTopicId) return s;
                            const oldIndex = s.questions.findIndex((q) => q.id === activeId);
                            const newIndex = s.questions.findIndex((q) => q.id === overId);
                            return { ...s, questions: arrayMove(s.questions, oldIndex, newIndex) };
                        })
                    };
                })
            })),

            // --- V2 Actions ---
            toggleBookmark: (topicId, subTopicId, questionId) => set((state) => ({
                topics: state.topics.map((t) =>
                    t.id === topicId ? {
                        ...t,
                        subTopics: t.subTopics.map((s) =>
                            s.id === subTopicId ? {
                                ...s,
                                questions: s.questions.map((q) =>
                                    q.id === questionId ? { ...q, bookmarked: !q.bookmarked } : q
                                )
                            } : s
                        )
                    } : t
                )
            })),
            saveNote: (topicId, subTopicId, questionId, note) => set((state) => ({
                topics: state.topics.map((t) =>
                    t.id === topicId ? {
                        ...t,
                        subTopics: t.subTopics.map((s) =>
                            s.id === subTopicId ? {
                                ...s,
                                questions: s.questions.map((q) =>
                                    q.id === questionId ? { ...q, note: note } : q
                                )
                            } : s
                        )
                    } : t
                )
            })),
            deleteNote: (topicId, subTopicId, questionId) => set((state) => ({
                topics: state.topics.map((t) =>
                    t.id === topicId ? {
                        ...t,
                        subTopics: t.subTopics.map((s) =>
                            s.id === subTopicId ? {
                                ...s,
                                questions: s.questions.map((q) =>
                                    q.id === questionId ? { ...q, note: null } : q
                                )
                            } : s
                        )
                    } : t
                )
            })),
            toggleComplete: (topicId, subTopicId, questionId) => set((state) => ({
                topics: state.topics.map((t) =>
                    t.id === topicId ? {
                        ...t,
                        subTopics: t.subTopics.map((s) =>
                            s.id === subTopicId ? {
                                ...s,
                                questions: s.questions.map((q) =>
                                    q.id === questionId ? { ...q, isCompleted: !q.isCompleted } : q
                                )
                            } : s
                        )
                    } : t
                )
            })),
        }),
        {
            name: 'sheet-storage',
            getStorage: () => localStorage,
        }
    )
);
