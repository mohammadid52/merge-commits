import {API, graphqlOperation} from 'aws-amplify';
import axios from 'axios';
import {useEffect, useState} from 'react';

import Buttons from 'atoms/Buttons';
import FormInput from 'atoms/Form/FormInput';
import Selector from 'atoms/Form/Selector';

import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import {createUserUrl} from 'utilities/urls';

import useGraphqlMutation from '@customHooks/useGraphqlMutation';
import {withZoiqFilter} from '@utilities/functions';
import {statusList} from '@utilities/staticData';
import {getReverseUserRoleString, getUserRoleString} from '@utilities/strings';
import {
  CreateClassStudentInput,
  CreatePersonInput,
  CreatePersonMutation,
  CreateStaffInput,
  Language,
  PersonStatus,
  Role
} from 'API';
import {UserRegisterSchema} from 'Schema';
import {Checkbox, Divider, message} from 'antd';
import {NoticeType} from 'antd/es/message/interface';
import {listRooms} from 'customGraphql/customQueries';
import {useFormik} from 'formik';
import PageLayout from 'layout/PageLayout';
import {createClassStudent, createPerson, createStaff} from '@graphql/mutations';

const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  role: Role.ST,
  isZoiq: false,
  isSelfPaced: true,
  status: PersonStatus.ACTIVE,
  class: {
    id: '',
    name: '',
    roomId: ''
  }
};

interface DynamicWrapperProps {
  children: React.ReactNode;
  isInModalPopup: boolean;
  title?: string;
}

const DynamicWrapper = ({children, isInModalPopup, title}: DynamicWrapperProps) => {
  if (!isInModalPopup) {
    return (
      <PageLayout
        type={isInModalPopup ? 'inner' : undefined}
        hideInstProfile={isInModalPopup}
        hideGoBack={isInModalPopup}
        title={isInModalPopup ? null : title}>
        {children}
      </PageLayout>
    );
  } else {
    return (
      <div>
        <Divider />
        {children}
      </div>
    );
  }
};

