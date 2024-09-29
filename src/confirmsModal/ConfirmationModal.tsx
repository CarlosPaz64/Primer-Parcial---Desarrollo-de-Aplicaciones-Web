// ConfirmationModal.tsx
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Estilos y animaciones proporcionados
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

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, message }) => {
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
        <h2>Confirmar</h2>
        <p>{message}</p>
        <button onClick={onConfirm} style={{ marginRight: '10px' }}>
          Confirmar
        </button>
        <button onClick={onClose}>Cancelar</button>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ConfirmationModal;