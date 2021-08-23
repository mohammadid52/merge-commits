import React, {useState, useContext, useEffect, Fragment} from 'react';
import API, {graphqlOperation} from '@aws-amplify/api';
import {NavLink, useHistory, useRouteMatch} from 'react-router-dom';

import DropdownForm from './DropdownForm';
import {UserInfo} from './Profile';
import * as customMutations from '../../../customGraphql/customMutations';
import * as customQueries from '../../../customGraphql/customQueries';
import LessonLoading from '../../Lesson/Loading/ComponentLoading';
import {GlobalContext} from '../../../contexts/GlobalContext';
import useDictionary from '../../../customHooks/dictionary';
import MultipleSelector from '../../Atoms/Form/MultipleSelector';
import FormInput from '../../Atoms/Form/FormInput';
import Selector from '../../Atoms/Form/Selector';
import Buttons from '../../Atoms/Buttons';
import {convertArrayIntoObj} from '../../../utilities/strings';
import {get} from 'lodash';

interface UserInfoProps {
  user: UserInfo;
  status: string;
  getUser: () => void;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  stdCheckpoints: any[];
  questionData: any[];
}

const ProfileEdit = (props: UserInfoProps) => {
  const history = useHistory();
  const {state, userLanguage, clientKey, dispatch} = useContext(GlobalContext);
  const {dashboardProfileDict} = useDictionary(clientKey);
  const {user, getUser, status, setStatus, stdCheckpoints, questionData} = props;
  let [imagePreviewURL, setImagePreviewURL] = useState(user.image);
  const [editUser, setEditUser] = useState(user);
  const [loading, setLoading] = useState(false);
  const [checkpointData, setCheckpointData] = useState<any>({});

  const onInputChange = (e: any, checkpointID: string, questionID: string) => {
    setCheckpointData({
      ...checkpointData,
      [checkpointID]: {
        ...checkpointData[checkpointID],
        [questionID]: e.target.value,
      },
    });
  };

  const onOtherInputChange = (e: any, checkpointID: string, questionID: string) => {
    setCheckpointData({
      ...checkpointData,
      [checkpointID]: {
        ...checkpointData[checkpointID],
        [questionID]: `Other || ${e.target.value}`,
      },
    });
  };

  const onMultipleSelection = (
    id: string,
    name: string,
    value: string,
    checkpointID: string,
    questionID: string
  ) => {
    const selectedQuestion = checkpointData[checkpointID]
      ? checkpointData[checkpointID][questionID]
      : [];

    if (selectedQuestion?.length > 0) {
      if (typeof selectedQuestion === 'string') {
        setCheckpointData({
          ...checkpointData,
          [checkpointID]: {
            ...checkpointData[checkpointID],
            [questionID]: [],
          },
        });
      }
      const selectedOption: any = selectedQuestion?.find((item: any) => item.id === id);
      let updatedList;
      if (selectedOption) {
        const newList = selectedQuestion.filter((item: any) => item.id !== id);
        updatedList = [...newList];
      } else {
        updatedList = [...selectedQuestion, {id, name, value}];
      }
      setCheckpointData({
        ...checkpointData,
        [checkpointID]: {
          ...checkpointData[checkpointID],
          [questionID]: [...updatedList],
        },
      });
    } else {
      setCheckpointData({
        ...checkpointData,
        [checkpointID]: {
          ...checkpointData[checkpointID],
          [questionID]: [
            {
              id,
              name,
              value,
            },
          ],
        },
      });
    }
  };
  const onSingleSelect = (
    value: string,
    name: string,
    id: string,
    checkpointID: string,
    questionID: string
  ) => {
    setCheckpointData({
      ...checkpointData,
      [checkpointID]: {
        ...checkpointData[checkpointID],
        [questionID]: name,
      },
    });
  };

  const getQuestionArray = (obj: any) => {
    const keys: any = Object.keys(obj);
    return keys.map((item: any) => ({
      qid: item,
      response:
        typeof obj[item] === 'string'
          ? [obj[item]]
          : [...obj[item].map((op: any) => op.name)],
    }));
  };
  const gobackToPreviousStep = () => {
    history.push('/dashboard/profile');
  };

  const updateQuestionData = async (responseObj: any, checkpointID: string) => {
    const val = responseObj.responseObject.map((resp: any) => {
      if (hasOther(resp.response, 'Other')) {
        return {
          ...resp,
          response: checkpointData[checkpointID][resp.qid],
          otherResponse: checkpointData[checkpointID][resp.qid]
            .toString()
            .split(' || ')[1],
        };
      } else {
        return {...resp};
      }
    });

    const modifiedResponseObj = {...responseObj, responseObject: val};

    try {
      const questionData = await API.graphql(
        graphqlOperation(customMutations.updateQuestionData, {input: modifiedResponseObj})
      );
    } catch (err) {
      console.error(err);
    }
  };

  const updatePersonCheckpointData = async (
    questionDataId: string,
    questions: any[],
    checkpointID: string
  ) => {
    let responseObject = {
      id: questionDataId,
      responseObject: questions,
    };
    updateQuestionData(responseObject, checkpointID);
  };

  const createQuestionData = async (responseObj: any) => {
    try {
      const questionData = await API.graphql(
        graphqlOperation(customMutations.createQuestionData, {input: responseObj})
      );
      console.log('Question data updated');
    } catch (err) {
      console.error(err);
    }
  };

  const savePersonCheckpointData = async (checkpointId: string, questions: any[]) => {
    let responseObject = {
      syllabusLessonID: '999999', //Dummy syllabus id since it's required, at least for now.
      checkpointID: checkpointId,
      authID: editUser.authId,
      email: editUser.email,
      responseObject: questions,
    };
    createQuestionData(responseObject);
  };

  const saveAllCheckpointData = async () => {
    setLoading(true);
    const checkpId = Object.keys(checkpointData);
    const allCheckpoints = checkpId.map((itemID) => ({
      checkpointId: itemID,
      questions: checkpointData ? getQuestionArray(checkpointData[itemID]) : [],
    }));
    if (questionData?.length === 0) {
      let checkpoints = Promise.all(
        allCheckpoints.map(async (item: any) => {
          return savePersonCheckpointData(item.checkpointId, item.questions);
        })
      );
    } else {
      let checkpoints = Promise.all(
        allCheckpoints.map(async (item: any) => {
          const currentItem: any = questionData?.find(
            (question: any) => question.checkpointID === item.checkpointId
          );
          if (currentItem) {
            return updatePersonCheckpointData(
              currentItem.id,
              item.questions,
              item.checkpointId
            );
          } else {
            return savePersonCheckpointData(item.checkpointId, item.questions);
          }
        })
      );
    }
  };

  async function updatePerson() {
    const input = {
      id: editUser.id,
      authId: editUser.authId,
      firstName: editUser.firstName,
      grade: editUser.grade,
      image: editUser.image,
      language: editUser.language,
      lastName: editUser.lastName,
      preferredName: editUser.preferredName,
      role: editUser.role,
      status: editUser.status,
      phone: editUser.phone,
      birthdate: editUser.birthdate,
      email: editUser.email,
    };

    try {
      const update: any = await API.graphql(
        graphqlOperation(customMutations.updatePerson, {input: input})
      );
      setEditUser(update.data.updatePerson);
      setStatus('loading');
      dispatch({
        type: 'SET_USER',
        payload: {
          id: state.user.id,
          firstName: editUser.firstName,
          lastName: editUser.lastName,
          language: editUser.language,
          onBoardSurvey: state.user.onBoardSurvey ? state.user.onBoardSurvey : false,
          role: state.user.role,
          image: state.user.image,
        },
      });
      gobackToPreviousStep();
    } catch (error) {
      console.error(error);
    }
  }

  async function saveProfileInformation() {
    saveAllCheckpointData();
    const updateUser = await updatePerson();
    const get = await getUser();
  }

  const onChange = (e: any) => {
    const {id, value} = e.target;
    setEditUser(() => {
      return {
        ...editUser,
        [id]: value,
      };
    });
  };

  const handleChangeLanguage = (lang: {name: string; code: string}) => {
    setEditUser(() => {
      return {
        ...editUser,
        language: lang.code,
      };
    });
  };

  const Language = [
    {
      code: 'EN',
      name: 'English',
    },
    {
      code: 'ES',
      name: 'Spanish',
    },
  ];

  const convertToSelectorList = (options: any) => {
    const newArr: any = options.map((item: any, index: number) => ({
      id: index,
      name: item.text,
      value: item.text,
    }));

    return newArr;
  };
  const convertToMultiSelectList = (options: any) => {
    const newArr: any = options.map((item: any, index: number) => ({
      id: index.toString(),
      name: item.text,
      value: item.text,
    }));
    return newArr;
  };

  const selectedMultiOptions = (options: any[]) => {
    if (typeof options === 'string') {
      return [{id: '0', name: options, value: options}];
    }
    if (options && typeof options[0] === 'string') {
      const newArr: any = options?.map((option: any, index: number) => {
        return {
          id: index.toString(),
          name: option,
          value: option,
        };
      });

      return [...newArr];
    } else {
      return [...options];
    }
  };

  let imagePreview = null;
  if (imagePreview) {
    imagePreview = <img src={`"${imagePreviewURL}"`} />;
  } else {
    imagePreview = (
      <svg
        className="h-full w-full text-gray-300"
        fill="currentColor"
        viewBox="0 0 24 24">
        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    );
  }
  const extractItemFromArray = (responceArray: any[]) => {
    const answerArray: any = responceArray.map((item: any) => {
      // const getOtherRespValue = () => {
      //   const response = item?.response.toString();
      //   if (response.includes('Other')) {
      //     return item.otherResponse;
      //   } else {
      //     return response;
      //   }
      // };
      return {
        [item['qid']]:
          item?.response?.length > 1
            ? [...selectedMultiOptions(item.response)]
            : item?.response.toString(),
      };
    });
    return convertArrayIntoObj(answerArray);
  };

  useEffect(() => {
    if (questionData?.length > 0) {
      const updatedListArray: any = questionData.map((item: any) => ({
        [item['checkpointID']]: extractItemFromArray(item.responseObject),
      }));
      const updatedListObj: any = convertArrayIntoObj(updatedListArray);
      setCheckpointData({
        ...updatedListObj,
      });
    }
  }, [questionData]);

  const match = useRouteMatch();

  if (status !== 'done') {
    return <LessonLoading />;
  }

  const path = '/dashboard/profile/password';

  // Code for Other Field
  const hasOther = (val: string | string[], other: string) => {
    try {
      return val ? val.toString().includes(other): false;
    } catch (err) {
      console.log('errrr' , err)
      return false;
    }
  }

  const isOther = (val: any) => {
    if (hasOther(val, 'Other')) {
      return true;
    } else return false;
  };
  // ⬆️ Ends here ⬆️

  const getValue = (checkpointId: string, questionId: string) => {
    if (checkpointData[checkpointId]) {
      const currentQuestionResponse = checkpointData[checkpointId][questionId];
      return currentQuestionResponse
        ? currentQuestionResponse.split(' || ').length === 2
          ? currentQuestionResponse.split(' || ')[1]
          : ''
        : '';
    }
  };

  {
    return (
      <div className="h-full w-full md:px-4 pt-4">
        <form>
          <div>
            <div className="h-auto bg-white border-l-0 border-gray-200 mb-4">
              <div className="px-4 py-1 md:py-5 border-b-0 border-gray-200 sm:px-6">
                <h3 className="text-sm md:text-lg leading-6 font-medium text-gray-900 uppercase">
                  {dashboardProfileDict[userLanguage]['EDIT_PROFILE']['TITLE']}
                  <NavLink
                    className="text-gray-500 lowercase text-right float-right w-auto"
                    to={path}>
                    <p className="font-medium text-sm md:text-base">
                      Click here to edit password
                    </p>
                  </NavLink>
                </h3>
              </div>

              <div className="h-full px-4 py-5 sm:px-6">
                <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6 text-gray-900">
                  <>
                    <div className="sm:col-span-3 p-2">
                      <FormInput
                        value={user.firstName}
                        onChange={onChange}
                        id="firstName"
                        name="firstName"
                        label={
                          dashboardProfileDict[userLanguage]['EDIT_PROFILE']['FIRST_NAME']
                        }
                        isRequired
                      />
                      {/* <label
                        htmlFor="firstName"
                        className="block text-sm font-medium leading-5 text-gray-700">
                        {dashboardProfileDict[userLanguage]['EDIT_PROFILE']['FIRST_NAME']}
                      </label>
                      <div className="mt-1  border-0 border-gray-300 py-2 px-3 rounded-md shadow-sm">
                        <input
                          id="firstName"
                          onChange={onChange}
                          type="text"
                          className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                          defaultValue={user.firstName}
                        />
                      </div> */}
                    </div>

                    <div className="sm:col-span-3 p-2">
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium leading-5 text-gray-700">
                        {dashboardProfileDict[userLanguage]['EDIT_PROFILE']['LAST_NAME']}
                      </label>
                      <div className="mt-1 border-0 border-gray-300 py-2 px-3 rounded-md shadow-sm">
                        <input
                          id="lastName"
                          onChange={onChange}
                          className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                          defaultValue={user.lastName}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3 p-2">
                      <label
                        htmlFor="preferredName"
                        className="block text-sm font-medium leading-5 text-gray-700">
                        {dashboardProfileDict[userLanguage]['EDIT_PROFILE']['NICKNAME']}
                      </label>
                      <div className="border-0 border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm">
                        <input
                          id="preferredName"
                          onChange={onChange}
                          className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                          defaultValue={user.preferredName}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3 p-2">
                      <DropdownForm
                        handleChangeLanguage={handleChangeLanguage}
                        userLanguage={user.language}
                        label={
                          dashboardProfileDict[userLanguage]['EDIT_PROFILE']['LANGUAGE']
                        }
                        items={Language}
                      />
                    </div>
                  </>
                </div>
              </div>
            </div>
          </div>

          {stdCheckpoints?.length > 0 ? (
            <div className="mt-8">
              {stdCheckpoints.map((checkpoint: any) => (
                <Fragment key={checkpoint.id}>
                  <div className="h-auto bg-white shadow-5 sm:rounded-lg mb-4 text-gray-900">
                    <div className="px-4 py-5 border-b-0 border-gray-200 sm:px-6">
                      <h3 className="text-lg leading-6 font-medium uppercase">
                        {checkpoint.title}
                      </h3>
                    </div>

                    <div className="h-full px-4 py-5 sm:px-6">
                      <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6 text-gray-900">
                        {checkpoint.questions?.items.map((item: any) => (
                          <Fragment key={item.question.id}>
                            <div className="sm:col-span-6 p-2 flex items-end">
                              <div className="flex flex-col justify-between">
                                {item.question.type === 'text' ? (
                                  <FormInput
                                    value={
                                      checkpointData[checkpoint.id]
                                        ? checkpointData[checkpoint.id][item.question.id]
                                        : ''
                                    }
                                    id={item.question.id}
                                    name=""
                                    label={item?.question?.question}
                                    onChange={(e) =>
                                      onInputChange(e, checkpoint.id, item.question.id)
                                    }
                                  />
                                ) : null}
                                {/* Will change it to text box if required. */}
                                {item.question.type === 'input' ? (
                                  <FormInput
                                    value={
                                      checkpointData[checkpoint.id]
                                        ? checkpointData[checkpoint.id][item.question.id]
                                        : ''
                                    }
                                    id={item.question.id}
                                    name=""
                                    label={item?.question?.question}
                                    onChange={(e) =>
                                      onInputChange(e, checkpoint.id, item.question.id)
                                    }
                                  />
                                ) : null}
                                {item.question.type === 'link' ? (
                                  <div className="sm:col-span-3">
                                    <label
                                      htmlFor="date picker"
                                      className="block text-m font-medium leading-5 text-gray-700">
                                      {item?.question?.question}
                                    </label>
                                    <div className="mt-1  border-0 border-gray-300 py-2 px-3 rounded-md shadow-sm">
                                      <input
                                        id={item.question.id}
                                        type="url"
                                        name="url"
                                        placeholder="https://example.com"
                                        pattern="https://.*"
                                        size={30}
                                        required
                                        value={
                                          checkpointData[checkpoint.id]
                                            ? checkpointData[checkpoint.id][
                                                item.question.id
                                              ]
                                            : ''
                                        }
                                        onChange={(e) =>
                                          onInputChange(
                                            e,
                                            checkpoint.id,
                                            item.question.id
                                          )
                                        }
                                        className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5 text-gray-900"
                                      />
                                    </div>
                                  </div>
                                ) : null}
                                {item.question.type === 'datePicker' ? (
                                  <FormInput
                                    value={
                                      checkpointData[checkpoint.id]
                                        ? checkpointData[checkpoint.id][item.question.id]
                                        : ''
                                    }
                                    id={item.question.id}
                                    name=""
                                    label={item?.question?.question}
                                    onChange={(e) =>
                                      onInputChange(e, checkpoint.id, item.question.id)
                                    }
                                  />
                                ) : null}
                                {item.question.type === 'selectOne' ? (
                                  <Fragment>
                                    <label className="block text-xs font-semibold mb-1 leading-5 text-gray-700">
                                      {item?.question?.question}
                                    </label>

                                    <Selector
                                      selectedItem={
                                        checkpointData[checkpoint.id]
                                          ? isOther(
                                              checkpointData[checkpoint.id][
                                                item.question.id
                                              ]
                                            )
                                            ? 'Other'
                                            : checkpointData[checkpoint.id][
                                                item.question.id
                                              ]
                                          : ''
                                      }
                                      placeholder=""
                                      list={convertToSelectorList(
                                        item?.question?.options
                                      )}
                                      onChange={(value, name, id) =>
                                        onSingleSelect(
                                          value,
                                          name,
                                          id,
                                          checkpoint.id,
                                          item.question.id
                                        )
                                      }
                                    />
                                    {checkpointData[checkpoint.id] &&
                                      isOther(
                                        checkpointData[checkpoint.id][item.question.id]
                                      ) && (
                                        <div className="col-span-2">
                                          <FormInput
                                            value={getValue(
                                              checkpoint.id,
                                              item.question.id
                                            )}
                                            id={item.question.id}
                                            placeHolder="Mention other"
                                            name="other"
                                            onChange={(e) => {
                                              onOtherInputChange(
                                                e,
                                                checkpoint.id,
                                                item.question.id
                                              );
                                            }}
                                          />
                                        </div>
                                      )}
                                  </Fragment>
                                ) : null}
                                {item.question.type === 'selectMany' ? (
                                  <Fragment>
                                    <label className="block text-xs font-semibold mb-1 leading-5 text-gray-700">
                                      {item?.question?.question}
                                    </label>
                                    <MultipleSelector
                                      list={convertToMultiSelectList(
                                        item?.question?.options
                                      )}
                                      selectedItems={
                                        checkpointData[checkpoint.id] &&
                                        checkpointData[checkpoint.id][item.question.id]
                                          ? selectedMultiOptions(
                                              checkpointData[checkpoint.id][
                                                item.question.id
                                              ]
                                            )
                                          : []
                                      }
                                      placeholder=""
                                      onChange={(id, name, value) =>
                                        onMultipleSelection(
                                          id,
                                          name,
                                          value,
                                          checkpoint.id,
                                          item.question.id
                                        )
                                      }
                                    />
                                  </Fragment>
                                ) : null}
                              </div>
                            </div>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                </Fragment>
              ))}
            </div>
          ) : null}

          <div className="px-4 pt-4 w-full flex justify-end">
            <div className="flex justify-center">
              <Buttons
                btnClass="py-1 px-4 text-xs mr-2"
                label={dashboardProfileDict[userLanguage]['EDIT_PROFILE']['CANCEL']}
                onClick={gobackToPreviousStep}
                transparent
              />
              <Buttons
                btnClass="py-1 px-8 text-xs ml-2"
                label={
                  loading
                    ? 'Updating...'
                    : dashboardProfileDict[userLanguage]['EDIT_PROFILE']['SAVE']
                }
                onClick={saveProfileInformation}
                disabled={loading ? true : false}
              />
            </div>
          </div>
        </form>
      </div>
    );
  }
};

export default ProfileEdit;
