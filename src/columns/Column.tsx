import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Note } from '../context-reducer/KanbanContext';
import CollapsedNotes from './CollapsedNotes';
import ExpandedNotes from './ExpandedNotes';
import Tooltip from '@mui/material/Tooltip';

interface ColumnProps {
  column: {
    id: string;
    title: string;
    notes: Note[];
  };
  index: number;
  expanded: boolean;
  onToggleExpand: () => void;
  onDeleteNote: (noteId: string, columnId: string) => void;
  onEditNote: (note: Note) => void;
  onDeleteColumn: (columnId: string) => void;
  hoveredColumnId: string | null; // Nuevo prop para manejar el hover
  setHoveredColumnId: (columnId: string | null) => void; // Nuevo prop para cambiar el hover
}

const Column: React.FC<ColumnProps> = ({
  column,
  expanded,
  onToggleExpand,
  onDeleteNote,
  onEditNote,
  onDeleteColumn,
  hoveredColumnId,
  setHoveredColumnId
}) => {
  return (
    <div
      style={{ position: 'relative', zIndex: 0, marginBottom: '20px' }}
      onMouseEnter={() => setHoveredColumnId(column.id)} // Cambia el hover al entrar
      onMouseLeave={() => setHoveredColumnId(null)} // Elimina el hover al salir
    >
      <Droppable droppableId={column.id} type="note">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{
              minHeight: '150px',
              padding: '10px',
              position: 'relative',
              zIndex: 0,
              background: 'transparent',
              borderRadius: '8px',
              margin: '0 15px',
              boxSizing: 'border-box',
            }}
          >
            {/* Mostrar el botón de eliminar solo si esta columna está en hover */}
            {hoveredColumnId === column.id && (
              <div
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  zIndex: 10,
                }}
              >
                <Tooltip title="Eliminar espacio">
                  <button
                    onClick={() => onDeleteColumn(column.id)}
                    style={{
                      background: '#FF7878',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '50%',
                      padding: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </Tooltip>
              </div>
            )}

            {/* Contenido de las notas */}
            {!expanded ? (
              <CollapsedNotes
                column={column}
                onExpand={onToggleExpand}
                onEditNote={onEditNote}
                onDeleteNote={onDeleteNote}
              />
            ) : (
              <ExpandedNotes
                column={column}
                onCollapse={onToggleExpand}
                onEditNote={onEditNote}
                onDeleteNote={onDeleteNote}
              />
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;