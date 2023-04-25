import React from 'react';

const RequiredMark = ({isRequired}: {isRequired: boolean}) => (
  <span className="text-red-500"> {isRequired ? '*' : null}</span>
);

export default RequiredMark;
