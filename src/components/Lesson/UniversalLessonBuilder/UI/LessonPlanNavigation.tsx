import React, {useContext, useEffect, useState} from 'react';
import {AiOutlineRight} from 'react-icons/ai';

import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';

import {
  UniversalLesson,
  UniversalLessonPage,
} from '../../../../interfaces/UniversalLessonInterfaces';
import {useULBContext} from '../../../../contexts/UniversalLessonBuilderContext';
import {useHistory} from 'react-router';
import {useQuery} from '../../../../customHooks/urlParam';
import {Switch} from '@headlessui/react';
import {IconType} from 'react-icons';
import {updateLessonPageToDB} from '../../../../utilities/updateLessonPageToDB';
import {GlobalContext} from '../../../../contexts/GlobalContext';

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
  const {lessonPlan = []} = universalLessonDetails || {};
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
  function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
  }
  const Toggle = ({
    enabled,
    enabledColor,
    disabledColor,
    setEnabled,
    enableIcon: EIcon,
    disableIcon: DIcon,
    disabled,
  }: {
    enableIcon?: IconType;
    disableIcon?: IconType;
    enabled: boolean;
    disabled?: boolean;
    enabledColor: string;
    disabledColor: string;
    setEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
    return (
      <Switch
        checked={enabled}
        onChange={setEnabled}
        disabled={disabled}
        className={classNames(
          enabled
            ? `${enabledColor || 'bg-gray-600'}`
            : `${disabledColor || 'bg-orange-200'}`,
          'relative ml-2 inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
        )}>
        <span className="sr-only">Use setting</span>
        <span
          className={classNames(
            enabled ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
          )}>
          <span
            className={classNames(
              enabled
                ? 'opacity-0 ease-out duration-100'
                : 'opacity-100 ease-in duration-200',
              'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'
            )}>
            {DIcon && <DIcon className="h-3 w-3" aria-hidden="true" />}
          </span>
          <span
            className={classNames(
              enabled
                ? 'opacity-100 ease-in duration-200'
                : 'opacity-0 ease-out duration-100',
              'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'
            )}
            aria-hidden="true">
            {EIcon && <EIcon className="h-3 w-3" aria-hidden="true" />}
          </span>
        </span>
      </Switch>
    );
  };

  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  console.log('darkMode', settings.darkMode);
  useEffect(() => {
    if (universalLessonDetails.darkMode !== undefined) {
      setSettings({
        darkMode: universalLessonDetails.darkMode,
        classwork: true, // for now
      });
      handleThemeChange(settings.darkMode);
    }
  }, [universalLessonDetails.darkMode]);

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
    console.log(
      '🚀 ~ file: LessonPlanNavigation.tsx ~ line 148 ~ handleThemeChange ~ val',
      val
    );

    dispatch({
      type: 'UPDATE_LESSON_PAGE_THEME',
      payload: {theme: val ? 'dark' : 'light'},
    });
  };

  const {darkMode, classwork} = settings;

  return (
    <div className="px-4 py-5 flex items-center border-b-0 border-gray-200 sm:px-6 bg-gray-200">
      <div className="w-8/10">
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="partContent" direction="horizontal">
            {(provided) => (
              <div
                className={`max-w-full h-12 bg-white flex overflow-x-auto`}
                ref={provided.innerRef}
                {...provided.droppableProps}>
                {lessonPlan.map((page: UniversalLessonPage, index: number) => (
                  <Draggable draggableId={`${page.id}`} index={index} key={`${page.id}`}>
                    {(provided) => (
                      <div
                        key={index}
                        className={`my-2 flex items-center justify-between cursor-pointer`}
                        onClick={() => updatePage(page.id)}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}>
                        <span
                          className={`inline-flex items-center justify-center font-bold ${
                            selectedPageID === page.id ? 'underline font-bold' : ''
                          }${
                            index == 0
                              ? ' text-blue-500'
                              : index === lessonPlan.length - 1
                              ? ' text-red-600'
                              : ''
                          }`}>
                          {page.label}
                        </span>{' '}
                        {index !== lessonPlan.length - 1 ? (
                          <span className="inline-flex items-center justify-end w-auto">
                            <AiOutlineRight size={25} className="w-auto" />
                          </span>
                        ) : null}{' '}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      <div className="ml-2 w-2/10 bg-white h-12 flex items-center p-4">
        <div className="flex items-center">
          Theme:{' '}
          <Toggle
            enabledColor={'bg-yellow-400 text-yellow-500'}
            disabledColor={'bg-gray-600 text-gray-500'}
            setEnabled={updateTheme}
            enabled={!darkMode}
          />
        </div>
        <div className="flex items-center">
          Classwork:{' '}
          <Toggle
            enabledColor={'bg-indigo-600'}
            disabledColor={'bg-gray-700'}
            setEnabled={() => setSettings({...settings, classwork: !classwork})}
            enabled={classwork}
          />
        </div>
      </div>
    </div>
  );
};

export default LessonPlanNavigation;
