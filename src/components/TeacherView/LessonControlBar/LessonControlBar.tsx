import React, { useContext, useState } from 'react';
import StageButton from './StageButton';
import LessonControl from '../LessonControl';
import { LessonControlContext } from '../../../contexts/LessonControlContext';

interface LessonControlBarProps {
  pageViewed: { pageID: number; stage: string };
  handlePageChange: any;
}

const LessonControlBar: React.FC<LessonControlBarProps> = (props: LessonControlBarProps) => {
  const { pageViewed, handlePageChange } = props;
  const { state } = useContext(LessonControlContext);
  const [menuOpen, setMenuOpen] = useState<null | string>(null);

  const handleOpenMenu = (stage: string) => {
    if (menuOpen === stage) {
      return setMenuOpen(null);
    }
    return setMenuOpen(stage);
  };

  /**
   *
   * filter multiple stages
   * map over multiple stages
   * use this map as stage name e.g. Breakdown 1, Breakdown 2, Breakdown 3...
   *
   * THIS CODE NEEDS TO BE REWRITTEN, SUPER UNCLEAR AT THE MOMENT
   *
   * Duplicated in:
   *
   * - ProgressBar.tsx
   * - LessonControlBar.tsx
   *
   */

  const mapStages = state.pages.map(
    (page: { stage: string; type: string; open: boolean; disabled: boolean }, stageNr: number) => ({
      ...page,
      stageNr: stageNr,
    })
  );

  const checkIfMultipleStages = (type: string) => {
    return (
      state.pages.filter(
        (page: { stage: string; type: string; open: boolean; disabled: boolean }) => page.type === type
      ).length > 1
    );
  };

  const mapMultipleStages = (type: string) => {
    const out = mapStages
      .filter(
        (page: { stage: string; type: string; open: boolean; disabled: boolean; stageNr: number }) => page.type === type
      )
      .map((page: { stage: string; type: string; open: boolean; disabled: boolean; stageNr: number }, i: number) => ({
        ...page,
        multipleCounter: i + 1,
      }));

    return out;
  };

  const getSpecificStage = (type: string, stageNr: number) => {
    const out = mapMultipleStages(type).filter(
      (page: {
        stage: string;
        type: string;
        open: boolean;
        disabled: boolean;
        stageNr: number;
        multipleCounter: number;
      }) => page.stageNr === stageNr
    );

    return out[0];
  };

  return (
    <div className="relative w-full h-full md:flex flex-col items-center justify-center content-center px-2 z-0">
      <ol
        className="relative w-full h-8 cursor-pointer bg-white bg-opacity-60
      rounded-lg px-2 flex justify-between">
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
              menuOpen={menuOpen === page.stage}
              handleOpenMenu={handleOpenMenu}
              pageViewed={pageViewed}
              handlePageChange={handlePageChange}
              counter={checkIfMultipleStages(page.type) ? getSpecificStage(page.type, key).multipleCounter : null}
            />
          )
        )}
      </ol>
    </div>
  );
};

export default LessonControlBar;
