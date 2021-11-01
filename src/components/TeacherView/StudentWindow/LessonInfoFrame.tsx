import React, {useContext, useEffect, useState, useRef} from 'react';
import {getAsset} from 'assets';
import {GlobalContext} from '@contexts/GlobalContext';
import useTailwindBreakpoint from '@customHooks/tailwindBreakpoint';
import * as queries from '@graphql/queries';
import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {createFilterToFetchSpecificItemsOnly} from '@utilities/strings';
import {keywordCapitilizer} from '@utilities/strings';
import ButtonsRound from '@components/Atoms/ButtonsRound';
import {AiOutlineCloseCircle} from 'react-icons/ai';

interface ILessonInfoFrame {
  children?: React.ReactNode;
  visible?: boolean;
  rightView?: {view: string; option?: string};
  setRightView?: any;
}

const DATE_REGEX = /\d{4}-\d{1,2}-\d{1,2}/g;
const SENTIMENT_TEMPLATE = {
  great: 0,
  good: 0,
  okay: 0,
  bad: 0,
  awful: 0,
  _: 0,
  total: 0,
};

const EMOJIS = getAsset('general', 'emoji');

const LessonInfoFrame = ({visible, rightView, setRightView}: ILessonInfoFrame) => {
  // ~~~~~~~~~~ CONTEXT SEPARATION ~~~~~~~~~ //
  const gContext = useContext(GlobalContext);
  const user = gContext.state.user;
  const roster = gContext.controlState.roster;
  const clientKey = gContext.clientKey;
  const theme = gContext.theme;
  const themeColor = getAsset(clientKey, 'themeClassName');

  let studentAuthIDArray = roster.map((st: any) => st.personAuthID);
  let lastLoggedIn = user.lastLoggedIn;
  let dateString = lastLoggedIn.match(DATE_REGEX);

  // ##################################################################### //
  // ######################### SENTIMENT FETCHING ######################## //
  // ##################################################################### //
  const [loading, setLoading] = useState<boolean>(false);
  const [sentimentStore, setSentimentStore] = useState<any>({});

  //@ts-ignore
  const fetchStudentSentiments = async (
    studentAuthIDArray: any[],
    dateString: string
  ) => {
    let thereAreStudents = studentAuthIDArray && studentAuthIDArray.length > 0;
    let validDate = DATE_REGEX.test(dateString);

    let listQuery = createFilterToFetchSpecificItemsOnly(
      studentAuthIDArray,
      'personAuthID'
    );

    if (thereAreStudents && validDate) {
      try {
        let result: any = await API.graphql(
          graphqlOperation(queries.listPersonSentimentss, {
            filter: {
              date: {eq: dateString},
              ...listQuery,
            },
          })
        );
        return result.data.listPersonSentimentss.items;
      } catch (e) {
        console.error('fetchStudentSentiments - ', e);
        return [];
      } finally {
        setLoading(false);
      }
    } else {
      return [];
    }
  };

  const countSentiments = (
    sentimentObjTemplate: any,
    rosterArr: any[],
    sentimentArr: string[]
  ) => {
    let prepare = {
      ...sentimentObjTemplate,
      _: sentimentArr.length - rosterArr.length,
      total: rosterArr.length,
    };
    return sentimentArr.reduce((sentimentAcc: any, sentimentStr: string) => {
      if (Object.keys(sentimentObjTemplate).includes(sentimentStr)) {
        return {...sentimentAcc, [sentimentStr]: sentimentAcc[sentimentStr] + 1};
      } else {
        return sentimentAcc;
      }
    }, prepare);
  };

  // ~~~~~~~~ ONCLICK AND USEEFFECT ~~~~~~~~ //
  const handleGetSentiments = async () => {
    if (studentAuthIDArray && dateString) {
      setLoading(true);
      let fetchResults = await fetchStudentSentiments(studentAuthIDArray, dateString[0]);
      let sentimentArray = fetchResults.map(
        (sentimentObj: any) => sentimentObj.responseText
      );
      let output = countSentiments(SENTIMENT_TEMPLATE, roster, sentimentArray);
      setSentimentStore(output);
    }
  };

  // ~~~~~~~~~ FIRST VISIBILITY GET ~~~~~~~~ //
  useEffect(() => {
    if (visible && Object.keys(sentimentStore).length === 0 && roster.length >= 5) {
      handleGetSentiments();
    }
  }, [visible]);

  // ##################################################################### //
  // ######################### TOGGLE SENTIMENTS ######################### //
  // ##################################################################### //
  const handleSentimentToggle = () => {
    setRightView({view: 'lesson', option: ''});
  };

  // ##################################################################### //
  // ############################# ANIMATION ############################# //
  // ##################################################################### //
  const frameRef = useRef();

  // ##################################################################### //
  // ############################# RESPONSIVE ############################ //
  // ##################################################################### //
  const {breakpoint} = useTailwindBreakpoint();

  return (
    <>
      <div
        ref={frameRef}
        style={{
          width:
            breakpoint === 'xl' || breakpoint === '2xl' ? '75%' : 'calc(100% - 36px)',
        }}
        className={`absolute mr-0 top-0 right-0 h-full flex flex-col items-center z-50`}>
        <div className="absolute w-full h-full bg-gray-800 bg-opacity-50 z-40"></div>
        <div className="w-1/3 relative m-auto min-w-100 max-w-128 bg-gray-200 p-4 rounded z-50">
          <ButtonsRound
            Icon={AiOutlineCloseCircle}
            onClick={() => handleSentimentToggle()}
            iconSizePX={24}
            buttonWHClass={`w-8 h-8`}
            containerBgClass={`absolute right-0 top-0 bg-transparent`}
            buttonBgClass={`bg-transparent`}
            iconTxtColorClass={theme.textColor[themeColor]}
          />
          <div className="align-middle text-center text-sm font-semibold text-gray-600 leading-8">
            <p>Class Sentiments</p>
            <p
              onClick={() => handleGetSentiments()}
              className={`cursor-pointer underline ${theme.textColor[themeColor]}`}>
              (Refresh)
            </p>
          </div>
          <ul>
            {roster && roster.length >= 5 ? (
              sentimentStore && !loading ? (
                Object.keys(sentimentStore).map((sentimentKey: string, idx: number) => {
                  return (
                    <li
                      key={`sentimentRow_${idx}`}
                      className="w-full h-8 flex flex-row items-center bg-white rounded mb-2 text-sm text-gray-600">
                      <span className="w-2/10 text-right h-auto flex">
                        {EMOJIS[sentimentKey] ? (
                          <img
                            src={EMOJIS[sentimentKey]}
                            className="w-auto h-8 object-contain"
                          />
                        ) : null}
                      </span>
                      <span className="w-3/10 text-left whitespace-pre overflow-hidden">
                        {sentimentKey === '_'
                          ? "Didn't Answer"
                          : keywordCapitilizer(sentimentKey)}
                        :
                      </span>
                      <span className="w-2/10 text-right">
                        {sentimentStore[sentimentKey]}
                      </span>
                      <span className="w-2/10 text-center">
                        {(sentimentStore[sentimentKey] / sentimentStore.total) * 100}%
                      </span>
                    </li>
                  );
                })
              ) : (
                loading && (
                  <li
                    key={`sentimentRow_loading`}
                    className="w-full h-8 flex flex-row items-center bg-white rounded mb-2 text-sm text-gray-600">
                    Loading
                  </li>
                )
              )
            ) : (
              <li
                key={`sentimentRow_loading`}
                className="w-full p-2 flex flex-row items-center bg-white rounded mb-2 text-sm text-gray-600">
                You need at least 5 students in-class to check sentiments 😀
              </li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default LessonInfoFrame;
