// Kanban.tsx
import React, { useContext, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { KanbanContext, Note } from './context-reducer/KanbanContext'; // Importa Note desde KanbanContext
import Column from './columns/Column';
import EditableInput from './inputs/EditableInput';
import AddColumn from './columns/AddColumn';
import CreateNoteModal from './modal/CreateNoteModal';
import EditNoteModal from './modal/EditNoteModal';
import { v4 as uuidv4 } from 'uuid';

const Kanban: React.FC = () => {
  const { state, dispatch } = useContext(KanbanContext);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentNoteContent, setCurrentNoteContent] = useState('');
  const [currentNote, setCurrentNote] = useState<Note | null>(null);

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

  const handleAddNote = (content: string, columnId: string) => {
    const newNote: Note = {
      id: uuidv4(),
      author: 'Author',
      category: columnId,
      content: content,
    };

    dispatch({ type: 'ADD_NOTE', columnId, note: newNote });
  };

  const handleEditNote = (note: Note) => {
    setCurrentNoteContent(note.content);
    setCurrentNote(note);
    setIsEditModalOpen(true);
  };

  const handleSaveNote = (newContent: string) => {
    if (currentNote) {
      const updatedNote: Note = {
        ...currentNote,
        content: newContent,
      };
  
      // Busca la columna que contiene la nota actual
      const column = state.columns.find((col) =>
        col.notes.some((note) => note.id === currentNote.id)
      );
  
      if (column) {
        dispatch({
          type: 'EDIT_NOTE',
          columnId: column.id, // Usa el ID correcto de la columna
          noteId: currentNote.id,
          updatedNote,
        });
      }
  
      setIsEditModalOpen(false);
    }
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
                      <Column
                        column={column}
                        index={index}
                        onDeleteNote={handleDeleteNote}
                        onEditNote={handleEditNote}
                      />
                      <button onClick={() => handleDeleteColumn(column.id)}>Delete Column</button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <button
        onClick={() => setIsCreateModalOpen(true)}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          backgroundColor: '#4caf50',
          color: 'white',
          padding: '10px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Create Note
      </button>

      <CreateNoteModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onAddNote={handleAddNote}
        columns={state.columns.map((col) => ({ id: col.id, title: col.title }))}
      />

      {currentNote && (
        <EditNoteModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSaveNote={handleSaveNote}
          initialContent={currentNoteContent}
        />
      )}
    </div>
  );
};

export default Kanban;