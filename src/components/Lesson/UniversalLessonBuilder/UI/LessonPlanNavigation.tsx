import React, {useContext, useEffect, useState} from 'react';
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import {UniversalLesson} from '../../../../interfaces/UniversalLessonInterfaces';
import {useULBContext} from '../../../../contexts/UniversalLessonBuilderContext';
import {useHistory} from 'react-router';
import {useQuery} from '../../../../customHooks/urlParam';
import {updateLessonPageToDB} from '../../../../utilities/updateLessonPageToDB';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import CustomToggle from './Toggle';
import {BiBook} from 'react-icons/bi';

interface ILessonPlanNavigationProps {
  selectedPageID: string;
  universalLessonDetails: UniversalLesson;
  setSelectedPageID?: React.Dispatch<React.SetStateAction<string>>;
}

interface SettingsInterface {
  darkMode: boolean;
  classwork: boolean;
}

const INITIAL_SETTINGS: SettingsInterface = {darkMode: true, classwork: true};

const LessonPlanNavigation = ({
  selectedPageID,
  setSelectedPageID,
  universalLessonDetails,
}: ILessonPlanNavigationProps) => {
  const {lessonPlan = [{id: '1', name: 'Loading', href: ''}]} =
    universalLessonDetails || {};
  const {updateMovableList, fetchingLessonDetails} = useULBContext();
  const {dispatch} = useContext(GlobalContext);
  const history = useHistory();
  const params = useQuery(location.search);
  const lessonId = params.get('lessonId');

  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(lessonPlan);

    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    updateMovableList(items, 'page');
  };

  const updatePage = (id: string) => {
    setSelectedPageID(id);
    history.push(
      `/dashboard/lesson-builder/lesson/page-builder?lessonId=${lessonId}&pageId=${id}`
    );
  };

  const [settings, setSettings] = useState(INITIAL_SETTINGS);

  useEffect(() => {
    if (fetchingLessonDetails) {
      setSettings({...settings, darkMode: true});
      handleThemeChange(true);
    } else {
      if (universalLessonDetails.darkMode) {
        setSettings({...settings, darkMode: true});
        handleThemeChange(true);
      } else {
        setSettings({...settings, darkMode: false});
        handleThemeChange(false);
      }
    }
  }, [universalLessonDetails, fetchingLessonDetails]);

  const wait = (timeout: number) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const updateTheme = () => {
    setSettings({...settings, darkMode: !settings.darkMode});
    handleThemeChange(!settings.darkMode);
    wait(1000).then(async () => {
      const input = {
        id: lessonId,
        darkMode: !settings.darkMode,
      };
      await updateLessonPageToDB(input);
    });
  };

  const handleThemeChange = (val: boolean) => {
    dispatch({
      type: 'UPDATE_LESSON_PAGE_THEME',
      payload: {theme: val ? 'dark' : 'light'},
    });
  };

  const {darkMode, classwork} = settings;

  return (
    <div className="px-0 py-5 flex items-center border-b-0 border-gray-200 bg-gray-200">
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="partContent" direction="horizontal">
          {(provided) => (
            <nav
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="bg-white border-b h-12 border-gray-200 flex"
              aria-label="Breadcrumb">
              <ol className="max-w-screen-xl w-full mx-auto px-4 flex space-x-4 sm:px-6 lg:px-8">
                <li className="flex w-auto">
                  <div className="flex items-center">
                    <a href="#" className="text-gray-600">
                      <BiBook className="flex-shrink-0 h-5 w-5" aria-hidden="true" />
                      <span className="sr-only">Home</span>
                    </a>
                  </div>
                </li>
                {fetchingLessonDetails ? (
                  <p className="text-gray-600 hover:text-gray-700 font-medium">
                    Loading...
                  </p>
                ) : (
                  lessonPlan.map((page, index) => (
                    <Draggable
                      draggableId={`${page.id}`}
                      index={index}
                      key={`${page.id}`}>
                      {(provided) => (
                        <li
                          key={index}
                          className="flex w-auto"
                          onClick={() => updatePage(page.id)}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}>
                          <div className="flex items-center w-auto group">
                            <svg
                              className="flex-shrink-0 w-6 h-full text-gray-300 group-hover:text-gray-400 transition-all duration-150 "
                              viewBox="0 0 24 44"
                              preserveAspectRatio="none"
                              fill="currentColor"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true">
                              <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
                            </svg>

                            <a
                              href={page.href}
                              className={` ${
                                selectedPageID === page.id
                                  ? 'border-b-0 border-indigo-400 text-indigo-600 hover:text-indigo-700'
                                  : 'text-gray-600 hover:text-gray-700'
                              }   ml-4 cursor-pointer w-auto  text-sm font-medium transform hover:scale-110 transition-transform duration-150`}>
                              {page.label}
                            </a>
                          </div>
                        </li>
                      )}
                    </Draggable>
                  ))
                )}
              </ol>
            </nav>
          )}
        </Droppable>
      </DragDropContext>

      <div className="ml-2 w-2/10 bg-white h-12 flex items-center p-4 mr-3">
        <div className="flex items-center text-base">
          Theme:{' '}
          <CustomToggle
            enabledColor={'bg-yellow-400 text-yellow-500'}
            disabledColor={'bg-gray-600 text-gray-500'}
            setEnabled={updateTheme}
            enabled={!darkMode}
          />
        </div>
        <div className="flex items-center text-base">
          Classwork:{' '}
          <CustomToggle
            enabledColor={'bg-indigo-600'}
            disabledColor={'bg-gray-700'}
            setEnabled={() => {}}
            enabled={true}
          />
        </div>
      </div>
    </div>
  );
};

export default LessonPlanNavigation;
