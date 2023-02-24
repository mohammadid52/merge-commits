import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {IoArrowUndoCircleOutline} from 'react-icons/io5';
import {useHistory} from 'react-router-dom';

import BreadCrums from 'atoms/BreadCrums';
import Buttons from 'atoms/Buttons';
import FormInput from 'atoms/Form/FormInput';
import Selector from 'atoms/Form/Selector';
import SuccessNote from 'standard/Alert/SuccessNote';
import DropdownForm from './DropdownForm';
import ErrorNote from './ErrorNote';

import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import {createUserUrl} from 'utilities/urls';

import SectionTitleV3 from '@components/Atoms/SectionTitleV3';
import useGraphqlMutation from '@customHooks/useGraphqlMutation';
import {withZoiqFilter} from '@utilities/functions';
import {getReverseUserRoleString, getUserRoleString} from '@utilities/strings';
import {
  CreateClassroomGroupStudentsInput,
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

interface newUserInput {
  key: number;
  authId: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  birthdate: string;
  grade: string;
  role: CreatePersonInput['role'] | '';
  status: {name: string; value: PersonStatus};
  externalId: string;
  group: {
    id: string;
    name: string;
  };
  message: {
    show: boolean;
    text: string;
    type: string;
  };
  institution: {
    id: string;
    name: string;
  };
  isSelfPaced?: boolean;
  isZoiq?: boolean;
  class: {
    id: string;
    name: string;
    roomId: string;
  };
}

const PASSWORD = 'xIconoclast.5x';

const initialState: newUserInput = {
  key: 0,
  authId: '',
  email: '',
  password: PASSWORD,
  firstName: '',
  lastName: '',
  phone: '',
  status: {name: 'Active', value: PersonStatus.ACTIVE},
  birthdate: '',
  grade: '',
  role: '',
  externalId: '',
  message: {show: false, text: '', type: ''},
  institution: {id: '', name: ''},
  class: {id: '', name: '', roomId: ''},
  group: {id: '', name: ''},
  isSelfPaced: true,
  isZoiq: false
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

  const [newUserInputs, setNewUserInputs] = useState<newUserInput>(initialState);

  const [institutions, setInstitutions] = useState([]);
  const [institutionsData, setInstitutionsData] = useState([]);
  const [instClasses, setInstClasses] = useState([]);

  const [groups, setGroups] = useState([]);
  const [groupLoading, setGroupLoading] = useState(false);
  const [message, setMessage] = useState<{show: boolean; type: string; message: string}>({
    show: false,
    type: '',
    message: ''
  });

  const {state, userLanguage, zoiqFilter, checkIfAdmin} = useGlobalContext();
  const {RegistrationDict, BreadcrumsTitles} = useDictionary();

  const Roles = [
    state.user.role === Role.SUP && {
      name: Role.SUP,
      id: 1,
      value: RegistrationDict[userLanguage]['roles']['sup']
    },
    (state.user.role === Role.SUP || state.user.role === Role.ADM) && {
      name: Role.ADM,
      id: 2,
      value: RegistrationDict[userLanguage]['roles']['adm']
    },
    {name: Role.BLD, id: 3, value: RegistrationDict[userLanguage]['roles']['bld']},
    {name: Role.FLW, id: 4, value: RegistrationDict[userLanguage]['roles']['flw']},
    {name: Role.CRD, id: 5, value: RegistrationDict[userLanguage]['roles']['crd']},
    {name: Role.TR, id: 6, value: RegistrationDict[userLanguage]['roles']['tr']},
    (!isInModalPopup || (isInModalPopup && classId)) &&
      state.user.role !== Role.BLD && {
        name: Role.ST,
        id: 7,
        value: RegistrationDict[userLanguage]['roles']['st']
      }
  ].filter(Boolean);

  const breadCrumsList = [
    {title: BreadcrumsTitles[userLanguage]['HOME'], url: '/dashboard', last: false},
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
      setNewUserInputs((prevValues) => ({
        ...prevValues,
        role: Role.ST,
        class: {
          id: classId,
          name: classData.name,
          roomId: classData.roomId
        }
      }));
      getClassRoomGroups(classData.roomId);
    }
  }, [classId]);

  const handleMessage = (type: string, text: string) => {
    setNewUserInputs(() => {
      return {
        ...newUserInputs,
        message: {
          show: true,
          text: text,
          type: type
        }
      };
    });
  };

  // const onGroupChange = (_: string, name: string, id: string) => {
  //   setNewUserInputs((prevValues) => ({
  //     ...prevValues,
  //     group: {id, name},
  //   }));
  // };

  const getClassRoomGroups = async (roomId: string) => {
    try {
      setGroupLoading(true);
      let filter = {
        and: [
          {
            classRoomID: {eq: roomId}
          },
          {groupType: {eq: 'Proficiency'}}
        ]
      };
      const list: any = await API.graphql(
        graphqlOperation(customQueries.listClassroomGroupssOptions, {
          filter: filter
        })
      );
      setGroups(
        list?.data?.listClassroomGroups.items?.map((item: any) => ({
          name: item.groupName,
          id: item.id
        }))
      );
      setGroupLoading(false);
    } catch (error) {
      setGroupLoading(false);
    }
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

  // mutation for creating a new class student
  const createClassroomGroupStudentsMutation = useGraphqlMutation<
    {input: CreateClassroomGroupStudentsInput},
    any
  >('createClassroomGroupStudents');

  async function registerUser(authId: string) {
    let userData: CreatePersonInput = {
      authId: authId,
      status: newUserInputs.status.value,
      role: newUserInputs.role as Role,
      email: newUserInputs.email,
      firstName: newUserInputs.firstName,
      lastName: newUserInputs.lastName,
      phone: newUserInputs.phone,
      birthdate: '1960-01-01',
      externalId: newUserInputs.externalId,
      grade: newUserInputs.grade,
      language: Language.EN,
      onDemand: newUserInputs.role === 'ST' ? newUserInputs.isSelfPaced : false,
      addedby: state.user.authId,
      isZoiq: newUserInputs.isZoiq
    };

    try {
      const person = await createPersonMutation.mutate({input: userData});

      if (newUserInputs.role !== Role.ST) {
        const input: CreateStaffInput = {
          institutionID: newUserInputs.institution.id,
          staffAuthID: authId,
          staffEmail: newUserInputs.email,
          status: PersonStatus.ACTIVE,
          statusChangeDate: new Date().toISOString().split('T')[0]
        };

        createStaffMutation.mutate({input});
      } else {
        if (newUserInputs.class.id) {
          // add the student in the class
          // need to get the user id from new person object
          const input: CreateClassStudentInput = {
            classID: newUserInputs.class.id,
            studentID: person.id,
            studentAuthID: authId,
            studentEmail: newUserInputs.email,
            status: newUserInputs.status.value
          };

          createClassStudentMutation.mutate({input});
          if (newUserInputs.group?.id) {
            const input: CreateClassroomGroupStudentsInput = {
              classRoomGroupID: newUserInputs.group.id,
              studentEmail: newUserInputs.email,
              studentAuthId: authId
            };
            createClassroomGroupStudentsMutation.mutate({input});
          }
        }
      }

      handleMessage('success', 'User registered successfully');

      if (isInModalPopup) {
        postMutation();
      }
      setNewUserInputs(initialState);
    } catch (error) {
      console.error('error registering user:', error);
      handleMessage('error', error.message);
    }
  }

  async function signUp() {
    let username = newUserInputs.email;
    try {
      const response = await axios.post(createUserUrl, {email: username});
      const user = response.data.User;
      setNewUserInputs(() => {
        return {...newUserInputs, authId: user.Username};
      });
      registerUser(user.Username);
    } catch (error) {
      console.error('error signing up:', error);
      setMessage(() => {
        const er = error.response.data;
        switch (er.code) {
          case 'InvalidParameterException':
            return {
              show: true,
              type: 'success',
              message: RegistrationDict[userLanguage]['messages']['emailerr']
            };
          case 'UsernameExistsException':
            return {
              show: true,
              type: 'error',
              message: RegistrationDict[userLanguage]['messages']['existemail']
            };
          default:
            return {
              show: true,
              type: 'error',
              message: er.message
            };
        }
      });
      handleMessage('error', error.message);
    }
  }

  const validation = () => {
    let validated = false;

    setMessage(() => {
      let username = newUserInputs.email;
      if (!newUserInputs.firstName) {
        return {
          show: true,
          type: 'error',
          message: RegistrationDict[userLanguage]['messages']['firstname']
        };
      }
      if (!newUserInputs.lastName) {
        return {
          show: true,
          type: 'error',
          message: RegistrationDict[userLanguage]['messages']['lastname']
        };
      }
      if (!username) {
        return {
          show: true,
          type: 'error',
          message: RegistrationDict[userLanguage]['messages']['email']
        };
      }
      if (!username.includes('@' && '.')) {
        return {
          show: true,
          type: 'error',
          message: RegistrationDict[userLanguage]['messages']['emailaddress']
        };
      }
      if (!newUserInputs.role) {
        return {
          show: true,
          type: 'error',
          message: RegistrationDict[userLanguage]['messages']['userrol']
        };
      }
      if (!newUserInputs.institution.id) {
        return {
          show: true,
          type: 'error',
          message: RegistrationDict[userLanguage]['messages']['institution']
        };
      }
      // if (newUserInputs.role === 'ST' && !newUserInputs.class.id) {
      //   return {
      //     show: true,
      //     type: 'error',
      //     message: 'class is required',
      //   };
      // }
      validated = true;
      if (validated) {
        signUp();
      }
      return {
        show: true,
        type: 'loading',
        message: RegistrationDict[userLanguage]['messages']['loading']
      };
    });
  };

  const handleChange = (e: {target: {id: any; value: any}}) => {
    const {id, value} = e.target;
    setNewUserInputs(() => {
      if (id === 'email') {
        return {
          ...newUserInputs,
          [id]: value.toLowerCase()
        };
      } else {
        return {
          ...newUserInputs,
          [id]: value
        };
      }
    });
  };

  const handleCheckbox = (fieldName: string, value: boolean) => {
    setNewUserInputs(() => {
      return {
        ...newUserInputs,
        [fieldName]: value
      };
    });
  };

  const handleSubmit = () => {
    validation();
  };

  const handleInstituteChange = (item: {name: string; value: string}) => {
    setNewUserInputs(() => {
      return {
        ...newUserInputs,
        institution: {id: item.value, name: item.name}
      };
    });
  };

  useEffect(() => {
    listAllRooms(undefined, []);
  }, []);

  const listAllRooms = async (nextToken: string, outArray: any[]): Promise<any> => {
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
        combined = await listAllRooms(NextToken, combined);
      }
      setInstClasses(combined);

      return combined;
    } catch (error) {
      console.error(
        '🚀 ~ file: AnalyticsDashboard.tsx ~ line 24 ~ listAllClasses ~ error',
        error
      );
    }
  };

  const handleClassChange = (item: {
    name: string;
    value: string;
    roomId: string;
    classID: string;
    id: string;
  }) => {
    // getClassRoomGroups(item.id);
    // See reason below in the jsx
    setNewUserInputs(() => {
      return {
        ...newUserInputs,
        class: {
          id: item.classID,
          name: item.name,
          roomId: item.id
        }
      };
    });
  };
  const fetchInstitutions = async () => {
    try {
      let institutions: any = await API.graphql(
        graphqlOperation(customQueries.getInstitutionsList, {filter: withZoiqFilter({})})
      );
      institutions = institutions?.data.listInstitutions?.items || [];
      let list = institutions.map((inst: any) => {
        return {value: inst.id, name: inst.name};
      });
      setInstitutions([list[list.length - 1]]);
      setInstitutionsData(institutions);
    } catch (error) {}
  };

  useEffect(() => {
    fetchInstitutions();
  }, []);

  useEffect(() => {
    if (instId) {
      if (institutionsData.length) {
        handleInstituteChange({
          value: instId,
          name: ''
        });
      } else {
        setNewUserInputs((prevInput) => ({
          ...prevInput,
          institution: {id: instId, name: ''}
        }));
      }
    }
  }, [institutionsData, instId]);

  const status = [
    {id: 1, name: 'Active', value: 'ACTIVE'},
    {id: 2, name: 'Inactive', value: 'INACTIVE'},
    {id: 3, name: 'Training', value: 'TRAINING'}
  ];

  const onStatusChange = (value: PersonStatus, name: string) => {
    setNewUserInputs({...newUserInputs, status: {value, name}});
  };
  return (
    <div className={`w-full h-full p-4`}>
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

      <div
        className={`${
          !isInInstitute
            ? 'test border-2 border-gray-300 rounded bg-gray-200 shadow-elem-light px-12 py-8'
            : ''
        } w-full flex flex-col`}>
        <div className="">
          <div className="w-full md:flex flex-col mb-8">
            <div
              className={`h-full w-full ${
                !isInInstitute ? 'bg-white shadow-5' : ''
              } my-4 sm:rounded-lg`}>
              <form>
                <div
                  className={`h-full ${isInInstitute ? '' : 'px-4 sm:px-6'} pb-5 pt-2`}>
                  <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3 p-2">
                      <FormInput
                        label={RegistrationDict[userLanguage]['firstname']}
                        isRequired
                        id="firstName"
                        name="firstName"
                        onChange={handleChange}
                        className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                        value={`${newUserInputs.firstName}`}
                        placeHolder={RegistrationDict[userLanguage]['firstplaceholder']}
                      />
                    </div>

                    <div className="sm:col-span-3 p-2">
                      <FormInput
                        id="lastName"
                        isRequired
                        label={RegistrationDict[userLanguage]['lastname']}
                        name="lastName"
                        onChange={handleChange}
                        className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                        value={`${newUserInputs.lastName}`}
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
                        onChange={handleChange}
                        className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                        value={`${newUserInputs.email}`}
                        placeHolder={RegistrationDict[userLanguage]['emailplaceholder']}
                      />
                    </div>

                    {!classId && (
                      <div className="sm:col-span-3 p-2">
                        <Selector
                          placeholder="Select role"
                          onChange={(c: any, name: any) =>
                            setNewUserInputs({
                              ...newUserInputs,
                              role: getReverseUserRoleString(name) as Role
                            })
                          }
                          label={RegistrationDict[userLanguage]['role']}
                          dropdownWidth="w-56"
                          list={Roles.map((d) => ({
                            ...d,
                            name: getUserRoleString(d.name)
                          }))}
                          selectedItem={getUserRoleString(newUserInputs.role)}
                        />
                      </div>
                    )}
                    {/* <div className="sm:col-span-3 p-2">
                      <DropdownForm
                        style={true}
                        handleChange={handleInstituteChange}
                        userInfo={`${newUserInputs.institution.name}`}
                        label="Institution"
                        id="institution"
                        items={newUserInputs.role ? institutions : []}
                        value={`${newUserInputs.institution.id}`}
                        noOptionMessage={
                          RegistrationDict[userLanguage].messages.ROLE_NO_OPTION
                        }
                      />
                    </div> */}

                    {checkIfAdmin() && (
                      <CheckBox
                        dataCy="isZoiq"
                        label={'ZOIQ'}
                        className="group:hover:bg-gray-500"
                        value={newUserInputs.isZoiq}
                        onChange={(e) => handleCheckbox('isZoiq', e.target.checked)}
                        name="isZoiq"
                      />
                    )}

                    {newUserInputs.role &&
                      newUserInputs.role === Role.ST &&
                      newUserInputs.institution.id && (
                        <>
                          {!classId && (
                            <div className="sm:col-span-3 p-2">
                              <DropdownForm
                                dataCy="class"
                                style={true}
                                // @ts-ignore
                                handleChange={handleClassChange}
                                userInfo={`${newUserInputs.class.name}`}
                                label={RegistrationDict[userLanguage]['class']}
                                id="class"
                                items={instClasses}
                                value={`${newUserInputs.class.id}`}
                              />
                            </div>
                          )}

                          <div className="sm:col-span-3 p-2">
                            <div>
                              <Label label={RegistrationDict[userLanguage]['status']} />
                              <Selector
                                selectedItem={newUserInputs?.status?.name}
                                list={status}
                                placeholder={
                                  RegistrationDict[userLanguage]['statusPlaceholder']
                                }
                                onChange={onStatusChange}
                                labelTextClass="text-m"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-3 p-2">
                            <div>
                              <Label
                                label={RegistrationDict[userLanguage]['paceLabel']}
                              />
                              <CheckBox
                                dataCy="self-paced"
                                label={RegistrationDict[userLanguage]['paceCheckBox']}
                                className="group:hover:bg-gray-500"
                                value={newUserInputs.isSelfPaced}
                                onChange={(e) =>
                                  handleCheckbox('isSelfPaced', e.target.checked)
                                }
                                name="self-paced"
                              />
                            </div>
                          </div>
                        </>
                      )}
                  </div>
                </div>
              </form>
            </div>

            <div className="w-full md:h-full flex justify-center items-center">
              {message.show ? (
                <div>
                  {newUserInputs.message.type === 'success' ? (
                    <SuccessNote message="Succesfully registered" />
                  ) : message.type === 'error' ? (
                    <ErrorNote note={message.message} />
                  ) : message.type === 'loading' ? (
                    <div className="my-2 text-sm leading-5 text-gray-900">
                      {RegistrationDict[userLanguage]['messages']['loading']}
                    </div>
                  ) : newUserInputs.message.type === 'error' ? (
                    <ErrorNote note={message.message} />
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className={`${isInModalPopup ? '' : ' w-1.5/10'} ml-auto`}>
          <Buttons
            btnClass="py-2 px-4 text-xs w-full"
            label={RegistrationDict[userLanguage]['button']['submit']}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default Registration;
