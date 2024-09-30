import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Note } from '../context-reducer/KanbanContext';
import CollapsedNotes from './CollapsedNotes'; 
import ExpandedNotes from './ExpandedNotes'; 

interface ColumnProps {
  column: {
    id: string;
    title: string;
    notes: Note[];
  };
  index: number;
  expanded: boolean;
  onToggleExpand: () => void;
  onDeleteNote: (noteId: string, columnId: string) => void;
  onEditNote: (note: Note) => void;
}

const Column: React.FC<ColumnProps> = ({ column, expanded, onToggleExpand, onDeleteNote, onEditNote }) => {
  return (
    <div style={{ position: 'relative', zIndex: 0, marginBottom: '20px' }}>
      <Droppable droppableId={column.id} type="note">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{
              minHeight: '150px',
              padding: '10px',
              position: 'relative',
              zIndex: 0,
              background: 'transparent',
              left: '50px',
              borderRadius: '8px',
              margin: '0 15px',
              boxSizing: 'border-box',
            }}
          >
            {!expanded ? (
              <CollapsedNotes
                column={column}
                onExpand={onToggleExpand}
                onEditNote={onEditNote}
                onDeleteNote={onDeleteNote}
              />
            ) : (
              <ExpandedNotes
                column={column}
                onCollapse={onToggleExpand}
                onEditNote={onEditNote}
                onDeleteNote={onDeleteNote}
              />
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;