import React, {useContext, useEffect, useState} from 'react';
import {useHistory, useParams, useRouteMatch} from 'react-router-dom';
import ErrorBoundary from '../../Error/ErrorBoundary';
import {GlobalContext} from '../../../contexts/GlobalContext';
import {exampleUniversalLesson} from '../../Lesson/UniversalLessonBuilder/example_data/exampleUniversalLessonData';

import {
  PagePart,
  PartContent,
  PartContentSub,
  StudentPageInput,
  UniversalLessonPage,
  UniversalLessonStudentData,
} from '../../../interfaces/UniversalLessonInterfaces';
import API, {graphqlOperation} from '@aws-amplify/api';
import * as queries from '../../../graphql/queries';
import * as customQueries from '../../../customGraphql/customQueries';
import CoreUniversalLesson from '../../Lesson/UniversalLesson/views/CoreUniversalLesson';
import {Auth} from 'aws-amplify';

// ##################################################################### //
// ############################## READ ME ############################## //
// ##################################################################### //

/**
 * The lessonViewer is tied in heavily with lessonState
 *
 * src/state/LessonState.tsx
 *
 * LessonState contains:
 *    - LessonData: the fetched lesson object
 *    - StudentData: an array containing an array of input objects for each page
 *    - CurrentPage: index value of which page of the lessonPlan you're viewing
 *
 */

// ~~~~~~~~~~~~~ TEST VALUES ~~~~~~~~~~~~~ //
const LESSON_ID = '6b4f553d-b25c-47a2-98d0-894ca4caa129';
const SYLLABUS_ID = 'b0cd146b-6070-4a4a-ab23-b6f7db8f6d72';

