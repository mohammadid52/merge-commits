import React, {useContext, useState} from 'react';

const UseTemplateDialog = () => {
  return (
    <div>
      <h1>UseTemplateDialog</h1>
      <div className={`grid grid-cols-2 gap-2`}>
        <div>
          <h2>Column</h2>
          <ul className="divide-y divide-gray-200">
            <li className="py-4">
              Option
            </li>
            <li className="py-4">
              Option
            </li>
            <li className="py-4">
              Option
            </li>
          </ul>
        </div>
        <div>
          <h2>Column</h2>
          <ul className="divide-y divide-gray-200">
            <li className="py-4">
              Option
            </li>
            <li className="py-4">
              Option
            </li>
            <li className="py-4">
              Option
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UseTemplateDialog;
