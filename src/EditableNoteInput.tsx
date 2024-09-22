// EditableNoteInput.tsx
import React, { useState, useEffect } from 'react';

interface EditableNoteInputProps {
  initialValue: string;
  onConfirm: (value: string) => void;
  placeholder?: string;
}

const EditableNoteInput: React.FC<EditableNoteInputProps> = ({ initialValue, onConfirm, placeholder }) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue); // Asegura que el input se actualiza solo cuando cambia el valor inicial
  }, [initialValue]);

  const handleBlur = () => {
    if (value.trim() !== initialValue) {
      onConfirm(value.trim()); // Confirma solo cuando hay un cambio
    }
  };

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleBlur}
      placeholder={placeholder || 'Edit note content'}
      style={{
        marginBottom: '10px',
        padding: '8px',
        width: '100%', // Asegura que el input ocupe todo el espacio disponible sin descuadrarse
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxSizing: 'border-box', // Esto evita que el padding modifique el tamaño del input
      }}
    />
  );
};

export default EditableNoteInput;