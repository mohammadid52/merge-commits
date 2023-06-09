import {FeelingsArchive, ListFeelingsArchivesQueryVariables} from 'API';
import Loader from 'atoms/Loader';
import AnimatedContainer from 'components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import {useGlobalContext} from 'contexts/GlobalContext';
import useInGC from 'customHooks/checkIfGameChanges';
import useAuth from 'customHooks/useAuth';
import useGraphqlQuery from 'customHooks/useGraphqlQuery';
import React, {lazy, useEffect, useState} from 'react';
import {useHistory, useRouteMatch} from 'react-router';
import {useGameChangers} from '../context/GameChangersContext';
import {listFeelingsArchives} from '@customGraphql/customQueries';
const BubbleVersion = lazy(() => import('./BubbleVersion'));

const EmotionCard = ({inLesson}: {inLesson: boolean}) => {
  // For Mobile

  const {
    goBackCallback,
    setSelectedCard,
    showFinalStep,
    setShowFinalStep,
    setPrimaryEmotion,
    setSecondaryEmotion,
    setSelectedEmotions
  } = useGameChangers();
  const [changesSaved] = useState(false);

  const checkChanges = (_: boolean) => {};
  const inGC = useInGC();
  const history = useHistory();

  goBackCallback.current = () => {
    history.push('/dashboard/game-changers');
    setSelectedCard(null);
    setPrimaryEmotion('');
    checkChanges(changesSaved);
    setSecondaryEmotion('');
    setSelectedEmotions([]);
    if (inGC && showFinalStep) {
      setShowFinalStep(false);
    }
  };

  useEffect(() => {
    checkChanges(changesSaved);
  }, [changesSaved]);

  const {authId} = useAuth();

  const {lessonState} = useGlobalContext();
  const router: any = useRouteMatch();

  const lessonId = router.params.lessonID || '999';

  const {
    data = [],
    isLoading: listLoading,
    isSuccess
  } = useGraphqlQuery<ListFeelingsArchivesQueryVariables, FeelingsArchive[]>(
    'listFeelingsArchives',
    listFeelingsArchives,
    {
      filter: {
        personAuthID: {eq: authId},
        lessonID: {eq: lessonId},
        comments: {eq: lessonState.currentPage.toString()}
      }
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

  return listLoading ? (
    <div className="flex items-center justify-center h-32">
      <Loader />
    </div>
  ) : (
    <>
      <AnimatedContainer show={!showFinalStep && !isSubmitted}>
        {!showFinalStep && !isSubmitted && (
          <>
            <BubbleVersion />
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
