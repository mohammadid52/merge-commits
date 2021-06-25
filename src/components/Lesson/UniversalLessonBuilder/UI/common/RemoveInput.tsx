import React from 'react';

const RemoveInput = ({
  idx,
  inputId,
  removeItemFromList,
}: {
  idx: number;
  inputId: string;
  removeItemFromList: (id: string) => void;
}) => {
  return (
    <div>
      {idx !== 0 ? (
        <div className="flex my-2 items-center justify-end w-auto mx-3">
          <button
            onClick={() => removeItemFromList(inputId)}
            className={`text-center transition-all duration-200 hover:bg-red-200 text-xs font-semibold text-red-400 border-red-200 px-2 py-1 cursor-pointer rounded mt-2 border-2 hover:text-red-600 w-auto`}>
            Remove
          </button>
        </div>
      ) : (
        <div className="flex my-2 items-center justify-end w-auto mx-3">
          <div className={`px-2 py-1 `} />
        </div>
      )}
    </div>
  );
};

export default RemoveInput;
