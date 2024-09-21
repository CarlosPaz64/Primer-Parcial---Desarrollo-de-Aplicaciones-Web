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
}

const initialState: KanbanState = {
  columns: [
    { id: 'column1', title: 'To Do', notes: [{ id: 'note1', author: 'Author 1', category: 'General', content: 'First Task' }] },
    { id: 'column2', title: 'Doing', notes: [] },
    { id: 'column3', title: 'Done', notes: [] },
    { id: 'column4', title: 'Backlog', notes: [] },
  ],
};

type Action =
  | { type: 'MOVE_NOTE'; sourceId: string; destId: string; sourceIndex: number; destIndex: number }
  | { type: 'MOVE_COLUMN'; sourceIndex: number; destIndex: number }
  | { type: 'CHANGE_COLUMN_TITLE'; columnId: string; newTitle: string }
  | { type: 'ADD_NOTE'; columnId: string; note: Note }
  | { type: 'EDIT_NOTE'; columnId: string; noteId: string; updatedNote: Note }
  | { type: 'DELETE_NOTE'; columnId: string; noteId: string };

const kanbanReducer = (state: KanbanState, action: Action): KanbanState => {
  switch (action.type) {
    case 'MOVE_NOTE': {
      const { sourceId, destId, sourceIndex, destIndex } = action;

      const sourceColumn = state.columns.find(col => col.id === sourceId);
      const destColumn = state.columns.find(col => col.id === destId);

      if (!sourceColumn || !destColumn) return state;

      const sourceNotes = [...sourceColumn.notes];
      const [movedNote] = sourceNotes.splice(sourceIndex, 1);

      const updatedSourceColumn = { ...sourceColumn, notes: sourceNotes };

      if (sourceId === destId) {
        sourceNotes.splice(destIndex, 0, movedNote);
        const updatedColumn = { ...updatedSourceColumn, notes: sourceNotes };
        return {
          ...state,
          columns: state.columns.map(col => (col.id === sourceId ? updatedColumn : col)),
        };
      } else {
        const destNotes = [...destColumn.notes];
        destNotes.splice(destIndex, 0, movedNote);
        return {
          ...state,
          columns: state.columns.map(col =>
            col.id === sourceId
              ? updatedSourceColumn
              : col.id === destId
              ? { ...destColumn, notes: destNotes }
              : col
          ),
        };
      }
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
      const updatedColumns = state.columns.map(col =>
        col.id === columnId
          ? { ...col, notes: col.notes.filter(note => note.id !== noteId) }
          : col
      );
      return { ...state, columns: updatedColumns };
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
