import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import React, {Fragment, useContext, useEffect, useState} from 'react';
import {IconContext} from 'react-icons';
import {BsArrowLeft} from 'react-icons/bs';
import {IoClose} from 'react-icons/io5';
import {useHistory, useLocation} from 'react-router-dom';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import * as customMutations from '../../../../../customGraphql/customMutations';
import * as customQueries from '../../../../../customGraphql/customQueries';
import useDictionary from '../../../../../customHooks/dictionary';
import * as mutations from '../../../../../graphql/mutations';
import * as queries from '../../../../../graphql/queries';
import {getImageFromS3} from '../../../../../utilities/services';
import {
  getInitialsFromString,
  initials,
  stringToHslColor,
} from '../../../../../utilities/strings';
import BreadCrums from '../../../../Atoms/BreadCrums';
import Buttons from '../../../../Atoms/Buttons';
import AddButton from '../../../../Atoms/Buttons/AddButton';
import FormInput from '../../../../Atoms/Form/FormInput';
import SearchSelectorWithAvatar from '../../../../Atoms/Form/SearchSelectorWithAvatar';
import PageWrapper from '../../../../Atoms/PageWrapper';
import SectionTitle from '../../../../Atoms/SectionTitle';

interface ClassBuilderProps {
  instId: string;
  toggleUpdateState: () => void;
}

