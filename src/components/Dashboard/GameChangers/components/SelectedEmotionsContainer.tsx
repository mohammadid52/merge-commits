import Popover from '@atoms/Popover';
import Tooltip from '@components/Atoms/Tooltip';
import {useGlobalContext} from '@contexts/GlobalContext';
import {useNotifications} from '@contexts/NotificationContext';
import useInLessonCheck from '@customHooks/checkIfInLesson';
import useAuth from '@customHooks/useAuth';
import useGraphqlMutation from '@customHooks/useGraphqlMutation';
import {awsFormatDate, dateString} from '@utilities/time';
import {CreateFeelingsArchiveInput, CreateFeelingsArchiveMutationVariables} from 'API';
import {remove} from 'lodash';
import {nanoid} from 'nanoid';
import React, {useState} from 'react';
import {FiEdit, FiTrash2} from 'react-icons/fi';
import {useRouteMatch} from 'react-router';
import {SelectedEmotion, useGameChangers} from '../context/GameChangersContext';
import Button from './Button';
const Emotion = ({
  selectedEmotion,
  removeEmotion,
  idx,
}: {
  selectedEmotion: SelectedEmotion;
  removeEmotion: any;
  idx?: number;
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const {setReplaceIdx, setPrimaryEmotion} = useGameChangers();

  const className =
    'cursor-pointer hover:bg-white p-2 rounded-md text-white hover:bg-opacity-20 transition-all';

  const {setNotification} = useNotifications();

  return (
    <>
      <Popover
        className="w-auto"
        show={showMenu}
        bottom={2.5}
        minWidth={32}
        minHeight={'none'}
        dir={'top'}
        padding={2}
        containerClass={`bg-gray-800 border-gray-800 flex items-center`}
        rounded="lg"
        setShow={setShowMenu}
        content={
          <dl className="flex flex-row">
            <dt
              onClick={() => {
                setReplaceIdx(idx);
                setNotification({
                  title: `Now select another emotion`,
                  show: true,
                });
                setPrimaryEmotion(selectedEmotion.primary);
              }}
              className={`${className} `}>
              <FiEdit />
            </dt>

            <dt
              onClick={() => {
                setShowMenu(false);
                removeEmotion(selectedEmotion.secondary);
              }}
              className={`${className} `}>
              <FiTrash2 />
            </dt>
          </dl>
        }>
        <Tooltip show={!showMenu} placement="top" text="Click to edit">
          <div
            className={`${selectedEmotion.primary.toLowerCase()}_card  cursor-pointer py-1 px-2 rounded-md text-white`}>
            {selectedEmotion.secondary}
          </div>
        </Tooltip>
      </Popover>
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
    showFinalStep,
  } = useGameChangers();

  const removeEmotion = (emName: string) => {
    remove(selectedEmotions, (n) => n.secondary === emName);
    setSelectedEmotions([...selectedEmotions]);
  };

  const [changesSaved, setChangesSaved] = useState(false);

  const {authId, email, isStudent} = useAuth();

  const {mutate, isLoading} = useGraphqlMutation<CreateFeelingsArchiveMutationVariables>(
    'createFeelingsArchive'
  );

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
        comments: lessonState.currentPage.toString(),
      };
      mutate({input: payload});
      setShowFinalStep(true);
    } catch (error) {
      console.error(error);
    } finally {
      setChangesSaved(true);
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

  return (
    !showFinalStep && (
      <div className="flex flex-row select-none justify-center 2xl:mt-4 gap-x-4 items-center w-auto">
        <div
          style={{
            background: 'rgba(21, 19, 21, .8)',
          }}
          className="p-4 emoji-cart-container transition-all  border-2 w-auto  border-gray-900 rounded-md flex flex-row gap-x-4">
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
            <Button
              loading={isLoading}
              mt="none"
              width="w-auto"
              onClick={onSave}
              text={isLoading ? 'Saving' : 'Save'}
            />
          )}
        </div>
      </div>
    )
  );
};

export default SelectedEmotionsContainer;
