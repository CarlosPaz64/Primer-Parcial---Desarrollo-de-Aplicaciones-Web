// TagsModal.tsx
import React, { useMemo } from 'react';
import styled from 'styled-components';

const TagBadge = styled.div<{ color: string }>`
  display: inline-block;
  padding: 5px 10px;
  margin: 5px;
  border-radius: 15px;
  background-color: ${({ color }) => color};
  color: white;
  font-size: 12px;
  cursor: pointer;
`;

interface TagsModalProps {
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
}

const tags = [
  { name: 'Travels', color: '#FF33A8' },
  { name: 'Animals', color: '#FFC107' },
  { name: 'Lifestyle', color: '#8E44AD' },
  { name: 'Friends', color: '#295F98' },
  { name: 'Family', color: '#705C53' },
  { name: 'School', color: '#A6B37D' },
];

const TagsModal: React.FC<TagsModalProps> = ({ selectedTags, setSelectedTags }) => {
  const renderedTags = useMemo(
    () =>
      tags.map((tag) => (
        <TagBadge
          key={tag.name}
          color={tag.color}
          onClick={() =>
            setSelectedTags(
              selectedTags.includes(tag.name)
                ? selectedTags.filter((t) => t !== tag.name)
                : [...selectedTags, tag.name]
            )
          }
        >
          {tag.name}
        </TagBadge>
      )),
    [selectedTags, setSelectedTags]
  );

  return <div>{renderedTags}</div>;
};

export default TagsModal;