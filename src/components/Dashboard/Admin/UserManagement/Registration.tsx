import React, {useState, useContext, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import API, {graphqlOperation} from '@aws-amplify/api';
import {IoArrowUndoCircleOutline} from 'react-icons/io5';
import axios from 'axios';

import SuccessNote from '../../../../standard/Alert/SuccessNote';
import ErrorNote from './ErrorNote';
import DropdownForm from './DropdownForm';
import Buttons from '../../../Atoms/Buttons';
import SectionTitle from '../../../Atoms/SectionTitle';
import BreadCrums from '../../../Atoms/BreadCrums';
import FormInput from '../../../Atoms/Form/FormInput';
import Selector from '../../../Atoms/Form/Selector';
import useDictionary from '../../../../customHooks/dictionary';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import {createUserUrl} from '../../../../utilities/urls';
import {groupOptions} from '../../../../utilities/staticData';
import * as mutations from '../../../../graphql/mutations';
import * as customQueries from '../../../../customGraphql/customQueries';
import * as customMutations from '../../../../customGraphql/customMutations';

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
  externalId: string;
  group: string;
  message: {
    show: boolean;
    text: string;
    type: string;
  };
  institution: {
    id: string;
    name: string;
  };
  class: {
    id: string;
    name: string;
  };
}

const initialState: newUserInput = {
  key: 0,
  authId: '',
  email: '',
  password: 'xIconoclast.5x',
  firstName: '',
  lastName: '',
  phone: '',
  birthdate: '',
  grade: '',
  role: '',
  externalId: '',
  message: {show: false, text: '', type: ''},
  institution: {id: '', name: ''},
  class: {id: '', name: ''},
  group: '',
};

