import React from 'react';
import {children} from '../../../../../../interfaces';

const PreviewLayout = ({
  children,
  notAvailable,
}: {
  children: children;
  notAvailable?: string | boolean;
}) => {
  return (
    <div
      className={` ${
        notAvailable ? 'h-56' : 'max-h-132'
      } overflow-y-auto rounded-lg shadow bg-dark-gray py-4 px-6`}>
      {notAvailable ? (
        <div className="h-full flex items-center w-auto justify-center">
          <p className="w-auto text-center text-gray-400">{notAvailable}</p>
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default PreviewLayout;