const ClassBuilder = (props: ClassBuilderProps) => {
  const {instId, toggleUpdateState} = props;
  const history = useHistory();
  const location = useLocation();
  const initialData = {
    id: '',
    name: '',
    instituteId: '',
    instituteName: '',
  };
  const [classData, setClassData] = useState(initialData);
  const [newMember, setNewMember] = useState({
    name: '',
    id: '',
    value: '',
    avatar: '',
  });

  const [studentList, setStudentList] = useState([]);
  const [searching, setSearching] = useState<boolean>(false);
  const [filteredStudents, setFilteredStudents] = useState([]);

  const [selectedStudents, setSelectedStudent] = useState([]);
  const [allStudentList, setAllStudentList] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {classBuilderdict, CommonlyUsedDict, BreadcrumsTitles} = useDictionary(clientKey);
  const [messages, setMessages] = useState({
    show: false,
    message: '',
    isError: false,
  });

  const useQuery = () => {
    return new URLSearchParams(location.search);
  };
  const params = useQuery();

  const breadCrumsList = [
    {title: BreadcrumsTitles[userLanguage]['HOME'], url: '/dashboard', last: false},
    {
      title: BreadcrumsTitles[userLanguage]['INSTITUTION_MANAGEMENT'],
      url: '/dashboard/manage-institutions',
      last: false,
    },
    {
      title: classData?.instituteName,
      goBack: true,
      last: false,
    },
    {
      title: BreadcrumsTitles[userLanguage]['Class_Creation'],
      url: `/dashboard/manage-institutions/institution/${classData.instituteId}/class-creation`,
      last: true,
    },
  ];

  const onChange = (e: any) => {
    setClassData({
      ...classData,
      name: e.target.value,
    });
    if (messages.show) {
      setMessages({
        show: false,
        message: '',
        isError: false,
      });
    }
  };

  const getBasicInstitutionInfo = async () => {
    const result: any = await API.graphql(
      graphqlOperation(customQueries.getInstitutionBasicInfo, {
        id: instId,
      })
    );
    setClassData((prevData) => ({
      ...prevData,
      instituteName: result?.data?.getInstitution.name,
    }));
  };

  const getImageURL = async (uniqKey: string) => {
    const imageUrl: any = await getImageFromS3(uniqKey);
    if (imageUrl) {
      return imageUrl;
    } else {
      return '';
    }
  };

  const onStudentSelect = (str: string, name: string, id: string, avatar: string) => {
    setNewMember({
      id: id,
      name: name,
      value: str,
      avatar: avatar,
    });
  };

  const addMemberToList = () => {
    if (newMember.id) {
      setSelectedStudent([
        ...selectedStudents,
        {
          name: newMember.name,
          id: newMember.id,
          avatar: newMember.avatar,
        },
      ]);
      setNewMember({id: '', name: '', value: '', avatar: ''});
    }
  };

  const removeStudentFromList = (id: string) => {
    const newList = selectedStudents.filter((item) => item.id !== id);
    setSelectedStudent(newList);
  };

  const getStudentsList = async () => {
    try {
      // Fetch persons with student role and active status.
      const list: any = await API.graphql(
        graphqlOperation(customQueries.fetchPersons, {
          filter: {
            role: {eq: 'ST'},
            status: {eq: 'ACTIVE'},
          },
          limit: 300,
        })
      );
      const sortedList = list.data.listPersons.items.sort((a: any, b: any) =>
        a.firstName?.toLowerCase() > b.firstName?.toLowerCase() ? 1 : -1
      );
      const personsList = Promise.all(
        sortedList.map(async (item: any, i: any) => ({
          id: item.id,
          name: `${item.firstName || ''} ${item.lastName || ''}`,
          value: `${item.firstName || ''} ${item.lastName || ''}`,
          avatar: item.image ? await getImageURL(item.image) : '',
          email: item.email || '',
          authId: item.authId || '',
        }))
      );
      personsList.then((res) => {
        setStudentList(res);
        setAllStudentList(res);
      });
    } catch {
      setMessages({
        show: true,
        message: classBuilderdict[userLanguage]['MESSAGES']['ERROR']['FETCHSTUDENT'],
        isError: true,
      });
    }
  };

  //####################################
  //  FOR SEARCHING THROUGH STUDENTS   #
  //####################################
  const fetchStudentList = async (searchQuery: string) => {
    // const result: any = await API.graphql(
    //   graphqlOperation(customQueries.listPersons, {
    //     filter: { role: { eq: 'ST' },
    //       status: { eq: 'ACTIVE' }, or: [{ firstName: { contains: searchQuery} }, { lastName: { contains: searchQuery } }] },
    //   })
    // );
    let result: any = await API.graphql(
      graphqlOperation(customQueries.fetchPersons, {
        filter: {
          role: {eq: 'ST'},
          status: {eq: 'ACTIVE'},
          or: [{firstName: {contains: searchQuery}}, {lastName: {contains: searchQuery}}],
        },
        limit: 300,
      })
    );
    const students = result.data.listPersons.items;
    const mappedStudents = students.map((item: any, i: any) => ({
      id: item.id,
      name: `${item.firstName || ''} ${item.lastName || ''}`,
      value: `${item.firstName || ''} ${item.lastName || ''}`,
      avatar: item.image ? getImageFromS3(item.image) : '',
      status: item.status || 'Inactive',
      email: item.email || '',
      authId: item.authId || '',
    }));
    setFilteredStudents(sortStudents(mappedStudents));
    setSearching(false);
  };

  const sortStudents = (studentList: any) => {
    return studentList.sort((personA: any, personB: any) =>
      personA.name[0] < personB.name[0] ? -1 : 1
    );
  };

  const clearFilteredStudents = () => {
    setFilteredStudents([]);
  };

  const saveAllStudentsData = async (classId: string) => {
    Promise.all(
      selectedStudents.map(async (item: any) => await saveStudentsList(item.id, classId))
    )
      .then((res) => {
        setMessages({
          show: true,
          message: classBuilderdict[userLanguage]['MESSAGES']['SUCCESS']['CLASSSAVE'],
          isError: false,
        });
        setSelectedStudent([]);
        setClassData({...initialData, instituteId: instId});
        setIsLoading(false);
      })
      .catch((err) => {
        setMessages({
          show: true,
          message: classBuilderdict[userLanguage]['MESSAGES']['ERROR']['STUDENTADDERROR'],
          isError: true,
        });
      });
  };

  const saveClassDetails = async () => {
    setIsLoading(true);
    const isValid = await validateForm();
    if (isValid) {
      try {
        const input = {
          name: classData.name,
          institutionID: classData.instituteId,
        };
        const newClass: any = await API.graphql(
          graphqlOperation(mutations.createClass, {input: input})
        );
        const classId = newClass.data.createClass.id;
        saveAllStudentsData(classId);
        toggleUpdateState();
      } catch {
        setIsLoading(false);
        setMessages({
          show: true,
          message: classBuilderdict[userLanguage]['MESSAGES']['ERROR']['SAVECLASSERROR'],
          isError: true,
        });
      }
    }
  };

  const saveStudentsList = async (id: string, classId: string) => {
    try {
      const stdEmail = allStudentList.find((item: any) => item.id === id).email;
      const authId = allStudentList.find((item: any) => item.id === id).authId;
      const input = {
        classID: classId,
        studentID: id,
        studentEmail: stdEmail,
        studentAuthID: authId,
      };
      const students: any = await API.graphql(
        graphqlOperation(customMutations.createClassStudent, {input: input})
      );
    } catch {
      setMessages({
        show: true,
        message: classBuilderdict[userLanguage]['MESSAGES']['ERROR']['STUDENTADDERROR'],
        isError: true,
      });
    }
  };

  const checkUniqClassName = async () => {
    try {
      const list: any = await API.graphql(
        graphqlOperation(queries.listClasss, {
          filter: {
            institutionID: {eq: classData.instituteId},
            name: {eq: classData.name},
          },
        })
      );
      return list.data.listClasss.items.length === 0 ? true : false;
    } catch {
      setMessages({
        show: true,
        message: classBuilderdict[userLanguage]['MESSAGES']['ERROR']['PROCESSINGERROR'],
        isError: true,
      });
    }
  };

  const validateForm = async () => {
    if (classData.name.trim() === '') {
      setMessages({
        show: true,
        message: classBuilderdict[userLanguage]['MESSAGES']['VALIDATION']['NAME'],
        isError: true,
      });
      return false;
    } else if (classData.instituteId === '') {
      setMessages({
        show: true,
        message: classBuilderdict[userLanguage]['MESSAGES']['VALIDATION']['INSTITUTE'],
        isError: true,
      });
      return false;
    } else if (classData.name.trim() !== '') {
      const isUniq = await checkUniqClassName();
      if (!isUniq) {
        setMessages({
          show: true,
          message: classBuilderdict[userLanguage]['MESSAGES']['VALIDATION']['CLASSNAME'],
          isError: true,
        });
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  };

  useEffect(() => {
    if (instId) {
      setClassData({
        ...classData,
        instituteId: instId,
      });
      getStudentsList();
      getBasicInstitutionInfo();
    } else {
      history.push('/dashboard/manage-institutions');
    }
  }, []);

  useEffect(() => {
    const previousList = [...allStudentList];
    const newList = previousList.filter(
      (item) => !selectedStudents.some((std) => std.id === item.id)
    );
    setStudentList(newList);
  }, [selectedStudents]);

  const {name} = classData;

  return (
    <div className="">
      {/* Section Header */}
      {/* <BreadCrums items={breadCrumsList} /> */}
      {/* <div className="flex justify-between">
        <SectionTitle
          title={classBuilderdict[userLanguage]['TITLE']}
          subtitle={classBuilderdict[userLanguage]['SUBTITLE']}
        />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons
            btnClass=""
            label="Go Back"
            onClick={() => goBackBreadCrumb(breadCrumsList, history)}
            Icon={IoArrowUndoCircleOutline}
          />
        </div>
      </div> */}
      <div className="px-8 py-4">
        <h3 className="text-lg leading-6 font-medium text-gray-900 w-auto capitalize">
          {classBuilderdict[userLanguage]['TITLE']}
        </h3>
        <div
          className="flex items-center mt-1 cursor-pointer text-gray-500 hover:text-gray-700"
          onClick={() =>
            history.push(`/dashboard/manage-institutions/institution/${instId}/class`)
          }>
          <span className="w-auto mr-2">
            <BsArrowLeft />
          </span>
          <div className="text-sm">{CommonlyUsedDict[userLanguage]['BACK_TO_LIST']}</div>
        </div>
      </div>

      {/* Body section */}
      <div className="px-8">
        <div className="w-6/10 m-auto">
          <div className="">
            <div className="px-3 py-4">
              <FormInput
                value={name}
                id="className"
                onChange={onChange}
                name="className"
                label={classBuilderdict[userLanguage]['NAME_LABEL']}
                isRequired
              />
            </div>
          </div>
        </div>
        <div className="flex items-center w-6/10 m-auto px-3">
          {/* REPLACED STANDARD DROPDOWN WITH SEARCH */}
          <SearchSelectorWithAvatar
            selectedItem={newMember}
            list={searching ? filteredStudents : studentList}
            placeholder={classBuilderdict[userLanguage]['MEMBER_PLACEHOLDER']}
            onChange={onStudentSelect}
            fetchStudentList={fetchStudentList}
            clearFilteredStudents={clearFilteredStudents}
            searchStatus={searching}
            searchCallback={setSearching}
            imageFromS3={false}
          />
          {/* <Buttons
            btnClass="ml-4 py-1"
            label={classBuilderdict[userLanguage]['BUTTON']['ADD']}
            onClick={addMemberToList}
          /> */}
          <AddButton
            className="ml-4 py-1"
            label={classBuilderdict[userLanguage]['BUTTON']['ADD']}
            onClick={addMemberToList}
          />
        </div>
        <div className="my-4 w-6/10 m-auto px-2 max-h-88 overflow-y-scroll">
          {selectedStudents.length > 0 && (
            <Fragment>
              {selectedStudents.map((item, index) => (
                <div
                  className="flex justify-between w-full items-center px-8 py-4 whitespace-nowrap border-b-0 border-gray-200"
                  key={index}>
                  <div className="flex w-3/10 items-center">
                    <div className="flex-shrink-0 h-10 w-10 flex items-center">
                      {item.avatar ? (
                        <img src={item.avatar} className="h-8 w-8 rounded-full" />
                      ) : (
                        <div
                          className="h-8 w-8 rounded-full flex justify-center items-center text-white text-sm text-bold"
                          style={{
                            background: `${stringToHslColor(
                              getInitialsFromString(item.name)[0] +
                                ' ' +
                                getInitialsFromString(item.name)[1]
                            )}`,
                            textShadow: '0.1rem 0.1rem 2px #423939b3',
                          }}>
                          {item.name
                            ? initials(
                                getInitialsFromString(item.name)[0],
                                getInitialsFromString(item.name)[1]
                              )
                            : initials('N', 'A')}
                        </div>
                      )}
                    </div>
                    <div className="ml-4">{item.name}</div>
                  </div>
                  <span
                    className="w-6 h-6 flex items-center cursor-pointer"
                    onClick={() => removeStudentFromList(item.id)}>
                    <IconContext.Provider value={{size: '1rem', color: '#000000'}}>
                      <IoClose />
                    </IconContext.Provider>
                  </span>
                </div>
              ))}
            </Fragment>
          )}
        </div>
        {messages.show ? (
          <div className="py-2 m-auto text-center">
            <p className={`${messages.isError ? 'text-red-600' : 'text-green-600'}`}>
              {messages.message && messages.message}
            </p>
          </div>
        ) : null}
        <div className="flex my-8 justify-center">
          <Buttons
            btnClass="my-8 py-3 px-12 text-sm"
            label={
              loading
                ? classBuilderdict[userLanguage]['BUTTON']['SAVING']
                : classBuilderdict[userLanguage]['BUTTON']['SAVE']
            }
            onClick={saveClassDetails}
            disabled={loading ? true : false}
          />
        </div>
      </div>
    </div>
  );
};

export default ClassBuilder;
