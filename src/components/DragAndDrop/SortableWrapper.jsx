import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function SortableWrapper({ id, children, className }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        touchAction: 'none', // Important for touch devices
    };

    // We expect a single child to wrap and pass props to.
    // If multiple children, wrap them in a fragment or div before passing to SortableWrapper.

    return (
        <div ref={setNodeRef} style={style} className={className}>
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child, {
                        dragHandleProps: { ...attributes, ...listeners }
                    });
                }
                return child;
            })}
        </div>
    );
}
