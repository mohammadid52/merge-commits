import React, {useContext, useState} from 'react';
import {BiBook} from 'react-icons/bi';
import {GlobalContext} from '../../../contexts/GlobalContext';
import {UniversalLessonPage} from '../../../interfaces/UniversalLessonInterfaces';
import StageButton from './StageButton';

interface LessonControlBarProps {
  pageViewed?: {pageID: number; stage: string};
  handlePageChange: any;
}

const LessonControlBar: React.FC<LessonControlBarProps> = (
  props: LessonControlBarProps
) => {
  const {handlePageChange} = props;
  const {lessonState} = useContext(GlobalContext);
  const PAGES = lessonState.lessonData.lessonPlan;

  const [menuOpen, setMenuOpen] = useState<null | string>(null);
  const handleOpenMenu = (stage: string) => {
    if (menuOpen === stage) {
      return setMenuOpen(null);
    }
    return setMenuOpen(stage);
  };

  return (
    <nav
      className="bg-white border-b h-16 lg:h-12 border-gray-200 flex"
      aria-label="Breadcrumb">
      <ol className="max-w-screen-xl w-full mx-auto px-4 flex space-x-4 lg:space-x-0 items-center sm:px-6 lg:px-8 overflow-x-auto">
        <li className="flex w-auto">
          <div className="flex items-center">
            <a href="#" className="text-gray-600">
              <BiBook className="flex-shrink-0 h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </a>
          </div>
        </li>
        {PAGES &&
          PAGES.map((page: UniversalLessonPage, key: number) => (
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
              id={page.id}
              page={page}
            />
          ))}
      </ol>
    </nav>
  );
};

export default LessonControlBar;
