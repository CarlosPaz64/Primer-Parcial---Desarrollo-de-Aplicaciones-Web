// NoteCard.tsx
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Note } from '../context-reducer/KanbanContext';

interface NoteCardProps {
  note: Note;
  index: number;
  onEditNote: (note: Note) => void;
  onDeleteNote: (noteId: string, columnId: string) => void;
  columnId: string; // Para identificar en qué columna o zona está la nota
}

const NoteCard: React.FC<NoteCardProps> = ({ note, index, onEditNote, onDeleteNote, columnId }) => {
  return (
    <Draggable key={note.id} draggableId={note.id} index={index}>
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
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            ...provided.draggableProps.style,
          }}
        >
          <div
            dangerouslySetInnerHTML={{ __html: note.content }}
            style={{ marginBottom: '10px' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              onClick={() => onEditNote(note)}
              style={{
                background: 'turquoise',
                color: '#fff',
                border: 'none',
                borderRadius: '3px',
                padding: '5px',
                cursor: 'pointer',
              }}
            >
              Edit Note
            </button>
            <button
              onClick={() => onDeleteNote(note.id, columnId)}
              style={{
                background: '#e74c3c',
                color: '#fff',
                border: 'none',
                borderRadius: '3px',
                padding: '5px',
                cursor: 'pointer',
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default NoteCard;