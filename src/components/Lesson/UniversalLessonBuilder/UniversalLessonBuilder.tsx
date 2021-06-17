import React, {useContext, useEffect, useState} from 'react';
import {GlobalContext} from '../../../contexts/GlobalContext';
import {LessonPlansProps} from '../../Dashboard/Admin/LessonsBuilder/LessonEdit';
import BuilderWrapper from './views/BuilderWrapper';
import {
  PagePart,
  PartContent,
  UniversalLesson,
  UniversalLessonPage,
} from '../../../interfaces/UniversalLessonInterfaces';
import {exampleUniversalLesson} from './example_data/exampleUniversalLessonData';
import {ULBSelectionProps} from '../../../interfaces/UniversalLessonBuilderInterfaces';
import {replaceTailwindClass} from './crudFunctions/replaceInString';
import {useULBContext} from '../../../contexts/UniversalLessonBuilderContext';
import {MovableListProvider} from './MovableListContext';

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
  const {state, dispatch} = useContext(GlobalContext);
  const [universalBuilderStep, setUniversalBuilderStep] = useState('BuilderWrapper');
  const {
    universalLessonDetails,
    setUniversalLessonDetails,
    selectedPageID,
    setSelectedPageID,
  } = useULBContext();

  //  INITIALIZE CURRENT PAGE LOCATION
  useEffect(() => {
    if (state.user.role === 'TR' || state.user.role === 'FLW') {
      dispatch({type: 'UPDATE_CURRENTPAGE', payload: {data: 'universal-lesson-builder'}});
    }
  }, [state.user.role]);

  /**********************************************
   * FUNCTIONALITY AND DATA FETCHES WILL
   * BE DONE BELOW THIS AREA
   *
   * setUniversalLessonDetails will be updated
   * here
   **********************************************/

  // in this area ^
  useEffect(() => {
    setUniversalLessonDetails(exampleUniversalLesson);
    if (exampleUniversalLesson.lessonPlan.length > 0) {
      setSelectedPageID(exampleUniversalLesson.lessonPlan[0].id);
    }
  }, []);

  //  WHICH COMPONENT DO WE RETURN?
  // const currentStepComp = (currentStep: string) => {
  //   switch (currentStep) {
  //     case 'BuilderWrapper':
  //       return (
  //         <BuilderWrapper
  //           mode={`building`}
  //           deleteFromULBHandler={deleteULBHandler}
  //           updateFromULBHandler={updateULBHandler}
  //           universalLessonDetails={universalLessonDetails}
  //           universalBuilderStep={universalBuilderStep}
  //           setUniversalBuilderStep={setUniversalBuilderStep}
  //           selectedPageID={selectedPageID}
  //           setSelectedPageID={setSelectedPageID}
  //           initialUniversalLessonPagePartContent={initialUniversalLessonPagePartContent}
  //         />
  //       );
  //     default:
  //       return <h1>Current Universal Builder step is invalid</h1>;
  //   }
  // };

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
  };
  const {newBlockSeqId} = useULBContext();

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

  const createNewBlockULBHandler = (
    targetID: string,
    propertyToTarget: string,
    contentType: string,
    inputObj: any,
    addBlockAtPosition: number,
    classString?: string
  ) => {
    let temp = {...universalLessonDetails};
    const activePageIndex = universalLessonDetails.lessonPlan.findIndex(
      (page: any) => page.id === selectedPageID
    );
    let lessonPages = [...universalLessonDetails.lessonPlan];
    let pageContentData = [...lessonPages[activePageIndex].pageContent];

    switch (propertyToTarget) {
      case 'pageContent':
        const pageContentId: string = `${selectedPageID}_part_${pageContentData.length}`;
        pageContentData.splice(addBlockAtPosition, 0, {
          class: 'rounded-lg',
          id: pageContentId,
          partContent: [
            {
              id: `${pageContentId}_${contentType}_1`,
              type: contentType,
              value: inputObj,
              class: classString || '',
            },
          ],
          partType: 'default',
        });
        lessonPages[activePageIndex] = {
          ...lessonPages[activePageIndex],
          pageContent: pageContentData,
        };
        break;
      case 'pageContentColumn':
        const splittedPageContentIndex = pageContentData.findIndex(
          (content: any) => content.id === targetID
        );
        if (splittedPageContentIndex > -1) {
          let activePageContentData = pageContentData[splittedPageContentIndex];
          // const partContentId: string = `${selectedPageID}_part_${activePageContentData.partContent.length}_${contentType}_0`;
          const alreadyAddedPartContentLength: number =
            activePageContentData.partContent.length;
          let activePagePartContentData = [...activePageContentData.partContent];
          if (alreadyAddedPartContentLength < inputObj) {
            activePagePartContentData = [
              ...activePagePartContentData,
              ...Array(inputObj - alreadyAddedPartContentLength)
                .fill({})
                .map((_, index: number) => ({
                  id: `${selectedPageID}_part_${alreadyAddedPartContentLength + index}`,
                  value: [],
                })),
            ];
          }
          pageContentData[splittedPageContentIndex] = {
            ...pageContentData[splittedPageContentIndex],
            class: replaceTailwindClass(activePageContentData.class, classString),
            partContent: activePagePartContentData,
          };
          lessonPages[activePageIndex] = {
            ...lessonPages[activePageIndex],
            pageContent: pageContentData,
          };
        }
        break;
      case 'partContent':
        const activePageContentIndex = pageContentData.findIndex(
          (content: any) => content.id === targetID
        );
        if (activePageContentIndex > -1) {
          let activePageContentData = pageContentData[activePageContentIndex];
          const partContentId: string = `${selectedPageID}_part_${activePageContentData.partContent.length}_${contentType}_0`;
          let activePagePartContentData = [...activePageContentData.partContent];
          activePagePartContentData[addBlockAtPosition] = {
            id: partContentId,
            type: contentType,
            value: inputObj,
            class: classString || '',
          };
          pageContentData[activePageContentIndex] = {
            ...pageContentData[activePageContentIndex],
            partContent: activePagePartContentData,
          };
          lessonPages[activePageIndex] = {
            ...lessonPages[activePageIndex],
            pageContent: pageContentData,
          };
        }
        break;
      default:
        break;
    }

    temp = {
      ...temp,
      lessonPlan: lessonPages,
    };
    setUniversalLessonDetails(temp);
  };

  const updateBlockContentULBHandler = (
    targetID: string,
    propertyToTarget: string,
    contentType: string,
    inputObj: any,
    addBlockAtPosition: number,
    classString?: string
  ) => {
    let temp = {...universalLessonDetails};
    const activePageIndex = universalLessonDetails.lessonPlan.findIndex(
      (page: any) => page.id === selectedPageID
    );
    let lessonPages = [...universalLessonDetails.lessonPlan];
    let pageContentData = [...lessonPages[activePageIndex].pageContent];
    const activePageContentIndex = pageContentData.findIndex(
      (content: any) => content.id === targetID
    );
    switch (propertyToTarget) {
      case 'pageContent':
        pageContentData[activePageContentIndex] = {
          ...pageContentData[activePageContentIndex],
          ...inputObj,
        };
        lessonPages[activePageIndex] = {
          ...lessonPages[activePageIndex],
          pageContent: pageContentData,
        };
        break;
      case 'partContent':
        if (activePageContentIndex > -1) {
          let activePageContentData = pageContentData[activePageContentIndex];
          let activePagePartContentData = activePageContentData.partContent;
          activePagePartContentData[addBlockAtPosition] = {
            ...activePagePartContentData[addBlockAtPosition],
            class: classString
              ? replaceTailwindClass(
                  activePagePartContentData[addBlockAtPosition].class,
                  classString
                )
              : activePagePartContentData[addBlockAtPosition].class,
            type: contentType,
            value: inputObj,
          };
          pageContentData[activePageContentIndex] = {
            ...pageContentData[activePageContentIndex],
            partContent: activePagePartContentData,
          };
          lessonPages[activePageIndex] = {
            ...lessonPages[activePageIndex],
            pageContent: pageContentData,
          };
        }
        break;
      default:
        break;
    }

    temp = {
      ...temp,
      lessonPlan: lessonPages,
    };
    setUniversalLessonDetails(temp);
  };

  // console.log(universalLessonDetails, 'universalLessonDetails');

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
      id={`universalLessonBuilder`}
      className="h-full flex bg-white shadow-5 sm:rounded-lg overflow-y-hidden">
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
        initialUniversalLessonPagePartContent={initialUniversalLessonPagePartContent}
      />
    </div>
  );
};

export default UniversalLessonBuilder;
