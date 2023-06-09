import {API, graphqlOperation} from 'aws-amplify';
import {useEffect, useState} from 'react';
import {useHistory} from 'react-router';

import {
  deleteClassroomGroups,
  deleteClassroomGroupStudents
} from 'customGraphql/customMutations';
import {listClassroomGroupss} from 'customGraphql/customQueries';

import AddButton from 'atoms/Buttons/AddButton';
import Loader from 'atoms/Loader';

import {useGlobalContext} from 'contexts/GlobalContext';
import ModalPopUp from 'molecules/ModalPopUp';
import GroupCard from './GroupCards';
import GroupFormComponent from './GroupFormComponent';

interface ISubjectProficiencyProps {
  roomData: any;
}

const SubjectProficiency = ({roomData}: ISubjectProficiencyProps) => {
  const history = useHistory();

  const {
    state: {user}
  } = useGlobalContext();
  const isSuperAdmin = user.role === 'SUP';

  const [loading, setLoading] = useState<boolean>(true);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [groupFormOpen, setGroupFormOpen] = useState<boolean>(false);
  const [activeGroupData, setActiveGroupData] = useState<any>({});
  const [classRoomGroups, setClassRoomGroups] = useState<any>([]);
  const [serverError, setServerError] = useState('');
  const [warnModal, setWarnModal] = useState({
    show: false,
    message: 'It will remove students from group',
    action: () => {}
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
        graphqlOperation(listClassroomGroupss, {
          filter: {
            classRoomID: {eq: roomData?.id},
            groupType: {eq: 'Proficiency'}
          }
        })
      );
      setClassRoomGroups(list?.data?.listClassroomGroups.items);
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
                    ...data.classroomGroupsStudents
                  }
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
        graphqlOperation(deleteClassroomGroups, {
          input: {id: group?.id}
        })
      );
      if (group.classroomGroupsStudents?.items?.length) {
        await Promise.all(
          group.classroomGroupsStudents?.items?.map(
            async (student: any) =>
              await API.graphql(
                graphqlOperation(deleteClassroomGroupStudents, {
                  input: {id: student.id}
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
      action: onDrop
    }));
  };
  const closeDeleteModal = () => {
    setWarnModal((prevValues) => ({...prevValues, show: false}));
  };

  const redirectToUserPage = (studentId: string) => {
    history.push(
      isSuperAdmin
        ? `/dashboard/manage-institutions/users/${studentId}`
        : `/dashboard/manage-institutions/institution/${roomData.institutionID}/users/${studentId}`
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
              <Loader />
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
        groupType={'Proficiency'}
        open={groupFormOpen}
        onCancel={handleCancel}
        postMutation={postMutation}
        roomData={roomData}
      />

      <ModalPopUp
        open={warnModal.show}
        closeAction={closeDeleteModal}
        saveAction={warnModal.action}
        saveLabel="Yes"
        message={warnModal.message}
        loading={deleting}
      />
    </div>
  );
};

export default SubjectProficiency;
