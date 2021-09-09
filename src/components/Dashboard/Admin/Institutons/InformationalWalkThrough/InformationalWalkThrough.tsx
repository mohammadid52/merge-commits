import React, {useContext, useEffect, useRef, useState} from 'react';
import {IoIosCheckmarkCircle} from 'react-icons/io';
import {Dialog} from '@headlessui/react';
import {XIcon} from '@heroicons/react/outline';
import API, {graphqlOperation} from '@aws-amplify/api';

import * as customQueries from '../../../../../customGraphql/customQueries';

import {GlobalContext} from '../../../../../contexts/GlobalContext';
import {ContextMenuProvider} from '../../../../../contexts/TreeContext';

import Selector from '../../../../Atoms/Form/Selector';

import {Tree} from '../../../../TreeView/Tree';
import {useHistory} from 'react-router';
import {
  getLocalStorageData,
  setLocalStorageData,
} from '../../../../../utilities/localStorage';
import {BsCircleFill} from 'react-icons/bs';

const InformationalWalkThrough = ({open, onCancel}: any) => {
  const {state: {user: {associateInstitute = [], role = ''} = {}} = {}} = useContext(
    GlobalContext
  );
  const history = useHistory();
  const cancelButtonRef = useRef();
  const [activeSection, setActiveSection] = useState<any>(null);
  const [completedSections, setCompletedSections] = useState([]);
  const [selectedInstitution, setSelectedInstitution] = useState<any>({});

  const data: any = {
    title: 'root',
    children: [
      {
        title: `${
          selectedInstitution ? selectedInstitution?.institution?.name : 'Institution'
        }`,
        type: 'menu',
        id: 'institution',
        redirectionUrl: `/dashboard/manage-institutions/institution?id=${selectedInstitution?.institution?.id}`,
        children: [
          {
            title: 'General Info',
            type: 'list',
            children: [],
            id: 'inst_general_info',
            redirectionUrl: `/dashboard/manage-institutions/institution/edit?id=${selectedInstitution?.institution?.id}`,
          },
          {
            title: 'Classes',
            type: 'list',
            children: [],
            id: 'inst_classes',
            redirectionUrl: `/dashboard/manage-institutions/institution?id=${selectedInstitution?.institution?.id}&tab=1`,
          },
          {
            title: 'Staff',
            type: 'list',
            children: [],
            id: 'inst_staff',
            redirectionUrl: `/dashboard/manage-institutions/institution?id=${selectedInstitution?.institution?.id}&tab=1`,
          },
          {
            title: 'Curriculum',
            type: 'menu',
            id: 'inst_curriculum',
            redirectionUrl: `/dashboard/manage-institutions/institution?id=${selectedInstitution?.institution?.id}&tab=2`,
            children: [
              {
                title: 'General Info',
                type: 'list',
                id: 'inst_curriculum_general_info',
                redirectionUrl: `/dashboard/manage-institutions/institution?id=${selectedInstitution?.institution?.id}&tab=2`,
              },
              {
                title: 'Learning Objectives',
                type: 'list',
                children: [],
                id: 'inst_curriculum_learning_objectives',
                redirectionUrl: `/dashboard/manage-institutions/institution?id=${selectedInstitution?.institution?.id}&tab=2`,
              },
              {
                title: 'Units',
                type: 'list',
                children: [],
                id: 'inst_curriculum_units',
                redirectionUrl: `/dashboard/manage-institutions/institution?id=${selectedInstitution?.institution?.id}&tab=2`,
              },
              {
                title: 'Demographics & Information',
                type: 'list',
                children: [],
                id: 'inst_curriculum_demographic_information',
                redirectionUrl: `/dashboard/manage-institutions/institution?id=${selectedInstitution?.institution?.id}&tab=2`,
              },
            ],
          },
          {
            title: 'Classroom',
            type: 'list',
            children: [],
            id: 'inst_curriculum_classroom',
            redirectionUrl: `/dashboard/manage-institutions/institution?id=${selectedInstitution?.institution?.id}&tab=4`,
          },
          {
            title: 'Service Providers',
            type: 'list',
            children: [],
            id: 'inst_curriculum_service_provider',
            redirectionUrl: `/dashboard/manage-institutions/institution?id=${selectedInstitution?.institution?.id}&tab=3`,
          },
        ],
      },
    ],
  };

  useEffect(() => {
    const selected_institution: any = getLocalStorageData('selected_institution');
    if (associateInstitute?.length && !selected_institution?.institution?.id) {
      setLocalStorageData('selected_institution', associateInstitute[0]);
      setSelectedInstitution(associateInstitute[0]);
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

  const onItemClick = async (section: {id: string; title: string}) => {
    setLocalStorageData('active_step_section', section);
    setCompletedSections((prevSections) => [...prevSections, section]);
    const data = await fetchDataOfActiveSection(section.id);
    setActiveSection({...section, data});
  };

  const fetchDataOfActiveSection = async (id: string, instId?: string) => {
    switch (id) {
      case 'inst_general_info': {
        try {
          if (instId || selectedInstitution?.institution?.id) {
            const result: any = await API.graphql(
              graphqlOperation(customQueries.getBasicDetailsOfInstitution, {
                id: instId || selectedInstitution?.institution?.id || '',
              })
            );
            return result?.data.getInstitution;
          }
          return null;
        } catch (error) {
          console.log(error, 'error');
        }
      }
    }
  };

  const onInstituteChange = async (_: string, name: string, id: string) => {
    const selectedData = associateInstitute.find(
      (item: any) => item.institution?.id === id
    );
    setSelectedInstitution(selectedData);
    setLocalStorageData('selected_institution', selectedData);

    const data = await fetchDataOfActiveSection(
      activeSection.id,
      selectedData?.institution?.id
    );
    setActiveSection((prevData: any) => ({...prevData, data}));
  };

  const stepsOfActiveSection = () => {
    return (
      <>
        <div className="h-3/4 mt-6">
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
              <span className="w-6 h-6 inline-flex justify-start items-center">
                {activeSection?.data?.image ? (
                  <IoIosCheckmarkCircle className="text-green-400" />
                ) : (
                  <BsCircleFill className="w-2 h-2 ml-2 text-red-500" />
                )}
              </span>
            </div>
            <div className="my-1 ml-3 italic">
              Click the avatar circle to upload your organization's logo. SVG or PNG file
              extensions are recommended but jpg will work as well.
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
              <span className="w-6 h-6 inline-flex justify-start items-center">
                {activeSection?.data?.address ? (
                  <IoIosCheckmarkCircle className="text-green-400" />
                ) : (
                  <BsCircleFill className="w-2 h-2 ml-2 text-red-500" />
                )}
              </span>
            </div>
            <div className="my-1 ml-3 italic">
              Update the address, contact number and website of your organization. The
              service provider checkbox will be covered later.
            </div>
          </div>
        </div>
        {/* <hr className="my-2 text-gray-500" />
        <div className="h-1/4">
          <div className="my-1">
            <div className="font-bold">Notes:</div>Click the avatar circle to upload your
            organization's logo. SVG or PNG file extensions are recommended but jpg will
            work as well.
          </div>
        </div> */}
      </>
    );
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
                          {`${selectedInstitution?.institution?.name} Set-Up Navigator`}
                        </Dialog.Title>
                        {role === 'ADM' && associateInstitute?.length > 1 && (
                          <Selector
                            selectedItem={selectedInstitution?.institution?.name}
                            label={''}
                            placeholder={'Select institution'}
                            list={associateInstitute.map((item: any) => ({
                              ...item,
                              name: item.institution.name,
                              id: item.institution.id,
                            }))}
                            onChange={onInstituteChange}
                          />
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

                {/* Divider container */}
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
                {/* </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default InformationalWalkThrough;
