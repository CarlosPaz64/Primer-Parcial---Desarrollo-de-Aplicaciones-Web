import React from 'react';
import { Note } from '../context-reducer/KanbanContext';
import NoteCard from '../draggable/NoteCard';
import { Draggable } from 'react-beautiful-dnd';
import Tooltip from '@mui/material/Tooltip';

interface CollapsedNotesProps {
  column: {
    id: string;
    notes: Note[];
  };
  onExpand: () => void;
  onDeleteNote: (noteId: string, columnId: string) => void;
  onEditNote: (note: Note) => void;
}

const CollapsedNotes: React.FC<CollapsedNotesProps> = ({
  column,
  onExpand,
  onEditNote,
  onDeleteNote,
}) => {
  const displayedNotes = column.notes.slice(0, 5); // Mostrar hasta 5 notas

  return (
    <Draggable draggableId={`collapsed-${column.id}`} index={0}>
      {(provided, snapshot) => (
        <Tooltip title="Notas amontonadas" placement="top">
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              ...provided.draggableProps.style, // Mantener el estilo proporcionado por react-beautiful-dnd
              zIndex: snapshot.isDragging ? 9999 : 'auto',
            }}
            onClick={onExpand}
          >
            <div
              className="draggable"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100px',
                margin: '0 auto',
                boxSizing: 'border-box',
              }}
            >
              {displayedNotes.map((note, noteIndex) => (
                <div
                  key={note.id}
                  style={{
                    position: 'absolute',
                    top: `${noteIndex * 10}px`,
                    left: `${noteIndex * 5}px`,
                    zIndex: 5 - noteIndex,
                  }}
                >
                  <NoteCard
                    note={note}
                    index={noteIndex}
                    onEditNote={onEditNote}
                    onDeleteNote={onDeleteNote}
                    columnId={column.id}
                    isDraggable={false}
                    isEditable={false}
                  />
                </div>
              ))}
            </div>
          </div>
        </Tooltip>
      )}
    </Draggable>
  );
};

export default CollapsedNotes;