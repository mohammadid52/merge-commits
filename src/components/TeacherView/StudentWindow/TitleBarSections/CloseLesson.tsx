import {updateRoom} from '@customGraphql/customMutations';
import {useGlobalContext} from 'contexts/GlobalContext';
import useLessonControls from 'customHooks/lessonControls';
import useGraphqlMutation from 'customHooks/useGraphqlMutation';
import ModalPopUp from 'molecules/ModalPopUp';
import {useState} from 'react';
import {AiOutlineCloseCircle} from 'react-icons/ai';
import {useHistory, useRouteMatch} from 'react-router';
import {getLocalStorageData, setLocalStorageData} from 'utilities/localStorage';

const CloseLesson = ({}) => {
  const {isLoading} = useGraphqlMutation(updateRoom);
  const getRoomData = getLocalStorageData('room_info');
  const history = useHistory();
  const {lessonDispatch} = useGlobalContext();

  const {handleRoomUpdate} = useLessonControls();

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
    history.push(`/dashboard/classroom/${getRoomData.id}`);
    onCloseModal();
  };

  return (
    <div className="w-8 flex flex-col content-between ">
      <div
        title="Close lesson/survey"
        className={`text-medium  hover:iconoclast:text-500 hover:curate:text-500 cursor-pointer`}
        onClick={onShowModal}>
        <AiOutlineCloseCircle size="1.5rem" />
      </div>

      <ModalPopUp
        open={warnModal.show}
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
    </div>
  );
};

export default CloseLesson;
