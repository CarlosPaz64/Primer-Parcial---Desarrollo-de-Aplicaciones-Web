// DeleteNoteModal.tsx
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Reutilizamos estilos y variantes de animación
// ModalOverlay, ModalContent, modalOverlayVariants, modalContentVariants se definen igual
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

interface DeleteNoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
  }

const DeleteNoteModal: React.FC<DeleteNoteModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay
      variants={modalOverlayVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      onClick={onClose}
    >
      <ModalContent
        variants={modalContentVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Confirmar eliminación</h2>
        <p>¿Estás seguro de que deseas eliminar esta nota?</p>
        <button onClick={onConfirm}><span className="material-symbols-outlined">
        check_circle
        </span></button>
        <button onClick={onClose}><span className="material-symbols-outlined">
        cancel
        </span></button>
      </ModalContent>
    </ModalOverlay>
  );
};

export default DeleteNoteModal;