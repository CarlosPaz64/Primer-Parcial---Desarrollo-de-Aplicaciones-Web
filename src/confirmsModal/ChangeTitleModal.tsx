// ChangeTitleModal.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Reutiliza los mismos estilos y variantes de animación
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

interface ChangeTitleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newTitle: string) => void;
}

const ChangeTitleModal: React.FC<ChangeTitleModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [newTitle, setNewTitle] = useState('');

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
        <h2>Cambiar Título</h2>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Nuevo título"
        />
        <button onClick={() => onConfirm(newTitle)}>Cambiar Nombre</button>
        <button onClick={onClose}>Cancelar</button>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ChangeTitleModal;
