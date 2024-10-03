// CategoriesModal.tsx
import React, { useMemo } from 'react';
import styled from 'styled-components';

const CategoryBadge = styled.div<{ color: string }>`
  display: inline-block;
  padding: 5px 10px;
  margin: 5px;
  border-radius: 15px;
  background-color: ${({ color }) => color};
  color: white;
  font-size: 12px;
  cursor: pointer;
`;

interface CategoriesModalProps {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
}

const categories = [
  { name: 'Tasks', color: '#FF5733' },
  { name: 'Work', color: '#33C1FF' },
  { name: 'Personal', color: '#28A745' },
  { name: 'General', color: '#B7B7B7' },
  { name: 'Goal', color: '#C96868' },
  { name: 'Note', color: '#A28B55' },
];

const CategoriesModal: React.FC<CategoriesModalProps> = ({
  selectedCategories,
  setSelectedCategories,
}) => {
  const renderedCategories = useMemo(
    () =>
      categories.map((category) => (
        <CategoryBadge
          key={category.name}
          color={category.color}
          onClick={() => setSelectedCategories([category.name])} // Selecciona solo una categoría
        >
          {category.name}
        </CategoryBadge>
      )),
    [selectedCategories, setSelectedCategories]
  );

  return <div>{renderedCategories}</div>;
};

export default CategoriesModal;