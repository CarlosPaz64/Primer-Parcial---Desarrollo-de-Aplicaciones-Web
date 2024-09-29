// Kanban.tsx
import React, { useContext, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { KanbanContext, Note } from './context-reducer/KanbanContext';
import Column from './columns/Column';
import EditableInput from './inputs/EditableInput';
import AddColumn from './columns/AddColumn';
import CreateNoteModal from './modal/CreateNoteModal';
import EditNoteModal from './modal/EditNoteModal';
import { v4 as uuidv4 } from 'uuid';
import AppBar from './appBar/AppBar';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import DragPortal from './DragPortal'; // Importa DragPortal

// Importar los nuevos modales
import DeleteColumnModal from './confirmsModal/DeleteColumnModal';
import DeleteNoteModal from './confirmsModal/DeleteNoteModal';
import ChangeTitleModal from './confirmsModal/ChangeTitleModal';

const Kanban: React.FC = () => {
  const { state, dispatch } = useContext(KanbanContext);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteColumnModalOpen, setIsDeleteColumnModalOpen] = useState(false);
  const [isDeleteNoteModalOpen, setIsDeleteNoteModalOpen] = useState(false);
  const [isChangeTitleModalOpen, setIsChangeTitleModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<{ noteId: string; columnId: string } | null>(null);

  const onDragEnd = (result: DropResult) => {
    const { source, destination, type, draggableId } = result;
  
    // Verifica si no hay destino
    if (!destination) return;
  
    // Mover columnas
    if (type === 'column') {
      dispatch({ type: 'MOVE_COLUMN', sourceIndex: source.index, destIndex: destination.index });
    } 
    // Mover conjunto de notas colapsadas entre columnas
    else if (draggableId.startsWith('collapsed-')) {
      const sourceColumnId = source.droppableId;
      const destColumnId = destination.droppableId;
  
      if (sourceColumnId !== destColumnId) {
        dispatch({
          type: 'MOVE_COLLAPSED_NOTES',
          sourceColumnId,
          destColumnId,
        });
      }
    } 
    // Mover notas individuales
    else {
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
    setCurrentNote(note);
    setIsEditModalOpen(true);
  };

  const handleSaveNote = (updatedNote: Note) => {
    if (currentNote) {
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

  // Handlers modificados para abrir los modales de confirmación
  const openDeleteColumnModal = (columnId: string) => {
    setSelectedColumnId(columnId);
    setIsDeleteColumnModalOpen(true);
  };

  const confirmDeleteColumn = () => {
    if (selectedColumnId) {
      dispatch({ type: 'DELETE_COLUMN', columnId: selectedColumnId });
      setIsDeleteColumnModalOpen(false);
    }
  };

  const openDeleteNoteModal = (noteId: string, columnId: string) => {
    setSelectedNote({ noteId, columnId });
    setIsDeleteNoteModalOpen(true);
  };

  const confirmDeleteNote = () => {
    if (selectedNote) {
      dispatch({ type: 'DELETE_NOTE', columnId: selectedNote.columnId, noteId: selectedNote.noteId });
      setIsDeleteNoteModalOpen(false);
    }
  };

  const openChangeTitleModal = (columnId: string) => {
    setSelectedColumnId(columnId);
    setIsChangeTitleModalOpen(true);
  };

  const confirmChangeTitle = (newTitle: string) => {
    if (selectedColumnId) {
      dispatch({ type: 'CHANGE_COLUMN_TITLE', columnId: selectedColumnId, newTitle });
      setIsChangeTitleModalOpen(false);
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        padding: '10px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        overflowX: 'hidden',
        overflowY: 'auto',
      }}
    >
      <AppBar />
      <AddColumn />
      <DragDropContext onDragEnd={onDragEnd}>
        <div
          style={{
            display: 'flex',
            zIndex: '0',
            overflowX: 'auto',
            position: 'relative',
            padding: '10px 0',
            whiteSpace: 'nowrap',
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
                  zIndex: '0',
                }}
              >
                {state.columns.map((column, index) => (
                  <Draggable key={column.id} draggableId={column.id} index={index}>
                    {(provided, snapshot) => {
                      const content = (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="paper"
                          style={{
                            ...provided.draggableProps.style,
                            zIndex: snapshot.isDragging ? 1000 : 'auto',
                            whiteSpace: 'normal',
                          }}
                        >
                          <EditableInput
                            initialValue={column.title}
                            onConfirm={() => openChangeTitleModal(column.id)} // Abre el modal para cambiar el título
                          />
                          <Column
                            column={column}
                            index={index}
                            onDeleteNote={openDeleteNoteModal}
                            onEditNote={handleEditNote}
                          />
                          <Tooltip title="Eliminar columna">
                            <button
                              onClick={() => openDeleteColumnModal(column.id)}
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
                                marginTop: '10px',
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </button>
                          </Tooltip>
                        </div>
                      );
                      return snapshot.isDragging ? (
                        <DragPortal isDragging={snapshot.isDragging}>
                          {content}
                        </DragPortal>
                      ) : (
                        content
                      );
                    }}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>

      <Tooltip title="Crear nueva nota">
      <button
        onClick={() => setIsCreateModalOpen(true)}
        style={{
          position: 'absolute',
          top: '135px',
          right: '10px',
          backgroundColor: '#70AF85',
          color: 'white',
          padding: '10px 15px',
          border: 'none',
          borderRadius: '10%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
          transition: 'background-color 0.3s, transform 0.2s',
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#a8dadc')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#70AF85')}
      >
        <AddIcon style={{ fontSize: '20px', marginRight: '5px' }} />
        Create note
      </button>
      </Tooltip>

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
          note={currentNote}
        />
      )}

      {/* Renderiza los nuevos modales */}
      <DeleteColumnModal
        isOpen={isDeleteColumnModalOpen}
        onClose={() => setIsDeleteColumnModalOpen(false)}
        onConfirm={confirmDeleteColumn}
      />

      <DeleteNoteModal
        isOpen={isDeleteNoteModalOpen}
        onClose={() => setIsDeleteNoteModalOpen(false)}
        onConfirm={confirmDeleteNote}
      />

      <ChangeTitleModal
        isOpen={isChangeTitleModalOpen}
        onClose={() => setIsChangeTitleModalOpen(false)}
        onConfirm={confirmChangeTitle}
      />
    </div>
  );
};

export default Kanban;
