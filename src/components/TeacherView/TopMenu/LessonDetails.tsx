import React, {useContext, useEffect, useState} from 'react';
import {GlobalContext} from '@contexts/GlobalContext';
import useDictionary from '@customHooks/dictionary';
import {getLocalStorageData} from '@utilities/localStorage';
import ButtonsRound from '@components/Atoms/ButtonsRound';
import {AiOutlineInfoCircle} from 'react-icons/ai';
import * as queries from '@graphql/queries';
import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {createFilterToFetchSpecificItemsOnly} from '@utilities/strings';

interface ILessonDetailProps {
  hidden?: boolean;
  theme?: any;
  themeColor?: any;
  rightView?: string;
  setRightView?: any;
}

const DATE_REGEX = /\d{4}-\d{1,2}-\d{1,2}/g;
const SENTIMENT_TEMPLATE = {
  great: 0,
  good: 0,
  ok: 0,
  bad: 0,
  awful: 0,
};

// ##################################################################### //
// ############################# COMPONENT ############################# //
// ##################################################################### //
const LessonDetails = ({
  hidden,
  theme,
  themeColor,
  rightView,
  setRightView,
}: ILessonDetailProps) => {
  const gContext = useContext(GlobalContext);
  const user = gContext.state.user;
  const lessonState = gContext.lessonState;
  const controlState = gContext.controlState;
  const roster = gContext.controlState.roster;
  const clientKey = gContext.clientKey;
  const userLanguage = gContext.userLanguage;
  const {classRoomDict} = useDictionary(clientKey);

  const {lessonPlannerDict} = useDictionary(clientKey);

  const getRoomData = getLocalStorageData('room_info');

  const studentsOnline = () => {
    if (controlState.roster) {
      return controlState.roster.length;
    } else {
      return 0;
    }
  };

  // ##################################################################### //
  // ######################### SENTIMENT FETCHING ######################## //
  // ##################################################################### //
  // const [sentimentStore, setSentimentStore] = useState<any>({});

  // //@ts-ignore
  // const getStudentSentiments = async (studentAuthIDArray: any[], dateString: string) => {
  //   let thereAreStudents = studentAuthIDArray && studentAuthIDArray.length > 0;
  //   let validDate = DATE_REGEX.test(dateString);

  //   let listQuery = createFilterToFetchSpecificItemsOnly(
  //     studentAuthIDArray,
  //     'personAuthID'
  //   );

  //   if (thereAreStudents && validDate) {
  //     try {
  //       let result: any = await API.graphql(
  //         graphqlOperation(queries.listPersonSentimentss, {
  //           filter: {
  //             date: {eq: dateString},
  //             ...listQuery,
  //           },
  //         })
  //       );
  //       return result.data.listPersonSentimentss.items;
  //     } catch (e) {
  //       console.error('getStudentSentiments - ', e);
  //       return [];
  //     }
  //   } else {
  //     return [];
  //   }
  // };

  // const countSentiments = (sentimentObjTemplate: any, sentimentArr: string[]) => {
  //   return sentimentArr.reduce((sentimentAcc: any, sentimentStr: string) => {
  //     if (Object.keys(sentimentObjTemplate).includes(sentimentStr)) {
  //       return {...sentimentAcc, [sentimentStr]: sentimentAcc[sentimentStr] + 1};
  //     } else {
  //       return sentimentAcc;
  //     }
  //   }, sentimentObjTemplate);
  // };

  // const handleSentimentDisplay = async () => {
  //   let studentAuthIDArray = roster.map((st: any) => st.personAuthID);
  //   let lastLoggedIn = user.lastLoggedIn;

  //   let dateString = lastLoggedIn.match(DATE_REGEX);
  //   if (studentAuthIDArray && dateString) {
  //     let fetchResults = await getStudentSentiments(studentAuthIDArray, dateString[0]);
  //     let sentimentArray = fetchResults.map(
  //       (sentimentObj: any) => sentimentObj.responseText
  //     );
  //     let output = countSentiments(SENTIMENT_TEMPLATE, sentimentArray);
  //     setSentimentStore(output);
  //   }
  // };

  // ##################################################################### //
  // ######################### TOGGLE SENTIMENTS ######################### //
  // ##################################################################### //

  // const handleSentimentToggle = () => {
  //   if (rightView !== 'lessonInfo') {
  //     setRightView('lessonInfo');
  //   } else {
  //     setRightView('lesson');
  //   }
  // };

  // ##################################################################### //
  // ############################### OUTPUT ############################## //
  // ##################################################################### //
  return (
    <div
      className={`${
        hidden ? 'hidden' : 'block'
      } min-h-30 flex flex-col justify-between px-4 pt-2 rounded`}>
      <div title="title" className="align-middle text-gray-600 text-sm leading-8 ">
        <span className="font-bold">{classRoomDict[userLanguage]['LESSON']}: </span>
        <span>{lessonState.lessonData.title}</span>
      </div>

      <div className="relative w-full flex flex-col my-auto bg-gray-200 p-2 text-gray-600 text-sm shadow-sm">
        {/* <ButtonsRound
          Icon={AiOutlineInfoCircle}
          onClick={() => handleSentimentToggle()}
          iconSizePX={24}
          buttonWHClass={``}
          containerBgClass={`bg-transparent p-2`}
          containerWHClass={`absolute h-auto w-auto top-0 right-0`}
          buttonBgClass={`bg-transparent`}
          iconTxtColorClass={theme.textColor[themeColor]}
        /> */}
        <p className="">
          {lessonPlannerDict[userLanguage]['OTHER_LABELS']['STUDDENT_ONLINE']}:{' '}
          {studentsOnline()}
        </p>
        <p className="">
          {lessonPlannerDict[userLanguage]['OTHER_LABELS']['ROOM_NAME']}:{' '}
          {`${getRoomData.name ? getRoomData.name : ''}`}
        </p>
        <p className="">
          {lessonPlannerDict[userLanguage]['OTHER_LABELS']['EST_TIME']}:{' '}
          {lessonState.lessonData?.duration}{' '}
          {`${lessonState.lessonData?.duration > 1 ? 'weeks' : 'week'}`}
        </p>
      </div>
    </div>
  );
};

export default LessonDetails;
