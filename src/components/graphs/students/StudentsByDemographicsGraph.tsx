import {Pie, PieConfig} from '@ant-design/plots';
import Loader from '@components/Atoms/Loader';
import {SEARCH_LIMIT} from '@components/Lesson/constants';
import {useGlobalContext} from '@contexts/GlobalContext';
import {
  listPersonWithCheckpointsForGraph,
  listQuestionDatas
} from '@customGraphql/customQueries';
import useGraphConfig from '@customHooks/useGraphConfig';
import {useQuery} from '@tanstack/react-query';
import {withZoiqFilter} from '@utilities/functions';
import {calculateAge, checkIfId, getUniqItems} from '@utilities/strings';
import {Person, PersonStatus, QuestionData, QuestionResponse, Role} from 'API';
import {Segmented, TabsProps} from 'antd';
import {API, graphqlOperation} from 'aws-amplify';
import {useState} from 'react';
import ZipGraph from '../map/DemographicZipGraph';

export const getQuestionIndex = (
  questionId: string,
  responseObject: QuestionResponse[]
) => responseObject?.findIndex((d: any) => d.qid === questionId) || 0;

export const getGroupedData = (data: any) => {
  const groupDataWithCount: any[] = data.reduce((acc: any[], item: any) => {
    const index = acc.findIndex((d) => d.value === item.value);
    // @ts-ignore
    const count = item?.count || 1;
    if (index > -1) {
      acc[index].count += count;
    } else {
      acc.push({...item, count: 1});
    }
    return acc;
  }, []);
  return groupDataWithCount.map((d) => ({
    label: d.value.toString(),
    value: d.count
  }));
};

export interface ChildrenDemographicGraphProps {
  id: string;
  data: any;
}

const RaceGraph = ({data, id}: ChildrenDemographicGraphProps) => {
  const raceData = data.map(
    (item: {responseObject: {[x: string]: {response: string[]}}; authID: any}) => {
      // @ts-ignore
      const questionIndex = getQuestionIndex(id, item.responseObject);
      const value = item.responseObject?.[questionIndex]?.response?.[0] || '';
      const isId = checkIfId(value);
      return {
        value: isId ? 'Other' : value
      };
    }
  );

  const pieGraphConfig = useGraphConfig<PieConfig>({
    data: getGroupedData(raceData),
    legendTitle: 'Race',
    statisticsTitle: 'Total Students'
  });

  return <Pie {...pieGraphConfig} />;
};

const AgeGraph = ({data, id}: ChildrenDemographicGraphProps) => {
  const ageData = data
    .map(
      (item: {
        responseObject: QuestionResponse[] | {response: string[]}[];
        authID: any;
      }) => {
        // @ts-ignore
        const questionIndex = getQuestionIndex(id, item.responseObject);

        let dateStr = item.responseObject?.[questionIndex]?.response?.[0] || '';

        // sanitize date
        // if there are no hyphens.. add - between month and day
        // if there are more than 2 hypens.. filter it
        const hypens = dateStr.match(/-/g) || [];
        // if there is a-z in the string.. filter it
        const letters = dateStr.match(/[a-z]/gi) || [];
        if (hypens.length <= 2 && letters.length === 0) {
          const date = dateStr.replace(/(\d{2})(\d{2})(\d{4})/, '$1-$2-$3');

          // replace - and \ with / to make it a valid date
          dateStr = date.replace(/[-\\]/g, '/');

          const age = calculateAge(date || '');

          if (!Number.isNaN(age) && age > 0) {
            return {
              value: age
            };
          }
          return null;
        } else {
          return null;
        }
      }
    )
    .filter(Boolean);

  const pieGraphConfig = useGraphConfig<PieConfig>({
    data: getGroupedData(ageData),
    legendTitle: 'Age',
    statisticsTitle: 'Total Students'
  });

  return <Pie {...pieGraphConfig} />;
};

const GenderGraph = ({data, id}: ChildrenDemographicGraphProps) => {
  const genderData = data.map(
    (item: {responseObject: QuestionResponse[] | {response: any[]}[]; authID: any}) => {
      // @ts-ignore

      const questionIndex = getQuestionIndex(id, item.responseObject);
      const value = item.responseObject?.[questionIndex]?.response?.[0] || '';
      const isId = checkIfId(value);
      return {
        value: isId ? 'Other' : value
      };
    }
  );

  const pieGraphConfig = useGraphConfig<PieConfig>({
    data: getGroupedData(genderData),
    legendTitle: 'Gender',
    statisticsTitle: 'Total Students'
  });

  return <Pie {...pieGraphConfig} />;
};

