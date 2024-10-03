import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// Estilos y variantes de animación del modal principal
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
  z-index: 10000;
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
      <h4>¿Estás seguro de que quieres cambiar el nombre?</h4>
      <div style={{ display: 'flex', justifyContent: 'left', gap: '10px', marginTop: '20px' }}>
        <button
          onClick={onConfirm}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#86AB89',
            color: 'white',
            padding: '10px',
            border: 'none',
            borderRadius: '5px',
            marginRight: '10px',
            cursor: 'pointer',
            minWidth: '120px',  // Para que ambos botones mantengan un tamaño mínimo uniforme
          }}
        >
          <span className="material-symbols-outlined" style={{ marginRight: '5px' }}>
            check_circle
          </span>
          Confirmar
        </button>
        
        <button
          onClick={onCancel}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#C96868',
            color: 'white',
            padding: '10px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            minWidth: '120px',  // Para que ambos botones mantengan un tamaño mínimo uniforme
          }}
        >
          <span className="material-symbols-outlined" style={{ marginRight: '5px' }}>
            cancel
          </span>
          Cancelar
        </button>
      </div>
    </ModalContent>
  </ModalOverlay>
);

// Componente del modal de advertencia
const WarningModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <ModalOverlay initial="initial" animate="animate" exit="exit" variants={modalOverlayVariants}>
    <ModalContent initial="initial" animate="animate" exit="exit" variants={modalContentVariants}>
      <h4>El título no puede estar vacío.</h4>
      <button
        onClick={onClose}
        style={{
          backgroundColor: '##ffeb3b',
          transition: 'background-color 0.3s',
          color: '#000',
          padding: '10px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        <span className="material-symbols-outlined">
        check_circle
        </span>
      </button>
    </ModalContent>
  </ModalOverlay>
);

interface ChangeTitleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newTitle: string) => void;
}

const ChangeTitleModal: React.FC<ChangeTitleModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [newTitle, setNewTitle] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false); // Estado para el modal de advertencia

  const handleConfirmChange = () => {
    if (!newTitle.trim()) {
      setIsWarningModalOpen(true); // Abre el modal de advertencia si no hay título
    } else {
      setIsConfirmModalOpen(true); // Abre el modal de confirmación si hay título
    }
  };

  const handleFinalConfirm = () => {
    onConfirm(newTitle);
    setIsConfirmModalOpen(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
              style={{
                marginBottom: '10px',
                width: '100%',
                padding: '8px',
                borderRadius: '5px',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '10px' }}>
            <button
              onClick={handleConfirmChange}
              style={{
                backgroundColor: '#86AB89',
                color: 'white',
                padding: '10px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',  // Alinear icono verticalmente
                flex: '1', // Distribuye espacio de forma uniforme
                minWidth: '120px' // Establece un ancho mínimo común
              }}
            >
              <span className="material-symbols-outlined" style={{ marginRight: '5px' }}>
                published_with_changes
              </span>
              Confirmar
            </button>
            
            <button
              onClick={onClose}
              style={{
                backgroundColor: '#C96868',
                color: 'white',
                padding: '10px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',  // Alinear icono verticalmente
                flex: '1', // Distribuye espacio de forma uniforme
                minWidth: '120px' // Establece un ancho mínimo común
              }}
            >
              <span className="material-symbols-outlined" style={{ marginRight: '5px' }}>
                cancel
              </span>
              Cancelar
            </button>
          </div>


            {/* Modal de confirmación */}
            {isConfirmModalOpen && (
              <ConfirmationModal
                onConfirm={handleFinalConfirm}
                onCancel={() => setIsConfirmModalOpen(false)}
              />
            )}

            {/* Modal de advertencia */}
            {isWarningModalOpen && (
              <WarningModal onClose={() => setIsWarningModalOpen(false)} />
            )}
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default ChangeTitleModal;