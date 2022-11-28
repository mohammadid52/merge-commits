import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {getAsset} from 'assets';
import Buttons from 'atoms/Buttons';
import Loader from 'atoms/Loader';
import Modal from 'atoms/Modal';
import {GlobalContext} from 'contexts/GlobalContext';
import useTailwindBreakpoint from 'customHooks/tailwindBreakpoint';
import * as queries from 'graphql/queries';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  createFilterToFetchSpecificItemsOnly,
  keywordCapitilizer
} from 'utilities/strings';

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
  total: 0
};

const EMOJIS = getAsset('general', 'emoji');

const LessonInfoFrame = ({visible, rightView, setRightView}: ILessonInfoFrame) => {
  // ~~~~~~~~~~ CONTEXT SEPARATION ~~~~~~~~~ //
  const gContext = useContext(GlobalContext);
  const user = gContext.state.user;
  const roster = gContext.controlState.roster;
  const clientKey = gContext.clientKey;

  let studentAuthIDArray = roster.map((st: any) => st.personAuthID);
  let lastLoggedIn = user?.lastLoggedIn;
  let dateString = lastLoggedIn ? lastLoggedIn.match(DATE_REGEX) : '';
  // let dateString: any = undefined;

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
          graphqlOperation(queries.listPersonSentiments, {
            limit: 500,
            filter: {
              date: {eq: dateString},
              ...listQuery
            }
          })
        );
        return result.data.listPersonSentiments.items;
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
      none: rosterArr.length - sentimentArr.length,
      total: rosterArr.length
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
      try {
        setLoading(true);
        let fetchResults = await fetchStudentSentiments(
          studentAuthIDArray,
          dateString[0]
        );
        let sentimentArray =
          roster && roster.length >= 5
            ? fetchResults.map((sentimentObj: any) => sentimentObj.responseText)
            : [];
        let output = countSentiments(SENTIMENT_TEMPLATE, roster, sentimentArray);
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
  // ######################### TOGGLE SENTIMENTS ######################### //
  // ##################################################################### //
  const handleSentimentToggle = () => {
    setRightView({view: 'lesson', option: ''});
  };

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
          width: breakpoint === 'xl' || breakpoint === '2xl' ? '75%' : 'calc(100% - 36px)'
        }}
        className={`absolute mr-0 top-0 right-0 h-full flex flex-col items-center z-50`}>
        {rightView.view === 'lessonInfo' && (
          <>
            <div className="absolute w-full h-full bg-gray-800 bg-opacity-50 z-40"></div>
            <Modal
              customTitle={customTitle()}
              showHeader
              showHeaderBorder={false}
              showFooter={false}
              scrollHidden
              closeAction={() => setRightView({view: 'lesson', option: ''})}
              position="absolute"
              width="w-full"
              maxWidth="max-w-128">
              <ul className="rounded border-0 border-gray-400 border-opacity-20">
                {roster && roster.length < 5 && (
                  <li className="w-full p-2 flex flex-row text-center bg-white rounded mb-2 text-sm text-gray-600">
                    You need at least 5 students in-class to check sentiments.
                  </li>
                )}

                {loading ? (
                  <li
                    key={`sentimentRow_loading`}
                    className="w-full h-8 flex flex-row items-center bg-white rounded mb-2 text-sm text-gray-600">
                    <Loader />
                  </li>
                ) : roster && roster.length > 0 && sentimentStore ? (
                  Object.keys(sentimentStore).map((sentimentKey: string, idx: number) => {
                    return (
                      <li
                        key={`sentimentRow_${idx}`}
                        className={`${
                          idx % 2 === 0 ? 'bg-gray-200' : 'bg-gray-50'
                        } w-full h-8 p-4 flex flex-row items-center text-sm text-gray-600`}>
                        <span className="w-2.5/10 h-auto flex justify-center">
                          {EMOJIS[sentimentKey] ? (
                            <img
                              src={EMOJIS[sentimentKey]}
                              className="w-auto h-8 object-contain"
                            />
                          ) : null}
                        </span>
                        <span className="w-2.5/10 text-left whitespace-pre overflow-hidden">
                          {sentimentKey === '_'
                            ? "Didn't Answer"
                            : keywordCapitilizer(sentimentKey)}
                          :
                        </span>
                        <span className="w-2.5/10 flex justify-center">
                          {sentimentStore[sentimentKey]}
                        </span>
                        <span className="w-2.5/10 flex justify-center">
                          {(sentimentStore[sentimentKey] / sentimentStore.total) * 100}%
                        </span>
                      </li>
                    );
                  })
                ) : null}
              </ul>
              {/* </div> */}
            </Modal>
          </>
        )}
      </div>
    </>
  );
};

export default LessonInfoFrame;
