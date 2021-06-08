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
  universalLessonPlan: [],
  universalLessonPages: [],
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
    if(exampleUniversalLesson.universalLessonPages.length > 0){
      setSelectedPageID(exampleUniversalLesson.universalLessonPages[0].id)
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
  const [universalLessonDetails, setUniversalLessonDetails] = useState<UniversalLesson>(
    initialUniversalLessonData
  );
  const [selectedPageID, setSelectedPageID] = useState<string>('');


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
        inputObjKey === 'universalLessonPages' ||
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
                    console.log({
                      [propertyToTarget]: replaceTailwindClass(
                        targetArrayObj[propertyToTarget],
                        replacementValue
                      ),
                    });
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
      className="h-full flex bg-white shadow-5 sm:rounded-lg">
      {/*{currentStepComp(universalBuilderStep)}*/}
      <BuilderWrapper
        mode={`building`}
        deleteFromULBHandler={deleteULBHandler}
        updateFromULBHandler={updateULBHandler}
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
