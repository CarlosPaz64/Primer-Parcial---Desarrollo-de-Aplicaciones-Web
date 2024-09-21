// Kanban.tsx
import React, { useContext, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { KanbanContext } from './KanbanContext';
import Column from './column';
import { v4 as uuidv4 } from 'uuid';

const Kanban: React.FC = () => {
  const { state, dispatch } = useContext(KanbanContext);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [columnTitleEdit, setColumnTitleEdit] = useState('');

  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;

    if (!destination) return;

    if (type === 'column') {
      dispatch({ type: 'MOVE_COLUMN', sourceIndex: source.index, destIndex: destination.index });
    } else {
      dispatch({
        type: 'MOVE_NOTE',
        sourceId: source.droppableId,
        destId: destination.droppableId,
        sourceIndex: source.index,
        destIndex: destination.index,
      });
    }
  };

  const handleAddNote = (columnId: string) => {
    const newNote = {
      id: uuidv4(),
      author: 'Author', // Puedes agregar un input para el autor
      category: 'General', // Puedes agregar un input para la categoría
      content: newNoteContent,
    };
    dispatch({ type: 'ADD_NOTE', columnId, note: newNote });
    setNewNoteContent(''); // Limpiar el campo de texto
  };

  const handleChangeTitle = (columnId: string) => {
    dispatch({ type: 'CHANGE_COLUMN_TITLE', columnId, newTitle: columnTitleEdit });
    setColumnTitleEdit(''); // Limpiar el campo de edición de título
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="all-columns" direction="horizontal" type="column">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} style={{ display: 'flex' }}>
            {state.columns.map((column, index) => (
              <Draggable key={column.id} draggableId={column.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      margin: '8px',
                      minWidth: '200px',
                      backgroundColor: '#f0f0f0',
                      borderRadius: '5px',
                      padding: '10px',
                      ...provided.draggableProps.style,
                    }}
                  >
                    <input
                      type="text"
                      value={columnTitleEdit || column.title}
                      onChange={(e) => setColumnTitleEdit(e.target.value)}
                      onBlur={() => handleChangeTitle(column.id)}
                      placeholder="Edit title"
                    />
                    <Column column={column} index={index} />
                    <input
                      type="text"
                      value={newNoteContent}
                      onChange={(e) => setNewNoteContent(e.target.value)}
                      placeholder="Add new note"
                    />
                    <button onClick={() => handleAddNote(column.id)}>Add Note</button>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Kanban;
