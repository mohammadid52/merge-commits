import React from 'react';
import {HiOutlineTrash} from 'react-icons/hi';

interface IDeleteActionBtnInterface {
  handleClick?: () => void;
  dataCy?: string;
}

export const DeleteActionBtn = ({handleClick, dataCy}: IDeleteActionBtnInterface) => {
  return (
    <HiOutlineTrash
      data-cy={dataCy}
      className="w-4 h-4 text-red-500 cursor-pointer"
      onClick={handleClick}
    />
  );
};