const Registration = ({
  classData,

  instId,
  isInModalPopup = false,
  postMutation
}: any) => {
  const {classId} = classData || {};

  const [instClasses, setInstClasses] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  const {state, userLanguage, zoiqFilter, checkIfAdmin} = useGlobalContext();
  const {RegistrationDict} = useDictionary();

  const messageDict = RegistrationDict[userLanguage]['messages'];
  const rolesDict = RegistrationDict[userLanguage]['roles'];

  const Roles = [
    state.user.role === Role.SUP && {
      label: Role.SUP,
      id: 1,
      value: rolesDict['sup']
    },
    (state.user.role === Role.SUP || state.user.role === Role.ADM) && {
      label: Role.ADM,
      id: 2,
      value: rolesDict['adm']
    },
    {label: Role.BLD, id: 3, value: rolesDict['bld']},
    {label: Role.FLW, id: 4, value: rolesDict['flw']},
    {label: Role.TR, id: 6, value: rolesDict['tr']},
    (!isInModalPopup || (isInModalPopup && classId)) &&
      state.user.role !== Role.BLD && {
        label: Role.ST,
        id: 7,
        value: rolesDict['st']
      }
  ].filter(Boolean);

  useEffect(() => {
    if (classId) {
      setFieldValue('class', {
        id: classId,
        name: classData.name,
        roomId: classData.roomId
      });
    }
  }, [classId]);

  const handleMessage = (type: NoticeType, text: string) => {
    messageApi.open({
      content: text,
      type: type
    });
  };

  // mutation for creating a new user
  const createPersonMutation = useGraphqlMutation<
    {input: CreatePersonInput},
    CreatePersonMutation['createPerson']
  >(createPerson);

  // mutation for creating a new staff user
  const createStaffMutation = useGraphqlMutation<{input: CreateStaffInput}, any>(
    createStaff
  );

  // mutation for creating a new class student
  const createClassStudentMutation = useGraphqlMutation<
    {input: CreateClassStudentInput},
    any
  >(createClassStudent);

  async function registerUser(authId: string) {
    const {role, email, status} = values;
    let userData: CreatePersonInput = {
      authId: authId,
      status: values.status.toLocaleUpperCase() as PersonStatus,
      role: role,
      email,
      firstName: values.firstName,
      lastName: values.lastName,
      language: Language.EN,
      onDemand: role === Role.ST ? values.isSelfPaced : false,
      addedby: state.user.authId,
      isZoiq: values.isZoiq
    };

    try {
      const person: any = await createPersonMutation.mutate({
        input: userData
      });

      if (role !== Role.ST) {
        const input: CreateStaffInput = {
          institutionID: instId,
          staffAuthID: authId,
          staffEmail: email,
          status: PersonStatus.ACTIVE,
          statusChangeDate: new Date().toISOString().split('T')[0]
        };

        createStaffMutation.mutate({input});
      } else {
        if (values.class.id) {
          // add the student in the class
          // need to get the user id from new person object

          if (person) {
            const input: CreateClassStudentInput = {
              classID: values.class.id,
              studentID: person?.id,
              studentAuthID: authId,
              studentEmail: email,
              status: status.toUpperCase()
            };
            createClassStudentMutation.mutate({input});
          }
        }
      }

      handleMessage('success', 'User registered successfully');

      if (isInModalPopup) {
        postMutation();
      }
      resetForm();
    } catch (error) {
      console.error('error registering user:', error);
      handleMessage('error', error.message);
    }
  }

  async function signUp() {
    let username = values.email;
    try {
      setIsLoading(true);

      const response = await axios.post(createUserUrl, {email: username});
      const user = response.data.User;

      registerUser(user.Username);
    } catch (error) {
      const er = error.response.data;
      console.error('error signing up:', error);

      if (er.code === 'UsernameExistsException') {
        setFieldError('email', messageDict['existemail']);
      } else {
        handleMessage('error', er.message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  const listAllRooms = async (outArray: any[], nextToken = null): Promise<any> => {
    let combined;
    try {
      const result: any = await API.graphql(
        graphqlOperation(listRooms, {
          filter: withZoiqFilter({}, zoiqFilter),
          nextToken: nextToken
        })
      );
      let returnedData = result.data.listRooms?.items;
      let NextToken = result.data.listRooms?.nextToken;

      combined = [...outArray, ...returnedData];

      if (NextToken) {
        combined = await listAllRooms(combined, NextToken);
      }
      setInstClasses(
        combined.map((d: any) => ({...d, label: d?.name, value: d.classID, roomId: d.id}))
      );

      return combined;
    } catch (error) {
      console.error(
        '🚀 ~ file: AnalyticsDashboard.tsx ~ line 24 ~ listAllClasses ~ error',
        error
      );
    }
  };

  // * Formik setup

  const {
    values,
    errors,
    setFieldError,
    handleSubmit,
    handleChange,
    setFieldValue,
    resetForm
  } = useFormik({
    initialValues: initialValues,
    validateOnBlur: false,
    validateOnChange: false,

    validationSchema: UserRegisterSchema,
    onSubmit: async () => {
      await signUp();
    }
  });

  useEffect(() => {
    values.role === 'ST' && listAllRooms([]);
  }, [values.role]);

  return (
    <DynamicWrapper
      isInModalPopup={isInModalPopup}
      title={RegistrationDict[userLanguage]['title']}>
      {contextHolder}
      <form onSubmit={handleSubmit} className={` w-full flex flex-col`}>
        <div className="w-full md:flex flex-col mb-0">
          <div
            className={`h-full grid grid-cols-1 gap-4 ${
              isInModalPopup ? ' sm:grid-cols-2' : ' sm:grid-cols-3'
            }`}>
            <FormInput
              label={RegistrationDict[userLanguage]['firstname']}
              isRequired
              id="firstName"
              name="firstName"
              value={values.firstName}
              error={errors.firstName}
              onChange={handleChange}
              placeHolder={RegistrationDict[userLanguage]['firstplaceholder']}
            />

            <FormInput
              id="lastName"
              isRequired
              error={errors.lastName}
              label={RegistrationDict[userLanguage]['lastname']}
              name="lastName"
              onChange={handleChange}
              value={values.lastName}
              placeHolder={RegistrationDict[userLanguage]['lastplaceholder']}
            />

            <FormInput
              label={RegistrationDict[userLanguage]['email']}
              isRequired
              type="email"
              id="email"
              name="email"
              value={values.email}
              error={errors.email}
              onChange={handleChange}
              placeHolder={RegistrationDict[userLanguage]['emailplaceholder']}
            />

            {!classId && (
              <Selector
                placeholder="Select role"
                onChange={(name: any) =>
                  setFieldValue('role', getReverseUserRoleString(name))
                }
                label={RegistrationDict[userLanguage]['role']}
                error={errors.role}
                list={Roles}
                selectedItem={getUserRoleString(values.role)}
              />
            )}

            {values.role && values.role === Role.ST && instId && (
              <>
                {!classId && (
                  <Selector
                    label={RegistrationDict[userLanguage]['class']}
                    selectedItem={values.class.name}
                    list={instClasses}
                    placeholder={'Select a class'}
                    onChange={(value: any, option: any) =>
                      setFieldValue('class', {
                        id: value,
                        name: value,
                        roomId: option.id
                      })
                    }
                  />
                )}

                <Selector
                  label={RegistrationDict[userLanguage]['status']}
                  selectedItem={values.status}
                  list={statusList}
                  placeholder={RegistrationDict[userLanguage]['statusPlaceholder']}
                  onChange={(name: any) => setFieldValue('status', name)}
                />

                <Checkbox
                  checked={values.isSelfPaced}
                  onChange={(e) => setFieldValue('isSelfPaced', e.target.checked)}>
                  Self Paced
                </Checkbox>

                {checkIfAdmin() && (
                  <Checkbox
                    checked={values.isZoiq}
                    onChange={(e) => setFieldValue('isZoiq', e.target.checked)}>
                    ZOIQ
                  </Checkbox>
                )}
              </>
            )}
          </div>

          {/* <div className="w-full md:h-full flex justify-center items-center">
            {message.show ? (
              <div>
                {message.type === 'error' ? (
                  <Error message={message.message} />
                ) : message.type === 'success' ? (
                  <SuccessMessage note={message.message} />
                ) : message.type === 'loading' ? (
                  <div className="my-2 text-sm leading-5 text-darkest">
                    {messageDict['loading']}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div> */}
        </div>

        <div className={`ml-auto my-4`}>
          <Buttons
            loading={isLoading}
            disabled={isLoading}
            label={RegistrationDict[userLanguage]['button']['submit']}
            type="submit"
          />
        </div>
      </form>
    </DynamicWrapper>
  );
};

export default Registration;
