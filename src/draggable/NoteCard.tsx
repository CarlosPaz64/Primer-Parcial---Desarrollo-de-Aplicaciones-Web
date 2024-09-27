// NoteCard.tsx
import React, { useMemo } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Note } from '../context-reducer/KanbanContext';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Función para obtener un color pastel aleatorio
const getRandomPastelColor = () => {
  const pastelColors = ['#FFD1DC', '#D4F1F4', '#C3FDB8', '#FFFACD', '#FAD6A5'];
  return pastelColors[Math.floor(Math.random() * pastelColors.length)];
};

interface NoteCardProps {
  note: Note;
  index: number;
  onEditNote: (note: Note) => void;
  onDeleteNote: (noteId: string, columnId: string) => void;
  columnId: string;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, index, onEditNote, onDeleteNote, columnId }) => {
  // Color de fondo aleatorio generado solo una vez por nota
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
            borderRadius: '4px', // Borde rectangular
            boxShadow: '2px 2px 6px rgba(0, 0, 0, 0.1), -2px 2px 6px rgba(0, 0, 0, 0.1)', // Sombra a la izquierda y derecha
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            zIndex: snapshot.isDragging ? 1 : 1, // Controla la superposición
            position: snapshot.isDragging ? 'fixed' : 'relative', // Usa posición fija solo cuando se arrastra
            minWidth: '150px', // Tamaño pequeño ajustable
            lineHeight: '1.5',
            wordWrap: 'break-word',
          }}
        >
          {/* Botones de Editar y Eliminar al hacer hover */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '5px', position: 'absolute', top: '5px', right: '5px' }}>
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
              title="Editar"
            >
              <EditIcon fontSize="small" />
            </button>
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
              title="Eliminar"
            >
              <DeleteIcon fontSize="small" />
            </button>
          </div>

          {/* Contenido de la nota */}
          <p style={{ margin: '0', fontSize: '14px', fontWeight: '400' }}>{note.content}</p>

          {/* Título fuera del contenedor */}
          <h3 style={{ margin: '10px 0 0 0', fontWeight: '500', textAlign: 'center', color: '#333' }}>
            {note.title}
          </h3>
        </div>
      )}
    </Draggable>
  );
};

export default NoteCard;