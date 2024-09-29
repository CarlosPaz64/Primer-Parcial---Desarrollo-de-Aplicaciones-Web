import React, { createContext, useReducer, ReactNode, Dispatch } from 'react';

// Exporta la definición del tipo de una nota
export interface Note {
  id: string;
  author: string;
  title: string; // Añadido título
  category?: string; // Mantén categoría como opcional si es necesario
  content: string;
  tags?: string[]; // Añadido tags como opcional
}


// Exporta la definición del tipo de una columna
export interface Column {
  id: string;
  title: string;
  notes: Note[];
}

// Define el estado inicial y las acciones para el reducer
interface KanbanState {
  columns: Column[];
  looseNotes: Note[]; // Añadido looseNotes para notas no asignadas
}

// Estado inicial de columnas y looseNotes con las nuevas propiedades añadidas
const initialState: KanbanState = {
  columns: [
    {
      id: 'column1',
      title: 'Music',
      notes: [
        {
          id: 'note1',
          author: 'Author 1',
          title: 'Note Title 1', // Ejemplo de título
          category: 'General',
          content: 'This is a description of the note.', // Descripción del contenido
          tags: ['tag1', 'tag2'], // Ejemplo de etiquetas
        },
        {
          id: 'note2',
          author: 'Author 1',
          title: 'Note Title 2', // Ejemplo de título
          category: 'General',
          content: 'This is a description of the note.', // Descripción del contenido
          tags: ['tag1', 'tag2'], // Ejemplo de etiquetas
        },
        {
          id: 'note3',
          author: 'Author 1',
          title: 'Note Title 3', // Ejemplo de título
          category: 'General',
          content: 'This is a description of the note.', // Descripción del contenido
          tags: ['tag1', 'tag2'], // Ejemplo de etiquetas
        },
        {
          id: 'note4',
          author: 'Author 1',
          title: 'Note Title 4', // Ejemplo de título
          category: 'General',
          content: 'This is a description of the note.', // Descripción del contenido
          tags: ['tag1', 'tag2'], // Ejemplo de etiquetas
        },
        {
          id: 'note5',
          author: 'Author 1',
          title: 'Note Title 5', // Ejemplo de título
          category: 'General',
          content: 'This is a description of the note.', // Descripción del contenido
          tags: ['tag1', 'tag2'], // Ejemplo de etiquetas
        },
        {
          id: 'note6',
          author: 'Author 1',
          title: 'Note Title 6', // Ejemplo de título
          category: 'General',
          content: 'This is a description of the note.', // Descripción del contenido
          tags: ['tag1', 'tag2'], // Ejemplo de etiquetas
        },
      ],
    },
    { id: 'column2', title: 'Animals', notes: [] },
    { id: 'column3', title: 'Product list', notes: [] },
    { id: 'column4', title: 'Some stuff', notes: [] },
  ],
  looseNotes: [], // Estado inicial vacío para notas no asignadas
};


type Action =
  | { type: 'MOVE_NOTE'; sourceId: string; destId: string; sourceIndex: number; destIndex: number }
  | { type: 'MOVE_COLUMN'; sourceIndex: number; destIndex: number }
  | { type: 'CHANGE_COLUMN_TITLE'; columnId: string; newTitle: string }
  | { type: 'ADD_NOTE'; columnId: string; note: Note }
  | { type: 'EDIT_NOTE'; columnId: string; noteId: string; updatedNote: Note }
  | { type: 'DELETE_NOTE'; columnId: string; noteId: string }
  | { type: 'DELETE_COLUMN'; columnId: string }
  | { type: 'ADD_LOOSE_NOTE'; note: Note }
  | { type: 'ADD_COLUMN'; column: Column };

