import React, {useContext, useEffect, useRef, Fragment, useState} from 'react';
import {
  AiOutlineCopy,
  AiOutlineDelete,
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineFileAdd,
  AiOutlineFileSearch,
  AiOutlineSave,
} from 'react-icons/ai';
import {IconType} from 'react-icons/lib';
import {VscDiscard} from 'react-icons/vsc';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import {useULBContext} from '../../../../../contexts/UniversalLessonBuilderContext';
import useOnScreen from '../../../../../customHooks/useOnScreen';
import Tooltip from '../../../../Atoms/Tooltip';
import {Dialog, Transition} from '@headlessui/react';
import {CheckCircleIcon, XIcon} from '@heroicons/react/outline';
import {Tree} from '../../UI/UIComponents/TreeView/Tree';
import {find, isEmpty, map} from 'lodash';
import Info from '../../../../Atoms/Alerts/Info';
import Buttons from '../../../../Atoms/Buttons';
import {wait} from '../../../../../utilities/functions';
import {
  UniversalLesson,
  UniversalLessonPage,
} from '../../../../../interfaces/UniversalLessonInterfaces';
import {useHistory} from 'react-router';
import * as customMutations from '../../../../../customGraphql/customMutations';
import * as customQueries from '../../../../../customGraphql/customQueries';

import {graphqlOperation, API} from 'aws-amplify';
import FormInput from '../../../../Atoms/Form/FormInput';
import {FiBook} from 'react-icons/fi';

