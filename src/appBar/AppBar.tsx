// AppBar.tsx
import React from 'react';

const AppBar: React.FC = () => {
  return (
    <header
      style={{
        backgroundColor: '#F0A8D0', // Color pastel para el fondo
        padding: '20px',
        borderRadius: '8px', // Bordes redondeados
        textAlign: 'center',
        margin: '0px',
      }}
    >
      <h1 style={{ fontWeight: 'bold', margin: 0 }}>Aplicación de notas</h1>
      <h2 style={{ fontWeight: 400, margin: 0 }}>Bienvenido</h2>
    </header>
  );
};

export default AppBar;
