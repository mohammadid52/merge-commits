import {HomeOutlined} from '@ant-design/icons';
import useAuth from '@customHooks/useAuth';
import {useGlobalContext} from 'contexts/GlobalContext';
import {usePageBuilderContext} from 'contexts/PageBuilderContext';
import {useULBContext} from 'contexts/UniversalLessonBuilderContext';
import {UniversalLesson} from 'interfaces/UniversalLessonInterfaces';
import {nanoid} from 'nanoid';
import React, {useEffect, useState} from 'react';
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import {useHistory, useRouteMatch} from 'react-router';
import {EMOTIONS, GAME_CHANGERS} from './common/constants';

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
  universalLessonDetails
}: ILessonPlanNavigationProps) => {
  const {lessonPlan = [{id: '1', name: 'Loading', href: ''}]} =
    universalLessonDetails || {};
  const {updateMovableList, fetchingLessonDetails} = useULBContext();
  const {dispatch, lessonDispatch} = useGlobalContext();
  const history = useHistory();

  const {isSuperAdmin} = useAuth();

  // const lessonId = params.get('lessonId');
  const route: any = useRouteMatch();

  const lessonId = route.params.lessonId;

  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(lessonPlan);

    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    updateMovableList(items, 'page');
  };

  const {setEmotionComponentExists} = usePageBuilderContext();

  const {lessonState} = useGlobalContext();

  const pageContent = lessonPlan[lessonState.currentPage]?.pageContent;

  const checkIfEmotionComponentExists = (pageContent: any) => {
    if (pageContent) {
      pageContent.forEach((pgContent: any) => {
        pgContent?.partContent?.forEach((ptContent: any) => {
          if (ptContent.type === GAME_CHANGERS) {
            if (ptContent.value[0].value === EMOTIONS) {
              setEmotionComponentExists(true);
            } else {
              setEmotionComponentExists(false);
            }
          } else {
            setEmotionComponentExists(false);
          }
        });
      });
    }
  };

  const updatePage = (id: string, idx: number) => {
    lessonDispatch({type: 'SET_CURRENT_PAGE', payload: idx});

    setSelectedPageID?.(id);

    const baseUrl = isSuperAdmin
      ? `/dashboard/manage-institutions`
      : `/dashboard/manage-institutions/institution/${universalLessonDetails.institutionID}`;

    checkIfEmotionComponentExists(pageContent);

    history.push(`${baseUrl}/lessons/${lessonId}/page-builder?pageId=${id}`);
  };
  // listSentimentss
  const [settings, setSettings] = useState(INITIAL_SETTINGS);

  useEffect(() => {
    const parentContainer = document.querySelector('html');
    if (parentContainer) {
      if (fetchingLessonDetails) {
        parentContainer.classList.add('dark');
        setSettings({...settings, darkMode: true});
        handleThemeChange(true);
      } else {
        if (universalLessonDetails.darkMode) {
          parentContainer.classList.add('dark');

          setSettings({...settings, darkMode: true});
          handleThemeChange(true);
        } else {
          parentContainer.classList.remove('dark');

          setSettings({...settings, darkMode: false});
          handleThemeChange(false);
        }
      }
    }
  }, [universalLessonDetails, fetchingLessonDetails]);

  const handleThemeChange = (val: boolean) => {
    dispatch({
      type: 'UPDATE_LESSON_PAGE_THEME',
      payload: {theme: val ? 'dark' : 'light'}
    });
  };

  useEffect(() => {
    checkIfEmotionComponentExists(pageContent);
  }, [pageContent]);

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="partContent" direction="horizontal">
        {(provided) => (
          <nav
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`border-gray-200 flex overflow-x-auto overflow-y-hidden`}
            aria-label="Breadcrumb">
            <ol
              key={nanoid(4)}
              className="max-w-screen-xl mb-0 w-full mx-auto px-4 flex space-x-4 items-center sm:px-6 lg:px-8">
              <li className="flex w-auto">
                <a href="#" className="text-gray-600">
                  <HomeOutlined />

                  <span className="sr-only">Home</span>
                </a>
              </li>
              {fetchingLessonDetails ? (
                <p className="text-gray-600 mb-0 ml-4 hover:text-gray-700 font-light">
                  Loading...
                </p>
              ) : (
                lessonPlan.map((page, index) => (
                  <Draggable draggableId={`${page.id}`} index={index} key={`${page.id}`}>
                    {(provided) => (
                      <li
                        className="flex w-auto"
                        onClick={() => updatePage(page.id, index)}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}>
                        <div className="flex items-center w-auto group">
                          <span className="text-gray-500">/</span>

                          <a
                            href={page.href}
                            className={` ${
                              selectedPageID === page.id
                                ? 'border-b- theme-border:400 theme-text hover:theme-text:600'
                                : 'text-gray-500 hover:text-gray-600'
                            }   ml-4 cursor-pointer w-auto text-sm 2xl:text-base font-light transition-transform duration-150`}>
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
  );
};

export default LessonPlanNavigation;
