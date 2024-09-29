// ExpandedNotes.tsx
import React from 'react';
import { Note } from '../context-reducer/KanbanContext';
import NoteCard from '../draggable/NoteCard';
import Tooltip from '@mui/material/Tooltip';


interface ExpandedNotesProps {
  column: {
    id: string;
    notes: Note[];
  };
  onCollapse: () => void;
  onDeleteNote: (noteId: string, columnId: string) => void;
  onEditNote: (note: Note) => void;
}

const ExpandedNotes: React.FC<ExpandedNotesProps> = ({ column, onCollapse, onEditNote, onDeleteNote }) => {
  return (
    <div>
      {column.notes.map((note, noteIndex) => (
        <NoteCard
          key={note.id}
          note={note}
          index={noteIndex}
          onEditNote={onEditNote}
          onDeleteNote={onDeleteNote}
          columnId={column.id}
          isDraggable={true} // Activa el arrastre solo cuando están desplegadas
          isEditable={true}  // Activa la edición solo cuando están desplegadas
        />
      ))}
      <Tooltip title="Acomodar notas">
      <button
        onClick={onCollapse}
        style={{
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          fontSize: '20px',
          marginTop: '10px',
        }}
        aria-label="Colapsar notas"
      >
        ▲
      </button>
      </Tooltip>
    </div>
  );
};

export default ExpandedNotes;