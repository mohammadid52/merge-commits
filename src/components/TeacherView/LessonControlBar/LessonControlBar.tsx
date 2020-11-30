import React, { useContext, useState } from 'react';
import StageButton from './StageButton';
import LessonControl from '../LessonControl';
import { LessonControlContext } from '../../../contexts/LessonControlContext';

interface LessonControlBarProps {
  pageViewed: {pageID: number, stage: string};
  setPageViewed: React.Dispatch<React.SetStateAction<object>>;
}

const LessonControlBar: React.FC<LessonControlBarProps> = (props: LessonControlBarProps) => {
  const {pageViewed, setPageViewed} = props;
  const { state } = useContext(LessonControlContext);
  const [menuOpen, setMenuOpen] = useState<null | string>(null);

  const handleOpenMenu = (stage: string) => {
    if (menuOpen === stage) {
      return setMenuOpen(null);
    }
    return setMenuOpen(stage);
  };

  return (
    <div className='relative w-full h-full md:flex flex-col items-center justify-center content-center px-2 z-0'>
      <ol className='relative w-full h-8 cursor-pointer bg-white bg-opacity-60
      rounded-lg px-2 flex justify-between'>
        {state.pages.map(
          (
            page: {
              stage: string;
              type: string;
              breakdown: boolean;
              open: boolean;
              disabled: boolean;
            },
            key: number
          ) => (
            <StageButton
              iconID={key}
              key={key}
              open={page.open}
              stage={page.stage}
              type={page.type}
              disabled={page.disabled}
              active={state.pages[key].active}
              breakdown={page.breakdown ? page.breakdown : null}
              menuOpen={menuOpen === page.stage ? true : false}
              handleOpenMenu={handleOpenMenu}
              pageViewed={pageViewed}
              setPageViewed={setPageViewed}
            />
          )
        )}
      </ol>
    </div>
  );
};

export default LessonControlBar;
