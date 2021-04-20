import React, { lazy, useContext, useEffect, useState } from 'react';
import { LessonContext } from '../../../contexts/LessonContext';
import { Redirect, Route, Switch, useLocation, useRouteMatch } from 'react-router-dom';
import API, { graphqlOperation } from '@aws-amplify/api';
import * as customQueries from '../../../customGraphql/customQueries';
import queryString from 'query-string';
import * as mutations from '../../../graphql/mutations';
import NotesForm from '../LessonComponents/Notes/NotesForm';

const Intro = lazy(() => import('../LessonComponents/Intro/Intro'));
const Story = lazy(() => import('../LessonComponents/StoryPage/Story'));
const Lyrics = lazy(() => import('../LessonComponents/LyricsPage/Lyrics'));
const Poem = lazy(() => import('../LessonComponents/PoemPage/Poem'));
const List = lazy(() => import('../LessonComponents/ListPage/List'));
const Poll = lazy(() => import('../LessonComponents/PollPage/Poll'));
const TChart = lazy(() => import('../LessonComponents/TChartPage/TChart'));
const TruthGame = lazy(() => import('../LessonComponents/TruthGamePage/TruthGame'));
const MultiList = lazy(() => import('../LessonComponents/MultiListPage/MultiList'));
const Adventure = lazy(() => import('../LessonComponents/AdventurePage/Adventure'));
const Outro = lazy(() => import('../LessonComponents/Outro/Outro'));
const LessonError = lazy(() => import('../../Error/LessonError'));
const Checkpoint = lazy(() => import('../AssessmentComponents/Checkpoint'));
// const Assessments = lazy(() => import('../LessonComponents/Checkpoint/Assessments'));

/**
 * TODO:
 *  when the time comes to add the assessments,
 *  add it back here
 */
export interface BodyProps {
  checkpointsLoaded?: boolean;
  lessonDataLoaded?: boolean;
}

const Body = (props: BodyProps) => {
  const { checkpointsLoaded, lessonDataLoaded } = props;
  const { state, theme, dispatch } = useContext(LessonContext);
  const location = useLocation();
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
        return <Story />;
      case 'lyrics':
        return <Lyrics />;
      case 'poem':
        return <Poem />;
      case 'list':
        return <List />;
      case 'truthgame':
        return <TruthGame />;
      case 'tchart':
        return <TChart />;
      case 'multi-list':
        return <MultiList />;
      case 'poll':
        return <Poll />;
      case 'adventure':
        return <Adventure />;
      default:
        return <LessonError />;
    }
  };

  const pageFetch = (stage: string) => {
    let pageMatch = state.pages
      .filter((page: { stage: string }) => {
        return page.stage === stage;
      })
      .pop();

    if (!pageMatch) {
      return pageSwitch(null);
    }

    return pageSwitch(pageMatch.type);
  };

  useEffect(() => {
    if (state.currentPage < state.pages.length - 1) {
      if (state.pages[state.currentPage + 1].open) {
        dispatch({ type: 'CAN_CONTINUE' });
      } else {
        dispatch({ type: 'STOP' });
      }
    } else {
      dispatch({ type: 'STOP' });
    }
  }, [state.currentPage, state.pages]);

  return (
    <>
      <div className={`z-0 px-4 pb-4 pt-8 ${theme.bg} ${state.data.lesson.type === 'survey' ? 'mt-12' : ''}`}>
        {/**
         *  COMPONENT SWITCH
         */}
        <Switch>
          <Route exact path={`${match.url}/`}>
            {(() => {
              if (lessonType === 'assessment' || lessonType === 'survey') {
                return (
                  <>
                    <Intro />
                    <Checkpoint isTeacher={false} checkpointsLoaded={checkpointsLoaded} />
                  </>
                );
              } else {
                return <Intro />;
              }
            })()}
          </Route>
          <Route path={`${match.url}/warmup`}>{pageFetch('warmup')}</Route>
          <Route path={`${match.url}/corelesson`}>{pageFetch('corelesson')}</Route>
          <Route path={`${match.url}/activity`}>{pageFetch('activity')}</Route>
          <Route path={`${match.url}/outro`}>
            <Outro />
          </Route>
          <Route path={`${match.url}/checkpoint`}>
            <Checkpoint checkpointsLoaded={checkpointsLoaded} />
          </Route>
          {/*<Route path={`${match.url}/assessment`}>
          <Assessments />
        </Route>*/}
          <Route
            path={`${match.url}/intro`}
            render={({ location }) => (
              <Redirect
                to={{
                  pathname: `${match.url}`,
                  state: { from: location },
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
