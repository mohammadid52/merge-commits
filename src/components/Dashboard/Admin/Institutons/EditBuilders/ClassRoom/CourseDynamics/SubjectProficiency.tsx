import React, {useState} from 'react';
import API, {graphqlOperation} from '@aws-amplify/api';

import * as customQueries from '../../../../../../../customGraphql/customQueries';

import AddButton from '../../../../../../Atoms/Buttons/AddButton';
import Loader from '../../../../../../Atoms/Loader';

import GroupCard from './GroupCards';
import GroupFormComponent from './GroupFormComponent';
import {useEffect} from 'react';

const SubjectProficiency = ({roomData}: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [groupFormOpen, setGroupFormOpen] = useState<boolean>(false);
  const [activeGroupData, setActiveGroupData] = useState<any>({});
  const [classRoomGroups, setClassRoomGroups] = useState<any>([]);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    getClassRoomStudents();
  }, [roomData?.id]);

  const getClassRoomStudents = async () => {
    try {
      setLoading(true);
      const list: any = await API.graphql(
        graphqlOperation(customQueries.listClassroomGroupss, {
          filter: {
            classRoomID: {eq: roomData?.id},
          },
        })
      );
      setClassRoomGroups(list?.data?.listClassroomGroupss.items);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setServerError('Error while fetching class room groups');
    }
  };

  const handleEditClick = (data: any) => {
    setActiveGroupData(data);
    setGroupFormOpen(true);
  };

  const postMutation = (data: any) => {
    setClassRoomGroups((prevGroups: any) =>
      activeGroupData?.id
        ? prevGroups.map((group: any) =>
            group.id === activeGroupData?.id
              ? {
                  ...data,
                  classroomGroupsStudents: {
                    ...group.classroomGroupsStudents,
                    ...data.classroomGroupsStudents,
                  },
                }
              : group
          )
        : [data, ...prevGroups]
    );
    setActiveGroupData({});
    setGroupFormOpen(false);
  };

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
        {loading ? (
          <div className="py-20 text-center mx-auto flex justify-center items-center w-full h-48">
            <div className="w-5/10">
              <Loader color="rgba(107, 114, 128, 1)" />
            </div>
          </div>
        ) : classRoomGroups?.length ? (
          <div className="grid px-2 xl:px-6 gap-5 grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 lg:max-w-none">
            {classRoomGroups?.map((group: any) => (
              <GroupCard group={group} key={group.id} handleEditClick={handleEditClick} />
            ))}
          </div>
        ) : (
          <div>No group added</div>
        )}
      </div>
      <div className="py-2 m-auto text-center">
        <p className={`text-red-600`}>{serverError}</p>
      </div>
      <GroupFormComponent
        open={groupFormOpen}
        onCancel={handleCancel}
        roomData={roomData}
        groupData={activeGroupData}
        postMutation={postMutation}
      />
    </div>
  );
};

export default SubjectProficiency;
