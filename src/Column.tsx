// Column.tsx
import React, { useContext } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { KanbanContext } from './KanbanContext';
import EditableNoteInput from './EditableNoteInput'; // Asegúrate de que la ruta sea correcta

interface Note {
  id: string;
  author: string;
  category: string;
  content: string;
}

interface ColumnProps {
  column: {
    id: string;
    title: string;
    notes: Note[];
  };
  index: number;
}

const Column: React.FC<ColumnProps> = ({ column }) => {
  const { dispatch } = useContext(KanbanContext);

  const handleEditNote = (noteId: string, newContent: string) => {
    const note = column.notes.find((note) => note.id === noteId);
    if (!note) return;

    const updatedNote = { ...note, content: newContent };

    dispatch({
      type: 'EDIT_NOTE',
      columnId: column.id,
      noteId,
      updatedNote,
    });
  };

  const handleDeleteNote = (noteId: string) => {
    dispatch({ type: 'DELETE_NOTE', columnId: column.id, noteId });
  };

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
            {column.notes.map((note, index) => (
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
                    <EditableNoteInput
                      initialValue={note.content}
                      onConfirm={(newContent) => handleEditNote(note.id, newContent)}
                      placeholder="Edit note content"
                    />
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      style={{
                        alignSelf: 'flex-end',
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