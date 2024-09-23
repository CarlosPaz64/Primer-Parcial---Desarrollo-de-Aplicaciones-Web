// EditableInput.tsx
import React, { useState, useEffect } from 'react';

interface EditableInputProps {
  initialValue: string;
  onConfirm: (value: string) => void;
  placeholder?: string;
}

const EditableInput: React.FC<EditableInputProps> = ({ initialValue, onConfirm, placeholder }) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleBlur = () => {
    onConfirm(value.trim());
  };

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleBlur}
      placeholder={placeholder || 'Edit value'}
      style={{ marginBottom: '10px', padding: '5px' }}
    />
  );
};

export default EditableInput;
