// Column.tsx
import React, { useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Note } from '../context-reducer/KanbanContext';
import NoteCard from '../draggable/NoteCard';

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
  const [expanded, setExpanded] = useState(false);

  // Limita la visualización de las notas a un máximo de 5
  const displayedNotes = expanded ? column.notes : column.notes.slice(0, 5);

  return (
    <div style={{ position: 'relative', zIndex: 0, marginBottom: '20px', cursor: 'pointer' }}>
      <Droppable droppableId={column.id} type="note">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{
              minHeight: '50px',
              padding: '0',
              position: 'relative',
              zIndex: 0,
              overflow: 'visible',
              background: 'transparent', // Fondo transparente
            }}
          >
            {displayedNotes.map((note, noteIndex) => (
              <div
                key={note.id}
                style={{
                  position: 'relative',
                  top: `${noteIndex * 5}px`, // Simula superposición con pequeños desplazamientos
                  left: `${noteIndex * 2}px`,
                  zIndex: 5 - noteIndex,
                }}
                onClick={() => setExpanded(!expanded)} // Expande o colapsa la vista de las notas al hacer clic
              >
                <NoteCard
                  note={note}
                  index={noteIndex}
                  onEditNote={onEditNote}
                  onDeleteNote={onDeleteNote}
                  columnId={column.id}
                />
              </div>
            ))}
            {provided.placeholder}

            {/* Título de la columna y botón de eliminar */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '20px',
                padding: '0 10px',
              }}
            >
              <h3 style={{ fontWeight: '500' }}>{column.title}</h3>
            </div>
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;