// AddColumn.tsx
import React, { useState, useContext } from 'react';
import { KanbanContext } from '../context-reducer/KanbanContext';
import { v4 as uuidv4 } from 'uuid';
import Tooltip from '@mui/material/Tooltip'; // Importa Tooltip de Material-UI
import ConfirmationModal from '../confirmsModal/ConfirmationModal';
import WarningModal from '../confirmsModal/WarningModal';
import LimitReachedModal from '../confirmsModal/LimitReachedModal';

const AddColumn: React.FC = () => {
  const { state, dispatch } = useContext(KanbanContext);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [isLimitReachedModalOpen, setIsLimitReachedModalOpen] = useState(false);

  const handleAddColumnClick = () => {
    // Verificar si el título de la columna está vacío
    if (!newColumnTitle.trim()) {
      setIsWarningModalOpen(true); // Mostrar modal de advertencia si el título está vacío
      return;
    }

    // Mostrar el modal de confirmación si el título es válido
    setIsConfirmModalOpen(true);
  };

  const handleConfirmAddColumn = () => {
    // Verificar si ya existen 5 columnas
    if (state.columns.length >= 5) {
      setIsLimitReachedModalOpen(true); // Mostrar modal de límite alcanzado
      setIsConfirmModalOpen(false);
      return;
    }

    // Crear una nueva columna
    const newColumn = {
      id: uuidv4(),
      title: newColumnTitle.trim(),
      notes: [],
    };

    dispatch({ type: 'ADD_COLUMN', column: newColumn });
    setNewColumnTitle(''); // Limpiar el input después de añadir la columna
    setIsConfirmModalOpen(false); // Cerrar el modal de confirmación
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
      <Tooltip title="Agregar nueva columna">
        <button
          onClick={handleAddColumnClick}
          style={{
            padding: '8px 12px',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: '#70AF85',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          Add Column
        </button>
      </Tooltip>

      {/* Modal de confirmación */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmAddColumn}
        message="¿Estás seguro de que quieres añadir esta columna?"
      />

      {/* Modal de advertencia */}
      <WarningModal
        isOpen={isWarningModalOpen}
        onClose={() => setIsWarningModalOpen(false)}
        message="No puedes crear columnas sin nombre."
      />

      {/* Modal de límite alcanzado */}
      <LimitReachedModal
        isOpen={isLimitReachedModalOpen}
        onClose={() => setIsLimitReachedModalOpen(false)}
      />
    </div>
  );
};

export default AddColumn;