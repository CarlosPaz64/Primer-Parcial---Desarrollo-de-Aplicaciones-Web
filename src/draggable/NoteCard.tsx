import React, { useMemo, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Note } from '../context-reducer/KanbanContext';
import Tooltip from '@mui/material/Tooltip';

const pastelColors = [
  '#FFD1DC', '#D4F1F4', '#C3FDB8', '#FEF9D9', '#F3D0D7',
  '#F1F1F1', '#FFC6C6', '#E7FBE6', '#E8C5E5', '#DFD3C3',
  '#F1E5D1', '#D2E0FB', '#FCDC94', '#E3E1D9', '#D9ADAD',
  '#F0EBE3', '#DBC6EB', '#F5EFFF', '#E7F0DC', '#E6E6FA',
  '#FFF0F5', '#FFB6C1', '#F5DEB3', '#F0E68C', '#BBE9FF',
  '#91DDCF', '#C8CFA0', '#F1F8E8', '#B5C18E', '#E1ACAC',
  '#BFF6C3', '#FCFFE0', '#E8EFCF', '#AD88C6', '#FDFFAB',
];

let availableColors = [...pastelColors];
let usedColors = new Set<string>();

const getRandomPastelColor = () => {
  if (availableColors.length === 0) {
    availableColors = [...usedColors];
    usedColors.clear();
  }
  const randomIndex = Math.floor(Math.random() * availableColors.length);
  const color = availableColors.splice(randomIndex, 1)[0];
  usedColors.add(color);
  return color;
};

interface NoteCardProps {
  note: Note;
  index: number;
  onEditNote: (note: Note) => void;
  onDeleteNote: (noteId: string, columnId: string) => void;
  columnId: string;
  isDraggable?: boolean;
  isEditable?: boolean;
}

const NoteCard: React.FC<NoteCardProps> = ({
  note,
  index,
  onEditNote,
  onDeleteNote,
  columnId,
  isDraggable = true,
  isEditable = true,
}) => {
  const backgroundColor = useMemo(() => getRandomPastelColor(), []);
  const [hovered, setHovered] = useState(false);

  const NoteContent = (
    <>
      <h3 
      style={{ 
        margin: '0 0 10px 0', 
        fontWeight: '500', 
        textAlign: 'center', 
        color: '#000', 
        overflow:'hidden', 
        textOverflow:'ellipsis', 
        whiteSpace:'nowrap' 
        }}
      >
        {note.title ? note.title : 'La nota no tiene título'}
      </h3>
      <p
        style={{
          margin: '0 0 10px 0',
          fontWeight: '400',
          fontSize: '12px',
          color: '#000',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {note.content || 'Sin contenido'} {/* Valor por defecto para el contenido */}
      </p>

      {/* Categoría y Etiquetas con espacios reservados */}
      <div style={{ minHeight: '20px' }}>
        {note.category ? (
          <p
            style={{
              margin: '0 0 10px 0',
              fontWeight: '400',
              color: '#000',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            Categoría: {note.category}
          </p>
        ) : (
          <p style={{ margin: '0 0 10px 0', visibility: 'hidden' }}>Categoría</p>
        )}
        {note.tags && note.tags.length > 0 ? (
          <p
            style={{
              margin: '0 0 10px 0',
              fontWeight: '400',
              color: '#000',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            Etiquetas: {note.tags.join(', ')}
          </p>
        ) : (
          <p style={{ margin: '0 0 10px 0', visibility: 'hidden' }}>Etiquetas</p>
        )}
      </div>
    </>
  );

  if (!isDraggable) {
    return (
      <div
        style={{
          padding: '20px',
          margin: '10px 0',
          backgroundColor,
          borderRadius: '0px',
          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
          zIndex: 1,
          position: 'relative',
          maxWidth: '150px',
          minWidth: '150px', // Tamaño mínimo para la nota
          minHeight: '150px', // Tamaño mínimo para la nota
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {NoteContent}

        {/* Botones de editar y eliminar */}
        {isEditable && hovered && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '5px',
              position: 'absolute',
              top: '5px',
              right: '5px',
            }}
          >
            <Tooltip title="Editar">
              <button
                onClick={() => onEditNote(note)}
                style={{
                  background: '#70AF85',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  padding: '3px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span className="material-symbols-outlined">
                  edit_note
                  </span>
              </button>
            </Tooltip>
            <Tooltip title="Eliminar">
              <button
                onClick={() => onDeleteNote(note.id, columnId)}
                style={{
                  background: '#FF7878',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  padding: '3px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span className="material-symbols-outlined">
                  edit_note
                  </span>
              </button>
            </Tooltip>
          </div>
        )}
      </div>
    );
  }

  return (
    <Draggable key={note.id} draggableId={note.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            ...provided.draggableProps.style,
            padding: '20px',
            margin: '10px 0',
            backgroundColor,
            borderRadius: '0px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: snapshot.isDragging ? 1000 : 1,
            position: snapshot.isDragging ? 'fixed' : 'relative',
            maxWidth: '150px',
            minHeight: '150px', // Tamaño mínimo para la nota
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {NoteContent}
  
          {/* Botones de editar y eliminar con animación */}
          {isEditable && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '5px',
                position: 'absolute',
                top: '5px',
                right: '5px',
                zIndex: 10,
                opacity: hovered ? 1 : 0,
                transform: hovered ? 'translateY(0)' : 'translateY(-10px)',
                transition: 'opacity 0.3s ease, transform 0.3s ease', // Animación suave
              }}
            >
              <Tooltip title="Editar">
                <button
                  onClick={() => onEditNote(note)}
                  style={{
                    background: '#70AF85',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    padding: '3px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span className="material-symbols-outlined">edit_note</span>
                </button>
              </Tooltip>
              <Tooltip title="Eliminar">
                <button
                  onClick={() => onDeleteNote(note.id, columnId)}
                  style={{
                    background: '#FF7878',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    padding: '3px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </Tooltip>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );  
};

export default NoteCard;