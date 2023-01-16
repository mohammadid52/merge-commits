import React, {Fragment, useEffect, useState} from 'react';
// import { API, graphqlOperation } from 'aws-amplify';
import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import moment from 'moment';
import {IoLockClosed} from 'react-icons/io5';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {useHistory} from 'react-router-dom';
import {useGlobalContext} from 'contexts/GlobalContext';
import * as customMutations from 'customGraphql/customMutations';
import useDictionary from 'customHooks/dictionary';
import {convertArrayIntoObj} from 'utilities/strings';
import Buttons from 'atoms/Buttons';
import FormInput from 'atoms/Form/FormInput';
import MultipleSelector from 'atoms/Form/MultipleSelector';
import Selector from 'atoms/Form/Selector';
import TextArea from 'atoms/Form/TextArea';
import LessonLoading from '../../../Lesson/Loading/ComponentLoading';
import DropdownForm from './DropdownForm';
import {UserInfo} from './User';
import {PersonStatus} from 'API';
import ModalPopUp from '@components/Molecules/ModalPopUp';

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

interface UserInfoProps {
  instituteId?: string;
  user: UserInfo;
  status: string;
  getUserById: (id: string) => void;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  questionData: any;
  checkpoints: any;
  tab: string;
  shouldNavigate?: boolean;
  setTab: Function;
  onSuccessCallback?: () => void;
}

