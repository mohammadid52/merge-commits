import DotMenu from '@components/TeacherView/ClassRoster/RosterRow/DotMenu';
import {
  CreateFeelingsArchiveInput,
  CreateFeelingsArchiveMutationVariables,
  FeelingsArchive
} from 'API';
import Loader from 'atoms/Loader';
import {useGlobalContext} from 'contexts/GlobalContext';
import {useNotifications} from 'contexts/NotificationContext';
import useInLessonCheck from 'customHooks/checkIfInLesson';
import useAuth from 'customHooks/useAuth';
import useGraphqlMutation from 'customHooks/useGraphqlMutation';
import {remove} from 'lodash';
import ThemeModal from 'molecules/ThemeModal';
import {nanoid} from 'nanoid';
import {useState} from 'react';
import {useRouteMatch} from 'react-router';
import {awsFormatDate, dateString} from 'utilities/time';
import {SelectedEmotion, useGameChangers} from '../context/GameChangersContext';
import Button from './Button';
import {createFeelingsArchive} from '@graphql/mutations';
const Emotion = ({
  selectedEmotion,
  removeEmotion,
  idx = 0
}: {
  selectedEmotion: SelectedEmotion;
  removeEmotion: any;
  idx?: number;
}) => {
  const {setReplaceIdx, setPrimaryEmotion} = useGameChangers();

  const {setNotification} = useNotifications();

  return (
    <>
      <DotMenu
        menuItems={[
          {
            label: 'Edit',
            action: () => {
              setReplaceIdx(idx);
              setNotification({
                title: `Now select another emotion`,
                show: true
              });
              setPrimaryEmotion(selectedEmotion.primary);
            }
          },
          {
            label: 'Delete',
            action: () => {
              removeEmotion(selectedEmotion.secondary);
            },
            danger: true
          }
        ]}>
        <div
          className={`${selectedEmotion.primary.toLowerCase()}_card  cursor-pointer py-1 px-2 rounded-md text-white`}>
          {selectedEmotion.secondary}
        </div>
      </DotMenu>
    </>
  );
};

const SelectedEmotionsContainer = () => {
  const {
    setSelectedEmotions,
    selectedEmotions,
    primaryEmotion,

    setSecondaryEmotion,
    setPrimaryEmotion,
    setShowFinalStep,
    showFinalStep
  } = useGameChangers();

  const removeEmotion = (emName: string) => {
    remove(selectedEmotions, (n) => n.secondary === emName);
    setSelectedEmotions([...selectedEmotions]);
  };

  const [_, setChangesSaved] = useState(false);

  const {authId, email, isStudent} = useAuth();

  const {mutate, isLoading} = useGraphqlMutation<
    CreateFeelingsArchiveMutationVariables,
    FeelingsArchive
  >(createFeelingsArchive);

  const onSave = () => {
    try {
      const payload: CreateFeelingsArchiveInput = {
        personAuthID: authId,
        personEmail: email,
        sentimentId: nanoid(24),
        id: nanoid(24),
        sentimentName: selectedEmotions.map((em) => em.secondary),

        time: new Date().toTimeString().split(' ')[0],
        date: awsFormatDate(dateString('-', 'WORLD')),
        classRoomID: classId,
        lessonID: lessonId,
        comments: lessonState.currentPage.toString()
      };
      mutate({input: payload});
      setShowFinalStep(true);
    } catch (error) {
      console.error(error);
    } finally {
      setChangesSaved(true);
      setVisible(false);
    }
  };

  const {lessonState} = useGlobalContext();

  const isInLesson = useInLessonCheck();
  const router = useRouteMatch();

  // @ts-ignore
  let lessonId = isInLesson ? router.params.lessonID : '999';
  let classId = '999';

  const onBack = () => {
    setSecondaryEmotion('');
    setPrimaryEmotion('');
  };

  const [visible, setVisible] = useState(false);

  const handlePopup = () => setVisible((prev) => !prev);

  return (
    <>
      <ThemeModal open={visible} max={{w: 132}} setOpen={setVisible}>
        <div className="w-auto">
          <div className="mt-2">
            <p className="text-lg leading-5 text-white text-center">
              Are you sure you want to save this?
            </p>
          </div>
          <div className={`mt-5   sm:mt-6 flex flex-col`}>
            {/* YES */}
            <p className={`w-auto flex rounded-md shadow-sm text-white`}>
              <button
                type="button"
                disabled={isLoading}
                className={`${'bg-sea-green hover:bg-green-500 text-white focus:border-green-100 focus:ring-indigo'} inline-flex justify-center w-full rounded-md  border-0 border-transparent px-4 py-2 text-base leading-6 font-medium shadow-sm focus:outline-none transition ease-in-out duration-150 sm:text-sm sm:leading-5`}
                onClick={onSave}>
                {isLoading ? <Loader /> : 'Yes, Save It!'}
              </button>
            </p>

            {/* NO */}
            <p className={`w-auto flex rounded-md shadow-sm text-white`}>
              <button
                disabled={isLoading}
                type="button"
                className={`text-medium  hover:text-white w-full inline-flex justify-center  rounded-md px-4 py-2 text-base leading-6 font-medium transition ease-in-out duration-150 sm:text-sm sm:leading-5`}
                onClick={() => setVisible(false)}>
                No, Don't Save It
              </button>
            </p>
          </div>
        </div>
      </ThemeModal>
      {!showFinalStep && (
        <div className="flex flex-col select-none justify-center 2xl:mt-4 gap-y-4 items-center w-auto">
          <div className="p-2 px-3 emoji-cart-container transition-all  border-0 w-auto  border-darkest    rounded-md flex flex-row gap-x-4">
            {selectedEmotions.map((selectedEmotion, idx) => {
              return (
                <Emotion
                  key={selectedEmotion.secondary}
                  removeEmotion={removeEmotion}
                  selectedEmotion={selectedEmotion}
                  idx={idx}
                />
              );
            })}
          </div>
          <div className="flex flex-row items-center justify-center w-auto gap-x-4">
            {primaryEmotion && (
              <Button mt="none" width="w-auto" onClick={onBack} text="Select another" />
            )}
            {isStudent && (
              <Button mt="none" width="w-auto" onClick={handlePopup} text={'Save'} />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SelectedEmotionsContainer;
