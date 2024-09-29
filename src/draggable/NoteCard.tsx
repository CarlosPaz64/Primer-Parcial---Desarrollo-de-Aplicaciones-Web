// NoteCard.tsx
import React, { useMemo } from 'react';
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
  '#ADD8E6', '#FFE4E1', '#E0FFFF', '#AFEEEE', '#FAEBD7', 
  '#F5F5DC', '#D8BFD8', '#DDA0DD', '#EEE8AA', '#F5FFFA', 
  '#FFFAF0', '#FAFAD2', '#FFEFD5', '#FFEBCD', '#FFFAFA', 
  '#F8F8FF', '#E0FFFF', '#F0FFF0', '#F0FFFF', '#FFFFE0', 
  '#FFFACD', '#FAF0E6', '#F0F8FF', '#FFF5EE', '#EEE8AA', 
  '#98FB98', '#FFF8DC', '#F5FFFA', '#F0E68C', '#E6E6FA', 
  '#FFFAFA', '#F5DEB3', '#FFF5EE', '#FFDEAD', '#FAFAD2', 
  '#E0FFFF', '#FFFACD', '#F0FFF0', '#F0FFFF', '#FAF0E6', 
  '#FFF8DC', '#FFFAF0', '#F5FFFA', '#F8F8FF', '#FFFAFA', 
  '#FFF0F5', '#E0FFFF', '#FAEBD7', '#FFB6C1', '#FFEFD5', 
  '#F5F5DC', '#FFF5EE', '#FFFACD', '#F5FFFA', '#FAEBD7', 
  '#FFF8DC', '#F8F8FF', '#FAFAD2', '#FFDAB9', '#FFEBCC', 
  '#FFD1DC', '#FFC1CC', '#FFF0D0', '#FFE4E1', '#FFF0D5', 
  '#FFD7D9', '#FFE8DB', '#FFF0F0', '#FFEDD5', '#FFF4E5', 
  '#FFE9C8', '#FFDBD5', '#FFF1E1', '#FFF0D5', '#FFE8DC', 
  '#FFF4E6', '#FFE8D1', '#FFD4C7', '#FFE3DC', '#FFD0E1'
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

  const NoteContent = (
    <>
      {isEditable && (
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
                background: '#FF7878',
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
      )}

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
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 3, // Limits the text to 3 lines
          WebkitBoxOrient: 'vertical',
          maxWidth: '100%',
          maxHeight: '50px', // Fixed height to avoid expanding
          lineHeight: '1.5',
          whiteSpace: 'normal', // Allows multiline truncation
        }}
      >
        {note.content}
      </p>
    </>
  );

  if (!isDraggable) {
    return (
      <div
        style={{
          padding: '20px',
          margin: '0 0 8px 0',
          backgroundColor,
          borderRadius: '4px',
          boxShadow: '2px 2px 6px rgba(0, 0, 0, 0.1), -2px 2px 6px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          zIndex: 1,
          position: 'relative',
          maxWidth: '150px',
          minWidth: '150px',
          lineHeight: '1.5',
          overflowWrap: 'break-word',
          maxHeight: '80px', // Fija la altura máxima
          overflow: 'hidden', // Oculta el desbordamiento
          textOverflow: 'ellipsis',
        }}
      >
        {NoteContent}
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
          style={{
            ...provided.draggableProps.style,
            padding: '20px',
            margin: snapshot.isDragging ? '0' : '0 0 8px 0',
            backgroundColor,
            borderRadius: '4px',
            boxShadow: '2px 2px 6px rgba(0, 0, 0, 0.1), -2px 2px 6px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            zIndex: snapshot.isDragging ? 1000 : 1,
            position: snapshot.isDragging ? 'fixed' : 'relative',
            maxWidth: '350px',
            minWidth: '150px',
            lineHeight: '1.5',
            overflowWrap: 'break-word',
          }}
        >
          {NoteContent}
        </div>
      )}
    </Draggable>
  );
};

export default NoteCard;