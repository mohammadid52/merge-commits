import React, {useContext} from 'react';
import StageIcon from './StageIcon';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import {
  StudentPageInput,
  UniversalLessonPage,
} from '../../../../interfaces/UniversalLessonInterfaces';
import {BiBook} from 'react-icons/bi';

const ProgressBar = () => {
  const {lessonState} = useContext(GlobalContext);
  // const [clickable, setClickable] = useState<number>();

  const PAGES = lessonState.lessonData.lessonPlan;

  // ~~~~~~~~~ SIMPLE LOGIC CHECKS ~~~~~~~~~ //
  const validateRequired = (pageIdx: number) => {
    if (PAGES) {
      const thisPageData = lessonState?.studentData[pageIdx];
      const thisPageRequired = lessonState?.requiredInputs[pageIdx];
      if (thisPageData && thisPageData.length > 0) {
        const areAnyEmpty = thisPageData.filter((input: StudentPageInput) => {
          if (thisPageRequired.includes(input.domID) && input.input[0] === '') {
            return input;
          }
        });
        // console.log('validate areAnyEmpty - ', areAnyEmpty);
        if (areAnyEmpty.length > 0) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    } else {
      return false;
    }
  };

  const nextRequiredIdx = PAGES
    ? PAGES.reduce((nextIdx: number, _: any, currIdx: number) => {
        if (nextIdx === null) {
          if (validateRequired(currIdx)) {
            return nextIdx;
          } else {
            return currIdx;
          }
        } else {
          return nextIdx;
        }
      }, null)
    : null;

  /**
   * Explanation
   *
   * state.currentPage = number of current page from 0 - total nr of pages
   */

  return (
    <nav
      className="bg-gray-800 border-b h-12 border-gray-200 flex rounded-lg"
      aria-label="Breadcrumb">
      <ol className="max-w-screen-xl w-full mx-auto px-4 flex space-x-4  items-center sm:px-6 lg:px-8">
        <li className="flex w-auto">
          <div className="flex items-center">
            <a href="#" className="text-gray-200">
              <BiBook className="flex-shrink-0 h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </a>
          </div>
        </li>
        {PAGES &&
          PAGES.map((page: UniversalLessonPage, key: number) => {
            // console.table({key: key, nextReq: nextRequiredIdx, pageOpen: page.open});
            return (
              <StageIcon
                key={`${page.id}_progressIcon`}
                pageNr={key}
                id={page.id}
                enabled={page.disabled !== true}
                open={page.open !== false}
                // active={page.active !== false}
                active={key === lessonState?.currentPage}
                label={page.label}
                clickable={
                  key === 0 ||
                  ((nextRequiredIdx !== null ? key <= nextRequiredIdx : true) &&
                    page.open !== false)
                }
              />
            );
          })}
      </ol>
    </nav>
  );
};

export default ProgressBar;
