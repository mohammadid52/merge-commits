import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import axios from 'axios';
import React, {useContext, useEffect, useState} from 'react';
import {IoArrowUndoCircleOutline} from 'react-icons/io5';
import {useHistory} from 'react-router-dom';

import BreadCrums from '@atoms/BreadCrums';
import Buttons from '@atoms/Buttons';
import FormInput from '@atoms/Form/FormInput';
import Selector from '@atoms/Form/Selector';
import SectionTitle from '@atoms/SectionTitle';
import SuccessNote from '../../../../standard/Alert/SuccessNote';
import DropdownForm from './DropdownForm';
import ErrorNote from './ErrorNote';

import {GlobalContext} from '@contexts/GlobalContext';
import useDictionary from '@customHooks/dictionary';
import {createUserUrl} from '@utilities/urls';

import CheckBox from '@components/Atoms/Form/CheckBox';
import Label from '@components/Atoms/Form/Label';
import * as customMutations from '@customGraphql/customMutations';
import * as customQueries from '@customGraphql/customQueries';
import * as mutations from '@graphql/mutations';

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
  role: string;
  status: {name: string; value: string};
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
  status: {name: 'Active', value: 'ACTIVE'},
  birthdate: '',
  grade: '',
  role: '',
  externalId: '',
  message: {show: false, text: '', type: ''},
  institution: {id: '', name: ''},
  class: {id: '', name: '', roomId: ''},
  group: {id: '', name: ''},
  isSelfPaced: true
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

  const {state, clientKey, userLanguage} = useContext(GlobalContext);
  const {RegistrationDict, BreadcrumsTitles} = useDictionary(clientKey);

  const Roles = [
    state.user.role === 'SUP' && {
      code: 'SUP',
      name: RegistrationDict[userLanguage]['roles']['sup']
    },
    (state.user.role === 'SUP' || state.user.role === 'ADM') && {
      code: 'ADM',
      name: RegistrationDict[userLanguage]['roles']['adm']
    },
    {code: 'BLD', name: RegistrationDict[userLanguage]['roles']['bld']},
    {code: 'FLW', name: RegistrationDict[userLanguage]['roles']['flw']},
    {code: 'CRD', name: RegistrationDict[userLanguage]['roles']['crd']},
    {code: 'TR', name: RegistrationDict[userLanguage]['roles']['tr']},
    (!isInModalPopup || (isInModalPopup && classId)) &&
      state.user.role !== 'BLD' && {
        code: 'ST',
        name: RegistrationDict[userLanguage]['roles']['st']
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
        role: 'ST',
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

  async function registerUser(authId: string) {
    let userData = {
      authId: authId,
      status: newUserInputs.status.value,
      role: newUserInputs.role,
      email: newUserInputs.email,
      firstName: newUserInputs.firstName,
      lastName: newUserInputs.lastName,
      phone: newUserInputs.phone,
      birthdate: '1960-01-01',
      externalId: newUserInputs.externalId,
      grade: newUserInputs.grade,
      language: 'EN',
      onDemand: !newUserInputs.isSelfPaced,
      addedby: state.user.authId
    };

    try {
      const newPerson: any = await API.graphql(
        graphqlOperation(mutations.createPerson, {input: userData})
      );
      let person = newPerson.data.createPerson;
      if (newUserInputs.role !== 'ST') {
        const input = {
          institutionID: newUserInputs.institution.id,
          staffAuthID: authId,
          staffEmail: newUserInputs.email,
          status: 'ACTIVE',
          statusChangeDate: new Date().toISOString().split('T')[0]
        };
        const staff: any = await API.graphql(
          graphqlOperation(mutations.createStaff, {input: input})
        );
      } else {
        if (newUserInputs.class.id) {
          // add the student in the class
          // need to get the user id from new person object
          const input = {
            classID: newUserInputs.class.id,
            studentID: person.id,
            studentAuthID: authId,
            studentEmail: newUserInputs.email,
            status: newUserInputs.status
          };
          await API.graphql(
            graphqlOperation(customMutations.createClassStudent, {input})
          );
          if (newUserInputs.group?.id) {
            await API.graphql(
              graphqlOperation(customMutations.createClassroomGroupStudents, {
                input: {
                  classRoomGroupID: newUserInputs.group.id,
                  studentEmail: newUserInputs.email,
                  studentAuthId: authId
                }
              })
            );
          }
        }
      }
      handleMessage('success', 'User registered successfully');
      if (isInModalPopup) {
        postMutation();
      }
      setNewUserInputs((prev) => {
        return {
          ...prev,
          key: 0,
          authId: '',
          email: '',
          password: 'xIconoclast.5x',
          firstName: '',
          lastName: '',
          phone: '00',
          birthdate: '10-10-2020',
          grade: '1',
          class: {id: '', name: '', roomId: ''},
          role: '',
          externalId: '3'
        };
      });
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
      if (!username.includes('@')) {
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

  const handleChangeRole = (item: {name: string; code: string}) => {
    setNewUserInputs(() => {
      return {
        ...newUserInputs,
        role: item.code
      };
    });
  };

  const handleChangeSelfPaced = (value: boolean) => {
    setNewUserInputs(() => {
      return {
        ...newUserInputs,
        isSelfPaced: value
      };
    });
  };

  const handleSubmit = () => {
    validation();
  };

  const handleInstituteChange = (item: {name: string; code: string}) => {
    setNewUserInputs(() => {
      return {
        ...newUserInputs,
        institution: {id: item.code, name: item.name}
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
    code: string;
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
        graphqlOperation(customQueries.getInstitutionsList)
      );
      institutions = institutions?.data.listInstitutions?.items || [];
      let list = institutions.map((inst: any) => {
        return {code: inst.id, name: inst.name};
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
          code: instId,
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

  const onStatusChange = (value: string, name: string) => {
    setNewUserInputs({...newUserInputs, status: {value, name}});
  };
  return (
    <div
      className={`w-full h-full ${
        isInInstitute ? (isInModalPopup ? 'p-4' : 'py-8 px-12') : 'mt-4 p-12'
      }`}>
      {isInInstitute ? (
        !isInModalPopup && (
          <h3 className="text-sm leading-6 font-bold text-gray-900 w-auto">
            {RegistrationDict[userLanguage]['title']}
          </h3>
        )
      ) : (
        <>
          <BreadCrums items={breadCrumsList} />
          <div className="flex justify-between">
            <SectionTitle
              title={RegistrationDict[userLanguage]['title']}
              subtitle={RegistrationDict[userLanguage]['subtitle']}
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
                  <div className="text-red-500 pb-2 text-right">
                    * {RegistrationDict[userLanguage]['requiredfield']}
                  </div>

                  <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3 p-2">
                      <Label
                        label={RegistrationDict[userLanguage]['firstname']}
                        isRequired
                      />
                      <FormInput
                        id="firstName"
                        name="firstName"
                        onChange={handleChange}
                        className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                        value={`${newUserInputs.firstName}`}
                        placeHolder={RegistrationDict[userLanguage]['firstplaceholder']}
                      />
                    </div>

                    <div className="sm:col-span-3 p-2">
                      <Label
                        label={RegistrationDict[userLanguage]['lastname']}
                        isRequired
                      />
                      <FormInput
                        id="lastName"
                        name="lastName"
                        onChange={handleChange}
                        className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                        value={`${newUserInputs.lastName}`}
                        placeHolder={RegistrationDict[userLanguage]['lastplaceholder']}
                      />
                    </div>

                    <div className="sm:col-span-3 p-2">
                      <Label label={RegistrationDict[userLanguage]['email']} isRequired />
                      <FormInput
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
                        <DropdownForm
                          dataCy="role"
                          style={true}
                          handleChange={handleChangeRole}
                          userInfo={`${newUserInputs.role}`}
                          label={RegistrationDict[userLanguage]['role']}
                          listClassName="h-28"
                          id="role"
                          isRequired
                          items={Roles}
                          value={`${newUserInputs.role}`}
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
                    {newUserInputs.role &&
                      newUserInputs.role === 'ST' &&
                      newUserInputs.institution.id && (
                        <>
                          {!classId && (
                            <div className="sm:col-span-3 p-2">
                              <DropdownForm
                                dataCy="class"
                                style={true}
                                handleChange={handleClassChange}
                                userInfo={`${newUserInputs.class.name}`}
                                label={RegistrationDict[userLanguage]['class']}
                                id="class"
                                isRequired
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
                                onChange={(e) => handleChangeSelfPaced(e.target.checked)}
                                name="self-paced"
                              />
                            </div>
                          </div>

                          {/* We are not using this because Teachers are getting confused with this. But we might use this in future. */}
                          {/* {Boolean(groups?.length) ? (
                            <div className="sm:col-span-3 p-2">
                              <Selector
                                label={'Group'}
                                selectedItem={newUserInputs?.group?.name}
                                list={groups || []}
                                placeholder={
                                  RegistrationDict[userLanguage].GROUP_PLACEHOLDER
                                }
                                onChange={onGroupChange}
                                noOptionMessage={
                                  newUserInputs.class.id
                                    ? RegistrationDict[userLanguage].messages
                                        .GROUP_NO_OPTION_AFTER_FETCH
                                    : RegistrationDict[userLanguage].messages
                                        .GROUP_NO_OPTION
                                }
                                labelTextClass="text-m"
                                loading={groupLoading}
                              />
                            </div>
                          ) : null} */}
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
