import SuccessMessage from '@components/Dashboard/Admin/UserManagement/SuccessMessage';
import useAuth from '@customHooks/useAuth';
import {Transition} from '@headlessui/react';

import {Drawer, Empty} from 'antd';
import {UniversalLesson} from 'API';
import Info from 'atoms/Alerts/Info';
import Buttons from 'atoms/Buttons';
import FormInput from 'atoms/Form/FormInput';
import Tooltip from 'atoms/Tooltip';
import {API, graphqlOperation} from 'aws-amplify';
import {Tree} from 'components/Lesson/UniversalLessonBuilder/UI/UIComponents/TreeView/Tree';
import {useOverlayContext} from 'contexts/OverlayContext';
import {useULBContext} from 'contexts/UniversalLessonBuilderContext';
import * as customMutations from 'customGraphql/customMutations';
import * as customQueries from 'customGraphql/customQueries';

import map from 'lodash/map';
import {useState} from 'react';
import {FiBook} from 'react-icons/fi';
import {useHistory} from 'react-router';
import {wait} from 'utilities/functions';

const CopyCloneSlideOver = ({
  getCopyData,
  getCloneData
}: {
  getCopyData: (lessonId: string, pageId: string) => any;
  getCloneData: (lessonId: string, pageId: string) => any;
}) => {
  const history = useHistory();

  const {isSuperAdmin} = useAuth();
  const {setShowDataForCopyClone, showDataForCopyClone} = useOverlayContext();
  const {
    universalLessonDetails,
    setNewLessonPlanShow,
    setEditMode,
    setUniversalLessonDetails,
    setSelectedPageID
  } = useULBContext();

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
          lessonPlan: [...universalLessonDetails.lessonPlan, newPage]
        };

        const res: any = await API.graphql(
          graphqlOperation(customMutations.updateUniversalLesson, {
            input
          })
        );

        const data = res.data.updateUniversalLesson;

        // update local state if any page of current lesson is being copied
        setUniversalLessonDetails({...data});

        setSelectedPageID(newPage.id);
        setSelectedId({pageId: '', lessonId: ''});

        setStatus('none');
        setShowDataForCopyClone(false);
        // navigate user to newly created page
        if (universalLessonDetails.id && newPage.id) {
          const baseUrl = isSuperAdmin
            ? `/dashboard/manage-institutions`
            : `/dashboard/manage-institutions/institution/${universalLessonDetails.institutionID}`;
          history.push(
            `${baseUrl}/lessons/${universalLessonDetails.id}/page-builder?pageId=${newPage.id}`
          );
        }
        // when user is navigated to the page show modal with lesson page details
        setNewLessonPlanShow(true);
        setEditMode(true);
      });
    });
  };
  const [treeViewData, setTreeViewData] = useState<any>({});

  /**
   *
   * @param data Whole lesson
   * This function creates a separate data strutcture for tree view component only.
   */
  const prepareTreeViewData = (data: UniversalLesson[]) => {
    const dataForTreeView = {
      title: 'root',
      children: map(data, (lesson) => ({
        title: lesson.title,
        type: 'lesson',
        id: lesson.id,
        children:
          lesson.lessonPlan && lesson.lessonPlan.length > 0
            ? map(lesson.lessonPlan, (page) => ({
                title: page?.title || page?.label,
                type: 'page',
                id: page?.id,
                lessonId: lesson.id,
                children: []
              }))
            : []
      }))
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
            beginsWith: searchQuery
          }
        };

        const fetchUList: any = await API.graphql(
          graphqlOperation(customQueries.listUniversalLessons, {
            filter: filter
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
    <Drawer
      title={'Select Page to copy / clone'}
      width={400}
      onClose={() => setShowDataForCopyClone(false)}
      open={showDataForCopyClone}
      bodyStyle={{paddingBottom: 80}}>
      <div className="flex flex-col items-center space-y-2 mb-2">
        <Info text="Lessons are case sensitive" />
        {searchStatus === 'success' && status === 'none' && (
          <Info text="Click on a page to select for copy / clone" />
        )}
        <div className="flex items-center w-full  space-x-2">
          <FormInput
            value={searchQuery}
            className="w-full"
            onChange={onSearchChange}
            placeHolder="Search lessons"
          />

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
          <Empty
            description={
              <>
                Oops! No results found matching '{searchQuery}'.
                <br /> Please check spellings or try another one.
              </>
            }
          />
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
              {status === 'loading' ? (
                <Info text="collecting page data..." />
              ) : (
                <SuccessMessage note="Redirecting you to your new page..." />
              )}
            </Transition>
            <Transition
              show={Boolean(selectedId.lessonId) && Boolean(selectedId.pageId)}
              enter="transition-opacity duration-150"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-75"
              leaveFrom="opacity-100"
              leaveTo="opacity-0">
              <div className="my-4">
                <label
                  className={`mb-1 text-gray-700 block text-xs font-semibold leading-5 `}>
                  Select action :
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
    </Drawer>
  );
};

export default CopyCloneSlideOver;
