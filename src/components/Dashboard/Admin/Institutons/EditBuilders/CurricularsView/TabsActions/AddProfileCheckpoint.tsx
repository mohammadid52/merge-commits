import React, {useState, Fragment, useEffect, useContext} from 'react';
import {useHistory, useParams} from 'react-router';
import {IoArrowUndoCircleOutline, IoOptionsOutline} from 'react-icons/io5';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';

import {getTypeString} from '../../../../../../../utilities/strings';
import * as customQueries from '../../../../../../../customGraphql/customQueries';
import * as customMutations from '../../../../../../../customGraphql/customMutations';
import {getAsset} from '../../../../../../../assets';
import {GlobalContext} from '../../../../../../../contexts/GlobalContext';

import MultipleSelector from '../../../../../../Atoms/Form/MultipleSelector';
import SectionTitle from '../../../../../../Atoms/SectionTitle';
import PageWrapper from '../../../../../../Atoms/PageWrapper';
import BreadCrums from '../../../../../../Atoms/BreadCrums';
import FormInput from '../../../../../../Atoms/Form/FormInput';
import Selector from '../../../../../../Atoms/Form/Selector';
import Buttons from '../../../../../../Atoms/Buttons';
import AddQuestion from './QuestionComponents/AddQuestion';
import SelectPreviousQuestion from './QuestionComponents/SelectPreviousQuestion';
import useDictionary from '../../../../../../../customHooks/dictionary';
import {goBackBreadCrumb} from '../../../../../../../utilities/functions';

interface AddProfileCheckpointProps {}

