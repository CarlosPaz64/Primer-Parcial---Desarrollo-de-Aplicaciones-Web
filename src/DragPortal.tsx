import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

interface DragPortalProps {
  children: React.ReactNode;
  isDragging: boolean;
}

const DragPortal: React.FC<DragPortalProps> = ({ children, isDragging }) => {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '10000'; // Alto zIndex para que esté encima de todo
    document.body.appendChild(container);
    setPortalContainer(container);

    return () => {
      document.body.removeChild(container);
    };
  }, []);

  if (!portalContainer || !isDragging) {
    return null;
  }

  return ReactDOM.createPortal(children, portalContainer);
};

export default DragPortal;