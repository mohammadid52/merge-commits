import {API, graphqlOperation} from 'aws-amplify';
import {nanoid} from 'nanoid';
import React, {useContext, useEffect, useState} from 'react';
import {RiArrowRightSLine} from 'react-icons/ri';
import {useHistory, useRouteMatch, useParams} from 'react-router';
import {GlobalContext} from '../../../contexts/GlobalContext';
import {useULBContext} from '../../../contexts/UniversalLessonBuilderContext';
import * as customQueries from '../../../customGraphql/customQueries';
import useDictionary from '../../../customHooks/dictionary';
import {useQuery} from '../../../customHooks/urlParam';
import {LessonPlansProps} from '../../../interfaces/LessonInterfaces';
import {ULBSelectionProps} from '../../../interfaces/UniversalLessonBuilderInterfaces';
import {
  PagePart,
  PartContent,
  UniversalLesson,
  UniversalLessonPage,
} from '../../../interfaces/UniversalLessonInterfaces';
import BreadCrums from '../../Atoms/BreadCrums';
import Tooltip from '../../Atoms/Tooltip';
import {replaceTailwindClass} from './crudFunctions/replaceInString';
import BuilderWrapper from './views/BuilderWrapper';
import update from 'lodash/update';
import {usePageBuilderContext} from '@contexts/PageBuilderContext';
import {isEmpty} from 'lodash';
interface UniversalLessonBuilderProps extends ULBSelectionProps {
  designersList?: {id: string; name: string; value: string}[];
  lessonID?: string;
  lessonPlans?: LessonPlansProps[] | null;
  updateLessonPlan?: (plan: LessonPlansProps[]) => void;
  setUnsavedChanges?: (val: boolean) => void;
  activeStep?: string;
  lessonName?: string;
  lessonType?: string;
}

interface NewLessonDataInterface {
  title: string;
  label: string;
  summary: string;
  lessonPlan?: any[];
  type?: string;
  institutionID?: string;
}

/*******************************************
 * INITIAL VALUES                          *
 *******************************************/
const initialUniversalLessonData: UniversalLesson = {
  id: '',
  summary: '',
  designers: [''],
  teachers: [''],
  categories: [''],
  lessonPlan: [],
};

const initialUniversalLessonPage: UniversalLessonPage = {
  id: '',
  title: '',
  description: '',
  class: '',
  pageContent: [],
};
const intitalLessonData: NewLessonDataInterface = {
  title: '',
  summary: '',
  label: '',
};

const initialUniversalLessonPagePart: PagePart = {
  id: '',
  partType: 'default',
  class: '',
  partContent: [],
};

const initialUniversalLessonPagePartContent: PartContent = {
  id: '',
  type: '',
  value: [],
};

/*******************************************
 * THE BUILDER PARENT                      *
 *******************************************/
