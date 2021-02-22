import React, { useEffect, useContext } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import PollActivity from './PollModules/PollActivity';
import PollBreakdown from './PollBreakdown/PollBreakdown';
// import ErrorPage from '../../Error/ErrorPage';
import { LessonContext } from '../../../../contexts/LessonContext';
import { useCookies } from 'react-cookie';

const PollPage = () => {
  const { state, theme, dispatch } = useContext(LessonContext);
  const [cookies, setCookie] = useCookies([`lesson-${state.syllabusLessonID}`]);
  const inputs = state.data.lesson.warmUp.inputs;
  const match = useRouteMatch();

  /**
   * ON MOUNT:
   *
   * Activate the lesson for the student\
   *
   */
  useEffect(() => {
    dispatch({ type: 'ACTIVATE_LESSON', payload: 'warmup' });
  }, []);

  /**
   * ON MOUNT:
   *
   * Set the context component state with the right data structure and values
   *
   */
  useEffect(() => {
    if (cookies[`lesson-${state.syllabusLessonID}`].poll) {
      dispatch({
        type: 'SET_INITIAL_COMPONENT_STATE',
        payload: {
          name: 'poll',
          content: cookies[`lesson-${state.syllabusLessonID}`].poll,
        },
      });
    } else {
      let inputsArray = inputs?.pollInputs.map((item: { id: string; question: string; option: any }) => {
        return {
          id: item.id,
          question: item.question,
          option: [{ id: item.option.id, isChoice: item.option.isChoice }],
        };
      });

      let initialObject = {
        pollInputs: inputsArray,
      };

      dispatch({
        type: 'SET_INITIAL_COMPONENT_STATE',
        payload: {
          name: 'poll',
          content: initialObject,
        },
      });

      setCookie(`lesson-${state.syllabusLessonID}`, { ...cookies[`lesson-${state.syllabusLessonID}`], poll: initialObject });
    }
  }, []);

  return (
    <Switch>
      <Route path={`${match.url}/breakdown`}>
        <PollBreakdown />
      </Route>
      <Route exact path={`${match.url}`}>
        <PollActivity />
      </Route>
    </Switch>
  );
};

export default PollPage;
