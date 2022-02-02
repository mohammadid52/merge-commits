import Loader from '@components/Atoms/Loader';
import AnimatedContainer from '@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import {useGlobalContext} from '@contexts/GlobalContext';
import {useULBContext} from '@contexts/UniversalLessonBuilderContext';
import useAuth from '@customHooks/useAuth';
import useGraphqlMutation from '@customHooks/useGraphqlMutation';
import useGraphqlQuery from '@customHooks/useGraphqlQuery';
import {awsFormatDate, dateString} from '@utilities/time';
import {
  CreateFeelingsArchiveInput,
  FeelingsArchive,
  ListFeelingsArchivesQueryVariables,
} from 'API';
import {nanoid} from 'nanoid';
import React, {useEffect, useState} from 'react';
import {useGameChangers} from '../context/GameChangersContext';
import BubbleVersion from './BubbleVersion';
import Button from './Button';

const EmotionCard = ({inLesson}: {inLesson: boolean}) => {
  // For Mobile
  const [primaryEmotion, setPrimaryEmotion] = useState('');
  const [secondaryEmotion, setSecondaryEmotion] = useState('');
  const {goBackCallback, setSelectedCard} = useGameChangers();
  const [changesSaved, setChangesSaved] = useState(false);
  const [showFinalStep, setShowFinalStep] = useState(false);

  const checkChanges = (changes: boolean) => {
    // if (!changes) {
    //   window.addEventListener('beforeunload', beforeunload);
    // } else {
    //   window.removeEventListener('beforeunload', beforeunload);
    // }
  };

  goBackCallback.current = () => {
    if (primaryEmotion) {
      setSecondaryEmotion('');
    } else {
      setSecondaryEmotion('');
      setPrimaryEmotion('');
      setSelectedCard(null);
      checkChanges(changesSaved);
    }
  };

  const beforeunload = (event: BeforeUnloadEvent) =>
    (event.returnValue = 'Please save the changes');

  useEffect(() => {
    checkChanges(changesSaved);
  }, [changesSaved]);

  const {mutate, isLoading, isError, error} = useGraphqlMutation<{
    input: CreateFeelingsArchiveInput;
  }>('createFeelingsArchive');

  if (isError) {
    console.error(error);
  }

  const {authId, email, isStudent} = useAuth();

  const getEmoji = () => {
    switch (primaryEmotion) {
      case 'happy':
        return '😁';
      case 'sad':
        return '😔';
      case 'bad':
        return '😭';
      case 'fearful':
        return '😰';
      case 'disgusted':
        return '🤢';
      case 'angry':
        return '😡';

      case 'surprised':
        return '😱';

      default:
        return '😁';
    }
  };

  const {lessonState} = useGlobalContext();

  const PAGES = lessonState?.lessonData?.lessonPlan;
  const CURRENT_PAGE = inLesson ? lessonState.currentPage : null;
  const ACTIVE_PAGE_DATA = inLesson ? PAGES[CURRENT_PAGE] : null;

  let lessonId = ACTIVE_PAGE_DATA?.id || '999';
  let classId = ACTIVE_PAGE_DATA?.class || '999';

  const {data = [], isLoading: listLoading, isSuccess} = useGraphqlQuery<
    ListFeelingsArchivesQueryVariables,
    FeelingsArchive[]
  >(
    'listFeelingsArchives',
    {
      filter: {
        personAuthID: {eq: authId},
        lessonID: {eq: lessonId},
        sentimentType: {eq: lessonState.currentPage.toString()},
      },
    },
    //  custom means use query from customQueries file.
    // enabled allows conditinational fetching. if it is enabled then only the query will be fetched. Default is true
    {custom: true, enabled: inLesson}
  );

  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setIsSubmitted(checkIfAlreadySubmitted());
  }, [inLesson, data, isSuccess, listLoading]);

  const checkIfAlreadySubmitted = () => {
    if (!listLoading && isSuccess && data && data.length !== 0) {
      // not submitted emotion for this page
      return true;
    } else {
      // submitted emotion for this page
      return false;
    }
  };

  const onSave = () => {
    try {
      const payload: CreateFeelingsArchiveInput = {
        personAuthID: authId,
        personEmail: email,
        sentimentId: `${getEmoji()}-${nanoid(24)}`,
        id: nanoid(24),
        sentimentName: secondaryEmotion,
        sentimentType: lessonState.currentPage.toString(),
        time: new Date().toTimeString().split(' ')[0],
        date: awsFormatDate(dateString('-', 'WORLD')),
        classRoomID: classId,
        lessonID: lessonId,
      };
      mutate({input: payload});
      setShowFinalStep(true);
    } catch (error) {
      console.error(error);
    } finally {
      setChangesSaved(true);
    }
  };

  const goBack = () => {
    setSelectedCard(null);
  };

  return listLoading ? (
    <div className="flex items-center justify-center h-32">
      <Loader color="#fff" />
    </div>
  ) : (
    <>
      <AnimatedContainer show={!showFinalStep && !isSubmitted}>
        {!showFinalStep && !isSubmitted && (
          <>
            <BubbleVersion
              setPrimaryEmotion={setPrimaryEmotion}
              primaryEmotion={primaryEmotion}
              secondaryEmotion={secondaryEmotion}
              setSecondaryEmotion={setSecondaryEmotion}
            />
            <AnimatedContainer
              show={Boolean(primaryEmotion && secondaryEmotion && isStudent)}>
              {Boolean(primaryEmotion && secondaryEmotion && isStudent) && (
                <Button
                  width="w-full"
                  onClick={onSave}
                  text={isLoading ? <Loader /> : `Save '${secondaryEmotion} emotion'`}
                />
              )}
            </AnimatedContainer>
          </>
        )}
      </AnimatedContainer>
      <AnimatedContainer show={showFinalStep && !isSubmitted}>
        {showFinalStep && !isSubmitted && (
          <>
            <div className="p-4 px-6">
              <h1 className="text-4xl my-4  text-white font-bold text-left">
                Thanks for your input
              </h1>
            </div>
            {!inLesson && <Button width="w-full" onClick={goBack} text={'Go Back'} />}
          </>
        )}
      </AnimatedContainer>
      <AnimatedContainer show={isSubmitted}>
        {isSubmitted && (
          <>
            <div className="p-4 px-6">
              <h1 className="text-xl my-4  text-white font-bold text-left">
                You have already submitted emotion for this page
              </h1>
            </div>
          </>
        )}
      </AnimatedContainer>
    </>
  );
};

export default EmotionCard;
