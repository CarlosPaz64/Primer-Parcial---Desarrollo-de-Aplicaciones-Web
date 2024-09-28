// NoteCard.tsx
import React, { useMemo } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Note } from '../context-reducer/KanbanContext';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip'; // Importa Tooltip de Material-UI

const pastelColors = ['#FFD1DC', '#D4F1F4', '#C3FDB8', '#FFFACD', '#FAD6A5', '#F0A8D0', '#BB9AB1', '#E7F0DC', '#E8C5E5', '#DFD3C3', '#EF9C66', '#D2E0FB', '#FCDC94', '#E3E1D9'];

let usedColors: string[] = [];

const getRandomPastelColor = () => {
  const availableColors = pastelColors.filter(color => !usedColors.includes(color));
  if (availableColors.length === 0) {
    usedColors = [];
    return getRandomPastelColor();
  }
  const color = availableColors[Math.floor(Math.random() * availableColors.length)];
  usedColors.push(color);
  return color;
};

interface NoteCardProps {
  note: Note;
  index: number;
  onEditNote: (note: Note) => void;
  onDeleteNote: (noteId: string, columnId: string) => void;
  columnId: string;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, index, onEditNote, onDeleteNote, columnId }) => {
  const backgroundColor = useMemo(() => getRandomPastelColor(), []);

  return (
    <Draggable key={note.id} draggableId={note.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            padding: '20px',
            margin: snapshot.isDragging ? '0' : '0 0 8px 0',
            backgroundColor: backgroundColor,
            borderRadius: '4px',
            boxShadow: '2px 2px 6px rgba(0, 0, 0, 0.1), -2px 2px 6px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            zIndex: snapshot.isDragging ? 1 : 1,
            position: snapshot.isDragging ? 'fixed' : 'relative',
            minWidth: '150px',
            lineHeight: '1.5',
            wordWrap: 'break-word',
            maxWidth: '350px',
          }}
        >
          {/* Botones de Editar y Eliminar con Tooltips */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '5px', position: 'absolute', top: '5px', right: '5px' }}>
            <Tooltip title="Editar">
              <button
                onClick={() => onEditNote(note)}
                style={{
                  background: '#4caf50',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  padding: '5px',
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
                  background: '#e74c3c',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  padding: '5px',
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

          {/* Título */}
          <h3
            style={{
              margin: '10px 0 0 0',
              fontWeight: '500',
              textAlign: 'center',
              color: '#333',
            }}
          >
            {note.title}
          </h3>

          {/* Contenido de la nota */}
          <p
            style={{
              margin: '0',
              fontSize: '14px',
              fontWeight: '400',
              overflow: 'hidden', // Oculta el desbordamiento
              whiteSpace: 'nowrap', // No permite que el texto salte de línea
              textOverflow: 'ellipsis', // Aplica los puntos suspensivos
              maxWidth: '100%', // Asegura que el contenido se ajuste al contenedor
            }}
          >
            {note.content}
          </p>
        </div>
      )}
    </Draggable>
  );
};

export default NoteCard;