const Registration = ({isInInstitute}: any) => {
  const history = useHistory();
  const [newUserInputs, setNewUserInputs] = useState<newUserInput>(initialState);
  const [institutions, setInstitutions] = useState([]);
  const [institutionsData, setInstitutionsData] = useState([]);
  const [instClasses, setInstClasses] = useState([]);
  const [message, setMessage] = useState<{show: boolean; type: string; message: string}>({
    show: false,
    type: '',
    message: '',
  });
  const Roles = [
    {code: 'ADM', name: 'Admin'},
    {code: 'BLD', name: 'Builder'},
    {code: 'FLW', name: 'Fellow'},
    {code: 'CRD', name: 'Coordinator'},
    {code: 'TR', name: 'Teacher'},
    {code: 'ST', name: 'Student'},
  ];

  const {theme, clientKey, userLanguage} = useContext(GlobalContext);
  const {RegistrationDict, BreadcrumsTitles} = useDictionary(clientKey);

  const breadCrumsList = [
    {title: BreadcrumsTitles[userLanguage]['HOME'], url: '/dashboard', last: false},
    {
      title: BreadcrumsTitles[userLanguage]['PeopleManagment'],
      url: '/dashboard/manage-users',
      last: false,
    },
    {
      title: BreadcrumsTitles[userLanguage]['AddNewUser'],
      url: `/dashboard/registration`,
      last: true,
    },
  ];

  const handleMessage = (type: string, text: string) => {
    setNewUserInputs(() => {
      return {
        ...newUserInputs,
        message: {
          show: true,
          text: text,
          type: type,
        },
      };
    });
  };

  const onGroupChange = (_: string, name: string) => {
    setNewUserInputs((prevValues) => ({
      ...prevValues,
      group: name,
    }));
  };

  async function registerUser(authId: string) {
    let userData = {
      authId: authId,
      status: 'ACTIVE',
      role: newUserInputs.role,
      email: newUserInputs.email,
      firstName: newUserInputs.firstName,
      lastName: newUserInputs.lastName,
      phone: newUserInputs.phone,
      birthdate: '1960-01-01',
      externalId: newUserInputs.externalId,
      grade: newUserInputs.grade,
      language: 'EN',
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
          status: 'Active',
          statusChangeDate: new Date().toISOString().split('T')[0],
        };
        const staff: any = await API.graphql(
          graphqlOperation(mutations.createStaff, {input: input})
        );
      } else {
        // add the student in the class
        // need to get the user id from new person object
        const input = {
          classID: newUserInputs.class.id,
          studentID: person.id,
          studentAuthID: authId,
          studentEmail: newUserInputs.email,
          status: 'Active',
          group: newUserInputs.group,
        };
        let newStudent: any = await API.graphql(
          graphqlOperation(customMutations.createClassStudent, {input})
        );
      }
      handleMessage('success', 'User registered successfully');
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
          role: '',
          externalId: '3',
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
      console.log('error signing up:', error);
      setMessage(() => {
        const er = error.response.data;
        switch (er.code) {
          case 'InvalidParameterException':
            return {
              show: true,
              type: 'success',
              message: RegistrationDict[userLanguage]['messages']['emailerr'],
            };
          case 'UsernameExistsException':
            return {
              show: true,
              type: 'error',
              message: RegistrationDict[userLanguage]['messages']['existemail'],
            };
          default:
            return {
              show: true,
              type: 'error',
              message: er.message,
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
          message: RegistrationDict[userLanguage]['messages']['firstname'],
        };
      }
      if (!newUserInputs.lastName) {
        return {
          show: true,
          type: 'error',
          message: RegistrationDict[userLanguage]['messages']['lastname'],
        };
      }
      if (!username) {
        return {
          show: true,
          type: 'error',
          message: RegistrationDict[userLanguage]['messages']['email'],
        };
      }
      if (!username.includes('@')) {
        return {
          show: true,
          type: 'error',
          message: RegistrationDict[userLanguage]['messages']['emailaddress'],
        };
      }
      if (!newUserInputs.role) {
        return {
          show: true,
          type: 'error',
          message: RegistrationDict[userLanguage]['messages']['userrol'],
        };
      }
      if (!newUserInputs.institution.id) {
        return {
          show: true,
          type: 'error',
          message: RegistrationDict[userLanguage]['messages']['institution'],
        };
      }
      if (newUserInputs.role === 'ST' && !newUserInputs.class.id) {
        return {
          show: true,
          type: 'error',
          message: 'class is required',
        };
      }
      validated = true;
      if (validated) {
        signUp();
      }
      return {
        show: true,
        type: 'loading',
        message: RegistrationDict[userLanguage]['messages']['loading'],
      };
    });
  };

  const handleChange = (e: {target: {id: any; value: any}}) => {
    const {id, value} = e.target;
    setNewUserInputs(() => {
      if (id === 'email') {
        return {
          ...newUserInputs,
          [id]: value.toLowerCase(),
        };
      } else {
        return {
          ...newUserInputs,
          [id]: value,
        };
      }
    });
  };

  const handleChangeRole = (item: {name: string; code: string}) => {
    setNewUserInputs(() => {
      return {
        ...newUserInputs,
        role: item.code,
      };
    });
  };

  const handleSubmit = () => {
    validation();
  };

  const handleInstituteChange = (item: {name: string; code: string}) => {
    const selectedInst = institutionsData.filter((inst) => inst.id === item.code)[0];
    let classes = selectedInst.classes.items;
    let classList = classes.map((cl: any) => {
      return {code: cl.id, name: cl.name};
    });
    setInstClasses(classList);
    setNewUserInputs(() => {
      return {
        ...newUserInputs,
        institution: {id: item.code, name: item.name},
      };
    });
  };

  const handleClassChange = (item: {name: string; code: string}) => {
    setNewUserInputs(() => {
      return {
        ...newUserInputs,
        class: {id: item.code, name: item.name},
      };
    });
  };
  const fetchInstitutions = async () => {
    let institutions: any = await API.graphql(
      graphqlOperation(customQueries.getInstitutionsList)
    );
    institutions = institutions?.data.listInstitutions?.items || [];
    let list = institutions.map((inst: any) => {
      return {code: inst.id, name: inst.name};
    });
    setInstitutions(list);
    setInstitutionsData(institutions);
  };

  useEffect(() => {
    fetchInstitutions();
  }, []);

  return (
    <div className={`w-full h-full ${isInInstitute ? 'py-8 px-12' : 'mt-4 p-12'}`}>
      {isInInstitute ? (
        <h3 className="text-sm leading-6 font-bold text-gray-900 w-auto">
          {RegistrationDict[userLanguage]['title']}
        </h3>
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
                <div className={`h-full ${isInInstitute ? '' : 'px-4 sm:px-6'} pb-5 pt-2`}>
                  <div className="text-red-500 pb-2 text-right">
                    * {RegistrationDict[userLanguage]['requiredfield']}
                  </div>

                  <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3 p-2">
                      <label
                        htmlFor="firstName"
                        className="block text-m font-medium leading-5 text-gray-700">
                        <span className="text-red-500">*</span>{' '}
                        {RegistrationDict[userLanguage]['firstname']}
                      </label>
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
                      <label
                        htmlFor="lastName"
                        className="block text-m font-medium leading-5 text-gray-700">
                        <span className="text-red-500">*</span>{' '}
                        {RegistrationDict[userLanguage]['lastname']}
                      </label>
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
                      <label
                        htmlFor="email"
                        className="block text-m font-medium leading-5 text-gray-700">
                        <span className="text-red-500">*</span>{' '}
                        {RegistrationDict[userLanguage]['email']}
                      </label>
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

                    <div className="sm:col-span-3 p-2">
                      <DropdownForm
                        style={true}
                        handleChange={handleChangeRole}
                        userInfo={`${newUserInputs.role}`}
                        label="Role"
                        id="role"
                        items={Roles}
                        value={`${newUserInputs.role}`}
                      />
                    </div>
                    <div className="sm:col-span-3 p-2">
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
                    </div>
                    {newUserInputs.role &&
                      newUserInputs.role === 'ST' &&
                      newUserInputs.institution.id && (
                        <>
                          <div className="sm:col-span-3 p-2">
                            <DropdownForm
                              style={true}
                              handleChange={handleClassChange}
                              userInfo={`${newUserInputs.class.name}`}
                              label="Class"
                              id="class"
                              items={instClasses}
                              value={`${newUserInputs.class.id}`}
                            />
                          </div>
                          <div className="sm:col-span-3 p-2">
                            <Selector
                              label={'Group'}
                              selectedItem={newUserInputs?.group}
                              list={newUserInputs.class.id ? groupOptions : []}
                              placeholder={
                                RegistrationDict[userLanguage].GROUP_PLACEHOLDER
                              }
                              onChange={onGroupChange}
                              noOptionMessage={
                                RegistrationDict[userLanguage].messages.GROUP_NO_OPTION
                              }
                              labelTextClass="text-m"
                            />
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
                    <SuccessNote />
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

        <div className="w-1.5/10 ml-auto">
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