const AddProfileCheckpoint = (props: AddProfileCheckpointProps) => {
  const {} = props;
  const history = useHistory();
  const urlParams: any = useParams();
  const curricularId = urlParams.curricularId;
  const institutionId = urlParams.institutionId;

  const {theme, clientKey, userLanguage} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const {AddProfileCheckpointDict, BreadcrumsTitles} = useDictionary(clientKey);

  const initialData = {
    title: '',
    label: '',
    scope: 'public',
    language: {id: '1', name: 'English', value: 'EN'},
  };
  const [checkpointData, setCheckpointData] = useState(initialData);
  const [designersList, setDesignersList] = useState([]);
  const [selectedDesigners, setSelectedDesigner] = useState([]);
  const [checkpQuestions, setCheckpQuestions] = useState([]);
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
      title: BreadcrumsTitles[userLanguage]['INSTITUTION_MANAGEMENT'],
      url: '/dashboard/manage-institutions',
      last: false,
    },
    {
      title: BreadcrumsTitles[userLanguage]['INSTITUTION_INFO'],
      url: `/dashboard/manage-institutions/institution/${institutionId}/staff`,
      last: false,
    },
    {
      title: BreadcrumsTitles[userLanguage]['CURRICULUMBUILDER'],
      url: `/dashboard/manage-institutions/${institutionId}/curricular?id=${curricularId}`,
      last: false,
    },
    {
      title: BreadcrumsTitles[userLanguage]['AddCheckpint'],
      url: `/dashboard/manage-institutions/curricular/${curricularId}/checkpoint/addNew`,
      last: true,
    },
  ];

  const languageList = [
    {id: 1, name: 'English', value: 'EN'},
    {id: 2, name: 'Spanish', value: 'ES'},
  ];

  const scopeList = [
    {id: 0, name: 'public'},
    {id: 1, name: 'private'},
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

  const addCheckpointQuestions = async (
    quesId: string,
    checkpointID: string,
    required: boolean
  ) => {
    try {
      const input = {
        checkpointID: checkpointID,
        questionID: quesId,
        required: false,
      };
      const questions: any = await API.graphql(
        graphqlOperation(customMutations.createCheckpointQuestions, {input: input})
      );
    } catch {
      setValidation({
        title: '',
        label: '',
        message: AddProfileCheckpointDict[userLanguage]['messages']['unsave'],
        isError: true,
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
          language: checkpointData.language.value,
        };
        const results: any = await API.graphql(
          graphqlOperation(customMutations.createCheckpoint, {input: input})
        );
        const newCheckpoint = results?.data?.createCheckpoint;
        if (newCheckpoint) {
          let profileCheckpointInput = {
            type: 'curricular',
            typeID: curricularId,
            checkpointID: newCheckpoint.id,
          };
          await API.graphql(
            graphqlOperation(customMutations.createCommonCheckpoint, {
              input: profileCheckpointInput,
            })
          );

          let questions = Promise.all(
            checkpQuestions.map(async (item: any) =>
              addCheckpointQuestions(item.id, newCheckpoint.id, item.required)
            )
          );
          history.goBack();
        } else {
          setValidation({
            title: '',
            label: '',
            message: AddProfileCheckpointDict[userLanguage]['messages']['unsave'],
            isError: true,
          });
        }
        setLoading(false);

        // TODO: Redirect to previous step on success.
      } catch {
        setValidation({
          title: '',
          label: '',
          message: AddProfileCheckpointDict[userLanguage]['messages']['unsave'],
          isError: true,
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
      graphqlOperation(customQueries.listPersons, {
        filter: {or: [{role: {eq: 'TR'}}, {role: {eq: 'BLD'}}]},
      })
    );
    const savedData = result.data.listPersons;
    const updatedList = savedData?.items.map(
      (item: {id: string; firstName: string; lastName: string}) => ({
        id: item?.id,
        name: `${item?.firstName || ''} ${item.lastName || ''}`,
        value: `${item?.firstName || ''} ${item.lastName || ''}`,
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
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle
          title={AddProfileCheckpointDict[userLanguage]['title']}
          subtitle={AddProfileCheckpointDict[userLanguage]['subtitle']}
        />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons
            label="Go Back"
            btnClass="mr-4"
            onClick={() => goBackBreadCrumb(breadCrumsList, history)}
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
                {AddProfileCheckpointDict[userLanguage]['heading']}
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
                      label={AddProfileCheckpointDict[userLanguage]['label']}
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
                      label={AddProfileCheckpointDict[userLanguage]['checkpointlabel']}
                      isRequired
                    />
                    {validation.label && (
                      <p className="text-red-600 text-sm">{validation.label}</p>
                    )}
                  </div>
                </div>

                <div className="px-3 py-4 grid gap-x-6 grid-cols-3">
                  <div>
                    <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
                      {AddProfileCheckpointDict[userLanguage]['selectdesigner']}
                    </label>
                    <MultipleSelector
                      selectedItems={selectedDesigners}
                      placeholder={AddProfileCheckpointDict[userLanguage]['placeholder']}
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
                      placeholder={
                        AddProfileCheckpointDict[userLanguage]['typePlaceholder']
                      }
                      list={scopeList}
                      onChange={(c, name) =>
                        setCheckpointData({
                          ...checkpointData,
                          scope: name,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
                      {AddProfileCheckpointDict[userLanguage]['languageselect']}
                    </label>
                    <Selector
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
                <div className="p-6 border-gray-400  border-0 my-4 mx-2">
                  <p className="text-m font-medium leading-5 text-gray-700 my-2 text-center">
                    {AddProfileCheckpointDict[userLanguage]['checkpointq']}:{' '}
                  </p>
                  {!checkpQuestions?.length ? (
                    <div className="my-8">
                      <p className="text-center p-8">
                        {' '}
                        {AddProfileCheckpointDict[userLanguage]['addquestion']}
                      </p>
                      <div className="flex w-full mx-auto p-8 justify-center ">
                        <Buttons
                          btnClass="mr-4"
                          onClick={() => setCurrentState('questionsList')}
                          label={
                            AddProfileCheckpointDict[userLanguage]['button']['existing']
                          }
                        />
                        <Buttons
                          btnClass="ml-4"
                          onClick={() => setCurrentState('addQuestion')}
                          label={AddProfileCheckpointDict[userLanguage]['button']['newq']}
                        />
                      </div>
                    </div>
                  ) : (
                    <Fragment>
                      <div className="max-h-112 overflow-auto">
                        <div className="flex justify-between w-full px-8 py-4 mx-auto whitespace-nowrap border-b-0 border-gray-200">
                          <div className="w-.5/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                            <span>{AddProfileCheckpointDict[userLanguage]['no']}</span>
                          </div>
                          <div className="w-6/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                            <span>
                              {AddProfileCheckpointDict[userLanguage]['question']}
                            </span>
                          </div>
                          <div className="w-2/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                            <span>{AddProfileCheckpointDict[userLanguage]['type']}</span>
                          </div>
                          <div className="w-1.5/10 px-8 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                            <span>
                              {AddProfileCheckpointDict[userLanguage]['option']}
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
                                      {AddProfileCheckpointDict[userLanguage]['option']}:
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
                      <div className="flex w-full mx-auto p-8 justify-center ">
                        <Buttons
                          btnClass="mr-4"
                          onClick={() => setCurrentState('questionsList')}
                          label={
                            AddProfileCheckpointDict[userLanguage]['button']['existing']
                          }
                        />
                        <Buttons
                          btnClass="ml-4"
                          onClick={() => setCurrentState('addQuestion')}
                          label={AddProfileCheckpointDict[userLanguage]['button']['newq']}
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
                label={AddProfileCheckpointDict[userLanguage]['button']['cancel']}
                onClick={history.goBack}
                transparent
              />
              <Buttons
                btnClass="py-3 px-10 ml-4"
                label={
                  loading
                    ? AddProfileCheckpointDict[userLanguage]['button']['saving']
                    : AddProfileCheckpointDict[userLanguage]['button']['save']
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

export default AddProfileCheckpoint;
