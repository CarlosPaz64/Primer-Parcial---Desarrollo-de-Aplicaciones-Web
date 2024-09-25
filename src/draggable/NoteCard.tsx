// NoteCard.tsx
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Note } from '../context-reducer/KanbanContext';

interface NoteCardProps {
  note: Note;
  index: number;
  onEditNote: (note: Note) => void;
  onDeleteNote: (noteId: string, columnId: string) => void;
  columnId: string; // Para identificar en qué columna o zona está la nota
}

const NoteCard: React.FC<NoteCardProps> = ({ note, index, onEditNote, onDeleteNote, columnId }) => {
  return (
    <Draggable key={note.id} draggableId={note.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            userSelect: 'none',
            padding: '16px',
            margin: '0 0 8px 0',
            backgroundColor: '#fff',
            border: '1px solid #ddd',
            borderRadius: '3px',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            position: 'relative',
            boxSizing: 'border-box', // Incluye padding y borde en el tamaño total del contenedor
            maxWidth: '200px', // Ajusta este valor para el ancho según lo que necesites
            lineHeight: '1.4',
            ...provided.draggableProps.style,
            // Estilos de hoja de libreta
            wordWrap: 'break-word', // Asegura que el texto no se salga del contenedor
            backgroundImage: 'linear-gradient(180deg, transparent 23px, #d3d3d3 24px)',
            backgroundSize: '100% 25px', // Espacio entre líneas
          }}
        >
          {/* Simula los agujeros de la libreta a la izquierda */}
          <div
            style={{
              position: 'absolute',
              top: '0',
              left: '-10px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#e0e0e0',
                  margin: '2px 0',
                }}
              />
            ))}
          </div>
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
              onClick={() => onDeleteNote(note.id, columnId)}
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
  );
};

export default NoteCard;