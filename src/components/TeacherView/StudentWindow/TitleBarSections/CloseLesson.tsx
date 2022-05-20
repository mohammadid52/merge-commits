import useGraphqlMutation from '@customHooks/useGraphqlMutation';
import React, {useState} from 'react';
import {AiOutlineCloseCircle} from 'react-icons/ai';
import axios from 'axios';
import {getLocalStorageData} from '@utilities/localStorage';
import {useGlobalContext} from '@contexts/GlobalContext';
import {useHistory, useRouteMatch} from 'react-router';
import {tableCleanupUrl} from '@utilities/urls';
import ModalPopUp from '@components/Molecules/ModalPopUp';

const CloseLesson = ({}) => {
  const {mutate, isError, isSuccess, isLoading} = useGraphqlMutation('updateRoom');
  const getRoomData = getLocalStorageData('room_info');
  const roomID = getRoomData.id;
  const history = useHistory();
  const {state} = useGlobalContext();

  const router: any = useRouteMatch();
  const lessonId = router.params.lessonID || '999';

  const [warnModal, setWarnModal] = useState({
    show: false,
    activeLessonsId: [],
    lessonID: lessonId,
    message: 'Do you want to mark these active lessons as closed?',
  });

  const onCloseModal = () => {
    setWarnModal({
      message: '',
      activeLessonsId: [],
      lessonID: '',
      show: false,
    });
  };

  const onShowModal = () => {
    setWarnModal((prevValues) => ({
      ...prevValues,
      lessonID: lessonId,
      message: 'Do you want to mark these active lesson as closed?',
      show: true,
    }));
  };

  const handleMarkAsCompleteClick = async () => {
    // UPDATE ROOM MUTATION
    try {
      let allCompletedLessons = getRoomData?.completedLessons || [];

      mutate({
        input: {
          id: roomID,
          completedLessons: [
            ...allCompletedLessons,
            {
              lessonID: lessonId,
              time: new Date().toISOString(),
            },
          ],
          activeLessons: [lessonId],
        },
      });
      // if (warnModal.lessonID) {
      //   // POST TO LAMBDA
      //   await axios.post(tableCleanupUrl, {
      //     lessonID: warnModal.lessonID,
      //     syllabusID: getRoomData.activeSyllabus,
      //     roomID: getRoomData.id,
      //   });
      // }
    } catch (e) {
      console.error('handleMarkAsCompleteClick() - ', e);
    } finally {
      history.push(`/dashboard/classroom/${getRoomData.id}`);
      // http://localhost:8085/dashboard/classroom/:roomId
      onCloseModal();
    }
  };

  return (
    <div className="w-8 flex flex-col content-between ">
      <div
        title="Close lesson/survey"
        className={`text-gray-600 hover:iconoclast:text-500 hover:curate:text-500 cursor-pointer`}
        onClick={onShowModal}>
        <AiOutlineCloseCircle size="1.5rem" />
      </div>

      {warnModal.show && (
        <ModalPopUp
          closeAction={onCloseModal}
          cancelAction={onCloseModal}
          saveAction={handleMarkAsCompleteClick}
          saveLabel={isLoading ? 'Processing...' : 'Yes'}
          cancelLabel="No"
          message={warnModal.message}
        />
      )}
    </div>
  );
};

export default CloseLesson;
