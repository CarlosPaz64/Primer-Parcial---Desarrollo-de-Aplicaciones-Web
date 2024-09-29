import React, { useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Note } from '../context-reducer/KanbanContext';
import CollapsedNotes from './CollapsedNotes'; // Importa correctamente
import ExpandedNotes from './ExpandedNotes'; // Importa correctamente

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

  return (
    <div style={{ position: 'relative', zIndex: 0, marginBottom: '20px' }}>
      <Droppable droppableId={column.id} type="note">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{
              minHeight: '150px', // Aumentamos el espacio mínimo para evitar colisiones
              padding: '10px',
              position: 'relative',
              zIndex: 0,
              background: 'transparent',
              borderRadius: '8px',
              border: '1px solid #ddd', // Opcional: para que sea más claro el contorno
              margin: '0 15px',
              boxSizing: 'border-box',
            }}
          >
            {!expanded ? (
              <CollapsedNotes
                column={column}
                onExpand={() => setExpanded(true)}
                onEditNote={onEditNote}
                onDeleteNote={onDeleteNote}
              />
            ) : (
              <ExpandedNotes
                column={column}
                onCollapse={() => setExpanded(false)}
                onEditNote={onEditNote}
                onDeleteNote={onDeleteNote}
              />
            )}

            {provided.placeholder}

            {/* Título de la columna */}
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
