import React, {lazy, useContext, useEffect, useState} from 'react';
import {Redirect, Route, Switch, useRouteMatch} from 'react-router-dom';
import {LessonControlContext} from '../../contexts/LessonControlContext';

const IntroView = lazy(() => import('./ComponentViews/IntroView/IntroView'));

const OutroView = lazy(() => import('./ComponentViews/OutroView/OutroView'));
const Checkpoint = lazy(() => import('../Lesson/AssessmentComponents/Checkpoint'));
// const Assessments = lazy(() => import('./ComponentViews/Checkpoint/Assessments'));

interface BodyProps {
  fullscreenInstructions: boolean;
  setInstructions: React.Dispatch<
    React.SetStateAction<{visible: boolean; available: boolean; content: any}>
  >;
  checkpointsItems?: any[];
}

const Body: React.FC<BodyProps> = (props: BodyProps) => {
  const {checkpointsItems} = props;

  const {state, dispatch} = useContext(LessonControlContext);
  const match = useRouteMatch();
  const [fullscreen, setFullscreen] = useState(false);

  // const pageSwitch = (pageType: string) => {
  //   switch (pageType) {
  //     case 'story':
  //       return <StoryView fullscreen={fullscreen} />;
  //     case 'lyrics':
  //       return (
  //         <LyricsView
  //           fullscreen={fullscreen}
  //           fullscreenInstructions={fullscreenInstructions}
  //           setInstructions={setInstructions}
  //         />
  //       );
  //     case 'poem':
  //       return <PoemView fullscreen={fullscreen} />;
  //     case 'tchart':
  //     case 'multi-list':
  //     case 'list':
  //       return <ListView fullscreen={fullscreen} />;
  //     case 'truthgame':
  //       return <TruthGameView fullscreen={fullscreen} />;
  //     case 'poll':
  //       return <PollView />;
  //     default:
  //       return <LessonError />;
  //   }
  // };

  // const pageFetch = (stage: string) => {
  //   let pageMatch = state.pages
  //     .filter((page: { stage: string }) => {
  //       return page.stage === stage;
  //     })
  //     .pop();

  //   if (!pageMatch) {
  //     return pageSwitch(null);
  //   }

  //   return pageSwitch(pageMatch.type);
  // };

  useEffect(() => {
    const pageAfter = state.currentPage + 1;
    if (state.currentPage < state.pages.length - 1) {
      if (pageAfter && state.pages[pageAfter]?.open) {
        dispatch({type: 'CAN_CONTINUE'});
      } else {
        dispatch({type: 'STOP'});
      }
    } else {
      dispatch({type: 'STOP'});
    }
  }, [state.currentPage, state.pages]);

  return (
    // <div className="z-0 p-4 md:h-8.2/10 bg-dark">
    <Switch>
      <Route
        path={`${match.url}/intro`}
        render={() => (
          <IntroView fullscreen={fullscreen} checkpointsItems={checkpointsItems} />
        )}
      />

      {/* <Route path={`${match.url}/warmup`} render={() => pageFetch('warmup')} />
      <Route path={`${match.url}/corelesson`} render={() => pageFetch('corelesson')} />
      <Route path={`${match.url}/activity`} render={() => pageFetch('activity')} /> */}
      <Route
        path={`${match.url}/checkpoint`}
        render={() => <Checkpoint isTeacher={true} checkpointsItems={checkpointsItems} />}
      />
      <Route
        path={`${match.url}/outro`}
        render={() => <OutroView fullscreen={fullscreen} />}
      />
      <Route
        exact
        path={`${match.url}/`}
        render={({location}) => (
          <Redirect
            to={{
              pathname: `${match.url}/intro`,
              state: {from: location},
            }}
          />
        )}
      />
    </Switch>
  );
};

export default Body;
