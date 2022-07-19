import React, {useEffect, useState, useContext} from 'react';
import {GlobalContext} from '../../../contexts/GlobalContext';
import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import * as queries from '@graphql/queries';
import Selector from '../../Atoms/Form/Selector';
import DateAndTime from '../DateAndTime/DateAndTime';
import useDictionary from '../../../customHooks/dictionary';
import * as customQueries from '../../../customGraphql/customQueries';
import ComponentLoading from 'components/Lesson/Loading/ComponentLoading';
import moment from 'moment';
import PieChartWrapper from './DashboardTreeComponents/AnalyticsPieChart';

interface ICsvProps {
  institutionId?: string;
}

interface IAllDataProps {
  allInstitutions: number;
  allCourseData: number;
  allStudents: number;
  allFellows: number;
  allUniversalLessons: number;
  allUniversalSurveys: number;
  allClasses: number;
  allTakenSurveys?: number;
}

const AnalyticsDashboard = ({institutionId}: ICsvProps) => {
  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {CsvDict} = useDictionary(clientKey);
  const [loading, setLoading] = useState<boolean>(false);
  const [AllInstitutions, setAllInstitutions] = useState<any[]>([]);
  const [__, setAllStudents] = useState<any[]>([]);
  const [_, setAllFellows] = useState<any[]>([]);
  const [___, setAllTeachers] = useState<any[]>([]);
  const [AllUniversalLessons, setAllUniversalLessons] = useState<any[]>([]);
  const [AllUniversalSurveys, setAllUniversalSurveys] = useState<any[]>([]);
  const [AllCourses, setAllCourses] = useState<any[]>([]);
  const [AllRooms, setAllRooms] = useState<any[]>([]);
  const [AllData, setAllData] = useState<IAllDataProps>({
    allInstitutions: 0,
    allCourseData: 0,
    allStudents: 0,
    allFellows: 0,
    allUniversalLessons: 0,
    allUniversalSurveys: 0,
    allClasses: 0,
    allTakenSurveys: 0,
  });

  const [allUniversalSurveyStudentData, setAllUniversalSurveyStudentData] = useState<
    any[]
  >([]);

  const [isChecked, setIsChecked] = useState<boolean>(false);

  const [selectedInstitute, setSelectedInstitute] = useState<{
    id: string;
    name: string;
    value: string;
  }>({
    id: '',
    name: '',
    value: '',
  });

  const [selectedTimelineActivity, setSelectedTimelineActivity] = useState<{
    id: string;
    name: string;
    value: string;
  }>({
    id: '',
    name: '',
    value: '',
  });

  const TimeLineActivity = [
    {
      id: 1,
      name: 'All',
      value: 'all',
    },
    {
      id: 2,
      name: 'Today',
      value: 'today',
    },
    {
      id: 3,
      name: 'This Week',
      value: 'thisWeek',
    },
    {
      id: 4,
      name: 'This Month',
      value: 'thisMonth',
    },
    {
      id: 5,
      name: 'This Year',
      value: 'thisYear',
    },
  ];

  useEffect(() => {
    getAllDataReadyForChart();
    listUniversalSurveyData(undefined, []);
  }, []);

  const getAllDataReadyForChart = async () => {
    setLoading(true);
    const instituteDetails = await listInstitutions(undefined, []);
    const courseDetails = await listAllCourses(undefined, []);
    const studentsDetails = await listAllStudentsAndFellow(`ST`, undefined, []);
    const fellowDetails = await listAllStudentsAndFellow(`FLW`, undefined, []);
    const teacherDetails = await listAllStudentsAndFellow(`TR`, undefined, []);
    const lessonDetails = await listAllLessons(`lesson`, undefined, []);
    const surveyDetails = await listAllLessons(`survey`, undefined, []);
    const classDetails = await listAllRooms(undefined, []);
    await findActiveandInactiveStudent(
      instituteDetails,
      courseDetails,
      studentsDetails,
      fellowDetails,
      teacherDetails,
      lessonDetails,
      surveyDetails,
      classDetails
    );
    setLoading(false);
  };

  const listInstitutions = async (nextToken: string, outArray: any[]): Promise<any> => {
    let combined;
    try {
      const result: any = await API.graphql(
        graphqlOperation(customQueries.listInstitutions, {
          nextToken: nextToken,
        })
      );
      let returnedData = result.data.listInstitutions?.items;
      let NextToken = result.data.listInstitutions?.nextToken;

      combined = [...outArray, ...returnedData];

      if (NextToken) {
        // console.log('nextToken fetching more - ', nextToken);
        combined = await listInstitutions(NextToken, combined);
      }

      setAllInstitutions(combined);
      return combined;
    } catch (error) {
      console.log(
        '🚀 ~ file: AnalyticsDashboard.tsx ~ line 24 ~ listInstitutions ~ error',
        error
      );
    }
  };

  const listAllStudentsAndFellow = async (
    peopleType: string,
    nextToken: string,
    outArray: any[]
  ): Promise<any> => {
    let combined: any[];
    try {
      const result: any = await API.graphql(
        graphqlOperation(queries.listPeople, {
          filter: {role: {eq: peopleType}},
          nextToken: nextToken,
        })
      );

      let returnedData = result.data.listPeople?.items;
      let NextToken = result.data.listPeople?.nextToken;

      combined = [...outArray, ...returnedData];

      if (NextToken) {
        combined = await listAllStudentsAndFellow(peopleType, NextToken, combined);
      }

      if (peopleType === 'ST') {
        setAllStudents(combined);
      } else if (peopleType === 'FLW') {
        setAllFellows(combined);
      } else if (peopleType === 'TR') {
        setAllTeachers(combined);
      }

      return combined;
    } catch (error) {
      console.log(
        '🚀 ~ file: AnalyticsDashboard.tsx ~ line 24 ~ listAllStudents ~ error',
        error
      );
    }
  };

  const listAllCourses = async (nextToken: string, outArray: any[]): Promise<any> => {
    try {
      const result: any = await API.graphql(
        graphqlOperation(customQueries.listCurriculas, {
          nextToken: nextToken,
        })
      );
      let returnedData = result.data.listCurricula?.items;
      let NextToken = result.data.listCurricula?.nextToken;

      let combined = [...outArray, ...returnedData];

      if (NextToken) {
        combined = await listAllCourses(NextToken, combined);
      }

      setAllCourses(combined);
      return combined;
    } catch (error) {
      console.log(
        '🚀 ~ file: AnalyticsDashboard.tsx ~ line 24 ~ listAllCourses ~ error',
        error
      );
    }
  };

  const listAllLessons = async (
    lessonType: string,
    nextToken: string,
    outArray: any[]
  ): Promise<any> => {
    let combined: any[];
    try {
      const result: any = await API.graphql(
        graphqlOperation(queries.listUniversalLessons, {
          filter: {type: {eq: lessonType}},
          nextToken: nextToken,
        })
      );

      let returnedData = result.data.listUniversalLessons?.items;
      let NextToken = result.data.listUniversalLessons?.nextToken;

      combined = [...outArray, ...returnedData];

      if (NextToken) {
        combined = await listAllLessons(lessonType, NextToken, combined);
      }
      if (lessonType === 'lesson') {
        setAllUniversalLessons(combined);
      } else if (lessonType === 'survey') {
        setAllUniversalSurveys(combined);
      }

      return combined;
    } catch (error) {
      console.log(
        '🚀 ~ file: AnalyticsDashboard.tsx ~ line 24 ~ listAllLessons ~ error',
        error
      );
    }
  };

  const listAllRooms = async (nextToken: string, outArray: any[]): Promise<any> => {
    let combined;
    try {
      const result: any = await API.graphql(
        graphqlOperation(customQueries.listRooms, {
          nextToken: nextToken,
        })
      );
      let returnedData = result.data.listRooms?.items;
      let NextToken = result.data.listRooms?.nextToken;

      combined = [...outArray, ...returnedData];

      if (NextToken) {
        combined = await listAllRooms(NextToken, combined);
      }
      setAllRooms(combined);
      return combined;
    } catch (error) {
      console.log(
        '🚀 ~ file: AnalyticsDashboard.tsx ~ line 24 ~ listAllClasses ~ error',
        error
      );
    }
  };

  const listUniversalSurveyData = async (
    nextToken: string,
    outArray: any[]
  ): Promise<any> => {
    try {
      const result: any = await API.graphql(
        graphqlOperation(queries.listUniversalSurveyStudentData, {
          nextToken: nextToken,
        })
      );
      let returnedData = result.data.listUniversalSurveyStudentData?.items;
      let NextToken = result.data.listUniversalSurveyStudentData?.nextToken;

      let combined = [...outArray, ...returnedData];

      if (NextToken) {
        combined = await listUniversalSurveyData(NextToken, combined);
      }
      setAllUniversalSurveyStudentData(combined);
      return combined;
    } catch (error) {
      console.log(
        '🚀 ~ file: AnalyticsDashboard.tsx ~ line 435 ~ allUniversalSurveyData ~ error',
        error
      );
    }
  };

  const getInstituteName = async (instituteId: string) => {
    try {
      const instituteData = AllInstitutions.find(
        (institute) => institute.id === instituteId
      );
      if (instituteData) {
        const classList = instituteData.rooms.items.length;
        const courseList = instituteData.curricula.items.length;
        const studentList = instituteData.classes.items.reduce(
          (acc: any, curr: any) => acc + curr.students.items.length,
          0
        );

        const fellowList = instituteData.staff.items.filter(
          (staffList: any) =>
            staffList.staffMember.role === 'FLW' || staffList.staffMember.role === 'TR'
        ).length;

        const lessonList = AllUniversalLessons.filter(
          (lesson: any) =>
            lesson.institutionID === instituteId && lesson.type === 'lesson'
        ).length;

        const surveyList = AllUniversalSurveys.filter(
          (survey: any) =>
            survey.institutionID === instituteId && survey.type === 'survey'
        ).length;

        return {
          classList,
          courseList,
          studentList,
          fellowList: fellowList ? fellowList : 0,
          lessonList: lessonList ? lessonList : 0,
          surveyList: surveyList ? surveyList : 0,
        };
      }
    } catch (error) {
      console.log(
        '🚀 ~ file: AnalyticsDashboard.tsx ~ line 24 ~ getInstituteName ~ error',
        error
      );
    }
  };

  const findActiveandInactiveStudent = async (
    instituteDetails: any[],
    courseDetails: any[],
    studentsDetails: any[],
    fellowDetails: any[],
    teacherDetails: any[],
    lessonDetails: any[],
    surveyDetails: any[],
    classDetails: any[]
  ) => {
    try {
      setAllData({
        allInstitutions: instituteDetails.length,
        allCourseData: courseDetails.length,
        allStudents: studentsDetails.length,
        allClasses: classDetails.length,
        allFellows: fellowDetails.length + teacherDetails.length,
        allUniversalLessons: lessonDetails.length,
        allUniversalSurveys: surveyDetails.length,
      });
    } catch (error) {
      console.log(
        '🚀 ~ file: AnalyticsDashboard.tsx ~ line 195 ~ findActiveandInactiveStudent ~ error',
        error
      );
    }
  };

  const onInstitutionSelected = async (id: any, name: string, value: string) => {
    setIsChecked(true);
    let instituteDropdownValue = {id, name, value};
    setSelectedInstitute(instituteDropdownValue);

    const {
      classList,
      courseList,
      studentList,
      fellowList,
      lessonList,
      surveyList,
    } = await getInstituteName(id);

    const {
      lessonListByProvider,
      surveyListByProvider,
      fellowListByProvider,
      courseListByProvider,
    } = await getServiceProviderData(id);

    if (selectedTimelineActivity.id !== '') {
      const takenSurvey = await filterUniversalSurveyIDswithData(
        selectedTimelineActivity
      );

      setAllData({
        allInstitutions: 1,
        allCourseData: courseList + courseListByProvider,
        allStudents: studentList,
        allClasses: classList,
        allFellows: fellowList + fellowListByProvider,
        allUniversalLessons: (lessonList + lessonListByProvider) as any,
        allUniversalSurveys: (surveyList + surveyListByProvider) as any,
        allTakenSurveys: takenSurvey.length,
      });
    } else {
      setAllData({
        allInstitutions: 1,
        allCourseData: courseList + courseListByProvider,
        allStudents: studentList,
        allClasses: classList,
        allFellows: fellowList + fellowListByProvider,
        allUniversalLessons: (lessonList + lessonListByProvider) as any,
        allUniversalSurveys: (surveyList + surveyListByProvider) as any,
      });
    }
  };

  const filterUniversalSurveyIDswithData = async (timelineDropdownValue: {
    id: string;
    name: string;
    value: string;
  }) => {
    try {
      let surveyLists: any[];
      let filterAlluniversalSurveyStudentData: any[];
      let updatedSurveyList: any[];
      let duplicateDataIds: any[];
      let filteredSurveyListIDs: any[];
      const todayDate = moment().format();
      const oneDayBefore = moment().subtract(1, 'days').format();
      const currentWeek = moment().subtract(7, 'days').format();
      const currentMonth = moment().subtract(30, 'days').format();
      const currentYear = moment().subtract(365, 'days').format();
      if (isChecked) {
        const instituteDetails = AllInstitutions.find(
          (institute) => institute.id === selectedInstitute.id
        );

        if (instituteDetails?.serviceProviders?.items?.length > 0) {
          const returnedData = instituteDetails.serviceProviders.items.map(
            (serviceProvider: any) => {
              surveyLists = AllUniversalSurveys.filter(
                (survey: any) =>
                  survey.institutionID === serviceProvider.providerInstitution.id &&
                  survey.type === 'survey'
              );

              filterAlluniversalSurveyStudentData = allUniversalSurveyStudentData.filter(
                (survey: any) => {
                  if (timelineDropdownValue.value === 'all') {
                    return survey;
                  } else if (timelineDropdownValue.value === 'today') {
                    return (
                      survey.createdAt >= oneDayBefore &&
                      survey.createdAt <= todayDate &&
                      surveyLists.find(
                        (surveyList: any) => surveyList.id === survey.lessonID
                      )
                    );
                  } else if (timelineDropdownValue.value === 'thisWeek') {
                    return (
                      survey.createdAt >= currentWeek &&
                      survey.createdAt <= todayDate &&
                      surveyLists.find(
                        (surveyList: any) => surveyList.id === survey.lessonID
                      )
                    );
                  } else if (timelineDropdownValue.value === 'thisMonth') {
                    return (
                      survey.createdAt >= currentMonth &&
                      survey.createdAt <= todayDate &&
                      surveyLists.find(
                        (surveyList: any) => surveyList.id === survey.lessonID
                      )
                    );
                  } else if (timelineDropdownValue.value === 'thisYear') {
                    return (
                      survey.createdAt >= currentYear &&
                      survey.createdAt <= todayDate &&
                      surveyLists.find(
                        (surveyList: any) => surveyList.id === survey.lessonID
                      )
                    );
                  }
                }
              );
              updatedSurveyList = filterAlluniversalSurveyStudentData.map((survey: any) =>
                surveyLists.find((surveyList: any) => surveyList.id === survey.lessonID)
              );

              duplicateDataIds = updatedSurveyList.map((o) => o.id);
              filteredSurveyListIDs = updatedSurveyList.filter(
                ({id}, index) => !duplicateDataIds.includes(id, index + 1)
              );
              return filteredSurveyListIDs;
            }
          );
          return returnedData[0];
        } else {
          surveyLists = AllUniversalSurveys.filter(
            (survey: any) =>
              survey.institutionID === selectedInstitute.id && survey.type === 'survey'
          );

          filterAlluniversalSurveyStudentData = allUniversalSurveyStudentData.filter(
            (survey: any) => {
              if (timelineDropdownValue.value === 'all') {
                return survey;
              } else if (timelineDropdownValue.value === 'today') {
                return (
                  survey.createdAt >= oneDayBefore &&
                  survey.createdAt <= todayDate &&
                  surveyLists.find((surveyList: any) => surveyList.id === survey.lessonID)
                );
              } else if (timelineDropdownValue.value === 'thisWeek') {
                return (
                  survey.createdAt >= currentWeek &&
                  survey.createdAt <= todayDate &&
                  surveyLists.find((surveyList: any) => surveyList.id === survey.lessonID)
                );
              } else if (timelineDropdownValue.value === 'thisMonth') {
                return (
                  survey.createdAt >= currentMonth &&
                  survey.createdAt <= todayDate &&
                  surveyLists.find((surveyList: any) => surveyList.id === survey.lessonID)
                );
              } else if (timelineDropdownValue.value === 'thisYear') {
                return (
                  survey.createdAt >= currentYear &&
                  survey.createdAt <= todayDate &&
                  surveyLists.find((surveyList: any) => surveyList.id === survey.lessonID)
                );
              }
            }
          );
          updatedSurveyList = filterAlluniversalSurveyStudentData.map((survey: any) =>
            surveyLists.find((surveyList: any) => surveyList.id === survey.lessonID)
          );

          duplicateDataIds = updatedSurveyList.map((o) => o.id);
          filteredSurveyListIDs = updatedSurveyList.filter(
            ({id}, index) => !duplicateDataIds.includes(id, index + 1)
          );

          return filteredSurveyListIDs;
        }
      }
    } catch (error) {
      console.log(
        '🚀 ~ file: AnalyticsDashboard.tsx ~ line 437 ~ filterUniversalSurveyIDswithData ~ error',
        error
      );
    }
  };

  const onTimelineActivitySelected = async (id: any, name: string, value: string) => {
    let timelineDropdownValue = {id, name, value};
    setSelectedTimelineActivity(timelineDropdownValue);
    const takenSurvey = await filterUniversalSurveyIDswithData(timelineDropdownValue);

    setAllData({
      allInstitutions: AllData.allInstitutions,
      allCourseData: AllData.allCourseData,
      allStudents: AllData.allStudents,
      allClasses: AllData.allClasses,
      allFellows: AllData.allFellows,
      allUniversalLessons: AllData.allUniversalLessons as any,
      allUniversalSurveys: AllData.allUniversalSurveys as any,
      allTakenSurveys: takenSurvey.length,
    });
  };

  const getNameandValueofInstitute = () => {
    try {
      const instituteData = AllInstitutions.map((institute: any) => {
        return {
          name: institute.name,
          value: 350,
          key: 'Institute',
          allData: AllData,
        };
      });
      return instituteData;
    } catch (error) {
      console.log(
        '🚀 ~ file: AnalyticsDashboard.tsx ~ line 195 ~ getNameandValueofInstitute ~ error',
        error
      );
    }
  };

  const getCourseCount = () => {
    return [
      {
        name: 'Course',
        value: AllData.allCourseData === 0 ? 10 : AllData.allCourseData,
        key: 'Course',
        allData: AllData,
      },
      {
        name: '',
        value: AllData.allCourseData === 0 ? 0 : 220,
        key: 'Inactive_Course',
      },
    ];
  };

  const getTakenSurveyCount = () => {
    return [
      {
        name: 'Taken Survey',
        value: AllData.allTakenSurveys === 0 ? 5 : AllData.allTakenSurveys,
        key: 'taken_Survey',
        allData: AllData,
      },
      {
        name: 'Total Survey',
        value: AllData.allUniversalSurveys === 0 ? 10 : AllData.allUniversalSurveys,
        key: 'total_Survey',
        allData: AllData,
      },
    ];
  };

  const getClassesCount = () => {
    return [
      {
        name: 'Classrooms',
        value: AllData.allClasses === 0 ? 10 : AllData.allClasses,
        key: `Classes`,
        allData: AllData,
      },
      {
        name: '',
        value: AllData.allClasses === 0 ? 0 : 220,
        key: `Inactive_Classes`,
      },
    ];
  };

  const getUniversalLessonsCount = () => {
    return [
      {
        name: 'Lessons',
        value: AllData.allUniversalLessons === 0 ? 10 : AllData.allUniversalLessons,
        key: `Lessons`,
        allData: AllData,
      },
      {
        name: '',
        value: AllData.allUniversalLessons === 0 ? 0 : 220,
        key: `Inactive_Lessons`,
      },
    ];
  };

  const getUniversalSurveysCount = (): any => {
    return [
      {
        name: 'Surveys',
        value: AllData.allUniversalSurveys === 0 ? 10 : AllData.allUniversalSurveys,
        key: `Surveys`,
        allData: AllData,
      },
      {
        name: '',
        value: AllData.allUniversalSurveys === 0 ? 0 : 220,
        key: `Inactive_Surveys`,
      },
    ];
  };

  const getServiceProviderData = async (id: string) => {
    try {
      const instituteDetails = AllInstitutions.find((institute) => institute.id === id);
      if (instituteDetails?.serviceProviders?.items?.length > 0) {
        const returnedData = instituteDetails?.serviceProviders?.items?.map(
          (provider: any) => {
            const lessonListByProvider = AllUniversalLessons.filter(
              (lesson: any) =>
                lesson.institutionID === provider?.providerInstitution?.id &&
                lesson.type === 'lesson'
            ).length;

            const surveyListByProvider = AllUniversalSurveys.filter(
              (survey: any) =>
                survey.institutionID === provider?.providerInstitution?.id &&
                survey.type === 'survey'
            ).length;

            const fellows = AllInstitutions.filter(
              (institute: any) => institute.id === provider?.providerInstitution?.id
            );

            const fellowListByProvider = fellows[0]?.staff?.items?.filter(
              (staffList: any) =>
                (staffList.staffMember.role === 'FLW' ||
                  staffList.staffMember.role === 'TR') &&
                !instituteDetails.staff?.items?.find(
                  (staff: any) => staff?.staffEmail === staffList?.staffEmail
                )
            ).length;

            const courseListByProvider = AllCourses.filter(
              (course: any) => course.institutionID === provider?.providerInstitution?.id
            ).length;

            return {
              lessonListByProvider,
              surveyListByProvider,
              fellowListByProvider,
              courseListByProvider,
            };
          }
        );
        return returnedData[0];
      } else {
        return {
          lessonListByProvider: 0,
          surveyListByProvider: 0,
          fellowListByProvider: 0,
          courseListByProvider: 0,
        };
      }
    } catch (error) {
      console.log(
        '🚀 ~ file: AnalyticsDashboard.tsx ~ line 756 ~ getServiceProviderData ~ error',
        error
      );
    }
  };

  const toggleCheckBox = async () => {
    // setIsChecked(!isChecked);
    // await getServiceProviderData();
  };

  return (
    <div className="flex flex-col overflow-h-scroll w-full h-full px-8 py-4">
      <div className="mx-auto w-full">
        <div className="flex flex-row my-0 w-full py-0 mb-8 justify-between">
          <h3 className="text-lg leading-6 text-gray-600 w-auto">
            {CsvDict[userLanguage]['TITLE']}
          </h3>
          {/* <div className={`border-l-6 pl-4 ${theme.verticalBorder[themeColor]}`}>
            <span>{CsvDict[userLanguage]['TITLE']}</span>
          </div> */}
          <div className="w-auto">
            <span className={`mr-0 float-right text-gray-600 text-right`}>
              <DateAndTime />
            </span>
          </div>
        </div>
        <div className="flex gap-4 justify-between items-center">
          <Selector
            loading={loading}
            disabled={loading}
            selectedItem={selectedInstitute ? selectedInstitute.name : ''}
            placeholder="select an institution"
            list={AllInstitutions}
            additionalClass="w-1/3"
            onChange={(value, name, id) => onInstitutionSelected(id, name, value)}
          />
          {selectedInstitute.id !== '' && (
            <>
              <span className="cursor-not-allowed">
                <input
                  type="checkbox"
                  className="form-checkbox w-4 h-4 cursor-not-allowed"
                  checked={isChecked}
                  onChange={toggleCheckBox}
                  id="provider-checkbox"
                />
                <label
                  htmlFor="provider-checkbox"
                  className={`w-auto ml-2 leading-5 text-xs text-gray-600 cursor-not-allowed`}>
                  With Service Providers
                </label>
              </span>
              <Selector
                loading={loading}
                disabled={loading}
                selectedItem={
                  selectedTimelineActivity ? selectedTimelineActivity.name : ''
                }
                placeholder="Activity timeline"
                list={TimeLineActivity}
                additionalClass="w-1/3"
                onChange={(value, name, id) =>
                  onTimelineActivitySelected(id, name, value)
                }
              />
            </>
          )}
        </div>
        <div className="flex flex-wrap my-4 ">
          {loading ? (
            <div className="flex flex-col justify-center items-center">
              <ComponentLoading />
            </div>
          ) : (
            <>
              <div className="analytic-wrap gap-4 flex-wrap grid">
                <div className="analytic-badge">
                  <h2>{AllData.allInstitutions}</h2> Institutions
                </div>
                <div className="analytic-badge">
                  <h2>{AllData.allCourseData}</h2> Courses
                </div>
                <div className="analytic-badge">
                  <h2>{AllData.allStudents}</h2> Students
                </div>
                <div className="analytic-badge">
                  <h2>{AllData.allFellows}</h2> Fellows
                </div>
                <div className="analytic-badge">
                  <h2>{AllData.allClasses}</h2> Classes
                </div>
                <div className="analytic-badge">
                  <h2>{AllData.allUniversalLessons}</h2> Lessons
                </div>
                <div className="analytic-badge">
                  <h2>{AllData.allUniversalSurveys}</h2> Surveys
                </div>
                {selectedTimelineActivity.id !== '' && (
                  <div className="analytic-badge">
                    <h2>
                      {AllData.allTakenSurveys === 0 ? 0 : AllData.allTakenSurveys}/
                      {AllData.allUniversalSurveys}
                    </h2>{' '}
                    Surveys Taken
                  </div>
                )}
              </div>
              <div className="flex flex-wrap mx-2">
                <PieChartWrapper getNameandValuefromData={getNameandValueofInstitute} />
                <PieChartWrapper getNameandValuefromData={getCourseCount} />
                <PieChartWrapper getNameandValuefromData={getClassesCount} />
                <PieChartWrapper getNameandValuefromData={getUniversalLessonsCount} />
                <PieChartWrapper getNameandValuefromData={getUniversalSurveysCount} />
                {selectedTimelineActivity.id !== '' && (
                  <PieChartWrapper getNameandValuefromData={getTakenSurveyCount} />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(AnalyticsDashboard);
