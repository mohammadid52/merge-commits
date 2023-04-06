import React from 'react';

import UserLookup from '../UserManagement/UserLookup';

const Students = (props: any) => {
  return <UserLookup isStudentRoster {...props} />;
};

export default Students;
