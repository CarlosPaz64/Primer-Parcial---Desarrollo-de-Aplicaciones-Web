import React, { useMemo, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Note } from '../context-reducer/KanbanContext';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';

const pastelColors = [
  '#FFD1DC', '#D4F1F4', '#C3FDB8', '#FFFACD', '#FAD6A5',
  '#F0A8D0', '#BB9AB1', '#E7F0DC', '#E8C5E5', '#DFD3C3',
  '#EF9C66', '#D2E0FB', '#FCDC94', '#E3E1D9', '#D9ADAD',
  '#EEBB4D', '#DBC6EB', '#AD6989', '#A4C5C6', '#E6E6FA',
  '#FFF0F5', '#FFB6C1', '#F5DEB3', '#F0E68C', '#B0E0E6',
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
      <h3 style={{ margin: '0 0 10px 0', fontWeight: '500', textAlign: 'center', color: '#000' }}>
        {note.title}
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
                <EditIcon fontSize="small" />
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
                <DeleteIcon fontSize="small" />
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
          <div {...provided.dragHandleProps}>{NoteContent}</div>

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
                zIndex: 10, // Asegura que los botones queden sobre el contenido
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
                  <EditIcon fontSize="small" />
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
                  <DeleteIcon fontSize="small" />
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