const kanbanReducer = (state: KanbanState, action: Action): KanbanState => {
  switch (action.type) {
    case 'MOVE_NOTE': {
      const { sourceId, destId, sourceIndex, destIndex } = action;

      if (sourceId === destId) {
        // Mover nota dentro de la misma columna o dentro de looseNotes
        const column = sourceId === 'looseNotes' ? null : state.columns.find(col => col.id === sourceId);
        if (column) {
          const updatedNotes = Array.from(column.notes);
          const [movedNote] = updatedNotes.splice(sourceIndex, 1);
          updatedNotes.splice(destIndex, 0, movedNote);

          const updatedColumns = state.columns.map(col =>
            col.id === sourceId ? { ...col, notes: updatedNotes } : col
          );

          return { ...state, columns: updatedColumns };
        } else {
          const looseNotes = Array.from(state.looseNotes);
          const [movedNote] = looseNotes.splice(sourceIndex, 1);
          looseNotes.splice(destIndex, 0, movedNote);
          return { ...state, looseNotes };
        }
      }

      // Mover nota entre columnas o entre una columna y looseNotes
      const sourceColumn = sourceId === 'looseNotes' ? null : state.columns.find(col => col.id === sourceId);
      const destColumn = destId === 'looseNotes' ? null : state.columns.find(col => col.id === destId);

      if (!sourceColumn && sourceId === 'looseNotes') {
        const looseNotes = Array.from(state.looseNotes);
        const [movedNote] = looseNotes.splice(sourceIndex, 1);

        if (destColumn) {
          const destNotes = Array.from(destColumn.notes);
          destNotes.splice(destIndex, 0, movedNote);

          return {
            ...state,
            looseNotes,
            columns: state.columns.map(col =>
              col.id === destId ? { ...destColumn, notes: destNotes } : col
            ),
          };
        }

        looseNotes.splice(destIndex, 0, movedNote);
        return { ...state, looseNotes };
      }

      if (sourceColumn && destId === 'looseNotes') {
        const sourceNotes = Array.from(sourceColumn.notes);
        const [movedNote] = sourceNotes.splice(sourceIndex, 1);
        const looseNotes = Array.from(state.looseNotes);
        looseNotes.splice(destIndex, 0, movedNote);

        return {
          ...state,
          looseNotes,
          columns: state.columns.map(col =>
            col.id === sourceId ? { ...sourceColumn, notes: sourceNotes } : col
          ),
        };
      }

      if (sourceColumn && destColumn) {
        const sourceNotes = Array.from(sourceColumn.notes);
        const [movedNote] = sourceNotes.splice(sourceIndex, 1);
        const destNotes = Array.from(destColumn.notes);
        destNotes.splice(destIndex, 0, movedNote);

        return {
          ...state,
          columns: state.columns.map(col =>
            col.id === sourceId
              ? { ...sourceColumn, notes: sourceNotes }
              : col.id === destId
              ? { ...destColumn, notes: destNotes }
              : col
          ),
        };
      }

      return state;
    }

    // Los demás casos siguen igual
    case 'MOVE_COLUMN': {
      const { sourceIndex, destIndex } = action;
      const newColumns = Array.from(state.columns);
      const [removed] = newColumns.splice(sourceIndex, 1);
      newColumns.splice(destIndex, 0, removed);
      return { ...state, columns: newColumns };
    }

    case 'CHANGE_COLUMN_TITLE': {
      const { columnId, newTitle } = action;
      const updatedColumns = state.columns.map(col =>
        col.id === columnId ? { ...col, title: newTitle } : col
      );
      return { ...state, columns: updatedColumns };
    }

    case 'ADD_NOTE': {
      const { columnId, note } = action;
      const updatedColumns = state.columns.map(col =>
        col.id === columnId ? { ...col, notes: [...col.notes, note] } : col
      );
      return { ...state, columns: updatedColumns };
    }

    case 'EDIT_NOTE': {
      const { columnId, noteId, updatedNote } = action;

      if (columnId === 'looseNotes') {
        // Maneja la edición de notas dentro de la zona muerta (looseNotes)
        const updatedLooseNotes = state.looseNotes.map(note =>
          note.id === noteId ? updatedNote : note
        );
        return { ...state, looseNotes: updatedLooseNotes };
      }

      // Maneja la edición de notas dentro de las columnas
      const updatedColumns = state.columns.map(col =>
        col.id === columnId
          ? {
              ...col,
              notes: col.notes.map(note => (note.id === noteId ? updatedNote : note)),
            }
          : col
      );

      return { ...state, columns: updatedColumns };
    }

    case 'DELETE_NOTE': {
      const { columnId, noteId } = action;

      if (columnId === 'looseNotes') {
        const updatedLooseNotes = state.looseNotes.filter(note => note.id !== noteId);
        return { ...state, looseNotes: updatedLooseNotes };
      }

      const updatedColumns = state.columns.map(col =>
        col.id === columnId
          ? { ...col, notes: col.notes.filter(note => note.id !== noteId) }
          : col
      );

      return { ...state, columns: updatedColumns };
    }

    case 'DELETE_COLUMN': {
      const { columnId } = action;
      const updatedColumns = state.columns.filter(col => col.id !== columnId);
      return { ...state, columns: updatedColumns };
    }

    case 'ADD_LOOSE_NOTE': {
      const { note } = action;
      return { ...state, looseNotes: [...state.looseNotes, note] };
    }

    case 'ADD_COLUMN': {
      return {
        ...state,
        columns: [...state.columns, action.column],
      };
    }

    default:
      return state;
  }
};

// Define el contexto
export const KanbanContext = createContext<{
  state: KanbanState;
  dispatch: Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

// Proveedor del contexto
export const KanbanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(kanbanReducer, initialState);

  return (
    <KanbanContext.Provider value={{ state, dispatch }}>
      {children}
    </KanbanContext.Provider>
  );
};