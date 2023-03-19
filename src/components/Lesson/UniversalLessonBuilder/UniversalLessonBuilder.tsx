import {MenuFoldOutlined, MenuUnfoldOutlined} from '@ant-design/icons';
import {useOverlayContext} from '@contexts/OverlayContext';
import {Layout, Tooltip} from 'antd';
import {Content, Header} from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import {API, graphqlOperation} from 'aws-amplify';
import {useGlobalContext} from 'contexts/GlobalContext';
import {usePageBuilderContext} from 'contexts/PageBuilderContext';
import {useULBContext} from 'contexts/UniversalLessonBuilderContext';
import * as customQueries from 'customGraphql/customQueries';
import {useQuery} from 'customHooks/urlParam';
import {LessonPlansProps} from 'interfaces/LessonInterfaces';
import {ULBSelectionProps} from 'interfaces/UniversalLessonBuilderInterfaces';
import {PartContent, UniversalLessonPage} from 'interfaces/UniversalLessonInterfaces';
import {replaceTailwindClass} from 'lesson/UniversalLessonBuilder/crudFunctions/replaceInString';
import BuilderWrapper from 'lesson/UniversalLessonBuilder/views/BuilderWrapper';
import {isEmpty} from 'lodash';
import update from 'lodash/update';
import {nanoid} from 'nanoid';
import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router';
import LessonPlanNavigation from './UI/LessonPlanNavigation';
import NewLessonPlanSO from './UI/SlideOvers/NewLessonPlanSO';
import PageBuilderSlideOver from './UI/SlideOvers/PageBuilderSlideOver';
import Toolbar from './UI/UIComponents/Toolbar';
interface UniversalLessonBuilderProps extends ULBSelectionProps {
  designersList?: {id: string; name: string; value: string}[];
  lessonID?: string;
  lessonPlans?: LessonPlansProps[] | null;
  updateLessonPlan?: (plan: LessonPlansProps[]) => void;
  setUnsavedChanges?: (val: boolean) => void;
  activeStep?: string;
  lessonName?: string;
  lessonType?: string;
  instId: string;
}

const initialUniversalLessonPagePartContent: PartContent = {
  id: '',
  type: '',
  value: [],
  label: '',
  class: ''
};

/*******************************************
 * THE BUILDER PARENT                      *
 *******************************************/
