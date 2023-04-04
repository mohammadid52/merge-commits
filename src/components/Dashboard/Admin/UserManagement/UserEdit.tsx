import CheckBox from '@components/Atoms/Form/CheckBox';
import DemographicsEdit from '@components/Dashboard/Demographics/DemographicsEdit';
import ModalPopUp from '@components/Molecules/ModalPopUp';
import {Tabs, TabsProps} from 'antd';
import {PersonStatus} from 'API';
import Buttons from 'atoms/Buttons';
import FormInput from 'atoms/Form/FormInput';
import Selector from 'atoms/Form/Selector';
import TextArea from 'atoms/Form/TextArea';
import {API, graphqlOperation} from 'aws-amplify';
import {useGlobalContext} from 'contexts/GlobalContext';
import * as customMutations from 'customGraphql/customMutations';
import useDictionary from 'customHooks/dictionary';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {convertArrayIntoObj, getUserRoleString} from 'utilities/strings';
import LessonLoading from '../../../Lesson/Loading/ComponentLoading';
import {UserInfo} from './User';

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
  setIsEditMode?: any;
}

const UserEdit = (props: UserInfoProps) => {
  const history = useHistory();

  const {
    instituteId,
    user,
    status,
    getUserById,

    shouldNavigate = true,
    checkpoints,
    questionData,
    setIsEditMode,
    onSuccessCallback
  } = props;
  const [superEdit, setSuperEdit] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);
  const [editUser, setEditUser] = useState(user);
  const {state, checkIfAdmin, userLanguage} = useGlobalContext();
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
  const {UserEditDict, BUTTONS: ButtonDict, UserInformationDict} = useDictionary();
  const [checkpointData, setCheckpointData] = useState<any>({});

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

  useEffect(() => {
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

      image: editUser.image,
      language: editUser.language,
      lastName: editUser.lastName,
      preferredName: editUser.preferredName,
      ...(editUser.status === 'INACTIVE' && {
        inactiveStatusDate: moment(inactiveDate).format('YYYY-MM-DD')
      }),
      role: editUser.role,
      ...(editUser.status === 'INACTIVE' && {
        statusReason: editUser.statusReason
      }),
      status: editUser.status,

      email: editUser.email,
      onDemand: editUser.onDemand,
      isZoiq: editUser.isZoiq
    };

    try {
      await API.graphql(graphqlOperation(customMutations.updatePerson, {input: input}));
      setUpdating(false);

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
      await API.graphql(
        graphqlOperation(customMutations.updateQuestionData, {
          input: modifiedResponseObj
        })
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
      await API.graphql(
        graphqlOperation(customMutations.createQuestionData, {
          input: responseObj
        })
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
      Promise.all(
        allCheckpoints.map(async (item: any) =>
          savePersonCheckpointData(item.checkpointId, item.questions)
        )
      );
    } else {
      Promise.all(
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
    getUserById(editUser.id);
    onSuccessCallback?.();
  }

  const onSubmit = () => {
    setPerson();
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

  const handleChangeStatus = (value: string) => {
    setEditUser(() => {
      return {
        ...editUser,
        status: value as PersonStatus
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

  const beforeStatusChange = (value: string) => {
    if (value === PersonStatus.INACTIVE) {
      setWarnModal({
        show: true,
        message:
          'By setting this student to inactive, students will no longer see any courses when they log in (they will continue to have access to their notebooks). Do you wish to continue?',
        onSaveAction: () => handleChangeStatus(value)
      });
    } else {
      handleChangeStatus(value);
    }
  };

  const handleChangeRole = (value: string) => {
    setEditUser(() => {
      return {
        ...editUser,
        role: value
      };
    });
  };

  const handleChangeOnDemand = (item: {label: string; value: boolean}) => {
    setEditUser(() => {
      return {
        ...editUser,
        onDemand: item.value
      };
    });
  };

  const Status = [
    {
      label: 'ACTIVE',
      value: 'ACTIVE'
    },

    {
      label: 'INACTIVE',
      value: 'INACTIVE'
    },
    {
      label: 'TRAINING',
      value: 'TRAINING'
    }
    // {
    //   code: 'HOLD',
    //   name: 'Hold',
    // },
  ];

  const Role = [
    state.user.role === 'SUP' && {
      label: 'SUP',
      value: 'Super Admin'
    },
    {
      label: 'ADM',
      value: 'Admin'
    },
    {
      label: 'BLD',
      value: 'Builder'
    },
    {
      label: 'FLW',
      value: 'Fellow'
    },

    {
      label: 'TR',
      value: 'Teacher'
    }
  ].filter(Boolean);

  const OnDemand = [
    {
      value: false,
      label: 'No'
    },
    {
      value: true,
      label: 'Yes'
    }
  ];

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

  const items: TabsProps['items'] = [
    {
      label: UserEditDict[userLanguage]['heading'],
      key: '1',
      children: (
        <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6 text-darkest">
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
            <Selector
              selectedItem={editUser.status}
              placeholder={UserEditDict[userLanguage]['status']}
              list={Status}
              onChange={beforeStatusChange}
              label={UserEditDict[userLanguage]['status']}
            />
          </div>

          <div className="sm:col-span-3 p-2">
            <Selector
              selectedItem={getUserRoleString(editUser.role)}
              placeholder={UserEditDict[userLanguage]['role']}
              list={Role as any[]}
              onChange={handleChangeRole}
              label={UserEditDict[userLanguage]['role']}
            />
          </div>

          {superEdit && user.role === 'ST' && (
            <div className="sm:col-span-3 p-2">
              <Selector
                placeholder="Select on demand"
                label="On Demand"
                selectedItem={editUser?.onDemand ? 'Yes' : 'No'}
                onChange={(_: string, option: any) => handleChangeOnDemand(option)}
                isRequired
                list={OnDemand}
              />
            </div>
          )}
          {editUser.status === 'INACTIVE' && (
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

          {checkIfAdmin() && (
            <CheckBox
              dataCy="isZoiq"
              label={'ZOIQ'}
              className="group:hover:bg-medium "
              value={Boolean(editUser.isZoiq)}
              onChange={(e) => setEditUser({...editUser, isZoiq: e.target.checked})}
              name="isZoiq"
            />
          )}
        </div>
      )
    },
    {
      label: UserInformationDict[userLanguage]['demographics'],
      key: '2',
      children: (
        <DemographicsEdit
          setCheckpointData={setCheckpointData}
          checkpointData={checkpointData}
          stdCheckpoints={checkpoints}
        />
      )
    }
  ];

  return (
    <>
      <div className="h-full w-full">
        <Tabs items={items} tabPosition="right" animated defaultActiveKey="1" />

        <div className="px-4 pt-4 w-full gap-4 flex justify-end">
          <Buttons
            label={UserEditDict[userLanguage]['button']['cancel']}
            onClick={() => {
              setIsEditMode && setIsEditMode(false);
              // history.goBack();
            }}
            transparent
          />
          <Buttons
            dataCy="edit-user-save-button"
            disabled={updating}
            label={
              updating
                ? ButtonDict[userLanguage]['SAVING']
                : UserEditDict[userLanguage]['button']['save']
            }
            onClick={onSubmit}
          />
        </div>
      </div>

      <ModalPopUp
        open={warnModal.show}
        closeAction={closeModal}
        saveAction={warnModal.onSaveAction}
        saveLabel="Yes"
        message={warnModal.message}
      />
    </>
  );
};

export default UserEdit;