const UniversalLessonBuilder = (props: UniversalLessonBuilderProps) => {
  const match = useRouteMatch();
  const history = useHistory();
  const params = useQuery(location.search);
  const {lessonId}: any = useParams();
  const pageId = params.get('pageId');
  const {state, dispatch, clientKey, userLanguage, lessonState} = useContext(
    GlobalContext
  );

  const {selectedComponent} = usePageBuilderContext();

  const {BreadcrumsTitles, LessonEditDict} = useDictionary(clientKey);
  const [universalBuilderStep, setUniversalBuilderStep] = useState('BuilderWrapper');
  const {
    universalLessonDetails,
    setUniversalLessonDetails,
    selectedPageID,
    setFetchingLessonDetails,
    setSelectedPageID,
    setEditMode,
    setNewLessonPlanShow,
  } = useULBContext();

  const breadCrumsList = [
    {title: BreadcrumsTitles[userLanguage]['HOME'], url: '/dashboard', last: false},
    {
      title: BreadcrumsTitles[userLanguage]['LESSONS'],
      url: '/dashboard/lesson-builder',
      last: false,
    },
    {
      title: universalLessonDetails.title || 'Loading...',
      url: `/dashboard/lesson-builder/lesson/edit?lessonId=${universalLessonDetails.id}`,
      last: false,
    },
    {
      title: BreadcrumsTitles[userLanguage]['LESSON_EDITOR'],
      url: `${match.url}?${lessonId ? `lessonId=${lessonId}}` : ``}`,
      last: true,
    },
  ];

  //  INITIALIZE CURRENT PAGE LOCATION
  useEffect(() => {
    if (state.user.role === 'TR' || state.user.role === 'FLW') {
      dispatch({type: 'UPDATE_CURRENTPAGE', payload: {data: 'universal-lesson-builder'}});
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
          id: lessonId,
        })
      );
      const savedData = result.data.getUniversalLesson;

      setUniversalLessonDetails(savedData);
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
    propertyToTarget?: string,
    replacementValue?: string
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
            (acc2: any, targetArrayObj: UniversalLessonPage | PagePart | PartContent) => {
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
                        ),
                      },
                    ];
                  case 'create':
                    return [
                      ...acc2,
                      {
                        ...targetArrayObj,
                        [propertyToTarget]: replaceTailwindClass(
                          targetArrayObj[propertyToTarget],
                          replacementValue
                        ),
                      },
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
                      ),
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
                  ),
                ];
              }
            },
            []
          ),
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

  // const createNewBlockULBHandler = (
  // targetID: string,
  // propertyToTarget: string,
  // contentType: string,
  // inputObj: any,
  // addBlockAtPosition: number,
  // classString?: string,

  // customPageContentId?: string
  // ) => {
  //   let temp = {...universalLessonDetails};
  //   const activePageIndex = universalLessonDetails.lessonPlan.findIndex(
  //     (page: any) => page.id === selectedPageID
  //   );

  //   let lessonPages = [...universalLessonDetails.lessonPlan];
  //   let pageContentData = [...lessonPages[activePageIndex].pageContent];

  //   switch (propertyToTarget) {
  //     case 'pageContent':
  //       const pageContentId: string = `${nanoid(6)}_part_${pageContentData.length}${`${
  //         customPageContentId ? `_${customPageContentId}` : ''
  //       }`}`;
  // pageContentData.splice(addBlockAtPosition, 0, {
  //   class: 'rounded-lg',
  //   id: pageContentId,
  //   partContent: [
  //     {
  //       id: `${nanoid(6)}_${contentType}_1`,
  //       type: contentType,
  //       value: inputObj,
  //       class: classString || '',
  //     },
  //   ],
  //   partType: 'default',
  // });
  //       lessonPages[activePageIndex] = {
  //         ...lessonPages[activePageIndex],
  //         pageContent: pageContentData,
  //       };
  //       break;
  //     case 'pageContentColumn':
  //       const splittedPageContentIndex = pageContentData.findIndex(
  //         (content: any) => content.id === targetID
  //       );
  //       if (splittedPageContentIndex > -1) {
  //         let activePageContentData = pageContentData[splittedPageContentIndex];
  //         // const partContentId: string = `${selectedPageID}_part_${activePageContentData.partContent?.length}_${contentType}_0`;
  //         const alreadyAddedPartContentLength: number =
  //           activePageContentData.partContent?.length;
  //         let activePagePartContentData = [...activePageContentData.partContent];
  //         if (alreadyAddedPartContentLength < inputObj) {
  //           activePagePartContentData = [
  //             ...activePagePartContentData,
  //             ...Array(inputObj - alreadyAddedPartContentLength)
  //               .fill({})
  //               .map((_, index: number) => ({
  //                 id: `${selectedPageID}_part_${alreadyAddedPartContentLength + index}`,
  //                 value: [],
  //               })),
  //           ];
  //         }
  //         pageContentData[splittedPageContentIndex] = {
  //           ...pageContentData[splittedPageContentIndex],
  //           class: replaceTailwindClass(activePageContentData.class, classString),
  //           partContent: activePagePartContentData,
  //         };
  //         lessonPages[activePageIndex] = {
  //           ...lessonPages[activePageIndex],
  //           pageContent: pageContentData,
  //         };
  //       }
  //       break;
  //     case 'partContent':
  //       const activePageContentIndex = pageContentData.findIndex(
  //         (content: any) => content.id === targetID
  //       );
  //       if (activePageContentIndex > -1) {
  //         let activePageContentData = pageContentData[activePageContentIndex];
  //         let activePagePartContentData = [...activePageContentData.partContent];
  //         const partContentId: string = `${selectedPageID}_part_${activePageContentIndex}_${contentType}_${
  //           activePagePartContentData.filter((item) => item.type === contentType).length
  //         }`;
  //         activePagePartContentData[addBlockAtPosition] = {
  //           id: partContentId,
  //           type: contentType,
  //           value: inputObj,
  //           class: classString || '',
  //         };
  //         pageContentData[activePageContentIndex] = {
  //           ...pageContentData[activePageContentIndex],
  //           partContent: activePagePartContentData,
  //         };
  //         lessonPages[activePageIndex] = {
  //           ...lessonPages[activePageIndex],
  //           pageContent: pageContentData,
  //         };
  //       }
  //       break;
  //     default:
  //       break;
  //   }

  //   temp = {
  //     ...temp,
  //     lessonPlan: lessonPages,
  //   };
  //   setUniversalLessonDetails(temp);
  //   return temp;
  // };

  const updateBlockContentULBHandler = (
    targetID: string,
    propertyToTarget: string,
    contentType: string,
    inputObj: any,
    addBlockAtPosition: number,
    classString?: string
  ) => {
    const lessonPlan: UniversalLessonPage[] = universalLessonDetails.lessonPlan;

    const pageContent = lessonPlan[lessonState.currentPage].pageContent;

    if (!isEmpty(selectedComponent)) {
      const partContent = pageContent[selectedComponent.pageContentIdx].partContent;

      partContent[selectedComponent.partContentIdx] = {
        ...partContent[selectedComponent.partContentIdx],
        class: classString || partContent[selectedComponent.partContentIdx].class,
        type: contentType,
        value: inputObj,
      };

      const updatedPage = update(
        universalLessonDetails,
        `lessonPlan[${lessonState.currentPage}].pageContent[${selectedComponent.pageContentIdx}].partContent`,
        () => [...partContent]
      );
      setUniversalLessonDetails({...updatedPage});
      return updatedPage;
    }
  };

  const createNewBlockULBHandler = (
    targetID: string,
    propertyToTarget: string,
    contentType: string,
    inputObj: any,
    addBlockAtPosition: number,
    classString?: string,

    customPageContentId?: string
  ) => {
    const lessonPlan: UniversalLessonPage[] = universalLessonDetails.lessonPlan;

    const pageContent = lessonPlan[lessonState.currentPage].pageContent;

    if (!isEmpty(selectedComponent)) {
      const partContent = pageContent[selectedComponent.pageContentIdx].partContent;
      partContent.splice(
        addBlockAtPosition,
        0,

        {
          id: `${nanoid(6)}_${contentType}_1`,
          type: contentType,
          value: inputObj,
          class: classString || '',
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
      pageContent.splice(addBlockAtPosition, 0, {
        class: 'rounded-lg',
        id: pageContentId,
        partContent: [
          {
            id: `${nanoid(6)}_${contentType}_1`,
            type: contentType,
            value: inputObj,
            class: classString || '',
          },
        ],
        partType: 'default',
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

  // const updateBlockContentULBHandler = (
  //   targetID: string,
  //   propertyToTarget: string,
  //   contentType: string,
  //   inputObj: any,
  //   addBlockAtPosition: number,
  //   classString?: string
  // ) => {
  //   let temp = {...universalLessonDetails};
  //   const activePageIndex = universalLessonDetails.lessonPlan.findIndex(
  //     (page: any) => page.id === selectedPageID
  //   );
  //   let lessonPages = [...universalLessonDetails.lessonPlan];
  //   let pageContentData = [...lessonPages[activePageIndex].pageContent];

  //   const activePageContentIndex = pageContentData.findIndex(
  //     (content: any) => content.id === targetID
  //   );

  //   switch (propertyToTarget) {
  //     case 'pageContent':
  //       pageContentData[activePageContentIndex] = {
  //         ...pageContentData[activePageContentIndex],
  //         ...inputObj,
  //       };
  //       lessonPages[activePageIndex] = {
  //         ...lessonPages[activePageIndex],
  //         pageContent: pageContentData,
  //       };

  //       break;

  //     case 'partContent':
  //       if (activePageContentIndex > -1) {
  //         let activePageContentData = pageContentData[activePageContentIndex];
  //         let activePagePartContentData = activePageContentData.partContent;
  // activePagePartContentData[addBlockAtPosition] = {
  //   ...activePagePartContentData[addBlockAtPosition],
  //   class: classString || activePagePartContentData[addBlockAtPosition].class,
  //   type: contentType,
  //   value: inputObj,
  // };

  //         pageContentData[activePageContentIndex] = {
  //           ...pageContentData[activePageContentIndex],
  //           partContent: activePagePartContentData,
  //         };
  //         lessonPages[activePageIndex] = {
  //           ...lessonPages[activePageIndex],
  //           pageContent: pageContentData,
  //         };
  //       }
  //       break;
  //     default:
  //       break;
  //   }

  //   temp = {
  //     ...temp,
  //     lessonPlan: lessonPages,
  //   };
  //   setUniversalLessonDetails(temp);
  //   return temp;
  // };

  const onBack = () => {
    history.goBack();
  };

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
    <div
      id={`universalLessonBuilderContainer`}
      className="h-full bg-dark-gray flex overflow-hidden">
      <div className="w-full overflow-hidden h-full bg-gray-200">
        {/* Section Header */}
        {/* <BreadCrums items={breadCrumsList} /> */}

        {/* Body */}
        <div className="w-full h-full pb-8 m-auto">
          <div
            id={`universalLessonBuilder`}
            className="h-full flex bg-white shadow-5 sm:rounded-lg overflow-y-hidden mb-4">
            {/*{currentStepComp(universalBuilderStep)}*/}

            <BuilderWrapper
              mode={`building`}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversalLessonBuilder;
