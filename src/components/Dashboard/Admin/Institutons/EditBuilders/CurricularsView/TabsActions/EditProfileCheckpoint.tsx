import React, {useState, Fragment, useEffect, useContext} from 'react';
import API, {graphqlOperation} from '@aws-amplify/api';
import {useHistory, useParams} from 'react-router';
import {IoArrowUndoCircleOutline, IoOptionsOutline} from 'react-icons/io5';
import {IconContext} from 'react-icons/lib/esm/iconContext';

import {getTypeString} from '../../../../../../../utilities/strings';
import * as customQueries from '../../../../../../../customGraphql/customQueries';
import * as customMutations from '../../../../../../../customGraphql/customMutations';

import MultipleSelector from '../../../../../../Atoms/Form/MultipleSelector';
import SectionTitle from '../../../../../../Atoms/SectionTitle';
import PageWrapper from '../../../../../../Atoms/PageWrapper';
import BreadCrums from '../../../../../../Atoms/BreadCrums';
import FormInput from '../../../../../../Atoms/Form/FormInput';
import Selector from '../../../../../../Atoms/Form/Selector';
import Buttons from '../../../../../../Atoms/Buttons';
import AddQuestion from './QuestionComponents/AddQuestion';
import SelectPreviousQuestion from './QuestionComponents/SelectPreviousQuestion';
import {getAsset} from '../../../../../../../assets';
import {GlobalContext} from '../../../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../../../customHooks/dictionary';

interface EditProfileCheckpointProps {}

