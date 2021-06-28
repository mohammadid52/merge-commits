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
import API, {graphqlOperation} from '@aws-amplify/api';
import * as queries from '../../../graphql/queries';
import * as mutations from '../../../graphql/mutations';
import Loader from '../../Atoms/Loader';
import Buttons from '../../Atoms/Buttons';
import Modal from '../../Atoms/Modal';
import FormInput from '../../Atoms/Form/FormInput';
import useDictionary from '../../../customHooks/dictionary';

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
  const {state, dispatch, clientKey, userLanguage} = useContext(GlobalContext);
  const [universalBuilderStep, setUniversalBuilderStep] = useState('BuilderWrapper');
  const {
    universalLessonDetails,
    setUniversalLessonDetails,
    selectedPageID,
    setSelectedPageID,
    universalLessonsList,
    setUniversalLessonsList,
  } = useULBContext();

  const {EditQuestionModalDict} = useDictionary(clientKey);

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
          let activePagePartContentData = [...activePageContentData.partContent];
          const partContentId: string = `${selectedPageID}_part_${activePageContentIndex}_${contentType}_${
            activePagePartContentData.filter((item) => item.type === contentType).length
          }`;
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

  // DataBase Related
  const [fetchingLessons, setFetchingLessons] = useState(false); // loader for loading lessons
  const [creatingLessons, setCreatingLessons] = useState(false); // loader for saving new lessons

  const createNewLesson = async () => {
    setCreatingLessons(true);
    try {
      const input: NewLessonDataInterface = {
        ...newLessonData,
        type: 'lesson',
        institutionID: 'f3aef681-6fff-4795-8fde-67cb159bd275', // temporary -- remove this
        lessonPlan: [],
      };
      const result: any = await API.graphql(
        graphqlOperation(mutations.createUniversalLesson, {input})
      );

      setUniversalLessonsList([
        ...universalLessonsList,
        result.data.createUniversalLesson,
      ]);
    } catch (error) {
      console.error(error.message);
    } finally {
      closeAction();
      setCreatingLessons(false);
    }
  };

  const fetchUniversalLessonsList = async () => {
    setFetchingLessons(true);
    try {
      const result: any = await API.graphql(
        graphqlOperation(queries.listUniversalLessons)
      );
      const data = result?.data?.listUniversalLessons.items;

      setUniversalLessonsList(data);
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      setFetchingLessons(false);
    }
  };

  const deleteLesson = async () => {
    try {
      const result = await API.graphql(
        graphqlOperation(mutations.deleteUniversalLesson, {
          input: {id: '4f0807b5-5607-4635-9a50-961ba9c12b44'},
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUniversalLessonsList();
    // deleteLesson();
  }, []);

  const NO_LESSONS = universalLessonsList.length <= 0;

  const [newLessonModal, setNewLessonModal] = useState(false);
  const closeAction = () => setNewLessonModal(false);

  const [newLessonData, setNewLessonData] = useState(intitalLessonData);
  const onChange = (e: any) => {
    const {id, value} = e.target;
    setNewLessonData({...newLessonData, [id]: value});
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
      className="h-full bg-dark-gray flex overflow-y-hidden">
      {/*{currentStepComp(universalBuilderStep)}*/}
      {newLessonModal && (
        <Modal
          showHeader={true}
          title={`Create New Lesson`}
          showHeaderBorder={true}
          showFooter={false}
          closeAction={() => setNewLessonModal(false)}>
          <div className="min-w-256">
            <div className="mb-4">
              <FormInput
                isRequired
                value={newLessonData.title}
                label={'Add Title'}
                onChange={onChange}
                id={'title'}
              />
            </div>

            <div className="mb-4">
              <FormInput
                label={'Add Label'}
                value={newLessonData.label}
                onChange={onChange}
                id={'label'}
              />
            </div>
            <div className="mb-4">
              <FormInput
                label={'Edit Summary'}
                value={newLessonData.summary}
                onChange={onChange}
                id={'summary'}
              />
            </div>
            {/* <div className="mb-4">
             <Selector />
            </div> */}
            <div className="flex mt-8 justify-center px-6 pb-4">
              <div className="flex justify-end">
                <Buttons
                  btnClass="py-1 px-4 text-xs mr-2"
                  label={EditQuestionModalDict[userLanguage]['BUTTON']['CANCEL']}
                  onClick={closeAction}
                  transparent
                />
                <Buttons
                  btnClass="py-1 px-8 text-xs ml-2"
                  disabled={creatingLessons}
                  label={EditQuestionModalDict[userLanguage]['BUTTON']['SAVE']}
                  onClick={createNewLesson}
                />
              </div>
            </div>
          </div>
        </Modal>
      )}
      {fetchingLessons ? (
        <div className="py-20 text-center mx-auto flex justify-center items-center w-full">
          <div className="items-center flex justify-center flex-col">
            <Loader color="rgba(160, 174, 192, 1)" />
            <p className="mt-2 text-center text-lg text-gray-500">
              {/* @Mohammad TODO: Add this to dictionary  */}
              Loading Lessons
            </p>
          </div>
        </div>
      ) : NO_LESSONS ? (
        <div className="py-20 text-center mx-auto flex justify-center items-center w-full">
          <div className="items-center flex justify-center flex-col">
            {/* <img src="/assets/images/icons/empty.png" alt="no data" /> */}
            <p className="mt-2 text-center text-lg text-gray-500 mb-4">
              {/* @Mohammad TODO: Add this to dictionary  */}
              Oops, You don't have any lessons
            </p>
            <Buttons onClick={() => setNewLessonModal(true)} label="Create New Lesson" />
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default UniversalLessonBuilder;
