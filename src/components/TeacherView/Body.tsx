import React, { useContext, useEffect, Suspense, lazy, useState } from 'react';
import { LessonControlContext } from '../../contexts/LessonControlContext';
import { Switch, Route, useLocation, useRouteMatch, Redirect } from 'react-router-dom';
const IntroView = lazy(() => import('./ComponentViews/IntroView/IntroView'));
const StoryView = lazy(() => import('./ComponentViews/StoryPageView/StoryView'));
const LyricsView = lazy(() => import('./ComponentViews/LyricsPageView/LyricsView'));
const PoemView = lazy(() => import('./ComponentViews/PoemPageView/PoemView'));
const ListView = lazy(() => import('./ComponentViews/ListPageView/ListView'));
// const Poll = lazy(() => import('./ComponentViews/PollPageView/PollView'));
// const TChart = lazy(() => import('./ComponentViews/TChartPageView/TChartView'));
const TruthGameView = lazy(() => import('./ComponentViews/TruthGamePageView/TruthGameView'));
const OutroView = lazy(() => import('./ComponentViews/OutroView/OutroView'));
const LessonError = lazy(() => import('./../Error/LessonError'));
const Checkpoint = lazy(() => import('./ComponentViews/Checkpoint/Checkpoint'));
// const Assessments = lazy(() => import('./ComponentViews/Checkpoint/Assessments'));

interface BodyProps {
  fullscreenInstructions: boolean;
  setInstructions: React.Dispatch<React.SetStateAction<{ visible: boolean; available: boolean; content: any }>>;
}

const Body: React.FC<BodyProps> = (props: BodyProps) => {
  const { fullscreenInstructions, setInstructions } = props;

  const { state, dispatch } = useContext(LessonControlContext);
  const location = useLocation();
  const match = useRouteMatch();
  const [fullscreen, setFullscreen] = useState(false);

  const pageSwitch = (pageType: string) => {
    switch (pageType) {
      case 'story':
        return <StoryView fullscreen={fullscreen} />;
      case 'lyrics':
        return (
          <LyricsView
            fullscreen={fullscreen}
            fullscreenInstructions={fullscreenInstructions}
            setInstructions={setInstructions}
          />
        );
      case 'poem':
        return <PoemView fullscreen={fullscreen} />;
      case 'list':
        return <ListView fullscreen={fullscreen} />;
      case 'truthgame':
        return <TruthGameView fullscreen={fullscreen} />;
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

  const urlParser = (str: string) => {
    let temp = '';
    let arr = Array.from(str);
    arr.forEach((char) => {
      if (char !== '/') {
        temp = temp + char;
      }
      return temp;
    });
    return temp;
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
    // <div className="z-0 p-4 md:h-8.2/10 bg-dark">
    <Switch>
      <Route path={`${match.url}/intro`} render={() => <IntroView fullscreen={fullscreen} />} />

      <Route path={`${match.url}/warmup`} render={() => pageFetch('warmup')} />
      <Route path={`${match.url}/corelesson`} render={() => pageFetch('corelesson')} />
      <Route path={`${match.url}/activity`} render={() => pageFetch('activity')} />
      <Route path={`${match.url}/checkpoint`} render={() => <Checkpoint fullscreen={fullscreen} />} />
      <Route path={`${match.url}/outro`} render={() => <OutroView fullscreen={fullscreen} />} />
      <Route
        exact
        path={`${match.url}/`}
        render={({ location }) => (
          <Redirect
            to={{
              pathname: `${match.url}/intro`,
              state: { from: location },
            }}
          />
        )}
      />
    </Switch>
  );
};

export default Body;
