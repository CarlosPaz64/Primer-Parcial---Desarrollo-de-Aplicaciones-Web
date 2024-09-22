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
    { id: 'column1', title: 'To Do', notes: [{ id: 'note1', author: 'Author 1', category: 'General', content: 'First Task' }] },
    { id: 'column2', title: 'Doing', notes: [] },
    { id: 'column3', title: 'Done', notes: [] },
    { id: 'column4', title: 'Backlog', notes: [] },
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

      // Mover nota desde una columna a otra o hacia Loose Notes
      if (sourceId !== 'looseNotes') {
        const sourceColumn = state.columns.find(col => col.id === sourceId);
        if (!sourceColumn) return state;

        const sourceNotes = [...sourceColumn.notes];
        const [movedNote] = sourceNotes.splice(sourceIndex, 1);

        // Si la nota se mueve a Loose Notes
        if (destId === 'looseNotes') {
          const looseNotes = [...state.looseNotes];
          looseNotes.splice(destIndex, 0, movedNote);

          return {
            ...state,
            columns: state.columns.map(col =>
              col.id === sourceId ? { ...col, notes: sourceNotes } : col
            ),
            looseNotes,
          };
        }

        // Mover nota a otra columna
        const destColumn = state.columns.find(col => col.id === destId);
        if (!destColumn) return state;

        const destNotes = [...destColumn.notes];
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

      // Mover nota desde Loose Notes a una columna o dentro de Loose Notes
      if (sourceId === 'looseNotes') {
        const looseNotes = [...state.looseNotes];
        const [movedNote] = looseNotes.splice(sourceIndex, 1);

        // Si se mueve dentro de Loose Notes
        if (destId === 'looseNotes') {
          looseNotes.splice(destIndex, 0, movedNote);
          return { ...state, looseNotes };
        }

        // Mover nota desde Loose Notes a una columna
        const destColumn = state.columns.find(col => col.id === destId);
        if (!destColumn) return state;

        const destNotes = [...destColumn.notes];
        destNotes.splice(destIndex, 0, movedNote);

        return {
          ...state,
          looseNotes,
          columns: state.columns.map(col => (col.id === destId ? { ...col, notes: destNotes } : col)),
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
      if (columnId === 'looseNotes') {
        return { ...state, looseNotes: [...state.looseNotes, note] };
      }
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