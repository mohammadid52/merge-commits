import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {Fragment, useEffect, useState} from 'react';
import {IoOptionsOutline} from 'react-icons/io5';
import {useHistory, useParams} from 'react-router';

import {getAsset} from 'assets';
import {useGlobalContext} from 'contexts/GlobalContext';
import {
  createCheckpointQuestions,
  createCheckpoint,
  createCommonCheckpoint
} from 'customGraphql/customMutations';
import {listPersons} from 'customGraphql/customQueries';
import {getTypeString} from 'utilities/strings';

import {languageList, scopeList} from '@utilities/staticData';
import Buttons from 'atoms/Buttons';
import FormInput from 'atoms/Form/FormInput';
import MultipleSelector from 'atoms/Form/MultipleSelector';
import Selector from 'atoms/Form/Selector';
import useDictionary from 'customHooks/dictionary';
import PageLayout from 'layout/PageLayout';
import {v4 as uuidv4} from 'uuid';
import AddQuestion from './QuestionComponents/AddQuestion';
import SelectPreviousQuestion from './QuestionComponents/SelectPreviousQuestion';

const AddProfileCheckpoint = () => {
  const history = useHistory();
  const urlParams: any = useParams();
  const {courseId} = urlParams;

  const {theme, clientKey, userLanguage} = useGlobalContext();
  const themeColor = getAsset(clientKey, 'themeClassName');
  const {AddProfileCheckpointDict} = useDictionary();

  const initialData = {
    title: '',
    label: '',
    scope: 'public',
    language: {id: '1', name: 'English', value: 'EN'}
  };
  const [checkpointData, setCheckpointData] = useState(initialData);
  const [designersList, setDesignersList] = useState<any | []>([]);
  const [selectedDesigners, setSelectedDesigner] = useState<any | []>([]);
  const [checkpQuestions, setCheckpQuestions] = useState<any | []>([]);
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

  const addCheckpointQuestions = async (quesId: string, checkpointID: string) => {
    try {
      const input = {
        checkpointID: checkpointID,
        questionID: quesId,
        required: false
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
        message: AddProfileCheckpointDict[userLanguage]['messages']['unsave'],
        isError: true
      });
    }
  };

  const validateForm = () => {
    let isValid = true;
    const msgs = validation;
    if (!checkpointData.title?.trim().length) {
      isValid = false;
      msgs.title = AddProfileCheckpointDict[userLanguage]['messages']['titlerequired'];
    } else {
      msgs.title = '';
    }
    if (!checkpointData.label?.trim().length) {
      isValid = false;
      msgs.label = AddProfileCheckpointDict[userLanguage]['messages']['labelrequired'];
    } else {
      msgs.label = '';
    }
    if (checkpQuestions?.length <= 0) {
      isValid = false;
      msgs.message = AddProfileCheckpointDict[userLanguage]['messages']['minone'];
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
          stage: 'checkpoint',
          type: 'profile',
          label: checkpointData.label,
          scope: checkpointData.scope,
          title: checkpointData.title,
          designers: selectedDesigners.map((item: any) => item.id),
          language: checkpointData.language.value
        };
        const results: any = await API.graphql(
          graphqlOperation(createCheckpoint, {input: input})
        );
        const newCheckpoint = results?.data?.createCheckpoint;
        if (newCheckpoint) {
          let profileCheckpointInput = {
            id: uuidv4(),
            type: 'curricular',
            typeID: courseId,
            checkpointID: newCheckpoint.id
          };
          await API.graphql(
            graphqlOperation(createCommonCheckpoint, {
              input: profileCheckpointInput
            })
          );

          Promise.all(
            checkpQuestions.map(async (item: any) =>
              addCheckpointQuestions(item.id, newCheckpoint.id)
            )
          );
          history.goBack();
        } else {
          setValidation({
            title: '',
            label: '',
            message: AddProfileCheckpointDict[userLanguage]['messages']['unsave'],
            isError: true
          });
        }
        setLoading(false);

        // TODO: Redirect to previous step on success.
      } catch {
        setValidation({
          title: '',
          label: '',
          message: AddProfileCheckpointDict[userLanguage]['messages']['unsave'],
          isError: true
        });
        setLoading(false);
      }
    }
  };
  const addQuesToCheckpoint = (obj: any) => {
    setCheckpQuestions([...checkpQuestions, obj]);
  };

  const {title, language, label} = checkpointData;

  const fetchPersonsList = async () => {
    const result: any = await API.graphql(
      graphqlOperation(listPersons, {
        filter: {or: [{role: {eq: 'TR'}}, {role: {eq: 'BLD'}}]}
      })
    );
    const savedData = result.data.listPeople;
    const updatedList = savedData?.items.map(
      (item: {id: string; firstName: string; lastName: string}) => ({
        id: item?.id,
        name: `${item?.firstName || ''} ${item.lastName || ''}`,
        value: `${item?.firstName || ''} ${item.lastName || ''}`
      })
    );
    setDesignersList(updatedList);
  };

  useEffect(() => {
    fetchPersonsList();
  }, []);

  return (
    <div className="">
      {/* Section Header */}

      {/* Body section */}
      <PageLayout title={AddProfileCheckpointDict[userLanguage]['title']}>
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
          <>
            <div className="">
              <div className=" grid gap-4 gap-x-6 grid-cols-2">
                <FormInput
                  value={title}
                  id="title"
                  onChange={onInputChange}
                  name="title"
                  label={AddProfileCheckpointDict[userLanguage]['label']}
                  isRequired
                  error={validation.title}
                />

                <FormInput
                  value={label}
                  id="label"
                  onChange={onInputChange}
                  name="label"
                  label={AddProfileCheckpointDict[userLanguage]['checkpointlabel']}
                  isRequired
                  error={validation.label}
                />
                <div>
                  <MultipleSelector
                    label={AddProfileCheckpointDict[userLanguage]['selectdesigner']}
                    selectedItems={selectedDesigners}
                    placeholder={AddProfileCheckpointDict[userLanguage]['placeholder']}
                    list={designersList}
                    onChange={selectDesigner}
                  />
                </div>
                <div>
                  <Selector
                    label={'Select Scope'}
                    selectedItem={checkpointData.scope}
                    placeholder={
                      AddProfileCheckpointDict[userLanguage]['typePlaceholder']
                    }
                    list={scopeList}
                    onChange={(name) =>
                      setCheckpointData({
                        ...checkpointData,
                        scope: name
                      })
                    }
                  />
                </div>
                <div>
                  <Selector
                    label={AddProfileCheckpointDict[userLanguage]['languageselect']}
                    selectedItem={language.name}
                    placeholder={
                      AddProfileCheckpointDict[userLanguage]['placeholderlanguage']
                    }
                    list={languageList}
                    onChange={selectLanguage}
                  />
                </div>
              </div>

              {/* Question table */}
              <div className="mt-6 border-light   border-0 mb-4 mx-2">
                <p className="text-m font-medium leading-5 text-dark   my-2 text-center">
                  {AddProfileCheckpointDict[userLanguage]['checkpointq']}:{' '}
                </p>
                {!checkpQuestions?.length ? (
                  <div className="my-8">
                    <p className="text-center p-8">
                      {' '}
                      {AddProfileCheckpointDict[userLanguage]['addquestion']}
                    </p>
                    <div className="flex w-full mx-auto gap-4 justify-center ">
                      <Buttons
                        onClick={() => setCurrentState('questionsList')}
                        label={
                          AddProfileCheckpointDict[userLanguage]['button']['existing']
                        }
                      />
                      <Buttons
                        onClick={() => setCurrentState('addQuestion')}
                        label={AddProfileCheckpointDict[userLanguage]['button']['newq']}
                      />
                    </div>
                  </div>
                ) : (
                  <Fragment>
                    <div className="max-h-112 overflow-auto">
                      <div className="flex justify-between w-full gap-4 mx-auto whitespace-nowrap border-b-0 border-light">
                        <div className="w-.5/10 gap-4 bg-lightest text-left text-xs leading-4 font-medium text-medium  uppercase tracking-wider">
                          <span>{AddProfileCheckpointDict[userLanguage]['no']}</span>
                        </div>
                        <div className="w-6/10 gap-4 bg-lightest text-left text-xs leading-4 font-medium text-medium  uppercase tracking-wider">
                          <span>
                            {AddProfileCheckpointDict[userLanguage]['question']}
                          </span>
                        </div>
                        <div className="w-2/10 gap-4 bg-lightest text-left text-xs leading-4 font-medium text-medium  uppercase tracking-wider">
                          <span>{AddProfileCheckpointDict[userLanguage]['type']}</span>
                        </div>
                        <div className="w-1.5/10 gap-4 bg-lightest text-center text-xs leading-4 font-medium text-medium  uppercase tracking-wider">
                          <span>{AddProfileCheckpointDict[userLanguage]['option']}</span>
                        </div>
                      </div>

                      <div className="w-full m-auto">
                        {checkpQuestions.length > 0 ? (
                          checkpQuestions.map((item: any, index: number) => (
                            <Fragment key={item.id}>
                              <div
                                key={item.id}
                                className={`flex justify-between w-full  gap-4 whitespace-nowrap border-b-0 border-lightest ${
                                  questionOptions.quesId === item.id && 'bg-light'
                                }`}>
                                <div className="flex w-.5/10 items-center gap-4 text-left text-s leading-4">
                                  {' '}
                                  {index + 1}.
                                </div>
                                <div className="flex w-6/10 gap-4 items-center text-left text-s leading-4 font-medium whitespace-normal">
                                  {' '}
                                  {item.question}{' '}
                                </div>
                                <div className="flex w-2/10 gap-4 text-left text-s leading-4 items-center whitespace-normal">
                                  {item.type ? getTypeString(item.type) : '--'}
                                </div>
                                {/* <div className="flex w-1.5/10 gap-4 text-s leading-4 items-center justify-center">
                                      <span className="cursor-pointer">
                                        <CheckBox value={item.required ? true : false} onChange={() => console.log(item.id)} name='isRequired' />
                                      </span>
                                    </div> */}
                                <div className="flex w-1.5/10 gap-4 text-s leading-4 items-center justify-center">
                                  {(item.type === 'selectMany' ||
                                    item.type === 'selectOne') && (
                                    <div
                                      className={`w-6 h-6 cursor-pointer ${theme.textColor[themeColor]}`}
                                      onClick={() => showOptions(item.id, item.options)}>
                                      <IoOptionsOutline
                                        size="1.5rem"
                                        className="theme-text"
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                              {questionOptions.quesId === item.id && (
                                <div className="gap-4-4 flex flex-col text-dark   font-medium text-sm border-b-0 border-light">
                                  <p className="text-darkest   gap-4 text-base">
                                    {AddProfileCheckpointDict[userLanguage]['option']}:
                                  </p>
                                  {questionOptions.options?.map((item, index) => (
                                    <span className="gap-4-2" key={item.label}>
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
                              {
                                AddProfileCheckpointDict[userLanguage]['messages'][
                                  'noquestion'
                                ]
                              }
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex w-full mx-auto gap-4 justify-center ">
                      <Buttons
                        onClick={() => setCurrentState('questionsList')}
                        label={
                          AddProfileCheckpointDict[userLanguage]['button']['existing']
                        }
                      />
                      <Buttons
                        onClick={() => setCurrentState('addQuestion')}
                        label={AddProfileCheckpointDict[userLanguage]['button']['newq']}
                      />
                    </div>
                  </Fragment>
                )}
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
              <Buttons
                label={AddProfileCheckpointDict[userLanguage]['button']['cancel']}
                onClick={history.goBack}
                transparent
              />
              <Buttons
                label={
                  loading
                    ? AddProfileCheckpointDict[userLanguage]['button']['saving']
                    : AddProfileCheckpointDict[userLanguage]['button']['save']
                }
                onClick={saveNewCheckpoint}
                disabled={loading ? true : false}
              />
            </div>
          </>
        )}
      </PageLayout>
    </div>
  );
};

export default AddProfileCheckpoint;
