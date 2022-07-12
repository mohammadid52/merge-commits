import React, {useEffect, useState, useContext, useCallback} from 'react';
import {GlobalContext} from '../../../contexts/GlobalContext';
import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import * as queries from '@graphql/queries';
import Selector from '../../Atoms/Form/Selector';
import DateAndTime from '../DateAndTime/DateAndTime';
import useDictionary from '../../../customHooks/dictionary';
import * as customQueries from '../../../customGraphql/customQueries';
import ComponentLoading from 'components/Lesson/Loading/ComponentLoading';
import {PieChart, Pie, Cell, Sector} from 'recharts';

interface ICsvProps {
  institutionId?: string;
}

interface IAllDataProps {
  allInstitutions: number;
  allStudents: number;
  allFellows: number;
  allUniversalLessons: number;
  allUniversalSurveys: number;
  allClasses: number;
  activeStudent: number;
  inactiveStudent: number;
}

const AnalyticsDashboard = ({institutionId}: ICsvProps) => {
  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {CsvDict} = useDictionary(clientKey);
  const [loading, setLoading] = useState<boolean>(false);
  const [AllInstitutions, setAllInstitutions] = useState<any[]>([]);
  const [__, setAllStudents] = useState<any[]>([]);
  const [_, setAllFellows] = useState<any[]>([]);
  const [AllUniversalLessons, setAllUniversalLessons] = useState<any[]>([]);
  const [AllUniversalSurveys, setAllUniversalSurveys] = useState<any[]>([]);
  const [___, setAllClasses] = useState<any[]>([]);
  const [_____, setActiveStudent] = useState<any[]>([]);
  const [____, setInactiveStudent] = useState<any[]>([]);
  const [AllData, setAllData] = useState<IAllDataProps>({
    allInstitutions: 0,
    allStudents: 0,
    allFellows: 0,
    allUniversalLessons: 0,
    allUniversalSurveys: 0,
    allClasses: 0,
    activeStudent: 0,
    inactiveStudent: 0,
  });
  const [activeIndex, setActiveIndex] = useState<number>(0);
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

  useEffect(() => {
    getAllDataReadyForChart();
  }, []);

  const getAllDataReadyForChart = async () => {
    setLoading(true);
    const instituteDetails = await listInstitutions(undefined, []);
    const studentsDetails = await listAllStudentsAndFellow(`ST`, undefined, []);
    const fellowDetails = await listAllStudentsAndFellow(`FLW`, undefined, []);
    const lessonDetails = await listAllLessons(`lesson`, undefined, []);
    const surveyDetails = await listAllLessons(`survey`, undefined, []);
    const classDetails = await listAllClasses(undefined, []);
    await findActiveandInactiveStudent(
      instituteDetails,
      studentsDetails,
      fellowDetails,
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
        console.log('nextToken fetching more - ', nextToken);
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
      }

      return combined;
    } catch (error) {
      console.log(
        '🚀 ~ file: AnalyticsDashboard.tsx ~ line 24 ~ listAllStudents ~ error',
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

  const listAllClasses = async (nextToken: string, outArray: any[]): Promise<any> => {
    let combined;
    try {
      const result: any = await API.graphql(
        graphqlOperation(customQueries.listAllClasses, {
          nextToken: nextToken,
        })
      );
      let returnedData = result.data.listClasses?.items;
      let NextToken = result.data.listClasses?.nextToken;

      combined = [...outArray, ...returnedData];

      if (NextToken) {
        combined = await listAllClasses(NextToken, combined);
      }
      setAllClasses(combined);
      return combined;
    } catch (error) {
      console.log(
        '🚀 ~ file: AnalyticsDashboard.tsx ~ line 24 ~ listAllClasses ~ error',
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
        const classList = instituteData.classes.items.length;
        const studentList = instituteData.classes.items.reduce(
          (acc: any, curr: any) => acc + curr.students.items.length,
          0
        );
        const ActiveStudentCount = instituteData.classes.items
          .map((classData: any) => {
            const filteredActiveStudent = classData.students.items.filter(
              (student: any) => student.student.status === 'ACTIVE'
            ).length;
            return filteredActiveStudent;
          })
          .reduce((acc: any, curr: any) => {
            return acc + curr;
          }, 0);

        const InactiveStudentCount = instituteData.classes.items
          .map((classData: any) => {
            const filteredInactiveStudent = classData.students.items.filter(
              (student: any) => student.student.status === 'INACTIVE'
            ).length;
            return filteredInactiveStudent;
          })
          .reduce((acc: any, curr: any) => {
            return acc + curr;
          }, 0);

        const fellowList = instituteData.staff.items.filter(
          (staffList: any) => staffList.staffMember.role === 'FLW'
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
          studentList,
          fellowList: fellowList ? fellowList : 0,
          lessonList: lessonList ? lessonList : 0,
          surveyList: surveyList ? surveyList : 0,
          ActiveStudentCount,
          InactiveStudentCount,
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
    studentsDetails: any[],
    fellowDetails: any[],
    lessonDetails: any[],
    surveyDetails: any[],
    classDetails: any[]
  ) => {
    try {
      const ActiveStudentCount = studentsDetails.filter(
        (student: any) => student.status === 'ACTIVE'
      );
      const InactiveStudentCount = studentsDetails.filter(
        (student: any) => student.status === 'INACTIVE'
      );
      setActiveStudent(ActiveStudentCount);
      setInactiveStudent(InactiveStudentCount);
      setAllData({
        allInstitutions: instituteDetails.length,
        allStudents: studentsDetails.length,
        allClasses: classDetails.length,
        allFellows: fellowDetails.length,
        allUniversalLessons: lessonDetails.length,
        allUniversalSurveys: surveyDetails.length,
        activeStudent: ActiveStudentCount.length,
        inactiveStudent: InactiveStudentCount.length,
      });
    } catch (error) {
      console.log(
        '🚀 ~ file: AnalyticsDashboard.tsx ~ line 195 ~ findActiveandInactiveStudent ~ error',
        error
      );
    }
  };

  const onInstitutionSelected = async (id: any, name: string, value: string) => {
    setIsChecked(false);
    let instituteDropdownValue = {id, name, value};
    setSelectedInstitute(instituteDropdownValue);
    const {
      classList,
      studentList,
      fellowList,
      lessonList,
      surveyList,
      ActiveStudentCount,
      InactiveStudentCount,
    } = await getInstituteName(id);
    console.log(
      '🚀 ~ file: AnalyticsDashboard.tsx ~ line 202 ~ getInstituteName ~ studentList',
      studentList,
      classList,
      fellowList,
      lessonList,
      surveyList,
      ActiveStudentCount,
      InactiveStudentCount
    );

    setAllData({
      allInstitutions: 1,
      allStudents: studentList,
      allClasses: classList,
      allFellows: fellowList,
      allUniversalLessons: lessonList as any,
      allUniversalSurveys: surveyList as any,
      activeStudent: ActiveStudentCount,
      inactiveStudent: InactiveStudentCount,
    });
  };

  const getNameandValueofInstitute = () => {
    try {
      const instituteData = AllInstitutions.map((institute: any) => {
        return {name: institute.name, value: 350, key: 'Institute'};
      });
      return instituteData;
    } catch (error) {
      console.log(
        '🚀 ~ file: AnalyticsDashboard.tsx ~ line 195 ~ getNameandValueofInstitute ~ error',
        error
      );
    }
  };

  const getActiveandInactiveStudent = () => {
    try {
      return [
        {
          name: 'Active',
          value: AllData.activeStudent === 0 ? 10 : AllData.activeStudent,
          key: `Active`,
        },
        {
          name: 'Inactive',
          value: AllData.inactiveStudent === 0 ? 10 : AllData.inactiveStudent,
          key: `Inactive`,
        },
      ];
    } catch (error) {
      console.log(
        '🚀 ~ file: AnalyticsDashboard.tsx ~ line 232 ~ getActiveandInactiveStudent ~ error',
        error
      );
    }
  };

  const getClassesCount = () => {
    return [
      {
        name: 'Classrooms',
        value: AllData.allClasses === 0 ? 10 : AllData.allClasses,
        key: `Classes`,
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
      },
      {
        name: '',
        value: AllData.allUniversalLessons === 0 ? 0 : 220,
        key: `Inactive_Lessons`,
      },
    ];
  };

  const getUniversalSurveysCount = () => {
    return [
      {
        name: 'Surveys',
        value: AllData.allUniversalSurveys === 0 ? 10 : AllData.allUniversalSurveys,
        key: `Surveys`,
      },
      {
        name: '',
        value: AllData.allUniversalSurveys === 0 ? 0 : 220,
        key: `Inactive_Surveys`,
      },
    ];
  };

  const getServiceProviderData = async () => {
    try {
      if (!isChecked) {
        const allLessonValue = AllInstitutions.find(
          (institute) => institute.id === selectedInstitute.id
        );
        if (allLessonValue) {
          const returnedData = allLessonValue.serviceProviders.items.map(
            (provider: any) => {
              console.log(
                '🚀 ~ file: AnalyticsDashboard.tsx ~ line 766 ~ returnedData ~ provider.providerInstitution.id',
                provider.providerInstitution.id
              );
              const lessonList = AllUniversalLessons.filter(
                (lesson: any) =>
                  lesson.institutionID === provider.providerInstitution.id &&
                  lesson.type === 'lesson'
              ).length;

              const surveyList = AllUniversalSurveys.filter(
                (survey: any) =>
                  survey.institutionID === provider.providerInstitution.id &&
                  survey.type === 'survey'
              ).length;

              const fellows = AllInstitutions.filter(
                (institute: any) => institute.id === provider.providerInstitution.id
              );

              const fellowList = fellows[0].staff.items.filter(
                (staffList: any) => staffList.staffMember.role === 'FLW'
              ).length;

              return {
                lessonList,
                surveyList,
                fellowList,
              };
            }
          );
          console.log(
            '🚀 ~ file: AnalyticsDashboard.tsx ~ line 785 ~ returnedData ~ returnedData',
            returnedData
          );
          setAllData({
            allInstitutions: AllData.allInstitutions,
            allStudents: AllData.allStudents,
            allClasses: AllData.allClasses,
            allFellows: AllData.allFellows + returnedData[0].fellowList,
            allUniversalLessons: (AllData.allUniversalLessons +
              returnedData[0].lessonList) as any,
            allUniversalSurveys: (AllData.allUniversalSurveys +
              returnedData[0].surveyList) as any,
            activeStudent: AllData.activeStudent,
            inactiveStudent: AllData.inactiveStudent,
          });
        }
      } else if (isChecked) {
        const {
          classList,
          studentList,
          fellowList,
          lessonList,
          surveyList,
          ActiveStudentCount,
          InactiveStudentCount,
        } = await getInstituteName(selectedInstitute.id);
        setAllData({
          allInstitutions: AllData.allInstitutions,
          allStudents: studentList,
          allClasses: classList,
          allFellows: fellowList,
          allUniversalLessons: lessonList as any,
          allUniversalSurveys: surveyList as any,
          activeStudent: ActiveStudentCount,
          inactiveStudent: InactiveStudentCount,
        });
      }
    } catch (error) {
      console.log(
        '🚀 ~ file: AnalyticsDashboard.tsx ~ line 756 ~ getServiceProviderData ~ error',
        error
      );
    }
  };

  const toggleCheckBox = async () => {
    setIsChecked(!isChecked);
    await getServiceProviderData();
  };

  const onPieEnter = useCallback(
    (_, index) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  const COLORS = [
    '#084081',
    '#4eb3d3',
    '#2b8cbe',
    '#0868ac',
    '#7bccc4',
    '#a8ddb5',
    '#ccebc5',
    '#e0f3db',
    '#f7fcf0',
  ];
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = (obj: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
    index: number;
    name: string;
    key: string;
    tooltipPayload: string;
  }) => {
    const radius = obj.innerRadius + (obj.outerRadius - obj.innerRadius) * 0.5;
    const x = obj.cx + radius * Math.cos(-obj.midAngle * RADIAN);
    const y = obj.cy + radius * Math.sin(-obj.midAngle * RADIAN);
    return (
      <>
        {obj.key === 'Institute' && (
          <>
            <text></text>
            <text x={obj.cx} y={obj.cy} dy={8} textAnchor="middle" fill={'#333'}>
              {'Institute'}
            </text>
            <text
              x={obj.cx}
              y={obj.cy + 20}
              textAnchor="middle"
              fontSize={11}
              fill={'#999'}>
              {'Details'}
            </text>
          </>
        )}
        {obj.key === 'Active' && (
          <>
            <text
              x={x}
              y={y}
              fontSize={12}
              fill="white"
              textAnchor={'middle'}
              dominantBaseline="central">
              {obj.name}
            </text>
            <text x={obj.cx} y={obj.cy} dy={8} textAnchor="middle" fill={'#333'}>
              {'Active/Inactive'}
            </text>
            <text
              x={obj.cx}
              y={obj.cy + 20}
              textAnchor="middle"
              fontSize={11}
              fill={'#999'}>
              {'Students'}
            </text>
          </>
        )}
        {obj.key === 'Inactive' && (
          <>
            <text
              x={x}
              y={y}
              fontSize={12}
              fill="white"
              textAnchor={'middle'}
              dominantBaseline="central">
              {obj.name}
            </text>
          </>
        )}
        {obj.key === 'Classes' && (
          <>
            <text
              x={x}
              y={y}
              fontSize={12}
              fill="white"
              textAnchor={'middle'}
              dominantBaseline="central">
              {obj.name}
            </text>
            <text x={obj.cx} y={obj.cy} dy={8} textAnchor="middle" fill={'#333'}>
              {'Classes'}
            </text>
            <text
              x={obj.cx}
              y={obj.cy + 20}
              textAnchor="middle"
              fontSize={11}
              fill={'#999'}>
              {'Details'}
            </text>
          </>
        )}
        {obj.key === 'Inactive_Classes' && null}
        {obj.key === 'Lessons' && (
          <>
            <text
              x={x}
              y={y}
              fontSize={12}
              fill="white"
              textAnchor={'middle'}
              dominantBaseline="central">
              {obj.name}
            </text>
            <text x={obj.cx} y={obj.cy} dy={8} textAnchor="middle" fill={'#333'}>
              {'Lessons'}
            </text>
            <text
              x={obj.cx}
              y={obj.cy + 20}
              textAnchor="middle"
              fontSize={11}
              fill={'#999'}>
              {'Details'}
            </text>
          </>
        )}
        {obj.key === 'Inactive_Lessons' && null}
        {obj.key === 'Surveys' && (
          <>
            <text
              x={x}
              y={y}
              fontSize={12}
              fill="white"
              textAnchor={'middle'}
              dominantBaseline="central">
              {obj.name}
            </text>
            <text x={obj.cx} y={obj.cy} dy={8} textAnchor="middle" fill={'#333'}>
              {'Surveys'}
            </text>
            <text
              x={obj.cx}
              y={obj.cy + 20}
              textAnchor="middle"
              fontSize={11}
              fill={'#999'}>
              {'Details'}
            </text>
          </>
        )}
        {obj.key === 'Inactive_Surveys' && null}
      </>
    );
  };

  const renderActiveShape = (props: any) => {
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      percent,
      value,
      key,
      tooltipPayload,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 10;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        {key === 'Institute' && (
          <>
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text
              x={ex + (cos >= 0 ? 1 : -1) * 12}
              y={ey}
              textAnchor={textAnchor}
              fill="#333">{`Institute: ${tooltipPayload[0].name}`}</text>
          </>
        )}
        {key === 'Active' && (
          <>
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text
              x={ex + (cos >= 0 ? 1 : -1) * 12}
              y={ey}
              textAnchor={textAnchor}
              fill="#333">{`Active : ${
              tooltipPayload[0].value === 10 ? 0 : tooltipPayload[0].value
            }`}</text>
          </>
        )}
        {key === 'Inactive' && (
          <>
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text
              x={ex + (cos >= 0 ? 1 : -1) * 12}
              y={ey}
              textAnchor={textAnchor}
              fill="#333">{`Inactive : ${
              tooltipPayload[0].value === 10 ? 0 : tooltipPayload[0].value
            }`}</text>
          </>
        )}
        {key === 'Classes' && (
          <>
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text
              x={ex + (cos >= 0 ? 1 : -1) * 12}
              y={ey}
              textAnchor={textAnchor}
              fill="#333">{`Total Class: ${
              tooltipPayload[0].value === 10 ? 0 : tooltipPayload[0].value
            }`}</text>
          </>
        )}
        {key === 'Lessons' && (
          <>
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text
              x={ex + (cos >= 0 ? 1 : -1) * 12}
              y={ey}
              textAnchor={textAnchor}
              fill="#333">{`Total Lesson: ${
              tooltipPayload[0].value === 10 ? 0 : tooltipPayload[0].value
            }`}</text>
          </>
        )}
        {key === 'Surveys' && (
          <>
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text
              x={ex + (cos >= 0 ? 1 : -1) * 12}
              y={ey}
              textAnchor={textAnchor}
              fill="#333">{`Total Survey: ${
              tooltipPayload[0].value === 10 ? 0 : tooltipPayload[0].value
            }`}</text>
          </>
        )}
      </g>
    );
  };

  const PieChartWrapper = ({
    getNameandValuefromData = () => {
      return {name: '', value: 0, key: ''} as any;
    },
  }) => {
    const chartData = getNameandValuefromData();
    return (
      <PieChart width={1000} height={400}>
        <Pie
          dataKey="value"
          data={chartData}
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          // cx={270}
          isAnimationActive={false}
          cy={180}
          innerRadius={60}
          outerRadius={140}
          onMouseEnter={onPieEnter}
          label={renderCustomizedLabel}
          labelLine={false}>
          {chartData.map((entry: any, index: any) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    );
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
            <span className="cursor-pointer">
              <input
                type="checkbox"
                className="form-checkbox w-4 h-4"
                checked={isChecked}
                onChange={toggleCheckBox}
                id="provider-checkbox"
              />
              <label
                htmlFor="provider-checkbox"
                className={`w-auto ml-2 leading-5 text-xs text-gray-600`}>
                With Service Providers
              </label>
            </span>
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
                <div className="analytic-badge">
                  <h2>{AllData.activeStudent}</h2> Active Students
                </div>
                <div className="analytic-badge">
                  <h2>{AllData.inactiveStudent}</h2> Inactive Students
                </div>
              </div>
              <div className="flex flex-wrap mx-2">
                <PieChartWrapper getNameandValuefromData={getNameandValueofInstitute} />
                <PieChartWrapper getNameandValuefromData={getActiveandInactiveStudent} />
                <PieChartWrapper getNameandValuefromData={getClassesCount} />
                <PieChartWrapper getNameandValuefromData={getUniversalLessonsCount} />
                <PieChartWrapper getNameandValuefromData={getUniversalSurveysCount} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(AnalyticsDashboard);
