import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {Fragment, useEffect, useState} from 'react';
import {IoClose} from 'react-icons/io5';
import {useHistory, useParams} from 'react-router';

import {
  createCheckpointQuestions,
  deleteCheckpointQuestions,
  updateCheckpoint
} from 'customGraphql/customMutations';
import {getCheckpointDetails, listPersons} from 'customGraphql/customQueries';
import {getTypeString} from 'utilities/strings';

import {languageList, scopeList} from '@utilities/staticData';
import Buttons from 'atoms/Buttons';
import FormInput from 'atoms/Form/FormInput';
import MultipleSelector from 'atoms/Form/MultipleSelector';
import Selector from 'atoms/Form/Selector';
import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import PageLayout from 'layout/PageLayout';
import AddQuestion from './QuestionComponents/AddQuestion';
import SelectPreviousQuestion from './QuestionComponents/SelectPreviousQuestion';

const EditProfileCheckpoint = () => {
  const history = useHistory();
  const urlParams: any = useParams();
  const {userLanguage} = useGlobalContext();

  const {EditProfileCheckpointDict} = useDictionary();

  const checkpointId = urlParams.id;
  const initialData = {
    id: '',
    title: '',
    label: '',
    language: {id: '1', name: 'English', value: 'EN'},
    scope: ''
  };
  const [checkpointData, setCheckpointData] = useState(initialData);

  const [designersList, setDesignersList] = useState<any[]>([]);
  const [selectedDesigners, setSelectedDesigner] = useState<any[]>([]);
  const [checkpQuestions, setCheckpQuestions] = useState<any[]>([]);
  const [qSequence, setQSequence] = useState<any[]>([]);
  const [previouslySelectedId, setPreviouslySelectedId] = useState<any[]>([]);
  const [checkpQuestionId, setCheckpQuestionId] = useState<any[]>([]);
  const [questionOptions, setQuestionOptions] = useState<{
    quesId: string;
    options: any[];
  }>({
    quesId: '',
    options: []
  });
  const [currentState, setCurrentState] = useState('checkpoint');
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState({
    title: '',
    label: '',
    message: '',
    isError: true
  });

  const onInputChange = (e: any) => {
    setCheckpointData({
      ...checkpointData,
      [e.target.name]: e.target.value
    });
    if (validation.title || validation.label) {
      setValidation({
        ...validation,
        title: '',
        label: ''
      });
    }
  };

  const selectLanguage = (value: string, option: any) => {
    setCheckpointData({
      ...checkpointData,
      language: {
        id: option.id,
        name: option.label,
        value
      }
    });
  };
  const selectDesigner = (_: string[], option: any[]) => {
    setSelectedDesigner(option);
  };

  const showOptions = (quesId: string, options: any[]) => {
    if (questionOptions.quesId !== quesId) {
      setQuestionOptions({quesId, options});
    } else {
      setQuestionOptions({quesId: '', options: []});
    }
  };

  const backToInitials = () => {
    setCurrentState('checkpoint');
  };
  const addQuesToCheckpoint = (obj: any) => {
    setCheckpQuestions([...checkpQuestions, obj]);
  };

  // ##################################################################### //
  // ###################### CHECKPOINT FUNCTIONALITY ##################### //
  // ##################################################################### //

  // ~~~~~ REGEN CHECKP QUESTION ORDER ~~~~~ //
  const generateSequence = (checkpointQArray: any[]) => {
    return checkpointQArray.map((checkpointQObj: any) => checkpointQObj.id);
  };
  useEffect(() => {
    const newSequence = generateSequence(checkpQuestions);
    setQSequence(newSequence);
  }, [checkpQuestions]);

  // Add new checkpoint to the curricular
  const addCheckpointQuestions = async (
    quesId: string,
    checkpointID: string,
    required: boolean
  ) => {
    try {
      const input = {
        checkpointID: checkpointID,
        questionID: quesId,
        required: required ? required : false
      };
      await API.graphql(
        graphqlOperation(createCheckpointQuestions, {
          input: input
        })
      );
    } catch {
      setValidation({
        title: '',
        label: '',
        message: EditProfileCheckpointDict[userLanguage]['messages']['saveerr'],
        isError: true
      });
    }
  };

  // Removed question from checkpoint
  const removeCheckpointQuestion = async (quesId: string, cb?: Function) => {
    const deletedQuestions: any = [...checkpQuestionId];
    const deletedQuesID = deletedQuestions.find(
      (item: any) => item.questionID === quesId
    )?.id;
    try {
      const input = {
        id: deletedQuesID
      };
      await API.graphql(
        graphqlOperation(deleteCheckpointQuestions, {
          input: input
        })
      );
      if (cb) cb();
    } catch {
      setValidation({
        title: '',
        label: '',
        message: EditProfileCheckpointDict[userLanguage]['messages']['saveerr'],
        isError: true
      });
    }
  };

  const validateForm = () => {
    let isValid = true;
    const msgs = validation;
    if (!checkpointData.title?.trim().length) {
      isValid = false;
      msgs.title = EditProfileCheckpointDict[userLanguage]['messages']['title'];
    } else {
      msgs.title = '';
    }
    if (!checkpointData.label?.trim().length) {
      isValid = false;
      msgs.label = EditProfileCheckpointDict[userLanguage]['messages']['label'];
    } else {
      msgs.label = '';
    }
    if (checkpQuestions?.length <= 0) {
      isValid = false;
      msgs.message = EditProfileCheckpointDict[userLanguage]['messages'].onequetion;
    } else {
      msgs.message = '';
    }
    setValidation({...msgs});
    return isValid;
  };

  const saveNewCheckpoint = async () => {
    const isValid = validateForm();
    if (isValid) {
      try {
        setLoading(true);
        const input = {
          id: checkpointData.id,
          label: checkpointData.label,
          title: checkpointData.title,
          designers: selectedDesigners.map((item: any) => item.id),
          language: checkpointData.language.value,
          scope: checkpointData.scope,
          questionSeq: qSequence
        };
        const results: any = await API.graphql(
          graphqlOperation(updateCheckpoint, {input: input})
        );
        const newCheckpoint = results?.data?.updateCheckpoint;
        const newQuestions: any = checkpQuestions.filter(
          (que) => !previouslySelectedId.includes(que.id)
        );
        const deletedQuestions: any = previouslySelectedId.filter((queId) => {
          let newArrayOfId = checkpQuestions.map((que: any) => que.id);
          return !newArrayOfId.includes(queId);
        });

        console.log('modified checkpoint - ', newQuestions);

        if (newCheckpoint) {
          if (newQuestions.length > 0) {
            await Promise.all(
              newQuestions.map(async (item: any) =>
                addCheckpointQuestions(item.id, newCheckpoint.id, item.required)
              )
            );
          }
          if (deletedQuestions.length > 0) {
            await Promise.all(
              deletedQuestions.map(async (quesId: any) =>
                removeCheckpointQuestion(quesId)
              )
            );
          }
          history.goBack();
        } else {
          setValidation({
            title: '',
            label: '',
            message: EditProfileCheckpointDict[userLanguage]['messages']['saveerr'],
            isError: true
          });
        }
        setLoading(false);

        // TODO: Redirect to previous step on success.
      } catch {
        setValidation({
          title: '',
          label: '',
          message: EditProfileCheckpointDict[userLanguage]['messages']['saveerr'],
          isError: true
        });
        setLoading(false);
      }
    }
  };

  const fetchCheckpointDetails = async () => {
    try {
      const [savedCheckpointData, personsList]: any = await Promise.all([
        await API.graphql(
          graphqlOperation(getCheckpointDetails, {
            id: checkpointId
          })
        ),
        await API.graphql(
          graphqlOperation(listPersons, {
            filter: {or: [{role: {eq: 'TR'}}, {role: {eq: 'BLD'}}]}
          })
        )
      ]);
      const sortedDesignersList: any = personsList?.data?.listPeople?.items?.map(
        (item: {id: string; firstName: string; lastName: string}) => ({
          id: item?.id,
          name: `${item?.firstName || ''} ${item.lastName || ''}`,
          value: `${item?.firstName || ''} ${item.lastName || ''}`
        })
      );

      if (!savedCheckpointData) {
        throw new Error('fail!');
      } else {
        const results = savedCheckpointData.data?.getCheckpoint;

        const designers = sortedDesignersList.filter((item: any) =>
          results.designers.includes(item.id)
        );
        const selectedLanguage: any = languageList.find(
          (item) => item.value === results.language
        );
        const checkpointQuestions: any = results?.questions?.items;
        const checkpQuestionsId: any = checkpointQuestions.map((item: any) => ({
          id: item.id,
          questionID: item.questionID
        })); // Saving checkpoint question id.
        const savedQuestionsId: any = checkpointQuestions.map(
          (item: any) => item.questionID
        ); // Saving previously selected question ids .
        const questionsList: any = checkpointQuestions.map((item: any) => item?.question); // Saving questions list.
        setCheckpointData({
          ...checkpointData,
          id: checkpointId,
          title: results.title,
          label: results.label,
          language: selectedLanguage,
          scope: results.scope
        });
        setDesignersList([...sortedDesignersList]);
        setSelectedDesigner(designers);
        setCheckpQuestions([...questionsList]);
        setCheckpQuestionId([...checkpQuestionsId]);
        setPreviouslySelectedId(savedQuestionsId);
      }
      setLoading(false);
    } catch (error) {
      setValidation({
        title: '',
        label: '',
        message: EditProfileCheckpointDict[userLanguage]['messages']['fetcherr'],
        isError: true
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCheckpointDetails();
  }, []);

  const handleRemoveQuestionFromCheckpoint = (questionID: string) => {
    removeCheckpointQuestion(questionID, fetchCheckpointDetails);
  };

  const {title, language, label} = checkpointData;
  return (
    <div className="w-full h-full">
      {/* Body section */}
      <PageLayout title={EditProfileCheckpointDict[userLanguage]['title']}>
        {currentState !== 'checkpoint' ? (
          <Fragment>
            {currentState === 'addQuestion' && (
              <AddQuestion
                goBackToPreviousStep={backToInitials}
                addNewQuestion={addQuesToCheckpoint}
              />
            )}
            {currentState === 'questionsList' && (
              <SelectPreviousQuestion
                selectedList={checkpQuestions}
                goBackToPreviousStep={backToInitials}
                setCheckpQuestions={setCheckpQuestions}
              />
            )}
          </Fragment>
        ) : (
          <Fragment>
            <div className="">
              <div className="">
                <div className="py-4 grid gap-4 grid-cols-2">
                  <div>
                    <FormInput
                      value={title}
                      id="title"
                      onChange={onInputChange}
                      name="title"
                      label={EditProfileCheckpointDict[userLanguage]['ltitle']}
                      isRequired
                    />
                    {validation.title && (
                      <p className="text-red-600 text-sm">{validation.title}</p>
                    )}
                  </div>
                  <div>
                    <FormInput
                      value={label}
                      id="label"
                      onChange={onInputChange}
                      name="label"
                      label={EditProfileCheckpointDict[userLanguage]['checklabel']}
                      isRequired
                    />
                    {validation.label && (
                      <p className="text-red-600 text-sm">{validation.label}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold leading-5 text-dark   mb-1">
                      {EditProfileCheckpointDict[userLanguage]['designer']}
                    </label>
                    <MultipleSelector
                      selectedItems={selectedDesigners}
                      placeholder="Designers"
                      list={designersList}
                      onChange={selectDesigner}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold leading-5 text-dark   mb-1">
                      Select Scope
                    </label>
                    <Selector
                      selectedItem={checkpointData.scope || 'public'}
                      placeholder="Update scope"
                      list={scopeList}
                      onChange={(name) =>
                        setCheckpointData({...checkpointData, scope: name})
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold leading-5 text-dark   mb-1">
                      {EditProfileCheckpointDict[userLanguage]['language']}
                    </label>
                    <Selector
                      selectedItem={language.name}
                      placeholder={EditProfileCheckpointDict[userLanguage]['planguage']}
                      list={languageList}
                      onChange={selectLanguage}
                    />
                  </div>
                </div>

                {/* Question table */}
                <div className="p-6 inner_card my-4">
                  <p className="text-m font-medium leading-5 text-dark   my-2 text-center">
                    {EditProfileCheckpointDict[userLanguage]['checkpoint']}:{' '}
                  </p>
                  {!checkpQuestions?.length ? (
                    <div className="my-8">
                      <p className="text-center p-8">
                        {' '}
                        {EditProfileCheckpointDict[userLanguage]['addquestion']}
                      </p>
                      <div className="flex w-full mx-auto p-8 justify-center ">
                        <Buttons
                          onClick={() => setCurrentState('questionsList')}
                          label={EditProfileCheckpointDict[userLanguage]['addexist']}
                        />
                        <Buttons
                          onClick={() => setCurrentState('addQuestion')}
                          label={EditProfileCheckpointDict[userLanguage]['addnew']}
                        />
                      </div>
                    </div>
                  ) : (
                    <Fragment>
                      <div className="max-h-112 overflow-auto">
                        <div className="flex justify-between w-full px-8 py-4 mx-auto whitespace-nowrap border-b-0 border-light">
                          <div className="w-.5/10 px-8 py-3 bg-lightest text-left text-xs leading-4 font-medium text-medium  uppercase tracking-wider">
                            <span>{EditProfileCheckpointDict[userLanguage]['no']}</span>
                          </div>
                          <div className="w-6/10 px-8 py-3 bg-lightest text-left text-xs leading-4 font-medium text-medium  uppercase tracking-wider">
                            <span>
                              {EditProfileCheckpointDict[userLanguage]['question']}
                            </span>
                          </div>
                          <div className="w-2/10 px-8 py-3 bg-lightest text-left text-xs leading-4 font-medium text-medium  uppercase tracking-wider">
                            <span>{EditProfileCheckpointDict[userLanguage]['type']}</span>
                          </div>
                          <div className="w-1.5/10 px-8 py-3 bg-lightest text-center text-xs leading-4 font-medium text-medium  uppercase tracking-wider">
                            <span>
                              {EditProfileCheckpointDict[userLanguage]['option']}
                            </span>
                          </div>
                        </div>

                        <div className="w-full m-auto">
                          {checkpQuestions.length > 0 ? (
                            checkpQuestions.map((item: any, index: number) => (
                              <Fragment key={item.id}>
                                <div
                                  onClick={() => {
                                    if (
                                      item.type === 'selectMany' ||
                                      item.type === 'selectOne'
                                    ) {
                                      showOptions(item.id, item.options);
                                    }
                                  }}
                                  key={item.id}
                                  className={`flex cursor-pointer justify-between w-full  px-8 py-4 whitespace-nowrap border-b-0 border-lightest ${
                                    questionOptions.quesId === item.id && 'bg-light'
                                  }`}>
                                  <div className="flex w-.5/10 items-center px-8 py-3 text-left text-s leading-4">
                                    {' '}
                                    {index + 1}.
                                  </div>
                                  <div className="flex w-6/10 px-8 py-3 items-center text-left text-s leading-4 font-medium whitespace-normal">
                                    {' '}
                                    {item.question}{' '}
                                  </div>
                                  <div className="flex w-2/10 px-8 py-3 text-left text-s leading-4 items-center whitespace-normal">
                                    {item.type ? getTypeString(item.type) : '--'}
                                  </div>

                                  <div className="flex w-1.5/10 px-6 py-1 text-s leading-4 items-center justify-center">
                                    <IoClose
                                      className="theme-text"
                                      size="1.5rem"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveQuestionFromCheckpoint(item.id);
                                      }}
                                    />
                                  </div>
                                </div>
                                {questionOptions.quesId === item.id && (
                                  <div className="px-16 py-4 flex flex-col text-dark   font-medium text-sm border-b-0 border-light">
                                    <p className="text-darkest   px-2 py-2 text-base">
                                      {EditProfileCheckpointDict[userLanguage]['option']}:
                                    </p>
                                    {questionOptions.options?.map((item, index) => (
                                      <span className="px-12 py-2" key={item.label}>
                                        {index + 1}. {item.text}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </Fragment>
                            ))
                          ) : (
                            <div className="py-12 my-6 text-center">
                              <p>
                                {' '}
                                {EditProfileCheckpointDict[userLanguage]['noquestion']}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex w-full mx-auto gap-4 justify-center ">
                        <Buttons
                          onClick={() => setCurrentState('questionsList')}
                          label={EditProfileCheckpointDict[userLanguage]['addexist']}
                        />
                        <Buttons
                          onClick={() => setCurrentState('addQuestion')}
                          label={EditProfileCheckpointDict[userLanguage]['addnew']}
                        />
                      </div>
                    </Fragment>
                  )}
                </div>
              </div>
            </div>
            {validation.message && (
              <div className="py-4 m-auto mt-2 text-center">
                <p
                  className={`${validation.isError ? 'text-red-600' : 'text-green-600'}`}>
                  {validation.message}
                </p>
              </div>
            )}
            <div className="flex my-8 gap-4 justify-center">
              <Buttons label="Cancel" onClick={history.goBack} transparent />
              <Buttons
                label={
                  loading
                    ? EditProfileCheckpointDict[userLanguage]['saving']
                    : EditProfileCheckpointDict[userLanguage]['save']
                }
                onClick={saveNewCheckpoint}
                disabled={loading ? true : false}
              />
            </div>
          </Fragment>
        )}
      </PageLayout>
    </div>
  );
};

export default EditProfileCheckpoint;
