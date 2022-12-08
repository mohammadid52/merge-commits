import React from 'react';

import UserLookup from '../UserManagement/UserLookup';

const Students = (props: any) => {
  return (
    <div className="my-6">
      <UserLookup isStudentRoster {...props} />
    </div>
  );
};

export default Students;
