import React, {useContext, useState} from 'react';
import StageButton from './StageButton';
import LessonControl from '../LessonControl';
import {LessonControlContext} from '../../../contexts/LessonControlContext';
import {GlobalContext} from '../../../contexts/GlobalContext';
import { UniversalLessonPage } from '../../../interfaces/UniversalLessonInterfaces';

interface LessonControlBarProps {
  pageViewed?: {pageID: number; stage: string};
  handlePageChange: any;
}

const LessonControlBar: React.FC<LessonControlBarProps> = (
  props: LessonControlBarProps
) => {
  const {pageViewed, handlePageChange} = props;
  const {lessonState, lessonDispatch, controlState, controlDispatch} = useContext(
    GlobalContext
  );
  const PAGES = lessonState.lessonData.lessonPlan;

  const [menuOpen, setMenuOpen] = useState<null | string>(null);
  const handleOpenMenu = (stage: string) => {
    if (menuOpen === stage) {
      return setMenuOpen(null);
    }
    return setMenuOpen(stage);
  };


  return (
    <div className="relative w-full h-full md:flex flex-col items-center justify-center content-center px-2 z-0">
      <ol
        className="relative w-full h-8 cursor-pointer bg-white bg-opacity-60
      rounded-lg px-2 flex justify-between">
        {PAGES &&
          PAGES.map(
            (
              page: UniversalLessonPage,
              key: number
            ) => (
              <StageButton
                iconID={key}
                key={key}
                open={page.open}
                disabled={!page.enabled}
                active={page.active}
                label={page.label}
                menuOpen={menuOpen === page.stage}
                handleOpenMenu={handleOpenMenu}
                handlePageChange={handlePageChange}
              />
            )
          )}
      </ol>
    </div>
  );
};

export default LessonControlBar;
