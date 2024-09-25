// Column.tsx
import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Note } from '../context-reducer/KanbanContext';
import NoteCard from '../draggable/NoteCard'; // Importa el componente NoteCard

interface ColumnProps {
  column: {
    id: string;
    title: string;
    notes: Note[];
  };
  index: number;
  onDeleteNote: (noteId: string, columnId: string) => void;
  onEditNote: (note: Note) => void;
}

const Column: React.FC<ColumnProps> = ({ column, onDeleteNote, onEditNote }) => {
  return (
    <div>
      <h3 style={{ textAlign: 'center' }}>{column.title}</h3>
      <Droppable droppableId={column.id} type="note">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{
              minHeight: '50px',
              padding: '10px',
              background: '#e0e0e0',
              borderRadius: '5px',
              boxSizing: 'border-box',
            }}
          >
            {column.notes.map((note, noteIndex) => (
              <NoteCard
                key={note.id}
                note={note}
                index={noteIndex}
                onEditNote={onEditNote}
                onDeleteNote={onDeleteNote}
                columnId={column.id} // Pasa el ID de la columna al NoteCard
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;