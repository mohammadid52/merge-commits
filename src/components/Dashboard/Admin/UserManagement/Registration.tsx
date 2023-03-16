import {API, graphqlOperation} from 'aws-amplify';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {IoArrowUndoCircleOutline} from 'react-icons/io5';
import {useHistory} from 'react-router-dom';

import BreadCrums from 'atoms/BreadCrums';
import Buttons from 'atoms/Buttons';
import FormInput from 'atoms/Form/FormInput';
import Selector from 'atoms/Form/Selector';

import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import {createUserUrl} from 'utilities/urls';

import {Error} from '@components/Atoms/Alerts/Info';
import SectionTitleV3 from '@components/Atoms/SectionTitleV3';
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
import CheckBox from 'atoms/Form/CheckBox';
import Label from 'atoms/Form/Label';
import * as customQueries from 'customGraphql/customQueries';
import {useFormik} from 'formik';
import {UserRegisterSchema} from 'Schema';
import SuccessMessage from './SuccessMessage';

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

const Registration = ({
  classData,
  isInInstitute,
  instId,
  isInModalPopup = false,
  postMutation
}: any) => {
  const {classId} = classData || {};
  const history = useHistory();

  const [instClasses, setInstClasses] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const [message, setMessage] = useState<{
    show: boolean;
    type: string;
    message: string;
  }>({
    show: false,
    type: '',
    message: ''
  });

  const {state, userLanguage, zoiqFilter, checkIfAdmin} = useGlobalContext();
  const {RegistrationDict, BreadcrumsTitles} = useDictionary();

  const messageDict = RegistrationDict[userLanguage]['messages'];
  const rolesDict = RegistrationDict[userLanguage]['roles'];

  const Roles = [
    state.user.role === Role.SUP && {
      name: Role.SUP,
      id: 1,
      value: rolesDict['sup']
    },
    (state.user.role === Role.SUP || state.user.role === Role.ADM) && {
      name: Role.ADM,
      id: 2,
      value: rolesDict['adm']
    },
    {name: Role.BLD, id: 3, value: rolesDict['bld']},
    {name: Role.FLW, id: 4, value: rolesDict['flw']},
    {name: Role.TR, id: 6, value: rolesDict['tr']},
    (!isInModalPopup || (isInModalPopup && classId)) &&
      state.user.role !== Role.BLD && {
        name: Role.ST,
        id: 7,
        value: rolesDict['st']
      }
  ].filter(Boolean);

  const breadCrumsList = [
    {
      title: BreadcrumsTitles[userLanguage]['HOME'],
      url: '/dashboard',
      last: false
    },
    {
      title: BreadcrumsTitles[userLanguage]['PeopleManagment'],
      url: '/dashboard/manage-users',
      last: false
    },
    {
      title: BreadcrumsTitles[userLanguage]['AddNewUser'],
      url: `/dashboard/registration`,
      last: true
    }
  ];

  useEffect(() => {
    if (classId) {
      setFieldValue('class', {
        id: classId,
        name: classData.name,
        roomId: classData.roomId
      });
    }
  }, [classId]);

  const handleMessage = (type: string, text: string) => {
    setMessage({
      show: true,
      message: text,
      type: type
    });
  };

  // mutation for creating a new user
  const createPersonMutation = useGraphqlMutation<
    {input: CreatePersonInput},
    CreatePersonMutation['createPerson']
  >('createPerson');

  // mutation for creating a new staff user
  const createStaffMutation = useGraphqlMutation<{input: CreateStaffInput}, any>(
    'createStaff'
  );

  // mutation for creating a new class student
  const createClassStudentMutation = useGraphqlMutation<
    {input: CreateClassStudentInput},
    any
  >('createClassStudent');

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
        setMessage({show: true, type: 'error', message: er.message});
        handleMessage('error', error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    listAllRooms([]);
  }, []);

  const listAllRooms = async (outArray: any[], nextToken = null): Promise<any> => {
    let combined;
    try {
      const result: any = await API.graphql(
        graphqlOperation(customQueries.listRooms, {
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
      setInstClasses(combined.map((d: any) => ({...d, value: d.classID, roomId: d.id})));

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

    validationSchema: UserRegisterSchema,
    onSubmit: async () => {
      await signUp();
    }
  });

  return (
    <div className={`px-4`}>
      {isInInstitute ? (
        !isInModalPopup && (
          <SectionTitleV3 title={RegistrationDict[userLanguage]['title']} />
        )
      ) : (
        <>
          <BreadCrums items={breadCrumsList} />
          <div className="flex justify-between">
            <SectionTitleV3
              title={RegistrationDict[userLanguage]['title']}
              withButton={
                <div className="flex justify-end items-center">
                  <Buttons
                    label="Go Back"
                    btnClass="mr-4"
                    onClick={history.goBack}
                    Icon={IoArrowUndoCircleOutline}
                  />
                </div>
              }
              subtitle={RegistrationDict[userLanguage]['subtitle']}
            />
          </div>
        </>
      )}

      <form
        onSubmit={handleSubmit}
        className={`${
          !isInInstitute
            ? 'test border-2 border-gray-300 rounded bg-gray-200 shadow-elem-light px-12 py-8'
            : ''
        } w-full flex flex-col`}>
        <div className="">
          <div className="w-full md:flex flex-col mb-0">
            <div
              className={`h-full w-full ${
                !isInInstitute ? 'bg-white shadow-5' : ''
              } mt-4 sm:rounded-lg`}>
              <div>
                <div className={`h-full ${isInInstitute ? '' : 'px-4 sm:px-6'} pt-2`}>
                  <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3 p-2">
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
                    </div>

                    <div className="sm:col-span-3 p-2">
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
                    </div>

                    <div className="sm:col-span-3 p-2">
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
                    </div>

                    {!classId && (
                      <div className="sm:col-span-3 p-2">
                        <Selector
                          placeholder="Select role"
                          onChange={(_: any, name: any) =>
                            setFieldValue('role', getReverseUserRoleString(name))
                          }
                          label={RegistrationDict[userLanguage]['role']}
                          error={errors.role}
                          dropdownWidth="w-56"
                          list={Roles.map((d) => ({
                            ...d,
                            name: getUserRoleString(d.name)
                          }))}
                          selectedItem={getUserRoleString(values.role)}
                        />
                      </div>
                    )}

                    {checkIfAdmin() && (
                      <div className="sm:col-span-6">
                        <CheckBox
                          dataCy="isZoiq"
                          label={'ZOIQ'}
                          className="group:hover:bg-gray-500"
                          value={values.isZoiq}
                          onChange={(e) => setFieldValue('isZoiq', e.target.checked)}
                          name="isZoiq"
                        />
                      </div>
                    )}

                    {values.role && values.role === Role.ST && instId && (
                      <>
                        {!classId && (
                          <div className="sm:col-span-3 p-2">
                            <Selector
                              label={RegistrationDict[userLanguage]['class']}
                              selectedItem={values.class.name}
                              list={instClasses}
                              placeholder={'Select a class'}
                              onChange={(c: any, name: any, id: string) =>
                                setFieldValue('class', {
                                  id: c,
                                  name: name,
                                  roomId: id
                                })
                              }
                            />
                          </div>
                        )}

                        <div className="sm:col-span-3 p-2">
                          <div>
                            <Selector
                              label={RegistrationDict[userLanguage]['status']}
                              selectedItem={values.status}
                              list={statusList}
                              placeholder={
                                RegistrationDict[userLanguage]['statusPlaceholder']
                              }
                              onChange={(_: any, name: any) =>
                                setFieldValue('status', name)
                              }
                              labelTextClass="text-m"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3 p-2">
                          <div>
                            <Label label={RegistrationDict[userLanguage]['paceLabel']} />
                            <CheckBox
                              dataCy="self-paced"
                              label={RegistrationDict[userLanguage]['paceCheckBox']}
                              className="group:hover:bg-gray-500"
                              value={values.isSelfPaced}
                              onChange={(e) =>
                                setFieldValue('isSelfPaced', e.target.checked)
                              }
                              name="self-paced"
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full md:h-full flex justify-center items-center">
              {message.show ? (
                <div>
                  {message.type === 'error' ? (
                    <Error message={message.message} />
                  ) : message.type === 'success' ? (
                    <SuccessMessage note={message.message} />
                  ) : message.type === 'loading' ? (
                    <div className="my-2 text-sm leading-5 text-gray-900">
                      {messageDict['loading']}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className={`${isInModalPopup ? '' : ' w-1.5/10'} ml-auto`}>
          <Buttons
            btnClass=" w-full"
            loading={isLoading}
            disabled={isLoading}
            label={RegistrationDict[userLanguage]['button']['submit']}
            type="submit"
          />
        </div>
      </form>
    </div>
  );
};

export default Registration;
