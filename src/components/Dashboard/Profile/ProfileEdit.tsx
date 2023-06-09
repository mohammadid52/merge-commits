import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';

import useAuth from '@customHooks/useAuth';
import {Language} from 'API';
import {Tabs, TabsProps} from 'antd';
import Buttons from 'atoms/Buttons';
import FormInput from 'atoms/Form/FormInput';
import Selector from 'atoms/Form/Selector';
import {useGlobalContext} from 'contexts/GlobalContext';
import {
  createQuestionData,
  updatePerson,
  updateQuestionData
} from 'customGraphql/customMutations';
import useDictionary from 'customHooks/dictionary';
import {languageList} from 'utilities/staticData';
import {convertArrayIntoObj} from 'utilities/strings';
import LessonLoading from '../../Lesson/Loading/ComponentLoading';
import {UserInfo} from '../Admin/UserManagement/User';
import DemographicsEdit, {selectedMultiOptions} from '../Demographics/DemographicsEdit';

// Code for Other Field
const hasOther = (val: string | string[], other: string) => {
  try {
    return val ? val.toString().includes(other) : false;
  } catch (err) {
    console.log('errrr', err);
    return false;
  }
};

const updateQuestionDataFn = async (
  responseObj: any,
  checkpointID: string,
  checkpointData: any
) => {
  const val = responseObj.responseObject.map((resp: any) => {
    if (hasOther(resp.response, 'Other')) {
      return {
        ...resp,
        response: checkpointData[checkpointID][resp.qid],
        otherResponse: checkpointData[checkpointID][resp.qid].toString().split(' || ')[1]
      };
    } else {
      return {...resp};
    }
  });

  const modifiedResponseObj = {...responseObj, responseObject: val};

  try {
    await API.graphql(
      graphqlOperation(updateQuestionData, {
        input: modifiedResponseObj
      })
    );
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

const updatePersonCheckpointData = async (
  questionDataId: string,
  questions: any[],
  checkpointID: string,
  checkpointData: any
) => {
  let responseObject = {
    id: questionDataId,
    responseObject: questions
  };
  updateQuestionDataFn(responseObject, checkpointID, checkpointData);
};

const createQuestionDataFn = async (responseObj: any) => {
  try {
    await API.graphql(
      graphqlOperation(createQuestionData, {
        input: responseObj
      })
    );
    console.log('Question data updated');
  } catch (err) {
    console.error(err);
  }
};

const savePersonCheckpointData = async (
  checkpointId: string,
  questions: any[],
  auth: {authId: string; email: string}
) => {
  let responseObject = {
    syllabusLessonID: '999999', //Dummy syllabus id since it's required, at least for now.
    checkpointID: checkpointId,
    authID: auth.authId,
    email: auth.email,
    responseObject: questions
  };
  createQuestionDataFn(responseObject);
};

export const saveAllCheckpointData = async (
  questionData: any[],
  checkpointData: any,
  auth: {authId: string; email: string}
) => {
  // setLoading(true);
  const checkpId = Object.keys(checkpointData);
  const allCheckpoints = checkpId.map((itemID) => ({
    checkpointId: itemID,
    questions: checkpointData ? getQuestionArray(checkpointData[itemID]) : []
  }));
  if (questionData?.length === 0) {
    Promise.all(
      allCheckpoints.map(async (item: any) => {
        return savePersonCheckpointData(item.checkpointId, item.questions, auth);
      })
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
            item.checkpointId,
            checkpointData
          );
        } else {
          return savePersonCheckpointData(item.checkpointId, item.questions, auth);
        }
      })
    );
  }
};

export const extractItemFromArray = (responceArray: any[]) => {
  const answerArray: any = responceArray.map((item: any) => {
    return {
      [item['qid']]:
        item?.response?.length > 1
          ? [...selectedMultiOptions(item.response)]
          : item?.response.toString()
    };
  });
  return convertArrayIntoObj(answerArray);
};

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
  const {userLanguage} = useGlobalContext();
  const {dashboardProfileDict, UserEditDict, UserInformationDict} = useDictionary();
  const {user, getUser, status, setStatus, stdCheckpoints, questionData} = props;

  const [editUser, setEditUser] = useState(user);
  const [loading, setLoading] = useState(false);
  const [checkpointData, setCheckpointData] = useState<any>({});

  const gobackToPreviousStep = () => {
    history.push('/dashboard/profile');
  };

  const {setUser} = useAuth();

  async function updatePersonFn() {
    const input = {
      id: editUser.id,
      authId: editUser.authId,
      firstName: editUser.firstName,

      image: editUser.image,
      language: editUser.language,
      lastName: editUser.lastName,
      preferredName: editUser.preferredName,
      role: editUser.role,
      status: editUser.status,

      email: editUser.email
    };

    try {
      const update: any = await API.graphql(
        graphqlOperation(updatePerson, {input: input})
      );
      setEditUser(update.data.updatePerson);
      setStatus('loading');

      setUser({...editUser});

      gobackToPreviousStep();
    } catch (error) {
      console.error(error);
    }
  }

  async function saveProfileInformation() {
    setLoading(true);
    saveAllCheckpointData(questionData, checkpointData, {
      authId: editUser.authId,
      email: editUser.email
    });
    await updatePersonFn();
    getUser();
    setLoading(false);
  }

  const onChange = (e: any) => {
    const {id, value} = e.target;

    setEditUser({
      ...editUser,
      [id]: value
    });
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

  if (status !== 'done') {
    return <LessonLoading />;
  }

  const dictionary = dashboardProfileDict[userLanguage]['EDIT_PROFILE'];

  const items: TabsProps['items'] = [
    {
      label: UserEditDict[userLanguage]['heading'],
      key: '1',
      children: (
        <div className="h-full px-4 py-5 sm:px-6">
          <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6 text-darkest">
            <>
              <div className="sm:col-span-3 p-2">
                <FormInput
                  id="firstName"
                  value={editUser.firstName}
                  name="firstName"
                  onChange={onChange}
                  label={dictionary['FIRST_NAME']}
                />
              </div>

              <div className="sm:col-span-3 p-2">
                <FormInput
                  id="lastName"
                  value={editUser.lastName}
                  onChange={onChange}
                  label={dictionary['LAST_NAME']}
                />
              </div>

              <div className="sm:col-span-3 p-2">
                <FormInput
                  id="preferredName"
                  value={editUser?.preferredName || ''}
                  onChange={onChange}
                  label={dictionary['NICKNAME']}
                />
              </div>

              <div className="sm:col-span-3 p-2">
                <Selector
                  placeholder="Select Language"
                  list={languageList}
                  width="100%"
                  onChange={(value) =>
                    setEditUser({...editUser, language: value as Language})
                  }
                  label={dictionary['LANGUAGE']}
                  selectedItem={editUser.language === 'EN' ? 'English' : 'Spanish'}
                />
              </div>
            </>
          </div>
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
          stdCheckpoints={stdCheckpoints}
        />
      )
    }
  ];

  {
    return (
      <div className="h-full w-full md:px-4 pt-4">
        <form>
          <Tabs items={items} animated defaultActiveKey="1" />

          <div className="px-4 pt-4 w-full flex justify-end">
            <div className="flex justify-center gap-4">
              <Buttons
                label={dashboardProfileDict[userLanguage]['EDIT_PROFILE']['CANCEL']}
                onClick={gobackToPreviousStep}
                transparent
              />
              <Buttons
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
