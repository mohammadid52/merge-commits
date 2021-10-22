import React from 'react';
import {IoMdAddCircleOutline} from 'react-icons/io';

const AddNewCard = ({
  onClick,
  cardRef,
}: {
  onClick: () => void;
  cardRef?: React.LegacyRef<HTMLDivElement>;
}) => {
  return (
    <div ref={cardRef}>
      <p className="mb-8 text-gray-900 text-center">
        Click on the button below to add community cards
      </p>
      <div
        onClick={onClick}
        className={`w-full focus:scale-95 scale-100 transform h-48 cursor-pointer flex justify-center items-center rounded z-0 hover:border-gray-400 transition-all border-0`}>
        <div className={`w-auto flex items-center justify-center flex-col`}>
          <IoMdAddCircleOutline className="text-gray-700 h-12 w-12 text-center" />
          <p className={`text-center text-gray-700 text-xl`}>Add New Card</p>
        </div>
      </div>
    </div>
  );
};

export default AddNewCard;
