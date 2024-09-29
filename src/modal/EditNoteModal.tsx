import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import CategoriesModal from './CategoriesModal';
import TagsModal from './TagsModal';
import { Note } from '../context-reducer/KanbanContext'; // Importa el tipo Note

// Estilos del modal principal
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
  z-index: 1000;
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

// Componente del modal de confirmación
const ConfirmationModal: React.FC<{ onConfirm: () => void; onCancel: () => void }> = ({
  onConfirm,
  onCancel,
}) => (
  <ModalOverlay initial="initial" animate="animate" exit="exit" variants={modalOverlayVariants}>
    <ModalContent initial="initial" animate="animate" exit="exit" variants={modalContentVariants}>
      <h4>¿Estás seguro de que quieres guardar los cambios?</h4>
      <button
        onClick={onConfirm}
        style={{
          backgroundColor: '#4caf50',
          color: 'white',
          padding: '10px',
          border: 'none',
          borderRadius: '5px',
          marginRight: '10px',
          cursor: 'pointer',
        }}
      >
        Confirmar
      </button>
      <button
        onClick={onCancel}
        style={{
          backgroundColor: '#f44336',
          color: 'white',
          padding: '10px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Cancelar
      </button>
    </ModalContent>
  </ModalOverlay>
);

interface EditNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveNote: (updatedNote: Note) => void;
  note: Note | null;
}

const EditNoteModal: React.FC<EditNoteModalProps> = ({
  isOpen,
  onClose,
  onSaveNote,
  note,
}) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(note?.category ? [note.category] : []);
  const [selectedTags, setSelectedTags] = useState<string[]>(note?.tags || []);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // Estado para el modal de confirmación

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setSelectedCategories(note.category ? [note.category] : []);
      setSelectedTags(note.tags || []);
    }
  }, [note]);

  const handleSave = () => {
    setIsConfirmModalOpen(true); // Abre el modal de confirmación
  };

  const handleConfirmSave = () => {
    if (note) {
      const updatedNote: Note = {
        ...note,
        title,
        content,
        category: selectedCategories[0] || '',
        tags: selectedTags,
      };
      onSaveNote(updatedNote);
      setIsConfirmModalOpen(false); // Cierra el modal de confirmación
      onClose(); // Cierra el modal principal
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial="initial"
          animate="animate"
          exit="exit"
          variants={modalOverlayVariants}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <ModalContent
            initial="initial"
            animate="animate"
            exit="exit"
            variants={modalContentVariants}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h3>Editar Nota</h3>
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
            <input
              type="text"
              readOnly
              value={selectedCategories.join(', ')}
              placeholder="Categorías seleccionadas"
              style={{ marginBottom: '10px', width: '100%', padding: '8px', borderRadius: '5px' }}
            />
            <CategoriesModal
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
            <input
              type="text"
              readOnly
              value={selectedTags.join(', ')}
              placeholder="Etiquetas seleccionadas"
              style={{ marginBottom: '10px', width: '100%', padding: '8px', borderRadius: '5px' }}
            />
            <TagsModal selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
            <button
              onClick={handleSave}
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
              Guardar Nota
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
            {/* Modal de confirmación */}
            {isConfirmModalOpen && (
              <ConfirmationModal
                onConfirm={handleConfirmSave}
                onCancel={() => setIsConfirmModalOpen(false)}
              />
            )}
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default EditNoteModal;