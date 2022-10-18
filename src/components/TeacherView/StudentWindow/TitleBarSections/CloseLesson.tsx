import ModalPopUp from 'components/Molecules/ModalPopUp';
import {useGlobalContext} from 'contexts/GlobalContext';
import useLessonControls from 'customHooks/lessonControls';
import useAuth from 'customHooks/useAuth';
import useGraphqlMutation from 'customHooks/useGraphqlMutation';
import {getLocalStorageData, setLocalStorageData} from 'utilities/localStorage';
import React, {useState} from 'react';
import {AiOutlineCloseCircle} from 'react-icons/ai';
import {useHistory, useRouteMatch} from 'react-router';

const CloseLesson = ({}) => {
  const {mutate, isError, isSuccess, isLoading} = useGraphqlMutation('updateRoom');
  const getRoomData = getLocalStorageData('room_info');
  const roomID = getRoomData.id;
  const history = useHistory();
  const {lessonState, lessonDispatch} = useGlobalContext();
  const {isStudent, authId} = useAuth();
  const {handleRoomUpdate, getPageID} = useLessonControls();

  const MODAL_TEXT = 'Do you want to mark this lesson as completed?';
  const MODAL_SUBTEXT =
    "This will move the writing exercises from the live classroom to the live classroom to the student's notebook and show as completed on the classroom page";

  const router: any = useRouteMatch();
  const lessonId = router.params.lessonID || '999';

  const [warnModal, setWarnModal] = useState({
    show: false,
    activeLessonsId: [],
    lessonID: lessonId,
    message: MODAL_TEXT
  });

  const onCloseModal = () => {
    setWarnModal({
      message: '',
      activeLessonsId: [],
      lessonID: '',
      show: false
    });
  };

  const onShowModal = () => {
    setWarnModal((prevValues) => ({
      ...prevValues,
      lessonID: lessonId,
      message: MODAL_TEXT,
      show: true
    }));
  };

  const lessonData = lessonState.lessonData;
  const currentPage = lessonState.currentPage;

  const handleMarkAsCompleteClick = async () => {
    // UPDATE ROOM MUTATION
    try {
      let allCompletedLessons = getRoomData?.completedLessons || [];
      const displayData = [
        {
          isTeacher: false,
          studentAuthID: 'closed',
          lessonPageID: ''
        }
      ];
      lessonDispatch({
        type: 'SET_ROOM_SUBSCRIPTION_DATA',
        payload: {
          id: getRoomData.id,
          displayData: displayData
        }
      });

      setLocalStorageData('room_info', {
        ...getRoomData,
        studentViewing: 'closed',
        displayData: displayData
      });
      await handleRoomUpdate({
        id: getRoomData.id,
        studentViewing: 'closed',
        completedLessons: [
          ...allCompletedLessons,
          {
            lessonID: lessonId,
            time: new Date().toISOString()
          }
        ],
        activeLessons: [lessonId],
        displayData: displayData
      });
    } catch (e) {
      console.error('handleMarkAsCompleteClick() - ', e);
    } finally {
      noButtonAction();
    }
  };

  const noButtonAction = () => {
    // http://localhost:8085/dashboard/classroom/:roomId
    history.push(`/dashboard/classroom/${getRoomData.id}`);
    onCloseModal();
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
          smallText={MODAL_SUBTEXT}
          closeAction={onCloseModal}
          cancelAction={onCloseModal}
          noButtonAction={noButtonAction}
          noButton="No, I just want to exit classroom"
          saveAction={handleMarkAsCompleteClick}
          // saveAction={() => {}}
          saveLabel={isLoading ? 'Processing...' : 'Yes'}
          cancelLabel="Cancel"
          message={warnModal.message}
        />
      )}
    </div>
  );
};

export default CloseLesson;

// '3efb5ad7-933c-4d6b-ae19-27c290fa07d5', syllabusID: '9626d3c9-f005-4fc3-8c2f-acbebe5bfcba', lessonID: 'f0b5022f-12d0-4680-aac6-fc8e03e7cca0', unit: null, sequence: null, …}
// 1: {id: 'bd328fd9-b189-4456-97e1-69a8dffe8b23', syllabusID: '9626d3c9-f005-4fc3-8c2f-acbebe5bfcba', lessonID: 'a813f957-d974-4c5c-95b0-7b4e2bf1b624', unit: null, sequence: null, …}
// 2: {id: 'ae35b0b2-a93e-4aa3-892c-a017a87563af', syllabusID: '9626d3c9-f005-4fc3-8c2f-acbebe5bfcba', lessonID: '27457d28-3154-4588-8f79-2fb3c3929585', unit: null, sequence: null, …}
// 3: {id: '559a675b-d4f1-4255-9de2-f3e1719a0d46', syllabusID: '9626d3c9-f005-4fc3-8c2f-acbebe5bfcba', lessonID: 'fcf05d90-be06-4821-bd99-ed8511cb9697', unit: null, sequence: null, …}
// 4: {id: '6746699f-f13e-4b53-a554-551c005215b9', syllabusID: '9626d3c9-f005-4fc3-8c2f-acbebe5bfcba', lessonID: '6b4f553d-b25c-47a2-98d0-894ca4caa129', unit: null, sequence: null, …}
// 5: {id: 'e81f350f-11b2-4944-998b-081710a8d3fc', syllabusID: '9626d3c9-f005-4fc3-8c2f-acbebe5bfcba', lessonID: 'aa5106f4-7465-470e-8b3e-1a1c6730933f', unit: null, sequence: null, …}
// 6: {id: 'cbfb6c32-a546-433f-b8e5-fc30580fd5d4'
