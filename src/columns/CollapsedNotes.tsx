// CollapsedNotes.tsx
import React from 'react';
import { Note } from '../context-reducer/KanbanContext';
import NoteCard from '../draggable/NoteCard';

interface CollapsedNotesProps {
  column: {
    id: string;
    notes: Note[];
  };
  onExpand: () => void;
  onDeleteNote: (noteId: string, columnId: string) => void;
  onEditNote: (note: Note) => void;
}

const CollapsedNotes: React.FC<CollapsedNotesProps> = ({
  column,
  onExpand,
  onEditNote,
  onDeleteNote,
}) => {
  const displayedNotes = column.notes.slice(0, 5); // Mostrar hasta 5 notas

  return (
    <div
      onClick={onExpand}
      style={{
        cursor: 'pointer',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100px',
      }}
    >
      {displayedNotes.map((note, noteIndex) => (
        <div
          key={note.id}
          style={{
            position: 'absolute',
            marginTop: noteIndex === 0 ? 0 : '-20px',
            zIndex: 5 - noteIndex,
            transform: `translate(${noteIndex * 2}px, ${noteIndex * 5}px)`,
            transition: 'transform 0.3s',
          }}
        >
          <NoteCard
            note={note}
            index={noteIndex}
            onEditNote={onEditNote}
            onDeleteNote={onDeleteNote}
            columnId={column.id}
            isDraggable={false}
            isEditable={false}
          />
        </div>
      ))}
    </div>
  );
};

export default CollapsedNotes;