const Button = ({
  onClick,
  icon: Icon,
  text = '',
  tooltip = '',
  invert = false,
  color = 'text-white',
  tooltipPlacement = 'bottom',
}: {
  onClick?: () => void;
  icon?: IconType;
  tooltip?: string;
  text?: string;
  color?: string;
  tooltipPlacement?: 'bottom' | 'top' | 'left' | 'right' | 'bottomleft';
  invert?: boolean;
}) => {
  return (
    <Tooltip show={tooltip.length > 0} text={tooltip} placement={tooltipPlacement}>
      <button
        onClick={onClick}
        type="button"
        className={`${
          invert ? 'bg-indigo-600' : 'bg-transparent'
        } ${color} mx-2 hover:shadow-lg w-auto  inline-flex justify-center items-center p-2 border border-transparent rounded-md hover:text-white  transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}>
        {Icon && <Icon className="h-5 w-5" aria-hidden="true" />}
        {text}
      </button>
    </Tooltip>
  );
};

const SliderOver = ({
  open,
  setOpen,
  children,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed z-100 w-auto inset-0 overflow-hidden"
        open={open}
        onClose={setOpen}>
        <div className="absolute w-auto inset-0 overflow-hidden">
          <Dialog.Overlay className="absolute inset-0" />

          <div className="fixed w-auto inset-y-0 right-0 pl-10 max-w-full flex">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full">
              <div className="">
                <div className="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll">
                  <div className="px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <Dialog.Title className="text-lg font-medium text-gray-900">
                        Select Page to copy / clone
                      </Dialog.Title>
                      <div className="ml-3 h-7 flex items-center w-auto">
                        <button
                          className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none w-auto"
                          onClick={() => setOpen(false)}>
                          <span className="sr-only">Close panel</span>
                          <XIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 relative flex-1 px-4 sm:px-6 max-w-140 min-w-136">
                    {children}
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

const Divider = ({theme = 'dark'}: any) => (
  <span
    style={{width: 1}}
    className={`h-8 mx-2 ${theme === 'dark' ? 'bg-white' : 'bg-gray-600'} bg-opacity-50 `}
  />
);

const Container = ({children}: {children: any}) => (
  <div className="flex items-center w-auto">{children}</div>
);

const Toolbar = ({
  deleteLesson,
  setEditMode,
  setFields,
  getCopyData,
  getCloneData,
  setNewLessonPlanShow,

  universalLessonDetails,
}: {
  deleteLesson: () => void;
  getCopyData: (lessonId: string, pageId: string) => any;
  getCloneData: (lessonId: string, pageId: string) => any;
  universalLessonDetails?: UniversalLesson;
  setNewLessonPlanShow: React.Dispatch<React.SetStateAction<boolean>>;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;

  setFields: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const {
    previewMode,
    setPreviewMode,
    setUniversalLessonDetails,
    setSelectedPageID,
    setToolbarOnTop,
    toolbarOnTop,
  } = useULBContext();
  const history = useHistory();

  const {
    state: {
      lessonPage: {
        theme = 'dark',
        themeSecBackgroundColor = 'bg-gray-700',
        themeTextColor = '',
      } = {},
    },
  } = useContext(GlobalContext);
  const toolbarRef = useRef();
  const isVisible = useOnScreen(toolbarRef);

  useEffect(() => {
    setToolbarOnTop(isVisible);
  }, [isVisible]);

  const [showDataForCopyClone, setShowDataForCopyClone] = useState(false);

  const [selectedId, setSelectedId] = useState({pageId: '', lessonId: ''});

  const [status, setStatus] = useState('none');

  /**
   *
   * @param action copy | clone
   * What does this function do?
   * Well, This function will copy or clone the selected page from selected lesson and create new lesson page with unique ids but with same data with styles (clone) or only styles (copy)
   *
   * The wait timers are just to longer the process time. Becuase cloning process is fast
   */
  const onCopyCloneAction = (action: string = 'copy') => {
    setStatus('loading');
    wait(2000).then(() => {
      setStatus('done');
      wait(500).then(async () => {
        const newPage =
          action === 'copy'
            ? await getCopyData(selectedId.lessonId, selectedId.pageId)
            : await getCloneData(selectedId.lessonId, selectedId.pageId);

        const input = {
          id: universalLessonDetails.id,
          lessonPlan: [...universalLessonDetails.lessonPlan, newPage],
        };

        const res: any = await API.graphql(
          graphqlOperation(customMutations.updateUniversalLesson, {
            input,
          })
        );

        const data = res.data.updateUniversalLesson;
        // if (data.id === universalLessonDetails.id) {
        // update local state if any page of current lesson is being copied
        setUniversalLessonDetails({...data});
        // }

        setSelectedPageID(newPage.id);
        setSelectedId({pageId: '', lessonId: ''});

        setStatus('none');
        setShowDataForCopyClone(false);
        if (universalLessonDetails.id && newPage.id) {
          history.push(
            `/dashboard/lesson-builder/lesson/page-builder?lessonId=${universalLessonDetails.id}&pageId=${newPage.id}`
          );
        }
      });
    });
  };
  const [treeViewData, setTreeViewData] = useState<any>({});

  /**
   *
   * @param data Whole lesson
   * This function creates a separate data strutcture for tree view component only.
   * It would be better if this remain unchange 😉
   */
  const prepareTreeViewData = (data: UniversalLessonPage[]) => {
    const dataForTreeView = {
      title: 'root',
      children: map(data, (lesson) => ({
        title: lesson.title,
        type: 'lesson',
        id: lesson.id,
        children:
          lesson.lessonPlan && lesson.lessonPlan.length > 0
            ? map(lesson.lessonPlan, (page) => ({
                title: page.title || page.label,
                type: 'page',
                id: page.id,
                lessonId: lesson.id,
                children: [],
              }))
            : [],
      })),
    };

    setTreeViewData(dataForTreeView);
  };

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchStatus, setSearchStatus] = useState('none');

  /**
   * Load lessons only based on what user has search
   * ✊ SAVE API RESPONSE. SAVE INTERNET DATA ✊
   */
  const loadLessonsOnSearch = async () => {
    if (searchQuery.length >= 3) {
      setSearchStatus('searching');
      try {
        const filter = {
          title: {
            contains: searchQuery,
            beginsWith: searchQuery,
          },
        };

        const fetchUList: any = await API.graphql(
          graphqlOperation(customQueries.listUniversalLessons, {
            filter: filter,
          })
        );
        if (!fetchUList) {
          throw new Error('fail!');
        } else {
          const data = fetchUList?.data?.listUniversalLessons.items;
          if (data.length > 0) {
            prepareTreeViewData(data);
            setSearchStatus('success');
          } else {
            setSearchStatus('no_results');
          }
        }
      } catch (error) {
        setSearchStatus('error');
      }
    }
  };

  const onSearchChange = (e: any) => {
    setSearchQuery(e.target.value);
    if (searchStatus === 'no_results') {
      setSearchStatus('none');
    }
  };

  return (
    <>
      <SliderOver open={showDataForCopyClone} setOpen={setShowDataForCopyClone}>
        <div className="flex flex-col items-center space-y-2 mb-2">
          <Info text="Lessons are case sensitive" className="my-2 mb-4" />
          {searchStatus === 'success' && status === 'none' && (
            <Info
              text="Click on a page to select for copy / clone"
              className="my-2 mb-4"
            />
          )}
          <div className="flex items-center space-x-2">
            <div className="">
              <FormInput
                value={searchQuery}
                onKeyDown={(e) => {
                  if (e.keyCode === 13) {
                    loadLessonsOnSearch();
                  }
                }}
                onChange={onSearchChange}
                placeHolder="Search lessons"
              />
            </div>
            <Buttons onClick={loadLessonsOnSearch} label="Search" />
          </div>
        </div>

        <div className="h-full flex items-center justify-center">
          {searchStatus === 'none' ? (
            <span className="flex items-center justify-center flex-col">
              <FiBook className="h-40 w-40 text-gray-400" />
              <p className="w-auto block text-gray-400 text-lg">Search lessons</p>
            </span>
          ) : searchStatus === 'searching' ? (
            <div className="w-auto flex items-center flex-col justify-center">
              <img
                src={'https://image.flaticon.com/icons/png/512/639/639375.png'}
                alt="searching"
                className="h-32 w-32 mb-6 rotateSearchIcon text-gray-400"
              />
              <p className="w-auto block text-gray-400 text-base">
                Searching lessons from books...
              </p>
            </div>
          ) : searchStatus === 'error' ? (
            <div>Oops! Something went wrong.</div>
          ) : searchStatus === 'no_results' ? (
            <div className="w-auto flex items-center flex-col justify-center">
              <img
                src={'https://image.flaticon.com/icons/png/512/5319/5319100.png'}
                alt="no results found"
                className="h-32 w-32 mb-4 text-gray-400"
              />
              <p className="w-auto text-center block text-gray-500 text-base">
                Oops! No results found matching '{searchQuery}'.
                <br /> Please check spellings or try another one.
              </p>
            </div>
          ) : (
            <div className="self-start">
              <Transition
                show={status !== 'none'}
                enter="transition-opacity duration-150"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-75"
                leaveFrom="opacity-100"
                leaveTo="opacity-0">
                <div
                  style={{backgroundColor: '#ecfdf5'}}
                  className={'my-4 rounded-md  p-4'}>
                  <div className="flex">
                    <div className="flex-shrink-0 w-auto">
                      {status !== 'loading' ? (
                        <CheckCircleIcon
                          className="h-5 w-5 text-green-400"
                          aria-hidden="true"
                        />
                      ) : (
                        <div>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-green-700"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24">
                            <circle
                              className="opacity-20"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800 w-auto">
                        {status === 'loading'
                          ? 'collecting page data...'
                          : status === 'done'
                          ? 'Redirecting you to your new page...'
                          : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </Transition>
              <Transition
                show={Boolean(selectedId.lessonId) && Boolean(selectedId.pageId)}
                enter="transition-opacity duration-150"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-75"
                leaveFrom="opacity-100"
                leaveTo="opacity-0">
                <div className="mb-4">
                  <label
                    className={`mb-1 text-gray-700 block text-xs font-semibold leading-5 `}>
                    Select action:
                  </label>
                  <div className="border-0 p-4  flex items-center justify-around px-6 border-gray-200 rounded-md">
                    <Tooltip
                      placement="bottom"
                      text="Only copy styles of selected page with blank data">
                      <Buttons label="Copy" onClick={() => onCopyCloneAction('copy')} />
                    </Tooltip>
                    <Tooltip
                      placement="bottom"
                      text="Clone the whole selected page with styles">
                      <Buttons label="Clone" onClick={() => onCopyCloneAction('clone')} />
                    </Tooltip>
                  </div>
                </div>
              </Transition>

              <Tree
                customClick
                onClick={(pageId: string, lessonId: string) => {
                  setSelectedId({pageId, lessonId});
                }}
                selPageId={selectedId.pageId}
                root={treeViewData}
                dark
              />
            </div>
          )}
        </div>
      </SliderOver>

      <div
        hidden={previewMode}
        ref={toolbarRef}
        className={`customShadow rounded-lg toolbar bg-white dark:bg-gray-700 transition-all duration-200  w-auto p-2`}>
        <div className="flex items-center">
          <Container>
            <Button
              onClick={() => setPreviewMode(!previewMode)}
              tooltip="Preview"
              color={themeTextColor}
              icon={previewMode ? AiOutlineEyeInvisible : AiOutlineEye}
            />

            <Button
              onClick={() => setShowDataForCopyClone(true)}
              tooltip="Copy / Clone"
              color={themeTextColor}
              icon={AiOutlineCopy}
            />

            <>
              <Button
                color={themeTextColor}
                tooltip="Add New Page"
                onClick={() => {
                  setNewLessonPlanShow(true);
                  setEditMode(false);
                  setFields({
                    title: '',
                    label: '',
                    instructions: '',
                    instructionsHtml: '',
                    description: '', // ignore this field
                    interactionType: [],
                    tags: [],
                    estTime: '1 min',
                    classwork: true,
                  });
                }}
                icon={AiOutlineFileAdd}
              />
              <Divider theme={theme} />
            </>
          </Container>

          <Container>
            <Button color={themeTextColor} tooltip="Save changes" icon={AiOutlineSave} />
            <Button color={themeTextColor} tooltip="Discard changes" icon={VscDiscard} />

            <Button
              color="text-red-500"
              tooltip="Delete this page"
              icon={AiOutlineDelete}
              onClick={deleteLesson}
            />
          </Container>
        </div>
      </div>

      <div
        hidden={previewMode}
        style={{top: '30rem'}}
        className={`${
          toolbarOnTop ? 'opacity-0 translate-x-100' : 'opacity-100 translate-x-0'
        } transform duration-200 transition-all w-16 fixed right-5 z-10`}>
        <div
          className={`customShadow rounded-lg toolbar bg-white dark:bg-gray-700 transition-all duration-200 w-auto p-2`}>
          <div className="flex items-center flex-col">
            <div
              className={`flex items-center flex-col w-auto ${
                !toolbarOnTop ? 'mb-2' : ''
              }`}>
              <Button
                onClick={() => setPreviewMode(!previewMode)}
                tooltip="Preview"
                color={themeTextColor}
                icon={previewMode ? AiOutlineEyeInvisible : AiOutlineEye}
                tooltipPlacement="left"
              />

              <Button
                onClick={() => setShowDataForCopyClone(true)}
                tooltip="Copy / Clone"
                color={themeTextColor}
                icon={AiOutlineCopy}
                tooltipPlacement="left"
              />
              <>
                <Button
                  color={themeTextColor}
                  tooltip="Add New Page"
                  onClick={() => {
                    setNewLessonPlanShow(true);
                    setEditMode(false);
                  }}
                  icon={AiOutlineFileAdd}
                  tooltipPlacement="left"
                />
              </>
            </div>

            <div
              className={`flex items-center flex-col w-auto ${
                !toolbarOnTop ? 'mb-2' : ''
              }`}>
              <Button
                color={themeTextColor}
                tooltip="Save changes"
                icon={AiOutlineSave}
                tooltipPlacement="left"
              />
              <Button
                color={themeTextColor}
                tooltip="Discard changes"
                icon={VscDiscard}
                tooltipPlacement="left"
              />

              <Button
                color="text-red-500"
                tooltip="Delete this page"
                icon={AiOutlineDelete}
                onClick={deleteLesson}
                tooltipPlacement="left"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Toolbar;
