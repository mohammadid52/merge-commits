import { useState, useEffect, useContext } from 'react';
import { LessonContext } from '../contexts/LessonContext';
import { LessonControlContext } from '../contexts/LessonControlContext';
import { useLocation, useRouteMatch } from 'react-router-dom';

interface UsePageLabelProps {
  isTeacher?: boolean;
}

const usePageLabel = (props: UsePageLabelProps) => {
  /**
   * Teacher switch
   */
  const { isTeacher } = props;
  const switchContext = isTeacher ? useContext(LessonControlContext) : useContext(LessonContext);
  const { state } = switchContext;

  const match = useRouteMatch();

  const [pageLabel, setPageLabel] = useState<string>('');
  const [prevPageLabel, setPrevPageLabel] = useState<string>('');

  useEffect(() => {
    const currentPage = () => {
      if (isTeacher) {
        const url = match.url;
        const n = url.lastIndexOf('/');
        return url.substring(n + 1);
      } else {
        return state.pages[state.currentPage].stage;
      }
    };

    const previousPage = () => {
      if (isTeacher) {
        const url = match.url;
        const splitArray = url.split('/');
        return splitArray[splitArray.length-2];
      } else {
        return state.pages[state.currentPage - 1].stage;
      }
    };

    const labelSwitch = (input: string) => {
      if (RegExp('Breakdown', 'i').test(input)) {
        return 'Breakdown';
      } else {
        if (RegExp('intro', 'i').test(input)) return 'Intro';
        if (RegExp('Warmup', 'i').test(input)) return 'Warm Up';
        if (RegExp('Corelesson', 'i').test(input)) return 'Core Lesson';
        if (RegExp('Activity', 'i').test(input)) return 'Activity';
        if (RegExp('Checkpoint', 'i').test(input)) return 'Checkpoint';
        if (RegExp('Outro', 'i').test(input)) return 'Outro';
      }
    };

    // setPageLabel(labelSwitch(state.pages[state.currentPage].stage));
    setPageLabel(labelSwitch(currentPage()));
    setPrevPageLabel(labelSwitch(previousPage()));

    return () => console.log(' -> ', '');
  }, []);

  return { prev: prevPageLabel, current: pageLabel };
};

export default usePageLabel;