const EditProfileCheckpoint = (props: EditProfileCheckpointProps) => {
  const {} = props;
  const history = useHistory();
  const urlParams: any = useParams();
  const {theme, clientKey, userLanguage} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const {EditProfileCheckpointDict, BreadcrumsTitles} = useDictionary(clientKey);
  const curricularId = urlParams.curricularId;
  const institutionId = urlParams.institutionId;
  const checkpointId = urlParams.id;
  const initialData = {
    id: '',
    title: '',
    label: '',
    language: {id: '1', name: 'English', value: 'EN'},
    scope: '',
  };
  const [checkpointData, setCheckpointData] = useState(initialData);
  console.log(
    '🚀 ~ file: EditProfileCheckpoint.tsx ~ line 43 ~ EditProfileCheckpoint ~ checkpointData',
    checkpointData
  );
  const [designersList, setDesignersList] = useState([]);
  const [selectedDesigners, setSelectedDesigner] = useState([]);
  const [checkpQuestions, setCheckpQuestions] = useState([]);
  const [previouslySelectedId, setPreviouslySelectedId] = useState([]);
  const [checkpQuestionId, setCheckpQuestionId] = useState([]);
  const [questionOptions, setQuestionOptions] = useState({quesId: '', options: []});
  const [currentState, setCurrentState] = useState('checkpoint');
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState({
    title: '',
    label: '',
    message: '',
    isError: true,
  });

  const breadCrumsList = [
    {title: BreadcrumsTitles[userLanguage]['HOME'], url: '/dashboard', last: false},
    {
      title: BreadcrumsTitles[userLanguage]['CURRICULUMBUILDER'],
      url: `/dashboard/manage-institutions/${institutionId}/curricular?id=${curricularId}`,
      last: false,
    },
    {
      title: BreadcrumsTitles[userLanguage]['AddChekpoint'],
      url: `/dashboard/curricular/${curricularId}/checkpoint/addNew`,
      last: true,
    },
  ];

  const languageList = [
    {id: 1, name: 'English', value: 'EN'},
    {id: 2, name: 'Spanish', value: 'ES'},
  ];

  const onInputChange = (e: any) => {
    setCheckpointData({
      ...checkpointData,
      [e.target.name]: e.target.value,
    });
    if (validation.title || validation.label) {
      setValidation({
        ...validation,
        title: '',
        label: '',
      });
    }
  };

  const selectLanguage = (value: string, name: string, id: string) => {
    setCheckpointData({
      ...checkpointData,
      language: {
        id,
        name,
        value,
      },
    });
  };

  const selectDesigner = (id: string, name: string, value: string) => {
    let updatedList;
    const currentDesigners = selectedDesigners;
    const selectedItem = currentDesigners.find((item) => item.id === id);
    if (!selectedItem) {
      updatedList = [...currentDesigners, {id, name, value}];
    } else {
      updatedList = currentDesigners.filter((item) => item.id !== id);
    }
    setSelectedDesigner(updatedList);
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
        required: required ? required : false,
      };
      const questions: any = await API.graphql(
        graphqlOperation(customMutations.createCheckpointQuestions, {input: input})
      );
    } catch {
      setValidation({
        title: '',
        label: '',
        message: EditProfileCheckpointDict[userLanguage]['messages']['saveerr'],
        isError: true,
      });
    }
  };

  // Removed question from checkpoint
  const removeCheckpointQuestion = async (quesId: string) => {
    const deletedQuestions: any = [...checkpQuestionId];
    const deletedQuesID = deletedQuestions.find((item: any) => item.questionID === quesId)
      ?.id;
    try {
      const input = {
        id: deletedQuesID,
      };
      const result: any = await API.graphql(
        graphqlOperation(customMutations.deleteCheckpointQuestions, {input: input})
      );
    } catch {
      setValidation({
        title: '',
        label: '',
        message: EditProfileCheckpointDict[userLanguage]['messages']['saveerr'],
        isError: true,
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
      msgs.message = EditProfileCheckpointDict[userLanguage]['messages']['onequestion'];
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
        };
        const results: any = await API.graphql(
          graphqlOperation(customMutations.updateCheckpoint, {input: input})
        );
        const newCheckpoint = results?.data?.updateCheckpoint;
        const newQuestions: any = checkpQuestions.filter(
          (que) => !previouslySelectedId.includes(que.id)
        );
        const deletedQuestions: any = previouslySelectedId.filter((queId) => {
          let newArrayOfId = checkpQuestions.map((que: any) => que.id);
          return !newArrayOfId.includes(queId);
        });
        if (newCheckpoint) {
          if (newQuestions.length > 0) {
            let newAddedQuestions = await Promise.all(
              newQuestions.map(async (item: any) =>
                addCheckpointQuestions(item.id, newCheckpoint.id, item.required)
              )
            );
          }
          if (deletedQuestions.length > 0) {
            let removedQuestions = await Promise.all(
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
            isError: true,
          });
        }
        setLoading(false);

        // TODO: Redirect to previous step on success.
      } catch {
        setValidation({
          title: '',
          label: '',
          message: EditProfileCheckpointDict[userLanguage]['messages']['saveerr'],
          isError: true,
        });
        setLoading(false);
      }
    }
  };

  const fetchCheckpointDetails = async () => {
    try {
      const [savedCheckpointData, personsList]: any = await Promise.all([
        await API.graphql(
          graphqlOperation(customQueries.getCheckpointDetails, {
            id: checkpointId,
          })
        ),
        await API.graphql(
          graphqlOperation(customQueries.listPersons, {
            filter: {or: [{role: {eq: 'TR'}}, {role: {eq: 'BLD'}}]},
          })
        ),
      ]);
      const sortedDesignersList: any = personsList?.data?.listPersons?.items?.map(
        (item: {id: string; firstName: string; lastName: string}) => ({
          id: item?.id,
          name: `${item?.firstName || ''} ${item.lastName || ''}`,
          value: `${item?.firstName || ''} ${item.lastName || ''}`,
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
          questionID: item.questionID,
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
          // scope: results.scope,
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
        isError: true,
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCheckpointDetails();
  }, []);

  const scopeList = [
    {id: 0, name: 'public'},
    {id: 1, name: 'private'},
  ];

  const {title, language, label} = checkpointData;
  return (
    <div className="w-full h-full">
      {/* Section Header */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle
          title={EditProfileCheckpointDict[userLanguage]['title']}
          subtitle={EditProfileCheckpointDict[userLanguage]['subtitle']}
        />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons
            label="Go Back"
            btnClass="mr-4"
            onClick={history.goBack}
            Icon={IoArrowUndoCircleOutline}
          />
        </div>
      </div>

      {/* Body section */}
      <PageWrapper>
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
            <div className="w-8/10 m-auto">
              <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">
                {EditProfileCheckpointDict[userLanguage]['heading']}
              </h3>
            </div>
            <div className="w-9/10 m-auto">
              <div className="">
                <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
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
                </div>

                <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
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
                    <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
                      Select Scope
                    </label>
                    <Selector
                      selectedItem={checkpointData.scope}
                      placeholder={checkpointData.scope}
                      list={scopeList}
                      onChange={(c, name) =>
                        setCheckpointData({...checkpointData, scope: name})
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
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
                <div className="p-6 border-gray-400  border-0 my-4 border-dashed">
                  <p className="text-m font-medium leading-5 text-gray-700 my-2 text-center">
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
                          btnClass="mr-4"
                          onClick={() => setCurrentState('questionsList')}
                          label={EditProfileCheckpointDict[userLanguage]['addexist']}
                        />
                        <Buttons
                          btnClass="ml-4"
                          onClick={() => setCurrentState('addQuestion')}
                          label={EditProfileCheckpointDict[userLanguage]['addnew']}
                        />
                      </div>
                    </div>
                  ) : (
                    <Fragment>
                      <div className="max-h-112 overflow-auto">
                        <div className="flex justify-between w-full px-8 py-4 mx-auto whitespace-nowrap border-b-0 border-gray-200">
                          <div className="w-.5/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                            <span>{EditProfileCheckpointDict[userLanguage]['no']}</span>
                          </div>
                          <div className="w-6/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                            <span>
                              {EditProfileCheckpointDict[userLanguage]['question']}
                            </span>
                          </div>
                          <div className="w-2/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                            <span>{EditProfileCheckpointDict[userLanguage]['type']}</span>
                          </div>
                          <div className="w-1.5/10 px-8 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
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
                                  key={item.id}
                                  className={`flex justify-between w-full  px-8 py-4 whitespace-nowrap border-b-0 border-gray-200 ${
                                    questionOptions.quesId === item.id && 'bg-gray-200'
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
                                  {/* <div className="flex w-1.5/10 px-6 py-3 text-s leading-4 items-center justify-center">
                                      <span className="cursor-pointer">
                                        <CheckBox value={item.required ? true : false} onChange={() => console.log(item.id)} name='isRequired' />
                                      </span>
                                    </div> */}
                                  <div className="flex w-1.5/10 px-6 py-1 text-s leading-4 items-center justify-center">
                                    {(item.type === 'selectMany' ||
                                      item.type === 'selectOne') && (
                                      <div
                                        className={`w-6 h-6 cursor-pointer ${theme.textColor[themeColor]}`}
                                        onClick={() =>
                                          showOptions(item.id, item.options)
                                        }>
                                        <IconContext.Provider
                                          value={{
                                            size: '1.5rem',
                                            color: theme.iconColor[themeColor],
                                          }}>
                                          <IoOptionsOutline />
                                        </IconContext.Provider>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                {questionOptions.quesId === item.id && (
                                  <div className="px-16 py-4 flex flex-col text-gray-700 font-medium text-sm border-b-0 border-gray-200">
                                    <p className="text-gray-900 px-2 py-2 text-base">
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
                      <div className="flex w-full mx-auto p-8 justify-center ">
                        <Buttons
                          btnClass="mr-4"
                          onClick={() => setCurrentState('questionsList')}
                          label={EditProfileCheckpointDict[userLanguage]['addexist']}
                        />
                        <Buttons
                          btnClass="ml-4"
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
            <div className="flex my-8 justify-center">
              <Buttons
                btnClass="py-3 px-10 mr-4"
                label="Cancel"
                onClick={history.goBack}
                transparent
              />
              <Buttons
                btnClass="py-3 px-10 ml-4"
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
      </PageWrapper>
    </div>
  );
};

export default EditProfileCheckpoint;
