import React, {ReactNode} from 'react';

const NoResultsInput = ({children}: {children: ReactNode}) => {
  const dark = false;
  return <p>{children}</p>;
};

export default NoResultsInput;
