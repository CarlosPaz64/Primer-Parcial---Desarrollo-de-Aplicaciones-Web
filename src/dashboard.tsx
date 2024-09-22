// Kanban.tsx
import React, { useContext, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { KanbanContext } from './KanbanContext';
import Column from './Column';
import EditableInput from './EditableInput';
import AddColumn from './AddColumn';
import { v4 as uuidv4 } from 'uuid';

const Kanban: React.FC = () => {
  const { state, dispatch } = useContext(KanbanContext);
  const [looseNoteContent, setLooseNoteContent] = useState('');
  const [selectedColumn, setSelectedColumn] = useState('');

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

  const handleAddNote = () => {
    if (!selectedColumn) {
      alert('Please select a column context before adding a note.');
      return;
    }

    const newNote = {
      id: uuidv4(),
      author: 'Author',
      category: selectedColumn,
      content: looseNoteContent,
    };

    const column = state.columns.find((col) => col.title === selectedColumn);
    if (column) {
      dispatch({ type: 'ADD_NOTE', columnId: column.id, note: newNote });
    }

    setLooseNoteContent('');
    setSelectedColumn('');
  };

  const handleChangeTitle = (columnId: string, newTitle: string) => {
    dispatch({ type: 'CHANGE_COLUMN_TITLE', columnId, newTitle });
  };

  const handleDeleteColumn = (columnId: string) => {
    if (window.confirm('Are you sure you want to delete this column?')) {
      dispatch({ type: 'DELETE_COLUMN', columnId });
    }
  };

  const handleDeleteNote = (noteId: string, columnId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      dispatch({ type: 'DELETE_NOTE', columnId, noteId });
    }
  };

  return (
    <div style={{ position: 'relative', padding: '10px' }}>
      <AddColumn />
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
                      className="paper"
                    >
                      <EditableInput
                        initialValue={column.title}
                        onConfirm={(newTitle) => handleChangeTitle(column.id, newTitle)}
                        placeholder="Edit title"
                      />
                      <Column column={column} index={index} onDeleteNote={handleDeleteNote} />
                      <button onClick={() => handleDeleteColumn(column.id)}>Delete Column</button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {/* Zona de Creación de Notas */}
        <div className="add-note-container">
          <h3>Create a Note</h3>
          <input
            type="text"
            value={looseNoteContent}
            onChange={(e) => setLooseNoteContent(e.target.value)}
            placeholder="Add new note"
          />
          <select
            value={selectedColumn}
            onChange={(e) => setSelectedColumn(e.target.value)}
            style={{ marginLeft: '10px' }}
          >
            <option value="">Select a column context</option>
            {state.columns.map((column) => (
              <option key={column.id} value={column.title}>
                {column.title}
              </option>
            ))}
          </select>
          <button onClick={handleAddNote} style={{ marginLeft: '10px' }}>
            Add note
          </button>
        </div>
      </DragDropContext>
    </div>
  );
};

export default Kanban;