const UserEdit = (props: UserInfoProps) => {
  const history = useHistory();

  const {
    instituteId,
    user,
    status,
    getUserById,
    tab,
    setTab,
    shouldNavigate = true,
    checkpoints,
    questionData,
    onSuccessCallback
  } = props;
  const [superEdit, setSuperEdit] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);
  const [editUser, setEditUser] = useState(user);
  const {state, userLanguage, clientKey} = useGlobalContext();
  const [inactiveDate, setInactiveDate] = useState(
    new Date().getMonth() > 9
      ? new Date().getMonth() +
          1 +
          '/' +
          new Date().getDate() +
          '/' +
          new Date().getFullYear()
      : '0' +
          (new Date().getMonth() + 1) +
          '/' +
          new Date().getDate() +
          '/' +
          new Date().getFullYear()
  );
  const isSuperAdmin = state.user.role === 'SUP';
  const {UserEditDict, BUTTONS: ButtonDict, UserInformationDict} = useDictionary(
    clientKey
  );
  const [checkpointData, setCheckpointData] = useState<any>({});

  useEffect(() => {
    const superEditSwitch = (role: string) => {
      switch (role) {
        case 'FLW':
        case 'TR':
        case 'ADM':
        case 'SUP':
          setSuperEdit(true);
          break;
        default:
          setSuperEdit(false);
      }
    };
    if (state.user.role) {
      superEditSwitch(state.user.role);
    }
  }, [state.user.role]);

  useEffect(() => {
    setEditUser(user);
  }, [user]);

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
      ...(editUser.status === 'INACTIVE' && {
        inactiveStatusDate: moment(inactiveDate).format('YYYY-MM-DD')
      }),
      role: editUser.role,
      ...((editUser.status === 'INACTIVE' || editUser.status === 'SUSPENDED') && {
        statusReason: editUser.statusReason
      }),
      status: editUser.status,
      phone: editUser.phone,
      birthdate: editUser.birthdate,
      email: editUser.email,
      onDemand: editUser.onDemand
    };

    try {
      const update: any = await API.graphql(
        graphqlOperation(customMutations.updatePerson, {input: input})
      );
      setUpdating(false);
      // setStatus('loading');

      if (shouldNavigate) {
        history.push(
          isSuperAdmin
            ? `/dashboard/manage-institutions/manage-users`
            : `/dashboard/manage-institutions/institution/${instituteId}/manage-users`
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  const extractItemFromArray = (responseArray: any[]) => {
    const answerArray: any = responseArray.map((item: any) => ({
      [item['qid']]:
        item?.response?.length > 1
          ? [...selectedMultiOptions(item.response)]
          : item?.response?.join('')
    }));
    return convertArrayIntoObj(answerArray);
  };

  useEffect(() => {
    if (questionData?.length > 0) {
      const updatedListArray: any = questionData.map((item: any) => ({
        [item['checkpointID']]: extractItemFromArray(item.responseObject)
      }));
      const updatedListObj: any = convertArrayIntoObj(updatedListArray);
      setCheckpointData({
        ...updatedListObj
      });
    }
  }, [questionData]);

  const updateQuestionData = async (responseObj: any, checkpointID: string) => {
    try {
      // Code for Other Field

      const val = responseObj.responseObject.map((resp: any) => {
        if (hasOther(resp.response, 'Other')) {
          return {
            ...resp,
            response: checkpointData[checkpointID][resp.qid],
            otherResponse: checkpointData[checkpointID][resp.qid]
              .toString()
              .split(' || ')[1]
          };
        } else {
          return {...resp};
        }
      });

      const modifiedResponseObj = {...responseObj, responseObject: val};
      // Ends here

      // if wants to quick revert - change {input:modifiedResponseObj} value to {input:responseObj}
      const questionData = await API.graphql(
        graphqlOperation(customMutations.updateQuestionData, {input: modifiedResponseObj})
      );
      console.log('Question data updated');
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
      responseObject: questions
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

  const getQuestionArray = (obj: any) => {
    const keys: any = Object.keys(obj);
    return keys.map((item: any) => ({
      qid: item,
      response:
        typeof obj[item] === 'string'
          ? [obj[item]]
          : [...obj[item].map((op: any) => op.name)]
    }));
  };

  const savePersonCheckpointData = async (checkpointId: string, questions: any[]) => {
    let responseObject = {
      syllabusLessonID: '999999', //Dummy syllabus id since it's required, at least for now.
      checkpointID: checkpointId,
      authID: editUser.authId,
      email: editUser.email,
      responseObject: questions
    };
    createQuestionData(responseObject);
  };

  const saveAllCheckpointData = async () => {
    const checkpId = Object.keys(checkpointData);
    const allCheckpoints = checkpId.map((itemID) => ({
      checkpointId: itemID,
      questions: checkpointData ? getQuestionArray(checkpointData[itemID]) : []
    }));
    if (questionData?.length === 0) {
      let checkpoints = Promise.all(
        allCheckpoints.map(async (item: any) =>
          savePersonCheckpointData(item.checkpointId, item.questions)
        )
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

  async function setPerson() {
    setUpdating(true);
    await saveAllCheckpointData();
    await updatePerson();
    await getUserById(editUser.id);
    onSuccessCallback && onSuccessCallback();
  }

  const onSubmit = () => {
    setPerson();
    // e.preventDefault();
  };

  const onChange = (e: any) => {
    const {id, value} = e.target;
    setEditUser(() => {
      return {
        ...editUser,
        [id]: value
      };
    });
  };

  const onInputChange = (e: any, checkpointID: string, questionID: string) => {
    setCheckpointData({
      ...checkpointData,
      [checkpointID]: {
        ...checkpointData[checkpointID],
        [questionID]: e.target.value
      }
    });
  };

  const onOtherInputChange = (e: any, checkpointID: string, questionID: string) => {
    setCheckpointData({
      ...checkpointData,
      [checkpointID]: {
        ...checkpointData[checkpointID],
        [questionID]: `Other || ${e.target.value}`
      }
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
            [questionID]: []
          }
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
          [questionID]: [...updatedList]
        }
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
              value
            }
          ]
        }
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
        [questionID]: name
      }
    });
  };

  const handleChangeStatus = (item: {name: string; code: PersonStatus}) => {
    setEditUser(() => {
      return {
        ...editUser,
        status: item.code
      };
    });
    closeModal();
  };

  const [warnModal, setWarnModal] = useState({
    show: false,
    message: 'message',
    onSaveAction: () => {}
  });

  const closeModal = () => {
    setWarnModal({show: false, message: '', onSaveAction: () => {}});
  };

  const beforeStatusChange = (item: {name: string; code: PersonStatus}) => {
    if (item.name === PersonStatus.INACTIVE) {
      setWarnModal({
        show: true,
        message:
          'By setting this student to inactive, students will no longer see any courses when they log in (they will continue to have access to their notebooks). Do you wish to continue?',
        onSaveAction: () => handleChangeStatus(item)
      });
    } else {
      handleChangeStatus(item);
    }
  };

  const handleChangeRole = (item: {name: string; code: string}) => {
    setEditUser(() => {
      return {
        ...editUser,
        role: item.code
      };
    });
  };

  const handleChangeOnDemand = (item: {name: string; code: boolean}) => {
    setEditUser(() => {
      return {
        ...editUser,
        onDemand: item.code
      };
    });
  };

  const Status = [
    {
      code: 'ACTIVE',
      name: 'ACTIVE'
    },
    {
      code: 'SUSPENDED',
      name: 'SUSPENDED'
    },
    {
      code: 'INACTIVE',
      name: 'INACTIVE'
    },
    {
      code: 'TRAINING',
      name: 'TRAINING'
    }
    // {
    //   code: 'HOLD',
    //   name: 'Hold',
    // },
  ];

  const Role = [
    state.user.role === 'SUP' && {
      code: 'SUP',
      name: 'Super Admin'
    },
    {
      code: 'ADM',
      name: 'Admin'
    },
    {
      code: 'BLD',
      name: 'Builder'
    },
    {
      code: 'FLW',
      name: 'Fellow'
    },
    {
      code: 'CRD',
      name: 'Coordinator'
    },
    {
      code: 'TR',
      name: 'Teacher'
    }
  ].filter(Boolean);

  const OnDemand = [
    {
      code: false,
      name: 'No'
    },
    {
      code: true,
      name: 'Yes'
    }
  ];

  const convertToSelectorList = (options: any) => {
    const newArr: any = options.map((item: any, index: number) => ({
      id: index,
      name: item.text,
      value: item.text
    }));
    return newArr;
  };
  const convertToMultiSelectList = (options: any) => {
    const newArr: any = options.map((item: any, index: number) => ({
      id: index.toString(),
      name: item.text,
      value: item.text
    }));
    return newArr;
  };

  // key:31

  // -----

  const selectedMultiOptions = (options: any[]) => {
    if (typeof options === 'string') {
      return [{id: '0', name: options, value: options}];
    }
    if (options && typeof options[0] === 'string') {
      const newArr: any = options?.map((option: any, index: number) => ({
        id: index.toString(),
        name: option,
        value: option
      }));
      return [...newArr];
    } else {
      return [...options];
    }
  };

  if (status !== 'done') {
    return <LessonLoading />;
  }

  // Code for Other Field

  const hasOther = (val: string | string[], other: string) => {
    return val ? val.toString().includes(other) : false;
  };

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

  const onDateChange = (e: any) => {
    e.persist();
    setInactiveDate(e.target.value);
    let result = moment(e.target.value, 'MM/DD/YYYY', true).isValid();
    if (result) {
      setEditUser(() => {
        return {
          ...editUser,
          inactiveStatusDate: e.target.value
        };
      });
    }
  };

  const onStatusReasonChange = (e: any) => {
    e.persist();
    setEditUser(() => {
      return {
        ...editUser,
        statusReason: e.target.value
      };
    });
  };

  return (
    <>
      <div className="h-full w-3/4 md:px-2 pt-2">
        <form>
          <div className="h-full border-l-0 border-gray-200 bg-white mb-4">
            <div className="border-b-0 border-gray-200">
              <nav
                className="-mb-px flex space-x-8 overflow-x-auto custom-scrollbar"
                aria-label="Tabs">
                <a
                  onClick={() => setTab('p')}
                  key="personal_information"
                  className={classNames(
                    tab === 'p'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent  cursor-pointer text-gray-500 hover:text-gray-700 hover:border-gray-200',
                    'whitespace-nowrap justify-center flex py-4 px-1 border-b-2 font-medium text-sm'
                  )}>
                  {UserEditDict[userLanguage]['heading']}
                </a>
                <a
                  onClick={() => setTab('demographics')}
                  key="demographics"
                  className={`${
                    tab === 'demographics'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
                  } whitespace-nowrap flex justify-center cursor-pointer py-4 px-1 border-b-2 font-medium text-sm`}>
                  {UserInformationDict[userLanguage]['demographics']}
                </a>
                <a
                  onClick={() => setTab('private')}
                  key="private"
                  className={`${
                    tab === 'private'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
                  } whitespace-nowrap flex justify-center cursor-pointer py-4 px-1 border-b-2 font-medium text-sm`}>
                  {UserInformationDict[userLanguage]['private']}
                  <IconContext.Provider
                    value={{
                      size: '0.8rem',
                      className: `
                      ${
                        tab === 'private'
                          ? 'text-indigo-500'
                          : 'text-gray-400 group-hover:text-gray-500'
                      }
                      ml-2 h-5 w-5
                    `
                    }}>
                    <IoLockClosed />
                  </IconContext.Provider>
                </a>
              </nav>
            </div>

            <div className="h-full px-4 py-5 sm:px-6">
              {tab === 'p' && (
                <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6 text-gray-900">
                  <div className="sm:col-span-3 p-2">
                    <FormInput
                      value={editUser.firstName}
                      id={'firstName'}
                      label={UserEditDict[userLanguage]['firstname']}
                      placeHolder=""
                      name="firstName"
                      onChange={onChange}
                    />
                  </div>

                  <div className="sm:col-span-3 p-2">
                    <FormInput
                      value={editUser.lastName}
                      id={'lastName'}
                      label={UserEditDict[userLanguage]['lastname']}
                      placeHolder=""
                      name="lastName"
                      onChange={onChange}
                    />
                  </div>

                  <div className="sm:col-span-3 p-2">
                    <FormInput
                      value={editUser.preferredName}
                      id={'preferredName'}
                      label={UserEditDict[userLanguage]['nickname']}
                      placeHolder=""
                      name="preferredName"
                      onChange={onChange}
                    />
                  </div>

                  <div className="sm:col-span-3 p-2">
                    <DropdownForm
                      value=""
                      style={false}
                      handleChange={beforeStatusChange}
                      userInfo={editUser.status}
                      label={UserEditDict[userLanguage]['status']}
                      id="status"
                      isRequired
                      items={Status}
                    />
                  </div>

                  <div className="sm:col-span-3 p-2">
                    <DropdownForm
                      value=""
                      style={false}
                      handleChange={handleChangeRole}
                      userInfo={editUser.role}
                      label={UserEditDict[userLanguage]['role']}
                      listClassName="h-28"
                      id="role"
                      isRequired
                      items={Role}
                    />
                  </div>

                  {superEdit && user.role === 'ST' && (
                    <div className="sm:col-span-3 p-2">
                      <DropdownForm
                        dataCy="ondemand"
                        value=""
                        style={false}
                        handleChange={handleChangeOnDemand}
                        userInfo={editUser?.onDemand ? 'Yes' : 'No'}
                        label={UserEditDict[userLanguage]['ondemand']}
                        id="ondemand"
                        isRequired
                        items={OnDemand}
                      />
                    </div>
                  )}
                  {(editUser.status === 'SUSPENDED' ||
                    editUser.status === 'INACTIVE') && (
                    <>
                      <div className="sm:col-span-3 p-2">
                        <FormInput
                          value={inactiveDate}
                          id={'inactive_date'}
                          label={UserEditDict[userLanguage]['inactive_date']}
                          placeHolder="MM/DD/YYYY"
                          name="inactive_date"
                          onChange={onDateChange}
                        />
                      </div>
                      <div className="sm:col-span-3 p-2">
                        <TextArea
                          value={editUser.statusReason}
                          id="statusReason"
                          onChange={onStatusReasonChange}
                          name="statusReason"
                          label={UserEditDict[userLanguage]['status_reason']}
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
              {tab !== 'p' && checkpoints.length > 0 && (
                <div className="text-gray-900">
                  {checkpoints.map((checkpoint: any) => (
                    <Fragment key={`checkpoint_${checkpoint.id}`}>
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
                                            ? checkpointData[checkpoint.id][
                                                item.question.id
                                              ]
                                            : ''
                                        }
                                        id={item.question.id}
                                        name=""
                                        label={item?.question?.question}
                                        onChange={(e) =>
                                          onInputChange(
                                            e,
                                            checkpoint.id,
                                            item.question.id
                                          )
                                        }
                                      />
                                    ) : null}
                                    {/* Will change it to text box if required. */}
                                    {item.question.type === 'input' ? (
                                      <FormInput
                                        value={
                                          checkpointData[checkpoint.id]
                                            ? checkpointData[checkpoint.id][
                                                item.question.id
                                              ]
                                            : ''
                                        }
                                        id={item.question.id}
                                        name=""
                                        label={item?.question?.question}
                                        onChange={(e) =>
                                          onInputChange(
                                            e,
                                            checkpoint.id,
                                            item.question.id
                                          )
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
                                            ? checkpointData[checkpoint.id][
                                                item.question.id
                                              ]
                                            : ''
                                        }
                                        id={item.question.id}
                                        name=""
                                        label={item?.question?.question}
                                        onChange={(e) =>
                                          onInputChange(
                                            e,
                                            checkpoint.id,
                                            item.question.id
                                          )
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
                                            checkpointData[checkpoint.id][
                                              item.question.id
                                            ]
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
                                            checkpointData[checkpoint.id][
                                              item.question.id
                                            ]
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
              )}
            </div>
          </div>

          <div className="px-4 pt-4 w-full flex justify-end">
            <Buttons
              btnClass="py-2 w-2.5/10 px-4 text-xs mr-2"
              label={UserEditDict[userLanguage]['button']['cancel']}
              onClick={history.goBack}
              transparent
            />
            <Buttons
              dataCy="edit-user-save-button"
              disabled={updating}
              btnClass="py-2 w-2.5/10 px-4 text-xs ml-2"
              label={
                updating
                  ? ButtonDict['SAVING']
                  : UserEditDict[userLanguage]['button']['save']
              }
              onClick={onSubmit}
            />
          </div>
        </form>
      </div>
      {warnModal.show && (
        <ModalPopUp
          closeAction={closeModal}
          saveAction={warnModal.onSaveAction}
          saveLabel="Yes"
          message={warnModal.message}
        />
      )}
    </>
  );
};

export default UserEdit;