const UniversalLessonBuilder = ({instId}: UniversalLessonBuilderProps) => {
  const params = useQuery(location.search);
  const {lessonId}: any = useParams();
  const pageId = params.get('pageId');
  const {state, dispatch, scanLessonAndFindComplicatedWord, lessonState} =
    useGlobalContext();

  const {selectedComponent, actionMode} = usePageBuilderContext();

  const [universalBuilderStep, setUniversalBuilderStep] = useState('BuilderWrapper');
  const {
    universalLessonDetails,
    setUniversalLessonDetails,
    selectedPageID,
    setFetchingLessonDetails,
    setSelectedPageID
  } = useULBContext();

  //  INITIALIZE CURRENT PAGE LOCATION
  useEffect(() => {
    if (state.user.role === 'TR' || state.user.role === 'FLW') {
      dispatch({
        type: 'UPDATE_CURRENTPAGE',
        payload: {data: 'universal-lesson-builder'}
      });
    }
  }, [state.user.role]);

  useEffect(() => {
    if (!(universalLessonDetails && universalLessonDetails.id)) {
      fetchLessonData();
    }
  }, [lessonId]);

  useEffect(() => {
    setSelectedPageID(pageId);
  }, [pageId]);

  const fetchLessonData = async () => {
    try {
      setFetchingLessonDetails(true);
      const result: any = await API.graphql(
        graphqlOperation(customQueries.getUniversalLesson, {
          id: lessonId
        })
      );
      const savedData = result.data.getUniversalLesson;

      const updatedLessonPlan = scanLessonAndFindComplicatedWord(savedData.lessonPlan);
      setUniversalLessonDetails({
        ...savedData,
        lessonPlan: updatedLessonPlan
      });
      setSelectedPageID(pageId);
    } catch {
      setUniversalLessonDetails((prev: any) => ({...prev}));
    } finally {
      setFetchingLessonDetails(false);
    }
  };

  /**********************************************
   * FUNCTIONALITY AND DATA FETCHES WILL
   * BE DONE BELOW THIS AREA
   *
   * setUniversalLessonDetails will be updated
   * here
   **********************************************/

  //  CORE DATA MANAGEMENT

  /**
   *
   *
   * CRUD -  UPDATE
   *  - Recursive
   *  - Supports create, update, delete operation
   *  - If target ID is found, does specified operation
   *  - If target ID is not found, continues loop but does nothing
   *
   * */

  const crudULBHandler = (
    inputObj: any,
    operation: 'create' | 'update' | 'delete',
    idToTarget: string,
    propertyToTarget = '',
    replacementValue = ''
  ) => {
    const reduced = Object.keys(inputObj).reduce((acc: any, inputObjKey: string) => {
      if (
        inputObjKey === 'lessonPlan' ||
        inputObjKey === 'pageContent' ||
        inputObjKey === 'partContent'
      ) {
        return {
          ...acc,
          [`${inputObjKey}`]: inputObj[inputObjKey].reduce(
            (acc2: any, targetArrayObj: any) => {
              if (targetArrayObj.id === idToTarget) {
                switch (operation) {
                  case 'delete':
                    return acc2;
                  case 'update':
                    return [
                      ...acc2,
                      {
                        ...targetArrayObj,
                        [propertyToTarget]: replaceTailwindClass(
                          targetArrayObj[propertyToTarget],
                          replacementValue
                        )
                      }
                    ];
                  case 'create':
                    return [
                      ...acc2,
                      {
                        ...targetArrayObj,
                        [propertyToTarget]: replaceTailwindClass(
                          targetArrayObj[propertyToTarget],
                          replacementValue
                        )
                      }
                    ];
                  default:
                    return [
                      ...acc2,
                      crudULBHandler(
                        targetArrayObj,
                        operation,
                        idToTarget,
                        propertyToTarget,
                        replacementValue
                      )
                    ];
                }
              } else {
                return [
                  ...acc2,
                  crudULBHandler(
                    targetArrayObj,
                    operation,
                    idToTarget,
                    propertyToTarget,
                    replacementValue
                  )
                ];
              }
            },
            []
          )
        };
      } else {
        return {...acc, [`${inputObjKey}`]: inputObj[inputObjKey]};
      }
    }, {});
    return reduced;
  };

  /**
   *
   *
   * CRUD -  DELETE
   *
   *
   * */
  const deleteULBHandler = (targetID: string) => {
    const deleted = crudULBHandler(universalLessonDetails, 'delete', targetID);
    setUniversalLessonDetails(deleted);
    return deleted;
  };

  const updateULBHandler = (
    targetID: string,
    propertyToTarget: string,
    replacementValue?: string
  ) => {
    const updated = crudULBHandler(
      universalLessonDetails,
      'update',
      targetID,
      propertyToTarget,
      replacementValue
    );

    setUniversalLessonDetails(updated);
  };

  const updateBlockContentULBHandler = (
    _1: string,
    _2: string,
    contentType: string,
    inputObj: any,
    _3?: number,
    classString?: string,
    _4?: string,
    pageContentIdx?: number,
    partContentIdx?: number
  ) => {
    const lessonPlan: UniversalLessonPage[] = universalLessonDetails.lessonPlan;

    const pageContent = lessonPlan?.[lessonState.currentPage]?.pageContent || [];

    let idxData = {
      pageContentIdx:
        selectedComponent?.pageContentIdx !== undefined
          ? selectedComponent?.pageContentIdx
          : pageContentIdx,
      partContentIdx:
        selectedComponent?.partContentIdx !== undefined
          ? selectedComponent?.partContentIdx
          : partContentIdx
    };

    if (idxData?.pageContentIdx !== undefined) {
      const partContent = pageContent?.[idxData.pageContentIdx]?.partContent || [];

      // @ts-ignore
      partContent[idxData.partContentIdx] = {
        // @ts-ignore
        ...partContent[idxData.partContentIdx],
        // @ts-ignore
        class: classString || partContent?.[idxData.partContentIdx]?.class || '',
        type: contentType,
        value: inputObj
      };

      const updatedPage = update(
        universalLessonDetails,
        `lessonPlan[${lessonState.currentPage}].pageContent[${idxData.pageContentIdx}].partContent`,
        // @ts-ignore
        () => [...partContent]
      );

      setUniversalLessonDetails({...updatedPage});
      return updatedPage;
    } else {
      console.log('index data missing @UnivesalLessonBuilder.tsx');
    }
  };

  const createNewBlockULBHandler = (
    _1: string,
    _2: string,
    contentType: string,
    inputObj: any,
    _3?: number,
    classString?: string,
    customPageContentId?: string
  ) => {
    const pos = selectedComponent?.partContentIdx;

    const lessonPlan: UniversalLessonPage[] = universalLessonDetails.lessonPlan;

    const pageContent: any = lessonPlan?.[lessonState.currentPage]?.pageContent || [];

    if (
      (!isEmpty(selectedComponent) && selectedComponent !== null) ||
      actionMode === 'replace'
    ) {
      const partContent: any =
        pageContent?.[selectedComponent.pageContentIdx]?.partContent || [];

      const bufferPos = actionMode === 'replace' ? 0 : 1;
      const deleteCount = actionMode === 'replace' ? 1 : 0;

      partContent.splice(
        pos + bufferPos,
        deleteCount,

        {
          id: `${nanoid(6)}_${contentType}_1`,
          type: contentType,
          value: inputObj,
          class: classString || ''
        }
      );

      const updatedPage = update(
        universalLessonDetails,
        `lessonPlan[${lessonState.currentPage}].pageContent[${selectedComponent.pageContentIdx}].partContent`,
        () => [...partContent]
      );
      setUniversalLessonDetails({...updatedPage});
      return updatedPage;
    } else {
      const pageContentId: string = `${nanoid(6)}_part_${pageContent.length}${`${
        customPageContentId ? `_${customPageContentId}` : ''
      }`}`;
      pageContent.push({
        class: 'rounded-lg',
        id: pageContentId,
        partContent: [
          {
            id: `${nanoid(6)}_${contentType}_1`,
            type: contentType,
            value: inputObj,
            class: classString || ''
          }
        ],
        partType: 'default'
      });

      const updatedPage = update(
        universalLessonDetails,
        `lessonPlan[${lessonState.currentPage}].pageContent`,
        () => [...pageContent]
      );
      setUniversalLessonDetails({...updatedPage});
      return updatedPage;
    }
  };

  const [builderMenuCollapsed, setBuilderMenuCollapsed] = useState(false);

  const {
    setNewLessonPlanShow,
    fetchingLessonDetails,
    setLessonPlanFields,
    setEditMode,
    previewMode,
    pushUserToThisId,

    getCurrentPage,
    newLessonPlanShow
  } = useULBContext();

  const {showLessonEditOverlay} = useOverlayContext();

  return (
    /**
     *
     *  Pages:
     *    1. lesson overview page
     *    2. create new & edit page (similar)
     *    3. add a page part dialog
     *    4. apply a template dialog
     *    5. builder body
     *
     */

    <>
      <NewLessonPlanSO
        instId={instId}
        pageDetails={selectedPageID ? getCurrentPage(selectedPageID) : {}} // don't send unwanted page details if not editing
        open={newLessonPlanShow}
        setOpen={setNewLessonPlanShow}
      />

      <Layout>
        <Sider
          trigger={null}
          width={300}
          collapsedWidth={0}
          className={`p-4 ${builderMenuCollapsed ? '!bg-white' : 'unset'}`}
          collapsible
          collapsed={builderMenuCollapsed}>
          <PageBuilderSlideOver
            deleteFromULBHandler={deleteULBHandler}
            setEditMode={setEditMode}
            setNewLessonPlanShow={setNewLessonPlanShow}
            open={showLessonEditOverlay}
            // handleEditBlockContent={handleEditBlockContent}
            // handleModalPopToggle={handleModalPopToggle}
          />
        </Sider>
        <Layout className="site-layout">
          <Header
            className="flex items-center justify-between"
            style={{padding: 0, background: 'white'}}>
            <div className="flex">
              <Tooltip
                placement="right"
                title={builderMenuCollapsed ? 'Show builder' : 'Hide builder'}>
                {React.createElement(
                  builderMenuCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                  {
                    className: 'ml-4',
                    onClick: () => setBuilderMenuCollapsed(!builderMenuCollapsed)
                  }
                )}
              </Tooltip>

              <LessonPlanNavigation
                selectedPageID={selectedPageID}
                setSelectedPageID={setSelectedPageID}
                universalLessonDetails={universalLessonDetails}
              />
            </div>

            <Toolbar
              newLessonPlanShow={newLessonPlanShow}
              setFields={setLessonPlanFields}
              setEditMode={setEditMode}
              deleteLesson={() => {}}
              setNewLessonPlanShow={setNewLessonPlanShow}
            />
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280
            }}
            className="bg-dark-blue overflow-x-hidden overflow-y-auto max-h-screen">
            <BuilderWrapper
              mode={`building`}
              instId={instId}
              deleteFromULBHandler={deleteULBHandler}
              updateFromULBHandler={updateULBHandler}
              createNewBlockULBHandler={createNewBlockULBHandler}
              updateBlockContentULBHandler={updateBlockContentULBHandler}
              universalLessonDetails={universalLessonDetails}
              universalBuilderStep={universalBuilderStep}
              setUniversalBuilderStep={setUniversalBuilderStep}
              selectedPageID={selectedPageID}
              setSelectedPageID={setSelectedPageID}
              initialUniversalLessonPagePartContent={
                initialUniversalLessonPagePartContent
              }
            />
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default UniversalLessonBuilder;
