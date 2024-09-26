// Kanban.tsx
import React, { useContext, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { KanbanContext, Note } from './context-reducer/KanbanContext';
import Column from './columns/Column';
import EditableInput from './inputs/EditableInput';
import AddColumn from './columns/AddColumn';
import CreateNoteModal from './modal/CreateNoteModal';
import EditNoteModal from './modal/EditNoteModal';
import NoteCard from './draggable/NoteCard';
import { v4 as uuidv4 } from 'uuid';
import AppBar from './appBar/AppBar';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';

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
      const sourceId = source.droppableId === 'dead-zone' ? 'looseNotes' : source.droppableId;
      const destId = destination.droppableId === 'dead-zone' ? 'looseNotes' : destination.droppableId;

      if (sourceId && destId) {
        dispatch({
          type: 'MOVE_NOTE',
          sourceId: sourceId,
          destId: destId,
          sourceIndex: source.index,
          destIndex: destination.index,
        });
      }
    }
  };

  const handleAddNote = (content: string, columnId: string) => {
    const newNote: Note = {
      id: uuidv4(),
      author: 'Author',
      category: columnId,
      content: content,
      title: 'New Note',
      tags: [],
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

      const column = state.columns.find((col) =>
        col.notes.some((note) => note.id === currentNote.id)
      );

      if (column) {
        dispatch({
          type: 'EDIT_NOTE',
          columnId: column.id,
          noteId: currentNote.id,
          updatedNote,
        });
      } else if (state.looseNotes.some((note) => note.id === currentNote.id)) {
        dispatch({
          type: 'EDIT_NOTE',
          columnId: 'looseNotes',
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
    <div
      style={{
        position: 'relative',
        padding: '10px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        overflowX: 'hidden', // Evita desbordamiento horizontal innecesario
        overflowY: 'auto', // Permite desbordamiento vertical
      }}
    >
      <AppBar />
      <AddColumn />
      <DragDropContext onDragEnd={onDragEnd}>
        {/* Contenedor scrollable para las columnas */}
        <div
          style={{
            display: 'flex',
            overflowX: 'auto', // Hacer scrollable horizontal
            padding: '10px 0', // Espacio para facilitar el scroll
          }}
        >
          <Droppable droppableId="all-columns" direction="horizontal" type="column">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{
                  display: 'flex',
                  position: 'relative',
                }}
              >
                {state.columns.map((column, index) => (
                  <Draggable key={column.id} draggableId={column.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="paper"
                        style={{
                          ...provided.draggableProps.style,
                          zIndex: snapshot.isDragging ? 1000 : 1, // Asegura que la columna esté en primer plano al arrastrar
                        }}
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
                        {/* Botón de eliminar columna actualizado */}
                        <Tooltip title="Eliminar columna">
                          <button
                            onClick={() => handleDeleteColumn(column.id)}
                            style={{
                              background: '#e74c3c',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '50%',
                              padding: '8px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginTop: '10px',
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </button>
                        </Tooltip>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>

        {/* Zona muerta para notas no asignadas */}
        <Droppable droppableId="dead-zone" type="note">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                marginTop: '20px',
                padding: '20px',
                border: '2px dashed #ccc',
                minHeight: '150px',
                backgroundColor: '#f9f9f9',
                zIndex: 0,
              }}
            >
              <h3>Note's dead zone</h3>
              {state.looseNotes.map((note, index) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  index={index}
                  onEditNote={handleEditNote}
                  onDeleteNote={handleDeleteNote}
                  columnId="looseNotes"
                />
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
          top: '135px',
          right: '10px',
          backgroundColor: '#c1e1c1',
          color: '#333',
          padding: '10px 15px',
          border: 'none',
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
          transition: 'background-color 0.3s, transform 0.2s',
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#a8dadc')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#c1e1c1')}
      >
        <AddIcon style={{ fontSize: '20px', marginRight: '5px' }} />
        Create note
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