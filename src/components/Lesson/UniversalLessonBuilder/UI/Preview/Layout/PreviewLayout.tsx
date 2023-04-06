import React from 'react';
import {children} from 'interfaces/index';

const PreviewLayout = ({
  children,
  notAvailable,
  overflow = 'overflow-y-auto'
}: {
  children: children;
  overflow?: string;
  notAvailable?: string | boolean;
}) => {
  return (
    <div
      className={` ${
        notAvailable ? 'h-56' : 'max-h-132'
      } ${overflow} rounded-lg shadow bg-dark py-4 px-6`}>
      {notAvailable ? (
        <div className="h-full flex items-center w-auto justify-center">
          <p className="w-auto text-center text-light ">{notAvailable}</p>
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default PreviewLayout;
