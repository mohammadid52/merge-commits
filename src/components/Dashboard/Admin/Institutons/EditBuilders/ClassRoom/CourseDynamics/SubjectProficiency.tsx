import React, {useState} from 'react';

import AddButton from '../../../../../../Atoms/Buttons/AddButton';

import GroupCard from './GroupCards';
import GroupFormComponent from './GroupFormComponent';

const SubjectProficiency = ({roomData}: any) => {
  const [groupFormOpen, setGroupFormOpen] = useState(false);

  const handleCancel = () => {
    setGroupFormOpen(false);
  };

  return (
    <div>
      <div className="flex justify-end my-8">
        <AddButton
          className="ml-4 py-1 cursor-pointer"
          label={'Group'}
          onClick={() => setGroupFormOpen(true)}
        />
      </div>
      <div className="w-full flex justify-between mt-4">
        <div className="grid px-2 xl:px-6 gap-5 grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 lg:max-w-none">
          {[
            {
              name: 'Group 1',
              students: [
                {
                  id: 'b7cac388-8348-481b-931e-39a33e9f3ef3',
                  firstName: 'student',
                  preferredName: 'John',
                  lastName: 'student',
                },
                {
                  id: 'b7cac388-8348-481b-931e-39a33e9f3ef3',
                  firstName: 'Sam',
                  preferredName: 'John',
                  lastName: 'student',
                },
              ],
            },
            {
              name: 'Group 2',
              students: [
                {
                  id: 'b7cac388-8348-481b-931e-39a33e9f3ef3',
                  firstName: 'Max',
                  preferredName: 'John',
                  lastName: 'student',
                },
                {
                  id: 'b7cac388-8348-481b-931e-39a33e9f3ef3',
                  firstName: 'Dan',
                  preferredName: 'John',
                  lastName: 'student',
                },
              ],
            },
          ].map((group) => (
            <GroupCard group={group} />
          ))}
        </div>
      </div>
      <GroupFormComponent
        open={groupFormOpen}
        onCancel={handleCancel}
        roomData={roomData}
      />
    </div>
  );
};

export default SubjectProficiency;
