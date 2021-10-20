import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import React, {Fragment, useContext, useEffect, useState} from 'react';
import {IoIosKeypad} from 'react-icons/io';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {RiArrowRightLine} from 'react-icons/ri';
import {GlobalContext} from '../../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../../customHooks/dictionary';
import * as queries from '../../../../../../graphql/queries';
import {getLanguageString, getTypeString} from '../../../../../../utilities/strings';
import Buttons from '../../../../../Atoms/Buttons';
import CheckBox from '../../../../../Atoms/Form/CheckBox';
import SearchInput from '../../../../../Atoms/Form/SearchInput';

interface QuestionLookupProps {
  changeStep: (step: string) => void;
  onSave: (list: any[]) => void;
  selecteList: any[];
  goBackToPreviousStep: () => void;
  lessonName: string;
  lessonType: string;
  setUnsavedChanges: Function;
}

const QuestionLookup = (props: QuestionLookupProps) => {
  const {
    changeStep,
    onSave,
    selecteList,
    setUnsavedChanges,
    goBackToPreviousStep,
    lessonName,
    lessonType,
  } = props;
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
  const [questionsList, setQuestionsList] = useState([]);
  const [allQuestionsList, setAllQuestionsList] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {QuestionLookupDict} = useDictionary(clientKey);

  const selectItem = (questId: string) => {
    const selectedItem = selectedQuestionIds.find((id) => id === questId);
    let updatedList;
    if (!selectedItem) {
      updatedList = [...selectedQuestionIds, questId];
    } else {
      updatedList = selectedQuestionIds.filter((id) => id !== questId);
    }
    setSelectedQuestionIds(updatedList);
    setUnsavedChanges(true);
  };

  const searchFromList = () => {
    const currentQuesList = [...allQuestionsList];
    const newList = currentQuesList.filter((item) => {
      // Search on question for match.
      return item.question?.toLowerCase().includes(searchInput);
    });
    setQuestionsList(newList);
  };

  const removeSearchAction = () => {
    setQuestionsList(allQuestionsList);
    setSearchInput('');
  };
  const onQuestionSave = () => {
    const selectedQuestionsList = [...allQuestionsList].filter((item) =>
      selectedQuestionIds.includes(item.id)
    );
    onSave(selectedQuestionsList);
  };

  const fetchQuestionsList = async () => {
    try {
      setLoading(true);
      const fetchQuestionsData: any = await API.graphql(
        graphqlOperation(queries.listQuestions)
      );
      if (!fetchQuestionsData) {
        setError(true);
        throw new Error('fail!');
      } else {
        const QuestionsList = fetchQuestionsData.data?.listQuestions?.items;
        setQuestionsList(QuestionsList);
        setAllQuestionsList(QuestionsList);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(true);
      console.error(error);
    }
  };

  useEffect(() => {
    fetchQuestionsList();
  }, []);

  useEffect(() => {
    if (selecteList?.length > 0) {
      let IDs = selecteList.map((item) => item.id);
      setSelectedQuestionIds(IDs);
    }
  }, [selecteList]);

  return (
    <Fragment>
      <div className="px-4 py-5 border-b-0 border-gray-200 sm:px-6 flex items-center">
        <span className="w-6 h-6 flex items-center mr-4" onClick={() => console.log('')}>
          <IconContext.Provider value={{size: '1.5rem', color: 'darkgrey'}}>
            <IoIosKeypad />
          </IconContext.Provider>
        </span>

        {/* Breadcrums */}
        <h4 className="text-base leading-6 font-medium text-gray-900 flex items-center">
          <span
            className="w-auto flex-shrink-0 cursor-pointer"
            onClick={() => changeStep('SelectedCheckPointsList')}>
            {lessonType === 'survey' ? 'Survey' : 'Assessment'}{' '}
            {QuestionLookupDict[userLanguage]['BUILDER']} - {lessonName}
          </span>
          <span className="w-6 h-6 flex items-center mx-4">
            <IconContext.Provider value={{size: '1.5rem', color: 'darkgrey'}}>
              <RiArrowRightLine />
            </IconContext.Provider>
          </span>
          <span className="font-normal text-gray-600 w-auto flex-shrink-0">
            {QuestionLookupDict[userLanguage]['CHECKPOINT']}
          </span>
          <span className="w-6 h-6 flex items-center mx-4">
            <IconContext.Provider value={{size: '1.5rem', color: 'darkgrey'}}>
              <RiArrowRightLine />
            </IconContext.Provider>
          </span>
          <span className="font-normal text-gray-600 w-auto flex-shrink-0">
            {QuestionLookupDict[userLanguage]['PREVQUE']}
          </span>
        </h4>
      </div>

      <div className="p-4">
        <div className="flex justify-between my-4">
          <p className="text-sm font-medium text-gray-600 flex items-center w-2/4 px-14">
            {' '}
            {selectedQuestionIds?.length}
            {QuestionLookupDict[userLanguage]['QUESELECT']}
          </p>
          <SearchInput
            value={searchInput}
            onChange={(val: string) => setSearchInput(val)}
            onKeyDown={searchFromList}
            closeAction={removeSearchAction}
            style="w-2/4"
          />
        </div>
        <div>
          <Fragment>
            <div className="flex justify-between w-full px-8 py-4 whitespace-nowrap border-b-0 border-gray-200">
              <div className="w-1.5/10 px-6 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                <span>{QuestionLookupDict[userLanguage]['SELECTION']}</span>
              </div>
              <div className="w-5/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                <span>{QuestionLookupDict[userLanguage]['QUESTION']}</span>
              </div>
              <div className="w-2/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                <span>{QuestionLookupDict[userLanguage]['TYPE']}</span>
              </div>
              <div className="w-1.5/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                <span>{QuestionLookupDict[userLanguage]['LANGUAGE']}</span>
              </div>
            </div>

            <div className="w-full m-auto max-h-120 overflow-y-auto">
              {!loading ? (
                <Fragment>
                  {!error ? (
                    <Fragment>
                      {questionsList?.length ? (
                        questionsList.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between w-full  px-8 py-4 whitespace-nowrap border-b-0 border-gray-200">
                            <div className="flex w-1.5/10 items-center px-6 py-3 text-left text-s leading-4">
                              <span>
                                <CheckBox
                                  value={selectedQuestionIds?.includes(item.id)}
                                  onChange={() => selectItem(item.id)}
                                  name="selectquestion"
                                />
                              </span>
                            </div>
                            <div className="flex w-5/10 px-8 py-3 items-center text-left text-s leading-4 font-medium whitespace-normal">
                              {' '}
                              {item.question}{' '}
                            </div>
                            <div className="flex w-2/10 px-8 py-3 text-left text-s leading-4 items-center whitespace-normal">
                              {item.type ? getTypeString(item.type) : '--'}
                            </div>
                            <div className="flex w-1.5/10 px-8 py-3 text-left text-s leading-4 items-center whitespace-normal">
                              {item.language ? getLanguageString(item.language) : '--'}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-12 my-6 text-center">
                          <p> {QuestionLookupDict[userLanguage]['QUEEMPTY']}</p>
                        </div>
                      )}
                    </Fragment>
                  ) : (
                    <div className="py-12 my-6 text-center">
                      <p> {QuestionLookupDict[userLanguage]['FETCHERR']}</p>
                    </div>
                  )}
                </Fragment>
              ) : (
                <div className="py-12 my-6 text-center">
                  <p> {QuestionLookupDict[userLanguage]['FETCHING']}</p>
                </div>
              )}
            </div>
          </Fragment>
        </div>
        <div className="flex mt-8 justify-center px-6 pb-4">
          <div className="flex justify-center my-6">
            <Buttons
              btnClass="py-1 px-4 text-xs mr-2"
              label={QuestionLookupDict[userLanguage]['BUTTON']['CANCEL']}
              onClick={goBackToPreviousStep}
              transparent
            />
            <Buttons
              btnClass="py-1 px-8 text-xs ml-2"
              label={QuestionLookupDict[userLanguage]['BUTTON']['SAVE']}
              onClick={onQuestionSave}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default QuestionLookup;
