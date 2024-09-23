// EditNoteModal.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

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

interface EditNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveNote: (content: string) => void;
  initialContent: string;
}

const EditNoteModal: React.FC<EditNoteModalProps> = ({
  isOpen,
  onClose,
  onSaveNote,
  initialContent,
}) => {
  const [noteContent, setNoteContent] = useState(initialContent);

  useEffect(() => {
    setNoteContent(initialContent);
  }, [initialContent]);

  const handleSaveNote = () => {
    onSaveNote(noteContent);
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
          onMouseDown={(e) => e.stopPropagation()} // Detener la propagación de eventos de arrastre
        >
          <ModalContent
            initial="initial"
            animate="animate"
            exit="exit"
            variants={modalContentVariants}
            onMouseDown={(e) => e.stopPropagation()} // También en el contenido del modal
          >
            <h3>Edit Note</h3>
            <CKEditor
              editor={ClassicEditor}
              data={noteContent}
              onChange={(_, editor) => {
                const data = editor.getData();
                setNoteContent(data);
              }}
            />
            <button
              onClick={handleSaveNote}
              style={{
                backgroundColor: '#4caf50',
                color: 'white',
                padding: '10px',
                border: 'none',
                borderRadius: '5px',
                width: '100%',
                marginTop: '10px',
              }}
            >
              Save Note
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

export default EditNoteModal;