import React from "react";
import { useSheetStore } from "../../store/useSheetStore";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableWrapper } from "../DragAndDrop/SortableWrapper";
import { GripVertical, Pencil, Trash2, Plus } from "lucide-react";
import QuestionItem from "../Question/QuestionItem";

export default function SubTopicCard({ topicId, subTopic, onOpenModal, onOpenNoteModal, dragHandleProps, showBookmarksOnly }) {
    const { deleteSubTopic, deleteQuestion, toggleBookmark, toggleComplete } = useSheetStore();

    const filteredQuestions = showBookmarksOnly
        ? subTopic.questions.filter(q => q.bookmarked)
        : subTopic.questions;

    return (
        <div className="mb-4 bg-card/50 rounded-lg border border-border/60 overflow-hidden">
            {/* SubTopic Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between p-3 bg-muted/30 border-b border-border/50 group gap-2 md:gap-0">
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div
                        {...dragHandleProps}
                        className="cursor-move text-muted-foreground/50 hover:text-foreground transition-colors"
                    >
                        <GripVertical size={18} />
                    </div>
                    <h3 className="font-semibold text-sm text-foreground truncate flex-1 md:flex-none">{subTopic.title}</h3>
                    <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded ml-2 shrink-0">
                        {filteredQuestions.length} / {subTopic.questions.length}
                    </span>
                </div>

                <div className="flex items-center justify-end gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity w-full md:w-auto">
                    <button
                        onClick={() => onOpenModal('question', 'add', { topicId, subTopicId: subTopic.id })}
                        className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md"
                        title="Add Question"
                    >
                        <Plus size={16} />
                    </button>
                    <button
                        onClick={() => onOpenModal('subTopic', 'edit', { topicId }, subTopic)}
                        className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md"
                        title="Edit SubTopic"
                    >
                        <Pencil size={15} />
                    </button>
                    <button
                        onClick={() => deleteSubTopic(topicId, subTopic.id)}
                        className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md"
                        title="Delete SubTopic"
                    >
                        <Trash2 size={15} />
                    </button>
                </div>
            </div>

            {/* Questions List */}
            <div className="p-2 min-h-[50px]">
                <SortableContext
                    items={filteredQuestions.map(q => q.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {filteredQuestions.length === 0 ? (
                        <div className="text-center py-4 text-xs text-muted-foreground border-2 border-dashed border-border/50 rounded-md">
                            {showBookmarksOnly ? "No bookmarked questions." : "No questions yet."}
                        </div>
                    ) : (
                        filteredQuestions.map((question) => (
                            <SortableWrapper key={question.id} id={question.id}>
                                <QuestionItem
                                    question={question}
                                    onEdit={() => onOpenModal('question', 'edit', { topicId, subTopicId: subTopic.id }, question)}
                                    onDelete={() => deleteQuestion(topicId, subTopic.id, question.id)}

                                    // V2 Actions
                                    onToggleBookmark={() => toggleBookmark(topicId, subTopic.id, question.id)}
                                    onEditNote={() => onOpenNoteModal(topicId, subTopic.id, question.id, question.note)}
                                    onToggleComplete={() => toggleComplete(topicId, subTopic.id, question.id)}
                                />
                            </SortableWrapper>
                        ))
                    )}
                </SortableContext>
            </div>
        </div>
    );
}
