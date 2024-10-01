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
    // Verificar si ya existen 24 columnas
    if (state.columns.length >= 24) {
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
        placeholder="Añade el título de tu espacio"
        style={{
          padding: '10px 15px',
          borderRadius: '8px',
          border: '1px solid #E0E0E0', // Borde suave
          backgroundColor: '#FAF3F3', // Fondo pastel
          color: '#000', // Color del texto
          fontSize: '16px', // Tamaño del texto
          width: '250px', // Un poco más amplio
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', // Sombra sutil
          transition: 'all 0.3s ease', // Suaviza las transiciones
          outline: 'none',
          boxSizing: 'border-box',
        }}
        onFocus={(e) => (e.target.style.borderColor = '#A4C5C6')} // Cambia el color del borde en el enfoque
        onBlur={(e) => (e.target.style.borderColor = '#E0E0E0')} // Restablece el borde cuando pierde el enfoque
      />
      <Tooltip title="Agregar un nuevo espacio">
        <button
          onClick={handleAddColumnClick}
          style={{
            padding: '8px 12px',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: '#70AF85',
            color: '#000',
            cursor: 'pointer',
          }}
        >
          Add new space
        </button>
      </Tooltip>

      {/* Modal de confirmación */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmAddColumn}
        message="¿Estás seguro de que quieres añadir este espacio?"
      />

      {/* Modal de advertencia */}
      <WarningModal
        isOpen={isWarningModalOpen}
        onClose={() => setIsWarningModalOpen(false)}
        message="No puedes crear espacios sin nombre."
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