const StudentsByDemographicsGraph = () => {
  const {zoiqFilter} = useGlobalContext();

  const fetchAllPerson = async () => {
    let resp: any = await API.graphql(
      graphqlOperation(listPersonWithCheckpointsForGraph, {
        limit: SEARCH_LIMIT,
        filter: withZoiqFilter(
          {
            role: {
              eq: Role.ST
            },
            status: {
              eq: PersonStatus.ACTIVE
            }
          },
          zoiqFilter
        )
      })
    );
    const users = resp?.data?.listPeople?.items;
    return users;
  };

  const [qids, setQids] = useState({
    race: '',
    gender: '',
    age: '',
    zip: ''
  });

  const [selectedOption, setSelectedOption] = useState('Race');

  const getQuestionData = async (checkpointIDs: any[]): Promise<QuestionData[]> => {
    const checkpointIDFilter: any = checkpointIDs.map((item: any) => {
      return {
        checkpointID: {
          eq: item
        }
      };
    });
    const filter = {
      and: [
        {syllabusLessonID: {eq: '999999'}},
        {
          or: [...checkpointIDFilter]
        }
      ]
    };
    const results: any = await API.graphql(
      graphqlOperation(listQuestionDatas, {
        limit: SEARCH_LIMIT,
        filter: filter
      })
    );
    const questionData: any = results.data.listQuestionData?.items;
    return questionData;
  };

  const getUserCheckpoints = (person: Person) => {
    let studentClasses: any = person.classes?.items.map((item: any) => item?.class);
    studentClasses = studentClasses.filter((d: any) => d !== null);

    const studentRooms: any = studentClasses?.reduce((roomAcc: any[], item: any) => {
      if (item?.room) {
        return [...roomAcc, item.room];
      } else {
        return roomAcc;
      }
    }, []);

    const studentCurriculars: any = studentRooms
      .map((item: any) => item?.curricula?.items)
      .flat(1);

    const uniqCurriculars: any =
      studentCurriculars.length > 0
        ? getUniqItems(
            studentCurriculars.filter((d: any) => d !== null),
            'curriculumID'
          )
        : [];

    const studCurriCheckp: any =
      uniqCurriculars.length > 0
        ? uniqCurriculars.map((item: any) => item?.curriculum?.checkpoints?.items).flat(1)
        : [];

    const studentCheckpoints: any =
      studCurriCheckp.length > 0
        ? studCurriCheckp.map((item: any) => item?.checkpoint)
        : [];

    const sCheckpoints: any[] = [];

    studentCheckpoints.forEach((item: any) => {
      if (item && item.scope !== 'private') sCheckpoints.push(item);
    });

    const uniqCheckpoints: any = getUniqItems(sCheckpoints, 'id');

    const sortedCheckpointQ = uniqCheckpoints.map((checkpointObj: any) => {
      return {
        ...checkpointObj,
        questions: {
          items: checkpointObj.questionSeq
            ? checkpointObj.questionSeq.map((idStr: string) => {
                return checkpointObj.questions.items.find(
                  (questionItem: any) => questionItem.question.id === idStr
                );
              })
            : checkpointObj.questions.items
        }
      };
    });

    const uniqCheckpointIDs: any = sortedCheckpointQ.map((item: any) => item?.id);

    // if (uniqCheckpointIDs?.length > 0) {
    //   getQuestionData(person.email, person.authId, uniqCheckpointIDs);
    // }

    return {checkpointIds: uniqCheckpointIDs, qids: sortedCheckpointQ};
  };

  const [questionData, setQuestionData] = useState<QuestionData[]>([]);

  const {isLoading, isFetched} = useQuery<Person[]>({
    queryKey: ['students-by-demographics'],
    queryFn: fetchAllPerson,

    onSuccess(data) {
      const checkpointIDs: any[] = [];
      const qIDs: any[] = [];
      for (const x of data) {
        const {checkpointIds, qids} = getUserCheckpoints(x);

        // make sure checkpointIds is not included in checkpointIDs
        if (checkpointIds?.length > 0 && !checkpointIDs.includes(checkpointIds[0])) {
          checkpointIDs.push(...checkpointIds);
        }

        if (
          qIDs?.length === 0 &&
          qids &&
          qids.length > 0 &&
          qids[0]?.questions?.items.length > 0
        ) {
          qIDs.push(...qids[0].questions.items);
        }
      }

      const mapped = qIDs.map((item) => {
        return {
          question: item?.question?.question,
          id: item?.question?.id
        };
      });

      setQids({
        age: mapped.find((d) => d.question === 'Birthdate (mm/dd/yyyy)')?.id,
        gender: mapped.find((d) => d.question === 'Gender')?.id,
        race: mapped.find((d) => d.question === 'Race')?.id,
        zip: mapped.find((d) => d.question === 'Home Zip Code')?.id
      });

      getQuestionData(checkpointIDs).then((questionDataList) => {
        if (questionDataList && questionDataList.length > 0) {
          setQuestionData(questionDataList);
        }
      });
    }
  });

  if ((isLoading && !isFetched) || questionData.length === 0) {
    return (
      <div className="min-h-56 flex items-center justify-center">
        <Loader withText="Getting demographics for students... this may take some time" />
      </div>
    );
  }

  if (questionData && questionData?.length > 0) {
    const filtered = questionData.map((item) => {
      return {
        responseObject: item.responseObject
      };
    });

    const items: TabsProps['items'] = [
      {
        key: 'race',
        label: 'Race',
        children: <RaceGraph id={qids.race} data={filtered} />
      },
      // {
      //   key: 'age',
      //   label: 'Age',
      //   children: <AgeGraph id={qids.age} data={filtered} />
      // },
      {
        key: 'gender',
        label: 'Gender',
        children: <GenderGraph id={qids.gender} data={filtered} />
      },
      {
        key: 'zip',
        label: 'Zip',
        children: <ZipGraph id={qids.zip} data={filtered} />
      }
    ];

    const options = items.map((d) => d.label);

    const selectedGraph = items.find((d) => d.label === selectedOption)?.children;

    return (
      <div className="">
        <Segmented
          onChange={(selectedOption) => {
            setSelectedOption(selectedOption.toString());
          }}
          // @ts-ignore
          options={options}
        />
        <div className="mt-2">{selectedGraph}</div>
      </div>
    );
  }
  return null;
};

export default StudentsByDemographicsGraph;
