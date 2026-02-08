import React from "react";
import { GripVertical, ExternalLink, Pencil, Trash2, Star, StickyNote } from "lucide-react";
import { cn } from "../../utils/helpers";

const difficultyColors = {
    Easy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    Medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    Hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const platformColors = {
    LeetCode: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500",
    CodingNinjas: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-500",
    GeeksforGeeks: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-500",
    Other: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
};

export default function QuestionItem({ question, onEdit, onDelete, onToggleBookmark, onEditNote, onToggleComplete, dragHandleProps }) {
    return (
        <div className={cn(
            "group flex flex-col md:flex-row md:items-center justify-between p-3 bg-card hover:bg-accent/50 rounded-md border border-border/50 transition-all mb-2 gap-2 md:gap-0",
            question.isCompleted && "bg-green-50/50 dark:bg-green-900/10 border-green-200/50"
        )}>
            <div className="flex items-center gap-3 overflow-hidden w-full md:w-auto">
                {/* Drag Handle */}
                <div
                    {...dragHandleProps}
                    className="cursor-move text-muted-foreground/50 hover:text-foreground transition-colors shrink-0 p-1"
                >
                    <GripVertical size={18} />
                </div>

                {/* Checkbox */}
                <input
                    type="checkbox"
                    checked={question.isCompleted || false}
                    onChange={onToggleComplete}
                    className="w-4 h-4 rounded border-input text-primary focus:ring-primary shrink-0 cursor-pointer"
                />

                {/* Title & Links */}
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <span className="font-medium text-sm truncate">{question.title}</span>
                    <div className="flex flex-wrap gap-2">
                        {question.links && question.links.length > 0 ? (
                            question.links.map((link, idx) => (
                                <a
                                    key={idx}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cn("text-[10px] px-1.5 py-0.5 rounded-md font-medium hover:opacity-80 transition-opacity flex items-center gap-1", platformColors[link.platform] || platformColors.Other)}
                                >
                                    {link.platform} <ExternalLink size={10} />
                                </a>
                            ))
                        ) : question.link ? (
                            // Fallback for old data
                            <a
                                href={question.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary shrink-0"
                            >
                                <ExternalLink size={14} />
                            </a>
                        ) : null}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 w-full md:w-auto pl-8 md:pl-0 mt-2 md:mt-0">
                {/* Difficulty Badge */}
                <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", difficultyColors[question.difficulty] || difficultyColors.Easy)}>
                    {question.difficulty}
                </span>

                <div className="flex items-center gap-1">
                    {/* Bookmark */}
                    <button
                        onClick={onToggleBookmark}
                        className={cn("p-1.5 rounded-md transition-colors", question.bookmarked ? "text-yellow-500 bg-yellow-100/50" : "text-muted-foreground hover:bg-muted")}
                        title="Bookmark"
                    >
                        <Star size={16} fill={question.bookmarked ? "currentColor" : "none"} />
                    </button>

                    {/* Note */}
                    <button
                        onClick={onEditNote}
                        className={cn("p-1.5 rounded-md transition-colors", question.note ? "text-blue-500 bg-blue-100/50" : "text-muted-foreground hover:bg-muted")}
                        title="Notes"
                    >
                        <StickyNote size={16} fill={question.note ? "currentColor" : "none"} />
                    </button>

                    {/* Divider */}
                    <div className="w-[1px] h-4 bg-border mx-1"></div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={onEdit}
                            className="p-1.5 text-muted-foreground hover:text-primary hover:bg-muted rounded-md"
                        >
                            <Pencil size={14} />
                        </button>
                        <button
                            onClick={onDelete}
                            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
