// CreateNoteModal.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Herramientas from '../CustomEditor';

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
  const [noteContent, setNoteContent] = useState('');
  const [selectedColumn, setSelectedColumn] = useState('');

  const handleAddNote = () => {
    if (!selectedColumn) {
      alert('Please select a column context before adding a note.');
      return;
    }
    onAddNote(noteContent, selectedColumn);
    setNoteContent('');
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
            <h3>Create a Note</h3>
            <CKEditor
              editor={Herramientas}
              data={noteContent}
              onChange={(_, editor) => {
                const data = editor.getData(); // Solo usamos el editor, no el evento
                setNoteContent(data);
              }}
            />
            <select
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
              style={{ marginBottom: '10px', width: '100%', padding: '8px' }}
            >
              <option value="">Select a column context</option>
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
              }}
            >
              Add note
            </button>
            <button
              onClick={onClose}
              style={{
                marginTop: '10px',
                backgroundColor: '#f44336',
                color: 'white',
                padding: '10px',
                border: 'none',
                borderRadius: '5px',
                width: '100%',
              }}
            >
              Cancel
            </button>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default CreateNoteModal;