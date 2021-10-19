import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router';
import API, {graphqlOperation} from '@aws-amplify/api';

import * as customQueries from '../../../../../../../customGraphql/customQueries';
import * as customMutations from '../../../../../../../customGraphql/customMutations';

import AddButton from '../../../../../../Atoms/Buttons/AddButton';
import Loader from '../../../../../../Atoms/Loader';
import ModalPopUp from '../../../../../../Molecules/ModalPopUp';

import GroupCard from './GroupCards';
import GroupFormComponent from './GroupFormComponent';

interface ICoursePartnerProps {
  roomData: any;
}

const CoursePartner = ({roomData}: ICoursePartnerProps) => {
  const history = useHistory();
  const [loading, setLoading] = useState<boolean>(true);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [groupFormOpen, setGroupFormOpen] = useState<boolean>(false);
  const [activeGroupData, setActiveGroupData] = useState<any>({});
  const [classRoomGroups, setClassRoomGroups] = useState<any>([]);
  const [serverError, setServerError] = useState('');
  const [warnModal, setWarnModal] = useState({
    show: false,
    message: 'It will remove students from group',
    action: () => {},
  });

  useEffect(() => {
    if (roomData?.id) {
      getClassRoomStudents();
    }
  }, [roomData?.id]);

  const getClassRoomStudents = async () => {
    try {
      setLoading(true);
      const list: any = await API.graphql(
        graphqlOperation(customQueries.listClassroomGroupss, {
          filter: {
            classRoomID: {eq: roomData?.id},
            groupType: {eq: 'Partner'},
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
    setActiveGroupData({});
  };
  const onDelete = (group: any) => {
    const onDrop = async () => {
      setDeleting(true);
      const result: any = await API.graphql(
        graphqlOperation(customMutations.deleteClassroomGroups, {
          input: {id: group?.id},
        })
      );
      if (group.classroomGroupsStudents?.items?.length) {
        await Promise.all(
          group.classroomGroupsStudents?.items?.map(
            async (student: any) =>
              await API.graphql(
                graphqlOperation(customMutations.deleteClassroomGroupStudents, {
                  input: {id: student.id},
                })
              )
          )
        );
      }
      setClassRoomGroups((prevGroups: any) =>
        prevGroups.filter(
          (group: any) => group.id !== result?.data?.deleteClassroomGroups.id
        )
      );
      closeDeleteModal();
      setDeleting(false);
    };
    setWarnModal((prevValues) => ({
      ...prevValues,
      show: true,
      action: onDrop,
    }));
  };
  const closeDeleteModal = () => {
    setWarnModal((prevValues) => ({...prevValues, show: false}));
  };

  const redirectToUserPage = (studentId: string) => {
    history.push(
      `/dashboard/manage-institutions/institution/${roomData.institutionID}/users/${studentId}`
    );
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
          <div className="grid gap-5 grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 lg:max-w-none">
            {classRoomGroups?.map((group: any) => (
              <GroupCard
                group={group}
                key={group.id}
                handleEditClick={handleEditClick}
                handleDelete={() => onDelete(group)}
                redirectToUserPage={redirectToUserPage}
              />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center">No group added</div>
        )}
      </div>
      <div className="py-2 m-auto text-center">
        <p className={`text-red-600`}>{serverError}</p>
      </div>
      <GroupFormComponent
        groupData={activeGroupData}
        groupType={'Partner'}
        open={groupFormOpen}
        onCancel={handleCancel}
        postMutation={postMutation}
        roomData={roomData}
      />

      {warnModal.show && (
        <ModalPopUp
          closeAction={closeDeleteModal}
          saveAction={warnModal.action}
          saveLabel="Yes"
          message={warnModal.message}
          loading={deleting}
        />
      )}
    </div>
  );
};

export default CoursePartner;
