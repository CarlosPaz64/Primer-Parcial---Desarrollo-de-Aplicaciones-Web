// CreateNoteModal.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import CategoriesModal from './CategoriesModal';
import TagsModal from './TagsModal';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Asegura que esté por encima de otros elementos */
`;

const ModalContent = styled(motion.div)`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 500px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const modalOverlayVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalContentVariants = {
  initial: { y: '-100vh' },
  animate: { y: '0', transition: { type: 'spring', stiffness: 120 } },
  exit: { y: '-100vh', transition: { ease: 'easeInOut' } },
};

interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNote: (content: string, columnId: string) => void;
  columns: { id: string; title: string }[];
}

const CreateNoteModal: React.FC<CreateNoteModalProps> = ({
  isOpen,
  onClose,
  onAddNote,
  columns,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedColumn, setSelectedColumn] = useState('');

  const handleAddNote = () => {
    if (!selectedColumn) {
      alert('Por favor, selecciona una columna antes de agregar una nota.');
      return;
    }
    onAddNote(content, selectedColumn);
    setTitle('');
    setContent('');
    setSelectedCategories([]);
    setSelectedTags([]);
    setSelectedColumn('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial="initial"
          animate="animate"
          exit="exit"
          variants={modalOverlayVariants}
        >
          <ModalContent
            initial="initial"
            animate="animate"
            exit="exit"
            variants={modalContentVariants}
          >
            <h3>Crear una Nota</h3>
            <input
              type="text"
              placeholder="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ marginBottom: '10px', width: '100%', padding: '8px', borderRadius: '5px' }}
            />
            <textarea
              placeholder="Contenido"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{
                marginBottom: '10px',
                width: '100%',
                padding: '8px',
                borderRadius: '5px',
                minHeight: '100px',
                resize: 'none',
              }}
            />
            {/* Componente de categorías */}
            <CategoriesModal
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
            {/* Área que muestra las categorías seleccionadas */}
            <input
              type="text"
              readOnly
              value={selectedCategories.join(', ')}
              placeholder="Categorías seleccionadas"
              style={{ marginBottom: '10px', width: '100%', padding: '8px', borderRadius: '5px' }}
            />
            {/* Componente de etiquetas */}
            <TagsModal selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
            {/* Área que muestra las etiquetas seleccionadas */}
            <input
              type="text"
              readOnly
              value={selectedTags.join(', ')}
              placeholder="Etiquetas seleccionadas"
              style={{ marginBottom: '10px', width: '100%', padding: '8px', borderRadius: '5px' }}
            />
            <select
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
              style={{ marginBottom: '10px', width: '100%', padding: '8px', borderRadius: '5px' }}
            >
              <option value="">Selecciona una columna</option>
              {columns.map((column) => (
                <option key={column.id} value={column.id}>
                  {column.title}
                </option>
              ))}
            </select>
            <button
              onClick={handleAddNote}
              style={{
                backgroundColor: '#4caf50',
                color: 'white',
                padding: '10px',
                border: 'none',
                borderRadius: '5px',
                width: '100%',
                marginBottom: '10px',
                cursor: 'pointer',
              }}
            >
              Guardar
            </button>
            <button
              onClick={onClose}
              style={{
                backgroundColor: '#f44336',
                color: 'white',
                padding: '10px',
                border: 'none',
                borderRadius: '5px',
                width: '100%',
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default CreateNoteModal;