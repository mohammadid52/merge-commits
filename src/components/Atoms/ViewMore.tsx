import React, { MouseEventHandler } from 'react';

const ViewMore = ({ text, onClick }: { text: String; onClick: MouseEventHandler }): React.ReactElement => {
  return (
    <div className="w-auto float-right">
      <button
        onClick={onClick}
        type="button"
        className="inline-flex items-center px-3 py-2 border-0 border-gray-300 shadow-sm text-sm leading-4 font-semibold rounded-md text-gray-700 bg-white hover:bg-gray-100 focus:outline-none">
        {text}
      </button>
    </div>
  );
};

export default ViewMore;
