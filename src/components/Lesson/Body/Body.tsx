import React, {lazy, useContext, useEffect} from 'react';
import {LessonContext} from '../../../contexts/LessonContext';
import {Redirect, Route, Switch, useRouteMatch} from 'react-router-dom';

const Intro = lazy(() => import('../LessonComponents/Intro/Intro'));
const IntroV2 = lazy(() => import('../LessonComponents/Intro/IntroV2'));
const Outro = lazy(() => import('../LessonComponents/Outro/Outro'));
const Checkpoint = lazy(() => import('../AssessmentComponents/Checkpoint'));
// const Assessments = lazy(() => import('../LessonComponents/Checkpoint/Assessments'));

/**
 * TODO:
 *  when the time comes to add the assessments,
 *  add it back here
 */
export interface BodyProps {
  setupComplete?: boolean;
  checkpointsLoaded?: boolean;
  lessonDataLoaded?: boolean;
  checkpointsItems?: any[];
}

const Body = (props: BodyProps) => {
  const {checkpointsItems} = props;

  const {state, theme, dispatch} = useContext(LessonContext);

  const match = useRouteMatch();

  const lessonType = state.data?.lesson?.type;

  /**
   * TODO:
   *  list/tchart/multilist need to
   *  redirect to list && any bugs
   *  need to be fixed
   * @param pageType
   */
  const pageSwitch = (pageType: string) => {
    switch (pageType) {
      case 'story':
      // return <Story />;
      case 'lyrics':
      // return <Lyrics />;
      case 'poem':
      // return <Poem />;
      case 'tchart':
      case 'multi-list':
      case 'list':
      // return <List />;
      case 'truthgame':
      // return <TruthGame />;
      case 'poll':
      // return <Poll />;
      case 'adventure':
      // return <Adventure />;
      default:
      // return <LessonError />;
    }
  };

  useEffect(() => {
    if (state.currentPage < state.pages.length - 1) {
      if (state.pages[state.currentPage + 1].open) {
        dispatch({type: 'CAN_CONTINUE'});
      } else {
        dispatch({type: 'STOP'});
      }
    } else {
      dispatch({type: 'STOP'});
    }
  }, [state.currentPage, state.pages]);

  return (
    <>
      <div
        className={`z-0 px-4 pb-4 pt-8  ${theme.bg} ${
          state.data.lesson.type === 'survey' ? 'mt-12' : ''
        }`}>
        {/**
         *  COMPONENT SWITCH
         */}
        <Switch>
          <Route exact path={`${match.url}/`}>
            {(() => {
              if (lessonType === 'assessment' || lessonType === 'survey') {
                return <IntroV2 checkpointsItems={checkpointsItems} />;
              } else {
                return <Intro checkpointsItems={checkpointsItems} />;
              }
            })()}
          </Route>
          {/* <Route path={`${match.url}/warmup`}>{pageFetch('warmup')}</Route>
          <Route path={`${match.url}/corelesson`}>{pageFetch('corelesson')}</Route>
          <Route path={`${match.url}/activity`}>{pageFetch('activity')}</Route> */}
          <Route path={`${match.url}/outro`}>
            <Outro />
          </Route>
          <Route path={`${match.url}/checkpoint`}>
            <Checkpoint checkpointsItems={checkpointsItems} />
          </Route>
          {/*<Route path={`${match.url}/assessment`}>
          <Assessments />
        </Route>*/}
          <Route
            path={`${match.url}/intro`}
            render={({location}) => (
              <Redirect
                to={{
                  pathname: `${match.url}`,
                  state: {from: location},
                }}
              />
            )}
          />
        </Switch>
      </div>
    </>
  );
};

export default Body;
