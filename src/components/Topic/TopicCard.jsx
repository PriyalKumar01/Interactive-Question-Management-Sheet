import React, { useState } from "react";
import { useSheetStore } from "../../store/useSheetStore";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableWrapper } from "../DragAndDrop/SortableWrapper";
import { GripVertical, Pencil, Trash2, Plus, ChevronDown, ChevronRight } from "lucide-react";
import SubTopicCard from "../SubTopic/SubTopicCard";

export default function TopicCard({ topic, onOpenModal, onOpenNoteModal, dragHandleProps, showBookmarksOnly }) {
    const { deleteTopic } = useSheetStore();
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="mb-6 bg-card rounded-lg border border-border/60 shadow-sm overflow-hidden">
            {/* Topic Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-muted/40 border-b border-border/50 group gap-2 md:gap-0">
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div
                        {...dragHandleProps}
                        className="cursor-move text-muted-foreground/50 hover:text-foreground transition-colors p-1"
                    >
                        <GripVertical size={20} />
                    </div>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </button>
                    <h2 className="text-lg font-bold text-foreground truncate flex-1 md:flex-none">{topic.title}</h2>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium ml-2 shrink-0">
                        {topic.subTopics.length}
                    </span>
                </div>

                <div className="flex items-center justify-end gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity w-full md:w-auto">
                    <button
                        onClick={() => onOpenModal('subTopic', 'add', { topicId: topic.id })}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-md hover:bg-primary/20 transition-colors"
                    >
                        <Plus size={14} /> Add SubTopic
                    </button>
                    <div className="w-[1px] h-4 bg-border/50 mx-1"></div>
                    <button
                        onClick={() => onOpenModal('topic', 'edit', {}, topic)}
                        className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md"
                        title="Edit Topic"
                    >
                        <Pencil size={15} />
                    </button>
                    <button
                        onClick={() => deleteTopic(topic.id)}
                        className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md"
                        title="Delete Topic"
                    >
                        <Trash2 size={15} />
                    </button>
                </div>
            </div>

            {/* SubTopics List */}
            {isExpanded && (
                <div className="p-3 md:p-4 bg-card">
                    <SortableContext
                        items={topic.subTopics.map(s => s.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {topic.subTopics.length === 0 ? (
                            <div className="text-center py-6 text-sm text-muted-foreground border-2 border-dashed border-border/50 rounded-lg">
                                No sub-topics yet.
                            </div>
                        ) : (
                            topic.subTopics.map((subTopic) => (
                                <SortableWrapper key={subTopic.id} id={subTopic.id}>
                                    <SubTopicCard
                                        topicId={topic.id}
                                        subTopic={subTopic}
                                        onOpenModal={onOpenModal}
                                        onOpenNoteModal={onOpenNoteModal}
                                        showBookmarksOnly={showBookmarksOnly}
                                    />
                                </SortableWrapper>
                            ))
                        )}
                    </SortableContext>
                </div>
            )}
        </div>
    );
}
