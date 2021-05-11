import React, {useContext, useState} from 'react';

const AddPagePartDialog = () => {
  return (
    <div className={`grid grid-cols-2 gap-2`}>
      <div>
        <h2>Column</h2>
        <ul className="divide-y-2 divide-gray-200 divide-opacity-75 md:divide-opacity-50">
          <li className="py-4">Option</li>
          <li className="py-4">Option</li>
          <li className="py-4">Option</li>
        </ul>
      </div>
      <div>
        <h2>Column</h2>
        <ul className="divide-y-2 divide-gray-200 divide-opacity-75 md:divide-opacity-50">
          <li className="py-4">Option</li>
          <li className="py-4">Option</li>
          <li className="py-4">Option</li>
        </ul>
      </div>
    </div>
  );
};

export default AddPagePartDialog;