const LessonDataViewer = () => {
  const {lessonState, lessonDispatch, theme} = useContext(GlobalContext);
  const history = useHistory();
  const match = useRouteMatch();
  const urlParams: any = useParams();

  // ##################################################################### //
  // ######################### BASIC UI CONTROLS ######################### //
  // ##################################################################### //

  //  NAVIGATION CONSTANTS
  const PAGES = lessonState.lessonData.lessonPlan;
  const CURRENT_PAGE = lessonState.currentPage;

  // ##################################################################### //
  // ############################ LESSON FETCH ########################### //
  // ##################################################################### //
  const getSyllabusLesson = async (lessonID?: string) => {
    // lessonID will be undefined for testing
    if (lessonID !== '') {
      try {
        const universalLesson: any = await API.graphql(
          graphqlOperation(customQueries.getUniversalLesson, {id: lessonID})
        );
        const response = universalLesson.data.getUniversalLesson;
        setTimeout(() => {
          lessonDispatch({type: 'SET_LESSON_DATA', payload: response});
        }, 1000);
      } catch (e) {
        console.error('Error loading lesson in LessonDataViewer.tsx - ', e);
      }
    } else {
      setTimeout(() => {
        lessonDispatch({type: 'SET_LESSON_DATA', payload: exampleUniversalLesson});
      }, 1000);
    }
  };

  // ~~~~~~~~~~~~~~ GET LESSON ~~~~~~~~~~~~~ //
  useEffect(() => {
    // const {lessonID} = urlParams;
    const lessonID = LESSON_ID;

    if (lessonID) {
      lessonDispatch({type: 'SET_INITIAL_STATE', payload: {universalLessonID: lessonID}});
      getSyllabusLesson(lessonID).then((_: void) =>
        console.log('Lesson Mount - ', 'Lesson fetched!')
      );
    }
    return () => {
      lessonDispatch({type: 'CLEANUP'});
    };
  }, []);

  // ~~~~~~~~~~ RESPONSE TO FETCH ~~~~~~~~~~ //
  // ~~~~~~~~~~~~~ LESSON SETUP ~~~~~~~~~~~~ //
  useEffect(() => {
    if (lessonState.lessonData) {
      // Initialize page url and context
      if (CURRENT_PAGE !== '' && CURRENT_PAGE !== undefined) {
        lessonDispatch({type: 'SET_CURRENT_PAGE', payload: CURRENT_PAGE});
        // history.push(`${match.url}/${CURRENT_PAGE}`);
      } else {
        lessonDispatch({type: 'SET_CURRENT_PAGE', payload: 0});
        // history.push(`${match.url}/${0}`);
      }
    }
  }, [lessonState.lessonData.id]);

  // ##################################################################### //
  // ###################### INITIALIZE STUDENT DATA ###################### //
  // ##################################################################### //
  const [studentDataInitialized, setStudentDataInitialized] = useState<boolean>(false);

  /**
   * This function needs to be changed for the notebook
   *
   * Explanation:
   *  - When the lesson loads, we loop over the lessonPlan, find all the user inputs
   *  and initialize empty page data objects --> This makes the app ready for student input
   *  - This way, we can easily load student data based on studentData[the page index]
   *  and get the values for the input field based on the unique ID
   *
   *  Example:
   *
   *  {
   *   domID: 'question-1',
   *   input: [''],
   *   comments: [{commentBy: 'xxx', comment: 'abc'}], // This is something we only add in notebook
   *  },
   *
   * - THIS FUNCTION CA BE REMOVED, BUT ANOTHER FUNCTION NEEDS TO BE WRITTEN THAT DOES THIS:
   *
   *      1. get all student data from the pageData arrays
   *      2. set lessonState.studentData to an array of these arrays
   *      3. IMPORTANT: when you get studentData from the database it is in a random order,
   *            you need to sort the studentData records so they match the order of the lessonPlan
   *      4. LessonState.StudentData needs to be set like this:
   *            [
   *              [{}], // pagedata for page_1
   *              [{}], // pagedata for page_2
   *              [{}], // pagedata for page_3
   *            ]
   *
   */

  // ~~~~~~~~ INITIALIZE STUDENTDATA ~~~~~~~ //
  const initializeStudentData = async () => {
    if (studentDataInitialized === false && PAGES) {
      const mappedPages = PAGES.map((page: UniversalLessonPage) => {
        const allessonPageageParts = page.pageContent;
        const initialessonPageageData = allessonPageageParts.reduce(
          (pageData: StudentPageInput[], pagePart: PagePart) => {
            if (pagePart.hasOwnProperty('partContent')) {
              const pagePartContent = pagePart.partContent.reduce(
                (pagePartAcc: any[], partContent: PartContent) => {
                  const isForm = /form/g.test(partContent.type);
                  const isOtherInput = /input/g.test(partContent.type);
                  if (isForm) {
                    // map through partContent sub array
                    return [
                      ...pagePartAcc,
                      ...partContent.value.map((partContentSub: PartContentSub) => {
                        return {
                          domID: partContentSub.id,
                          input: [''],
                        };
                      }),
                    ];
                  } else if (isOtherInput) {
                    return [
                      ...pagePartAcc,
                      {
                        domID: partContent.id,
                        input: [''],
                      },
                    ];
                  } else {
                    return pagePartAcc;
                  }
                },
                []
              );
              return [...pageData, ...pagePartContent];
            } else {
              return pageData;
            }
          },
          []
        );
        return initialessonPageageData;
      });
      lessonDispatch({type: 'SET_INITIAL_STUDENT_DATA', payload: mappedPages});
      setStudentDataInitialized(true);
    }
  };

  // ##################################################################### //
  // ##################### LOAD STUDENT DATA RECORDS ##################### //
  // ##################################################################### //

  /**
   * This function will need to be replaced for the notebook.
   *
   * What it does is this:
   *  - Check database for student data for this lesson
   *  - If there are none, create records
   *  - Then, return these records and create a studentDataIdArray
   *  - The studentDataIdArray is an array of objects like this:
   *      {
   *        id: string, // id of the record to update
   *        pageIdx: number, // references index of student data for that page in lessonState.studentData
   *        lessonPageID: string, // specific id of page from lesson plan
   *        update: boolean, // in the lesson, we loop through the studentDataIdArray to check which page has been updated, then we send to the Database
   *      }
   *
   *
   *    - THIS IS FOR AUTOSAVING, IF THE TEACHER IS MANUALLY ADDING COMMENTS/FEEDBACK, THIS LOGIC IS NOT NECESSARY
   */

  // ~~~~~~~~~~~ THE MAIN FUNTION ~~~~~~~~~~ //
  const getStudentData = async () => {
    const lessonID = LESSON_ID;
    const syllabusID = SYLLABUS_ID; // in the table this is called SyllabusLessonID, but it's just the syllabusID

    const user = await Auth.currentAuthenticatedUser();
    const authId = user.attributes.sub;
    const email = user.attributes.email;

    // transform to data-id array, for updating
    const studentDataIdArray = (studentDataArray: any[]) => {
      return studentDataArray
        .map((dataObj: any, idx: number) => {
          return {
            id: dataObj.id,
            pageIdx: lessonState.lessonData.lessonPlan.findIndex(
              (lessonPlanObj: any) => lessonPlanObj.id === dataObj.lessonPageID
            ),
            lessonPageID: dataObj.lessonPageID,
            update: false,
          };
        })
        .sort((dataID1: any, dataID2: any) => {
          if (dataID1.pageIdx < dataID2.pageIdx) {
            return -1;
          }
          if (dataID1.pageIdx > dataID2.pageIdx) {
            return 1;
          }
        });
    };

    try {
      const listFilter = {
        filter: {lessonID: lessonID, syllabusLessonID: syllabusID, studentAuthID: authId},
      };
      const studentData: any = await API.graphql(
        graphqlOperation(queries.listUniversalLessonStudentDatas, {
          listFilter,
        })
      );

      // existing student rows
      const studentDataRows = studentData.data.listUniversalLessonStudentDatas.items;

      if (!(studentDataRows.length > 0)) {
        throw 'No student data records for this lesson...';
      } else {
        const existStudentDataIdArray = studentDataIdArray(studentDataRows);
        const filteredStudentData = existStudentDataIdArray.reduce(
          (acc: StudentPageInput[], dataIdObj: any) => {
            const findPageData = studentDataRows.find(
              (dataObj: UniversalLessonStudentData) => dataObj.id === dataIdObj.id
            )?.pageData;
            if (Array.isArray(findPageData)) {
              return [...acc, findPageData];
            } else {
              return [];
            }
          },
          []
        );

        lessonDispatch({
          type: 'LOAD_STUDENT_DATA',
          payload: {
            dataIdReferences: existStudentDataIdArray,
            filteredStudentData: filteredStudentData,
          },
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  //  INITIALIZE STUDENT DATA AND DATA-ID ARRAY  //
  useEffect(() => {
    if (
      lessonState.lessonData.lessonPlan &&
      lessonState.lessonData.lessonPlan.length > 0 &&
      lessonState.studentData &&
      !(lessonState.studentData.length > 0)
    ) {
      initializeStudentData().then((_: void) =>
        console.log('initializeStudentData - ', 'initiated')
      );
      if (!lessonState.loaded) {
        getStudentData().then((_: void) =>
          console.log('getOrCreateStudentData - ', 'getted')
        );
      }
    }
  }, [lessonState.lessonData.lessonPlan]);

  return (
    <>
      <div className={`${theme.bg} w-full flex flex-col items-start`}>
        {/**
         * Explanation:
         * The <LessonHeaderBar/> component displays the pages/navigation
         * at the top of the lesson page. It includes the component <LessonTopMenu/>
         * which handles the page back/forward functionality
         *
         * E.g.
         * Page forward =>
         * lessonDispatch({
         *   type: 'SET_CURRENT_PAGE',
         *   payload: CURRENT_PAGE + 1,
         * });
         *
         * Basically, when you switch pages in the notebook,
         * you should use this lessonDispatch to set the page, then the
         * LessonViewer will know which page to switch to.
         *
         *
         **/}

        {/*<LessonHeaderBar*/}
        {/*  lessonDataLoaded={lessonDataLoaded}*/}
        {/*  overlay={overlay}*/}
        {/*  setOverlay={setOverlay}*/}
        {/*/>*/}

        <ErrorBoundary fallback={<h1>Error in the Lesson Data Viewer</h1>}>
          <CoreUniversalLesson />
        </ErrorBoundary>
      </div>
    </>
  );
};

export default LessonDataViewer;
