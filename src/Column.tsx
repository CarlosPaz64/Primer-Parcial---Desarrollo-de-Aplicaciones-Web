// Column.tsx
import React, { useContext, useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { KanbanContext } from './KanbanContext';

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

  // Estado para manejar el contenido específico de cada nota
  const [editNoteContent, setEditNoteContent] = useState<Record<string, string>>({});

  // Función para manejar el cambio de contenido de cada nota
  const handleChangeNoteContent = (noteId: string, content: string) => {
    setEditNoteContent((prev) => ({
      ...prev,
      [noteId]: content, // Actualiza solo el contenido de la nota específica
    }));
  };

  const handleEditNote = (noteId: string) => {
    const note = column.notes.find((note) => note.id === noteId);
    if (!note) return;

    const updatedNote = { ...note, content: editNoteContent[noteId] || note.content };

    dispatch({ type: 'EDIT_NOTE', columnId: column.id, noteId, updatedNote });
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
            style={{ minHeight: '50px', padding: '10px', background: '#e0e0e0' }}
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
                      ...provided.draggableProps.style,
                    }}
                  >
                    <input
                      type="text"
                      value={editNoteContent[note.id] ?? note.content} // Accede al estado específico del input o al valor inicial
                      onChange={(e) => handleChangeNoteContent(note.id, e.target.value)}
                      onBlur={() => handleEditNote(note.id)} // Guarda los cambios al perder el foco
                      placeholder="Edit note content"
                    />
                    <button onClick={() => handleDeleteNote(note.id)}>Delete</button>
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