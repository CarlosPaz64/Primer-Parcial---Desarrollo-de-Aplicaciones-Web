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
          onClick={() =>
            setSelectedCategories(
              selectedCategories.includes(category.name)
                ? selectedCategories.filter((c) => c !== category.name)
                : [...selectedCategories, category.name]
            )
          }
        >
          {category.name}
        </CategoryBadge>
      )),
    [selectedCategories, setSelectedCategories]
  );

  return <div>{renderedCategories}</div>;
};

export default CategoriesModal;