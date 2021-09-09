import React, {useContext, useEffect, useRef, useState} from 'react';
import {IoIosCheckmarkCircle} from 'react-icons/io';
import {Dialog} from '@headlessui/react';
import {XIcon} from '@heroicons/react/outline';
import API, {graphqlOperation} from '@aws-amplify/api';

import * as queries from '../../../../../graphql/queries';
import * as customQueries from '../../../../../customGraphql/customQueries';

import {GlobalContext} from '../../../../../contexts/GlobalContext';
import {ContextMenuProvider} from '../../../../../contexts/TreeContext';

import Selector from '../../../../Atoms/Form/Selector';

import {Tree} from '../../../../TreeView/Tree';
import {useHistory} from 'react-router';
import {
  getLocalStorageData,
  removeLocalStorageData,
  setLocalStorageData,
} from '../../../../../utilities/localStorage';
import {BsCircleFill} from 'react-icons/bs';
import Loader from '../../../../Atoms/Loader';
import {HiOutlineRefresh} from 'react-icons/hi';

const InformationalWalkThrough = ({open, onCancel}: any) => {
  const {state: {user: {associateInstitute = [], role = ''} = {}} = {}} = useContext(
    GlobalContext
  );
  const history = useHistory();
  const cancelButtonRef = useRef();
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<any>({
    id: 'inst',
    title: 'Institution Setup',
  });
  const [completedSections, setCompletedSections] = useState([]);
  const [selectedInstitution, setSelectedInstitution] = useState<any>({});
  const [institutionList, setInstitutionList] = useState<any>([]);

  const data: any = {
    title: 'root',
    children: [
      {
        title: `${selectedInstitution?.institution?.name || 'Institution'} Setup`,
        type: 'menu',
        id: 'inst',
        redirectionUrl: selectedInstitution?.institution?.id
          ? `/dashboard/manage-institutions/institution?id=${selectedInstitution?.institution?.id}`
          : '/dashboard/manage-institutions',
        children: [
          {
            title: 'General Info',
            type: 'list',
            children: [],
            id: 'inst_general_info',
            redirectionUrl: selectedInstitution?.institution?.id
              ? `/dashboard/manage-institutions/institution/edit?id=${selectedInstitution?.institution?.id}`
              : '/dashboard/manage-institutions',
          },
          {
            title: 'Staff',
            type: 'list',
            children: [],
            id: 'inst_staff',
            redirectionUrl: selectedInstitution?.institution?.id
              ? `/dashboard/manage-institutions/institution?id=${selectedInstitution?.institution?.id}&tab=1`
              : '/dashboard/manage-institutions',
          },
          {
            title: 'Classes',
            type: 'menu',
            children: [
              {
                title: 'Create Class',
                type: 'list',
                id: 'inst_classes_create',
                redirectionUrl: `/dashboard/manage-institutions/institution/class-creation?id=${selectedInstitution?.institution?.id}`,
              },
              {
                title: 'Add Student',
                type: 'list',
                id: 'inst_classes_add_student',
                redirectionUrl: '/dashboard/registration',
              },
            ],
            id: 'inst_classes',
            redirectionUrl: selectedInstitution?.institution?.id
              ? `/dashboard/manage-institutions/institution?id=${selectedInstitution?.institution?.id}&tab=1`
              : '/dashboard/manage-institutions',
          },
          {
            title: 'Curriculum',
            type: 'menu',
            id: 'inst_curriculum',
            redirectionUrl: selectedInstitution?.institution?.id
              ? `/dashboard/manage-institutions/institution?id=${selectedInstitution?.institution?.id}&tab=2`
              : '/dashboard/manage-institutions',
            children: [
              {
                title: 'Add Curriculum Information',
                type: 'list',
                id: 'inst_curriculum_general_info',
                redirectionUrl: selectedInstitution?.institution?.id
                  ? `/dashboard/manage-institutions/institution?id=${selectedInstitution?.institution?.id}&tab=2`
                  : '/dashboard/manage-institutions',
              },
              {
                title: 'Create Learning Objectives',
                type: 'list',
                children: [],
                id: 'inst_curriculum_learning_objectives',
                redirectionUrl: selectedInstitution?.institution?.id
                  ? `/dashboard/manage-institutions/institution?id=${selectedInstitution?.institution?.id}&tab=2`
                  : '/dashboard/manage-institutions',
              },
              {
                title: 'Create Units',
                type: 'menu',
                children: [
                  {
                    title: 'General Information',
                    type: 'list',
                    id: 'inst_curriculum_units_general_info',
                  },
                  {
                    title: 'Lesson Plan Manager',
                    type: 'list',
                    id: 'inst_curriculum_units_lesson_plan_manager',
                  },
                ],
                id: 'inst_curriculum_units',
                redirectionUrl: selectedInstitution?.institution?.id
                  ? `/dashboard/manage-institutions/institution?id=${selectedInstitution?.institution?.id}&tab=2`
                  : '/dashboard/manage-institutions',
              },
              {
                title: 'Demographics & Information',
                type: 'list',
                children: [],
                id: 'inst_curriculum_demographic_information',
                redirectionUrl: selectedInstitution?.institution?.id
                  ? `/dashboard/manage-institutions/institution?id=${selectedInstitution?.institution?.id}&tab=2`
                  : '/dashboard/manage-institutions',
              },
            ],
          },
          {
            title: 'Classroom',
            type: 'list',
            children: [],
            id: 'inst_curriculum_classroom',
            redirectionUrl: selectedInstitution?.institution?.id
              ? `/dashboard/manage-institutions/institution?id=${selectedInstitution?.institution?.id}&tab=4`
              : '/dashboard/manage-institutions',
          },
          {
            title: 'Service Providers',
            type: 'list',
            children: [],
            id: 'inst_curriculum_service_provider',
            redirectionUrl: selectedInstitution?.institution?.id
              ? `/dashboard/manage-institutions/institution?id=${selectedInstitution?.institution?.id}&tab=3`
              : '/dashboard/manage-institutions',
          },
        ],
      },
      {
        title: `${
          selectedInstitution?.institution?.name || 'Institution'
        } Lesson Builder`,
        type: 'menu',
        id: 'institution',
        redirectionUrl: selectedInstitution?.institution?.id
          ? `/dashboard/manage-institutions/institution?id=${selectedInstitution?.institution?.id}`
          : '/dashboard/manage-institutions',
      },
      {
        title: `${
          selectedInstitution?.institution?.name || 'Institution'
        } Service Provider Setup`,
        type: 'menu',
        id: 'institution',
        redirectionUrl: selectedInstitution?.institution?.id
          ? `/dashboard/manage-institutions/institution?id=${selectedInstitution?.institution?.id}`
          : '/dashboard/manage-institutions',
      },
    ],
  };

  useEffect(() => {
    const selected_institution: any = getLocalStorageData('selected_institution');
    if (associateInstitute?.length) {
      // if (!selected_institution?.institution?.id) {
      //   setLocalStorageData('selected_institution', associateInstitute[0]);
      //   setSelectedInstitution(associateInstitute[0]);
      // }
      setInstitutionList(
        associateInstitute.map((item: any) => ({
          ...item,
          name: item.institution.name,
          id: item.institution.id,
        }))
      );
      setLoading(false);
    }
    if (!associateInstitute?.length) {
      fetchInstListForAdmin();
    }
  }, [associateInstitute]);

  useEffect(() => {
    const setupActiveSection = async () => {
      const activeStep = getLocalStorageData('active_step_section');
      const selected_institution: any = getLocalStorageData('selected_institution');
      if (activeStep) {
        const data = await fetchDataOfActiveSection(
          activeStep.id,
          selected_institution?.institution?.id
        );
        setActiveSection({...activeStep, data});
      }
      if (selected_institution) {
        setSelectedInstitution(selected_institution);
      }
    };
    if (open) {
      setupActiveSection();
    }
  }, [open]);

  const fetchInstListForAdmin = async () => {
    const fetchInstitutionData: any = await API.graphql(
      graphqlOperation(customQueries.getInstListForAdmin)
    );
    setInstitutionList(
      fetchInstitutionData.data?.listInstitutions?.items?.map((item: any) => ({
        ...item,
        institution: {
          id: item.id,
          name: item.name,
        },
      })) || []
    );
    setLoading(false);
  };

  const onItemClick = async (section: {id: string; title: string}) => {
    setLocalStorageData('active_step_section', section);
    setCompletedSections((prevSections) => [...prevSections, section]);
    setActiveSection(section);
    const data = await fetchDataOfActiveSection(
      section.id,
      selectedInstitution?.institution?.id
    );
    setActiveSection({...section, data});
  };

  const fetchDataOfActiveSection = async (id: string, instId: string) => {
    switch (id) {
      case 'inst_general_info': {
        try {
          if (instId) {
            const result: any = await API.graphql(
              graphqlOperation(customQueries.getBasicDetailsOfInstitution, {
                id: instId,
              })
            );
            return result?.data.getInstitution;
          }
          return null;
        } catch (error) {
          console.log(error, 'error');
        }
      }
      case 'inst_general_info': {
        try {
          if (instId) {
            const result: any = await API.graphql(
              graphqlOperation(queries.listStaffs, {
                filter: {
                  or: [
                    {
                      institutionID: {eq: instId},
                    },
                  ],
                },
              })
            );
            return {
              staff: result.data.listStaffs.items.filter(
                (member: any) => member.staffMember.role === 'TR'
              ),
            };
          }
          return null;
        } catch (error) {
          console.log(error, 'error');
        }
      }
    }
  };

  const onInstituteChange = async (_: string, name: string, id: string) => {
    const selectedData = institutionList.find((item: any) => item.institution?.id === id);
    setSelectedInstitution(selectedData);
    setLocalStorageData('selected_institution', selectedData);
    if (activeSection) {
      const data = await fetchDataOfActiveSection(
        activeSection.id,
        selectedData?.institution?.id
      );
      setActiveSection((prevData: any) => ({...prevData, data}));
    }
  };

  const progressIndicator = (isCompleted: boolean) => {
    return (
      <span className="w-6 h-6 inline-flex justify-start items-center">
        {isCompleted ? (
          <IoIosCheckmarkCircle className="text-green-400" />
        ) : (
          <BsCircleFill className="w-2 h-2 ml-2 text-red-500" />
        )}
      </span>
    );
  };

  const stepsOfActiveSection = () => {
    switch (activeSection?.id) {
      case 'inst':
        return (
          <div className="mt-6">
            <div className="mb-4">
              Welcome to the institution setup section. There are 5 areas we will cover
              which are the following:
            </div>

            <ul className="mb-4">
              <li>1. General Information</li>
              <li>2. Staff</li>
              <li>3. Classes</li>
              <li>4. Curricular</li>
              <li>5. Classrooms</li>
            </ul>

            <div className="mb-4">
              All sections need to be completed for the app to work properly.{' '}
            </div>

            <div className="mb-4">
              Note: We will cover Service Providers in another section for those who are
              lending or using their curriculum or teachers to another institution.
            </div>
          </div>
        );
      case 'inst_general_info':
        return (
          <div className="mt-6">
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() =>
                    history.push(
                      `/dashboard/manage-institutions/institution?id=${
                        associateInstitute?.length
                          ? associateInstitute[0].institution?.id
                          : ''
                      }`
                    )
                  }>
                  1. Add Your Institution's Avatar
                </span>
                {progressIndicator(activeSection?.data?.image)}
              </div>
              <div className="my-1 ml-3 italic">
                Click the avatar circle to upload your organization's logo. SVG or PNG
                file extensions are recommended but jpg will work as well.
              </div>
            </div>
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="w-auto text-base font-bold cursor-pointer"
                  onClick={() =>
                    history.push(
                      `/dashboard/manage-institutions/institution/edit?id=${
                        associateInstitute?.length
                          ? associateInstitute[0].institution?.id
                          : ''
                      }`
                    )
                  }>
                  2. Enter your Institution's contact information
                </span>
                {progressIndicator(activeSection?.data?.address)}
              </div>
              <div className="my-1 ml-3 italic">
                Update the address, contact number and website of your organization. The
                service provider checkbox will be covered later.
              </div>
            </div>
          </div>
        );

      case 'inst_staff':
        return (
          <div className="mt-6">
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() => history.push(`/dashboard/registration`)}>
                  1. Add at least one teacher or fellow to your institution (required)
                </span>
                {progressIndicator(activeSection?.data?.staff?.length)}
              </div>
              <div className="my-1 ml-3 italic">
                <div>- A teacher is someone who works at one organization.</div>
                <div>- A fellow is someone who works at several organizations</div>
              </div>
            </div>
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="w-auto text-base font-bold cursor-pointer"
                  onClick={() =>
                    history.push(
                      `/dashboard/manage-institutions/institution/edit?id=${
                        associateInstitute?.length
                          ? associateInstitute[0].institution?.id
                          : ''
                      }`
                    )
                  }>
                  2. Add a builder (optional)
                </span>
              </div>
              <div className="my-1 ml-3 italic">
                Update the address, contact number and website of your organization. The
                service provider checkbox will be covered later.
              </div>
            </div>
          </div>
        );
      case 'inst_classes_create':
        return (
          <div className="mt-6">
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() => history.push(`/dashboard/registration`)}>
                  Create a class for your institution
                </span>
                {progressIndicator(false)}
              </div>
              <div className="my-1 ml-3 italic">
                Add a class name and click save. We will add students to the class in the
                next step.
              </div>
            </div>
          </div>
        );
      case 'inst_classes_add_student':
        return (
          <div className="mt-6">
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() => history.push(`/dashboard/registration`)}>
                  Add students to your class
                </span>
                {progressIndicator(false)}
              </div>
              <div className="my-1 ml-3 italic">
                Click the button to add a new person Add their name, email and select the
                student role.
              </div>
              <div className="my-1 ml-3 italic">
                Select the institute and the class you just created.
              </div>
              <div className="my-1 ml-3 italic">
                The group field is optional. This is if you want to add a level of
                classification for the group.
              </div>
            </div>
          </div>
        );
      case 'inst_curriculum_general_info':
        return (
          <div className="mt-6">
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() => history.push(`/dashboard/registration`)}>
                  1. Add curriculum image
                </span>
                {progressIndicator(false)}
              </div>
              <div className="my-1 ml-3 italic">
                Click the avatar square. SVG or PNG files are recommended but jpg files
                will work as well.
              </div>
            </div>
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() => history.push(`/dashboard/registration`)}>
                  2. Name your curriculum
                </span>
                {progressIndicator(false)}
              </div>
              <div className="my-1 ml-3 italic">
                For multi-lingual classrooms, you can have more than one lesson languages.
              </div>
            </div>
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() => history.push(`/dashboard/registration`)}>
                  3. Select the language(s) of your lessons
                </span>
                {progressIndicator(false)}
              </div>
            </div>
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() => history.push(`/dashboard/registration`)}>
                  4. Add the people who contributed to the design of the curriculum
                </span>
                {progressIndicator(false)}
              </div>
              <div className="my-1 ml-3 italic">
                Can be a mix of teachers and builders
              </div>
            </div>
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() => history.push(`/dashboard/registration`)}>
                  5. Select the audience of your curriculum
                </span>
                {progressIndicator(false)}
              </div>
              <div className="my-1 ml-3 italic">
                Add a class name and click save. We will add students to the class in the
                next step.
              </div>
            </div>
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() => history.push(`/dashboard/registration`)}>
                  6. Add the purpose, description and objective of the course
                </span>
                {progressIndicator(false)}
              </div>
              <div className="my-1 ml-3 italic">
                Add a class name and click save. We will add students to the class in the
                next step.
              </div>
            </div>
          </div>
        );
      case 'inst_curriculum_learning_objectives':
        return (
          <div className="mt-6">
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() => history.push(`/dashboard/registration`)}>
                  1. Click on Add Learning Objective button
                </span>
                {progressIndicator(false)}
              </div>
              <div className="my-1 ml-3 italic">
                Click the avatar square. SVG or PNG files are recommended but jpg files
                will work as well.
              </div>
            </div>
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() => history.push(`/dashboard/registration`)}>
                  2. Create Learning Objective and add a description
                </span>
                {progressIndicator(false)}
              </div>
              <div className="my-1 ml-3 italic">
                For multi-lingual classrooms, you can have more than one lesson languages.
              </div>
            </div>
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() => history.push(`/dashboard/registration`)}>
                  3. Add a topic to the Learning Objective
                </span>
                {progressIndicator(false)}
              </div>
            </div>
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() => history.push(`/dashboard/registration`)}>
                  4. Add description and rubric to your topic
                </span>
                {progressIndicator(false)}
              </div>
              <div className="my-1 ml-3 italic">
                Can be a mix of teachers and builders
              </div>
            </div>
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() => history.push(`/dashboard/registration`)}>
                  5. Add at least one measurements to your topic
                </span>
                {progressIndicator(false)}
              </div>
              <div className="my-1 ml-3 italic">
                Add a class name and click save. We will add students to the class in the
                next step.
              </div>
            </div>
          </div>
        );
      case 'inst_curriculum_units_general_info':
        return (
          <div className="mt-6">
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() => history.push(`/dashboard/registration`)}>
                  1. Enter name of unit
                </span>
                {progressIndicator(false)}
              </div>
              <div className="my-1 ml-3 italic">
                Click the avatar square. SVG or PNG files are recommended but jpg files
                will work as well.
              </div>
            </div>
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() => history.push(`/dashboard/registration`)}>
                  2. Select the languages of the lessons
                </span>
                {progressIndicator(false)}
              </div>
              <div className="my-1 ml-3 italic">
                For multi-lingual classrooms, you can have more than one lesson languages.
              </div>
            </div>
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() => history.push(`/dashboard/registration`)}>
                  3. Add the description of the description, objectives, policies, purpose
                  and methodologies of the unit
                </span>
                {progressIndicator(false)}
              </div>
            </div>
          </div>
        );
      case 'inst_curriculum_units_lesson_plan_manager':
        return (
          <div className="mt-6">
            <div className="mb-4">
              <div className="text-base flex item-center">
                <span
                  className="cursor-pointer w-auto font-bold"
                  onClick={() => history.push(`/dashboard/registration`)}>
                  1. Click on the New Lesson button
                </span>
                {progressIndicator(false)}
              </div>
              <div className="my-1 ml-3 italic">
                One lesson for the institution is in the lesson table
              </div>
            </div>
          </div>
        );

      default:
        break;
    }
  };

  const resetData = () => {
    setActiveSection({id: 'inst', title: 'Institution Setup'});
    setSelectedInstitution({});
    removeLocalStorageData('active_step_section');
    removeLocalStorageData('selected_institution');
  };

  return (
    <Dialog
      as="div"
      static
      className={`
            fixed inset-0 transition-all ease-in-out duration-300 
            z-100
            ${open ? 'w-auto' : 'w-0 opacity-0 overflow-hidden bg-black bg-opacity-50'}
`}
      initialFocus={cancelButtonRef}
      open={open}
      onClose={onCancel}>
      <div className="absolute inset-0 overflow-hidden">
        <Dialog.Overlay className="absolute inset-0 w-auto" />

        <div
          className={` 
              fixed w-auto inset-y-0 right-0 pl-10 max-w-full flex sm:pl-16
              transform transition ease-in-out duration-500 sm:duration-700
              ${open ? 'translate-x-0' : 'translate-x-full'}
              `}>
          <div className="w-auto max-w-2xl">
            <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
              <div className="flex-1">
                {/* Header */}
                <div className="px-4 py-6 bg-gray-50 sm:px-6">
                  <div className="flex items-start justify-between space-x-3">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          {`${
                            selectedInstitution?.institution?.name || ''
                          } Set-Up Navigator`}
                        </Dialog.Title>
                        {selectedInstitution?.institution?.id ? (
                          <span className="w-auto cursor-pointer" onClick={resetData}>
                            <HiOutlineRefresh className="w-6 h-6" />
                          </span>
                        ) : (
                          role === 'ADM' &&
                          (!associateInstitute?.length ||
                            associateInstitute?.length > 1) && (
                            <Selector
                              selectedItem={selectedInstitution?.institution?.name}
                              label={''}
                              placeholder={'Select institution'}
                              list={institutionList}
                              onChange={onInstituteChange}
                            />
                          )
                        )}
                      </div>
                    </div>
                    <div className="h-7 w-auto flex items-center">
                      <button
                        ref={cancelButtonRef}
                        type="button"
                        className="w-auto bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onClick={onCancel}>
                        <span className="sr-only">Close panel</span>
                        <XIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
                {loading ? (
                  <div className="h-100 flex justify-center items-center">
                    <div className="w-5/10">
                      <Loader />
                    </div>
                  </div>
                ) : (
                  <div style={{minHeight: 'calc(100vh - 76px)'}} className={'w-256 flex'}>
                    {/* <div
                    className="grid grid-cols-2"
                    style={{height: 'calc(100vh - 76px)'}}> */}
                    <div className="bg-indigo-100 p-4 w-2/5">
                      <div className="text-xl font-bold mb-4">Sections</div>
                      <ContextMenuProvider>
                        <Tree
                          root={data}
                          hoverClassName={'bg-indigo-200'}
                          textClassName={'text-gray-900 font-medium'}
                          onItemClick={onItemClick}
                          activeSectionId={activeSection?.id}
                        />
                      </ContextMenuProvider>
                    </div>
                    <div className="p-4 w-3/5">
                      <div className="text-lg font-bold">
                        Steps for Setting up {activeSection?.title}
                      </div>
                      <hr className="my-2 text-gray-500" />
                      {stepsOfActiveSection()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default InformationalWalkThrough;
