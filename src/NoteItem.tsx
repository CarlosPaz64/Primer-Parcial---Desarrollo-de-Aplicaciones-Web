// NoteItem.tsx
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

interface NoteProps {
  note: {
    id: string;
    content: string;
  };
  index: number;
}

const NoteItem: React.FC<NoteProps> = ({ note, index }) => {
  return (
    <Draggable draggableId={note.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            userSelect: 'none',
            padding: '8px',
            margin: '0 0 8px 0',
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '3px',
            ...provided.draggableProps.style,
          }}
        >
          {note.content}
        </div>
      )}
    </Draggable>
  );
};

export default NoteItem;