import {API, graphqlOperation} from 'aws-amplify';
import {Fragment, useEffect, useState} from 'react';

import Buttons from 'atoms/Buttons';
import CheckBox from 'atoms/Form/CheckBox';
import SearchInput from 'atoms/Form/SearchInput';

import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import * as queries from 'graphql/queries';
import {getLanguageString, getTypeString} from 'utilities/strings';

interface SelectPreviousQuestionProps {
  goBackToPreviousStep: () => void;
  setCheckpQuestions: (obj: any) => void;
  selectedList: any[];
}

const SelectPreviousQuestion = (props: SelectPreviousQuestionProps) => {
  const {goBackToPreviousStep, setCheckpQuestions, selectedList} = props;
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<any[]>([]);
  const [questionsList, setQuestionsList] = useState<any[]>([]);
  const [allQuestionsList, setAllQuestionsList] = useState<any[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const {userLanguage} = useGlobalContext();
  const {SelectPreviousQuestionDict} = useDictionary();

  const selectItem = (questId: string) => {
    const selectedItem = selectedQuestionIds.find((id) => id === questId);
    let updatedList;
    if (!selectedItem) {
      updatedList = [...selectedQuestionIds, questId];
    } else {
      updatedList = selectedQuestionIds.filter((id) => id !== questId);
    }
    setSelectedQuestionIds(updatedList);
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
    setCheckpQuestions(selectedQuestionsList);
    goBackToPreviousStep();
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
    if (selectedList?.length > 0) {
      let IDs = selectedList.map((item) => item.id);
      setSelectedQuestionIds(IDs);
    }
  }, [selectedList]);

  return (
    <Fragment>
      <div className="w-full m-auto">
        <h3 className="text-lg leading-6 font-medium text-darkest   text-center pb-8 ">
          {SelectPreviousQuestionDict[userLanguage]['heading']}
        </h3>
      </div>
      <div className="w-full m-auto">
        <div className="">
          <div className="flex justify-between my-4">
            <p className="text-sm font-medium text-medium  flex items-center w-2/4 px-14">
              {' '}
              {selectedQuestionIds?.length}{' '}
              {SelectPreviousQuestionDict[userLanguage]['qselectd']}
            </p>
            <SearchInput
              value={searchInput}
              onChange={(val: string) => setSearchInput(val)}
              onKeyDown={searchFromList}
              closeAction={removeSearchAction}
            />
          </div>
          <div>
            <Fragment>
              <div className="flex justify-between w-full px-8 py-4 whitespace-nowrap border-b-0 border-light">
                <div className="w-1.5/10 px-6 py-3 bg-lightest text-center text-xs leading-4 font-medium text-medium  uppercase tracking-wider">
                  <span>{SelectPreviousQuestionDict[userLanguage]['selection']}</span>
                </div>
                <div className="w-5/10 px-8 py-3 bg-lightest text-left text-xs leading-4 font-medium text-medium  uppercase tracking-wider">
                  <span>{SelectPreviousQuestionDict[userLanguage]['question']}</span>
                </div>
                <div className="w-2/10 px-8 py-3 bg-lightest text-left text-xs leading-4 font-medium text-medium  uppercase tracking-wider">
                  <span>{SelectPreviousQuestionDict[userLanguage]['type']}</span>
                </div>
                <div className="w-1.5/10 px-8 py-3 bg-lightest text-left text-xs leading-4 font-medium text-medium  uppercase tracking-wider">
                  <span>{SelectPreviousQuestionDict[userLanguage]['language']}</span>
                </div>
              </div>

              <div className="w-full m-auto max-h-136 overflow-y-auto">
                {!loading ? (
                  <Fragment>
                    {!error ? (
                      <Fragment>
                        {questionsList?.length ? (
                          questionsList.map((item) => (
                            <div
                              key={item.id}
                              className="flex justify-between w-full  px-8 py-4 whitespace-nowrap border-b-0 border-light">
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
                            <p> {SelectPreviousQuestionDict[userLanguage]['qempty']}</p>
                          </div>
                        )}
                      </Fragment>
                    ) : (
                      <div className="py-12 my-6 text-center">
                        <p> {SelectPreviousQuestionDict[userLanguage]['error']}</p>
                      </div>
                    )}
                  </Fragment>
                ) : (
                  <div className="py-12 my-6 text-center">
                    <p> {SelectPreviousQuestionDict[userLanguage]['wait']}</p>
                  </div>
                )}
              </div>
            </Fragment>
          </div>
          <div className="flex mt-8 justify-center px-6 pb-4">
            <div className="flex justify-center my-6">
              <Buttons
                label={SelectPreviousQuestionDict[userLanguage]['button']['cancel']}
                onClick={goBackToPreviousStep}
                transparent
              />
              <Buttons
                label={SelectPreviousQuestionDict[userLanguage]['button']['save']}
                onClick={onQuestionSave}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default SelectPreviousQuestion;
