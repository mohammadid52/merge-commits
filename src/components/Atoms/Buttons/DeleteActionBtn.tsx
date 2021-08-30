import React from 'react';
import {HiOutlineTrash} from 'react-icons/hi';

interface IDeleteActionBtnInterface {
  handleClick?: () => void;
}

export const DeleteActionBtn = ({handleClick}: IDeleteActionBtnInterface) => {
  return <HiOutlineTrash className="w-4 h-4 text-red-500 cursor-pointer" onClick={handleClick} />;
};
