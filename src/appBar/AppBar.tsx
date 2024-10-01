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
      <h2 style={{ fontWeight: 400, margin: 0 }}>¡Bienvenidos al emocionante mundo de React Moderno! En este curso, te sumergirás en las últimas tecnologías y mejores prácticas para construir aplicaciones web de vanguardia. Aprenderás a dominar React, TypeScript y Vite, herramientas esenciales para el desarrollo web actual. Desarrollarás habilidades prácticas para crear aplicaciones interactivas, eficientes y escalables, preparándote para enfrentar los desafíos del mercado laboral y construir un futuro brillante en el mundo del desarrollo web. ¡Prepárate para un viaje lleno de aprendizaje y creatividad!</h2>
    </header>
  );
};

export default AppBar;
