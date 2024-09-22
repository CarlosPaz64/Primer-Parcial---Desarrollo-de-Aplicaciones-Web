// KanbanContext.tsx
import React, { createContext, useReducer, ReactNode, Dispatch } from 'react';

// Define el tipo de una nota
interface Note {
  id: string;
  author: string;
  category: string;
  content: string;
}

// Define el tipo de una columna
interface Column {
  id: string;
  title: string;
  notes: Note[];
}

// Define el estado inicial y las acciones para el reducer
interface KanbanState {
  columns: Column[];
  looseNotes: Note[];
}

const initialState: KanbanState = {
  columns: [
    { id: 'column1', title: 'Music', notes: [{ id: 'note1', author: 'Author 1', category: 'General', content: 'Alternative' }] },
    { id: 'column2', title: 'Animals', notes: [] },
    { id: 'column3', title: 'Product list', notes: [] },
    { id: 'column4', title: 'Some stuff', notes: [] },
  ],
  looseNotes: [],
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

      // Mover nota dentro de la misma columna
      if (sourceId === destId) {
        const column = state.columns.find(col => col.id === sourceId);
        if (!column) return state;

        const updatedNotes = Array.from(column.notes);
        const [movedNote] = updatedNotes.splice(sourceIndex, 1); // Elimina la nota del índice fuente
        updatedNotes.splice(destIndex, 0, movedNote); // Inserta la nota en el índice destino

        const updatedColumns = state.columns.map(col =>
          col.id === sourceId ? { ...col, notes: updatedNotes } : col
        );

        return { ...state, columns: updatedColumns };
      }

      // Mover nota entre columnas o hacia/fuera de Loose Notes
      const sourceColumn = state.columns.find(col => col.id === sourceId);
      const destColumn = state.columns.find(col => col.id === destId);

      if (!sourceColumn && sourceId === 'looseNotes') {
        const looseNotes = Array.from(state.looseNotes);
        const [movedNote] = looseNotes.splice(sourceIndex, 1);

        if (destId === 'looseNotes') {
          looseNotes.splice(destIndex, 0, movedNote);
          return { ...state, looseNotes };
        }

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

      return state; // Devuelve el estado actual si no se cumple ninguna condición
    }

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

      // Maneja la eliminación de notas de looseNotes
      if (columnId === 'looseNotes') {
        const updatedLooseNotes = state.looseNotes.filter(note => note.id !== noteId);
        return { ...state, looseNotes: updatedLooseNotes };
      }

      // Maneja la eliminación de notas de columnas
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