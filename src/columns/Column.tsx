// Column.tsx
import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Note } from '../context-reducer/KanbanContext';

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
              <Draggable key={note.id} draggableId={note.id} index={noteIndex}>
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
                        onClick={() => onDeleteNote(note.id, column.id)}
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
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;