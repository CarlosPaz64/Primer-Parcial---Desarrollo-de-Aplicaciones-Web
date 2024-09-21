// App.tsx
import { KanbanProvider } from './KanbanContext'; // Importa el proveedor
import Kanban from './dashboard'; // Asegúrate de que la ruta sea correcta

function App() {
  return (
    <KanbanProvider>
      <Kanban />
    </KanbanProvider>
  );
}

export default App;
