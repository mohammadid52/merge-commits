import React from 'react';
import Buttons from '../../../Atoms/Buttons';
import { AiOutlineEdit } from 'react-icons/ai';

interface ITagBlockInterface {
  tags: string[];
  handleEditTag: () => void;
}

const TagBlock = ({tags, handleEditTag}: ITagBlockInterface) => {
  return (
    <div className="flex">
      {tags.map((tag: string, index: number) => (
        <span
          className="text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 ml-1 bg-blue-200 text-blue-700 rounded-lg w-auto"
          key={index}>
          {tag}
        </span>
      ))}
      <span
        className="text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 ml-1 bg-blue-200 text-blue-700 rounded-lg w-12 cursor-pointer"
        onClick={handleEditTag}>
        <AiOutlineEdit size={12} />
      </span>
    </div>
  );
};

export default TagBlock;