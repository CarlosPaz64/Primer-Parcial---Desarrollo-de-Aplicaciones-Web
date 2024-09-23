// AddColumn.tsx
import React, { useState, useContext } from 'react';
import { KanbanContext } from '../context-reducer/KanbanContext'; // Asegúrate de que la ruta sea correcta
import { v4 as uuidv4 } from 'uuid';

const AddColumn: React.FC = () => {
  const { state, dispatch } = useContext(KanbanContext);
  const [newColumnTitle, setNewColumnTitle] = useState('');

  const handleAddColumn = () => {
    // Verificar si ya existen 4 columnas
    if (state.columns.length >= 4) {
      alert('You can only create 4 columns. Please, delete one or edit.');
      return;
    }

    // Verificar si el título de la columna no está vacío
    if (!newColumnTitle.trim()) return;

    // Crear una nueva columna
    const newColumn = {
      id: uuidv4(),
      title: newColumnTitle.trim(),
      notes: [],
    };

    dispatch({ type: 'ADD_COLUMN', column: newColumn });
    setNewColumnTitle(''); // Limpiar el input después de añadir la columna
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <input
        type="text"
        value={newColumnTitle}
        onChange={(e) => setNewColumnTitle(e.target.value)}
        placeholder="Enter column title"
        style={{
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          marginRight: '10px',
          width: '200px',
          boxSizing: 'border-box',
        }}
      />
      <button
        onClick={handleAddColumn}
        style={{
          padding: '8px 12px',
          borderRadius: '4px',
          border: 'none',
          backgroundColor: '#4caf50',
          color: 'white',
          cursor: 'pointer',
        }}
      >
        Add Column
      </button>
    </div>
  );
};

export default AddColumn;