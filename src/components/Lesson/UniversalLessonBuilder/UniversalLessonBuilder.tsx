import {GlobalContext} from '@contexts/GlobalContext';
import {usePageBuilderContext} from '@contexts/PageBuilderContext';
import {useULBContext} from '@contexts/UniversalLessonBuilderContext';
import * as customQueries from '@customGraphql/customQueries';
import {useQuery} from '@customHooks/urlParam';
import {LessonPlansProps} from '@interfaces/LessonInterfaces';
import {ULBSelectionProps} from '@interfaces/UniversalLessonBuilderInterfaces';
import {
  PagePart,
  PartContent,
  UniversalLessonPage,
} from '@interfaces/UniversalLessonInterfaces';
import {replaceTailwindClass} from '@lesson/UniversalLessonBuilder/crudFunctions/replaceInString';
import BuilderWrapper from '@lesson/UniversalLessonBuilder/views/BuilderWrapper';
import {API, graphqlOperation} from 'aws-amplify';
import {findIndex, isEmpty} from 'lodash';
import update from 'lodash/update';
import {nanoid} from 'nanoid';
import React, {useContext, useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router';
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
};

/*******************************************
 * THE BUILDER PARENT                      *
 *******************************************/
const UniversalLessonBuilder = ({instId}: UniversalLessonBuilderProps) => {
  const history = useHistory();
  const params = useQuery(location.search);
  const {lessonId}: any = useParams();
  const pageId = params.get('pageId');
  const {state, dispatch, lessonState, lessonDispatch} = useContext(GlobalContext);

  const {selectedComponent} = usePageBuilderContext();

  const [universalBuilderStep, setUniversalBuilderStep] = useState('BuilderWrapper');
  const {
    universalLessonDetails,
    setUniversalLessonDetails,
    selectedPageID,
    setFetchingLessonDetails,
    setSelectedPageID,
  } = useULBContext();

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
    const pos = selectedComponent?.partContentIdx;
    const lessonPlan: UniversalLessonPage[] = universalLessonDetails.lessonPlan;

    const pageContent = lessonPlan[lessonState.currentPage].pageContent;

    if (!isEmpty(selectedComponent) && selectedComponent !== null) {
      const partContent = pageContent[selectedComponent.pageContentIdx].partContent;
      partContent.splice(
        pos + 1,
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
      pageContent.push({
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
        <div className="w-full h-full m-auto">
          <div
            id={`universalLessonBuilder`}
            className="h-full flex bg-white shadow-5 sm:rounded-lg overflow-x-hidden overflow-y-hidden mb-4">
            {/*{currentStepComp(universalBuilderStep)}*/}

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversalLessonBuilder;
