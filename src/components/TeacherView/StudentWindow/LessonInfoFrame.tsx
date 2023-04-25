import {getAsset} from 'assets';
import Buttons from 'atoms/Buttons';
import Loader from 'atoms/Loader';
import Modal from 'atoms/Modal';
import {API, graphqlOperation} from 'aws-amplify';
import {useGlobalContext} from 'contexts/GlobalContext';
import useTailwindBreakpoint from 'customHooks/tailwindBreakpoint';
import {listPersonSentiments} from 'graphql/queries';
import React, {useEffect, useRef, useState} from 'react';
import {AiOutlineStop} from 'react-icons/ai';
import {keywordCapitilizer} from 'utilities/strings';

interface ILessonInfoFrame {
  children?: React.ReactNode;
  visible?: boolean;
  rightView?: {view: string; option?: string};
  setRightView?: any;
}

const DATE_REGEX = /\d{4}-\d{1,2}-\d{1,2}/g;
const SENTIMENT_TEMPLATE = {
  great: 0,
  okay: 0,
  bad: 0,
  awful: 0,
  total: 0
};

const EMOJIS = getAsset('general', 'emoji');

const LessonInfoFrame = ({visible, rightView, setRightView}: ILessonInfoFrame) => {
  // ~~~~~~~~~~ CONTEXT SEPARATION ~~~~~~~~~ //
  const gContext = useGlobalContext();
  const user = gContext.state.user;
  const roster = gContext.controlState.roster;

  let studentAuthIDArray = roster.map((st: any) => st.personAuthID);

  let lastLoggedIn = user?.lastLoggedIn;
  let dateString = lastLoggedIn ? lastLoggedIn.match(DATE_REGEX) : '';
  // let dateString: any = undefined;

  // ##################################################################### //
  // ######################### SENTIMENT FETCHING ######################## //
  // ##################################################################### //
  const [loading, setLoading] = useState<boolean>(false);
  const [sentimentStore, setSentimentStore] = useState<any>({});

  const getOverallSentimentResult = async (dateString: string) => {
    let result: any[] = [];

    await Promise.all(
      studentAuthIDArray.map(async (authID: string) => {
        let response: any = await API.graphql(
          graphqlOperation(listPersonSentiments, {
            limit: 100,
            personAuthID: authID,
            date: {
              eq: dateString
            }
          })
        );
        let data = response?.data?.listPersonSentiments?.items || [];
        result.push(data);
      })
    );

    return result;
  };

  //@ts-ignore
  const fetchStudentSentiments = async (
    studentAuthIDArray: any[],
    dateString: string
  ) => {
    let thereAreStudents = studentAuthIDArray && studentAuthIDArray.length > 0;
    let validDate = DATE_REGEX.test(dateString);

    if (thereAreStudents && validDate) {
      try {
        let result: any[] = (await getOverallSentimentResult(dateString)) || [[]];

        return result;
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
    sentimentArr: string[],
    notLoggedInCount: number
  ) => {
    let prepare = {
      ...sentimentObjTemplate,
      did_not_answered: 0,
      not_logged_in: 0,
      total: rosterArr.length
    };
    let response = sentimentArr.reduce((sentimentAcc: any, sentimentStr: string) => {
      let sentiment = sentimentStr.toLowerCase();

      if (sentiment === 'none') {
        return {
          ...sentimentAcc,
          did_not_answered: (sentimentAcc['did_not_answered'] += 1) || 0
        };
      } else {
        return {
          ...sentimentAcc,
          [sentiment]: (sentimentAcc[sentiment] += 1)
        };
      }
    }, prepare);

    response = {
      ...response,
      not_logged_in: notLoggedInCount
    };

    return response;
  };

  // ~~~~~~~~ ONCLICK AND USEEFFECT ~~~~~~~~ //
  const handleGetSentiments = async () => {
    if (studentAuthIDArray && dateString) {
      try {
        setLoading(true);
        let fetchResults = await fetchStudentSentiments(
          studentAuthIDArray,
          dateString[0]
        );

        let filteredResult = fetchResults.filter((r: any) => r.length > 0);

        let not_logged_in_count = fetchResults.length - filteredResult.length || 0;

        let flatten = fetchResults.flat();

        let sentimentArray =
          roster && roster.length >= 5
            ? flatten.map((sentimentObj: any) => sentimentObj.responseText)
            : [];
        let output = countSentiments(
          SENTIMENT_TEMPLATE,
          roster,
          sentimentArray,
          not_logged_in_count
        );
        setSentimentStore(output);
      } finally {
        setLoading(false);
      }
    }
  };

  // ~~~~~~~~~ FIRST VISIBILITY GET ~~~~~~~~ //
  useEffect(() => {
    if (visible && Object.keys(sentimentStore).length === 0) {
      handleGetSentiments();
    }
  }, [visible]);

  // ##################################################################### //
  // ############################## OTHER UI ############################# //
  // ##################################################################### //
  const customTitle = () => {
    return (
      <div className="w-full flex flex-row justify-between items-center">
        Class Sentiments
        <Buttons label="Refresh" onClick={() => handleGetSentiments()} />
      </div>
    );
  };

  // ##################################################################### //
  // ############################# ANIMATION ############################# //
  // ##################################################################### //
  const frameRef = useRef<any>(null);

  // ##################################################################### //
  // ############################# RESPONSIVE ############################ //
  // ##################################################################### //
  const {breakpoint} = useTailwindBreakpoint();

  const tableOrder = [
    'great',
    'okay',
    'bad',
    'awful',
    'did_not_answered',
    'not_logged_in',
    'total'
  ];

  const getPercentage = (sentimentKey: string) =>
    Math.ceil(
      Number(((sentimentStore[sentimentKey] / sentimentStore.total) * 100).toFixed(0))
    );

  return (
    <>
      <div
        ref={frameRef}
        style={{
          width: breakpoint === 'xl' || breakpoint === '2xl' ? '75%' : 'calc(100% - 36px)'
        }}
        className={`absolute mr-0 top-0 right-0 h-full flex flex-col items-center z-50`}>
        {rightView?.view === 'lessonInfo' && (
          <>
            <div className="absolute w-full h-full bg-darkest    bg-opacity-50 z-40"></div>
            <Modal
              open={rightView?.view === 'lessonInfo'}
              customTitle={customTitle()}
              showHeader
              showHeaderBorder={false}
              showFooter={false}
              scrollHidden
              closeAction={() => setRightView({view: 'lesson', option: ''})}
              position="absolute"
              width="w-full"
              maxWidth="max-w-128">
              <ul className="rounded border-0 border-light  border-opacity-20">
                {roster && roster.length < 5 && (
                  <li className="w-full p-2 flex flex-row text-center bg-white rounded mb-2 text-sm text-medium ">
                    You need at least 5 students in-class to check sentiments.
                  </li>
                )}

                {loading ? (
                  <li
                    key={`sentimentRow_loading`}
                    className="w-full h-8 flex flex-row items-center bg-white rounded mb-2 text-sm text-medium ">
                    <Loader />
                  </li>
                ) : roster && roster.length > 0 && sentimentStore ? (
                  tableOrder.map((sentimentKey: string, idx: number) => {
                    return (
                      <li
                        key={`sentimentRow_${idx}`}
                        className={`${
                          idx % 2 === 0 ? 'bg-light' : 'bg-lightest'
                        } w-full h-8 p-4 flex flex-row items-center text-sm text-medium `}>
                        <span className="w-2.5/10 h-auto flex justify-center">
                          {EMOJIS[sentimentKey] ? (
                            <img
                              src={EMOJIS[sentimentKey]}
                              className="w-auto h-8 object-contain"
                            />
                          ) : sentimentKey === 'did_not_answered' ? (
                            <AiOutlineStop size={'1.5rem'} />
                          ) : null}
                        </span>
                        <span className="w-2.5/10 text-left whitespace-pre overflow-hidden">
                          {sentimentKey === 'did_not_answered'
                            ? 'Did not answered'
                            : sentimentKey === 'not_logged_in'
                            ? 'Not logged in yet'
                            : keywordCapitilizer(sentimentKey)}
                          :
                        </span>
                        <span className="w-2.5/10 flex justify-center">
                          {sentimentStore[sentimentKey]}
                        </span>
                        <span className="w-2.5/10 flex justify-center">
                          {getPercentage(sentimentKey)}%
                        </span>
                      </li>
                    );
                  })
                ) : null}
              </ul>
            </Modal>
          </>
        )}
      </div>
    </>
  );
};

export default LessonInfoFrame;
