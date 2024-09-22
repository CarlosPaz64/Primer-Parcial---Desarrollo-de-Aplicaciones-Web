// Kanban.tsx
import React, { useContext, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { KanbanContext } from './KanbanContext';
import Column from './Column';
import EditableInput from './EditableInput';
import AddColumn from './AddColumn'; // Importa el nuevo módulo para añadir columnas
import { v4 as uuidv4 } from 'uuid';

const Kanban: React.FC = () => {
  const { state, dispatch } = useContext(KanbanContext);
  const [looseNoteContent, setLooseNoteContent] = useState('');

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

  const handleAddLooseNote = () => {
    const newNote = {
      id: uuidv4(),
      author: 'Author',
      category: 'General',
      content: looseNoteContent,
    };

    dispatch({ type: 'ADD_LOOSE_NOTE', note: newNote });
    setLooseNoteContent('');
  };

  const handleChangeTitle = (columnId: string, newTitle: string) => {
    dispatch({ type: 'CHANGE_COLUMN_TITLE', columnId, newTitle });
  };

  return (
    <div>
      <AddColumn /> {/* Agrega el componente para crear nuevas columnas */}
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
                      <EditableInput
                        initialValue={column.title}
                        onConfirm={(newTitle) => handleChangeTitle(column.id, newTitle)}
                        placeholder="Edit title"
                      />
                      <Column column={column} index={index} />
                      <button onClick={() => dispatch({ type: 'DELETE_COLUMN', columnId: column.id })}>
                        Delete Column
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {/* Zona de Notas Sueltas */}
        <div style={{ marginTop: '20px' }}>
          <h3>Loose Notes</h3>
          <input
            type="text"
            value={looseNoteContent}
            onChange={(e) => setLooseNoteContent(e.target.value)}
            placeholder="Add new loose note"
          />
          <button onClick={handleAddLooseNote}>Add Loose Note</button>

          <Droppable droppableId="looseNotes" type="note">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{ display: 'flex', flexWrap: 'wrap', padding: '10px', minHeight: '100px', background: '#f4f4f4' }}
              >
                {state.looseNotes.map((note, index) => (
                  <Draggable key={note.id} draggableId={note.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          userSelect: 'none',
                          padding: '8px',
                          margin: '4px',
                          backgroundColor: '#fff',
                          border: '1px solid #ccc',
                          borderRadius: '3px',
                          ...provided.draggableProps.style,
                        }}
                      >
                        {note.content}
                        <button onClick={() => dispatch({ type: 'DELETE_NOTE', columnId: 'looseNotes', noteId: note.id })}>
                          Delete Note
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
      </DragDropContext>
    </div>
  );
};

export default Kanban;