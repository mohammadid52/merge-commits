import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {Dialog} from '@headlessui/react';
import {XIcon} from '@heroicons/react/outline';
import React, {memo, useEffect, useRef, useState} from 'react';

import {getAsset} from 'assets';
import {useGlobalContext} from 'contexts/GlobalContext';
import * as customMutations from 'customGraphql/customMutations';
import * as customQueries from 'customGraphql/customQueries';
import useDictionary from 'customHooks/dictionary';

import CheckBox from 'atoms/Form/CheckBox';
import FormInput from 'atoms/Form/FormInput';
import Selector from 'atoms/Form/Selector';

interface IClassroomStudents {
  id?: string;
  studentEmail: string;
  studentAuthId: string;
  studentType?: string | null;
  studentNote?: string | null;
  checked?: boolean;
}

interface IGroupFields {
  groupId?: string;
  groupName: string;
  groupLocation: string;
  classroomGroupsStudents: Array<IClassroomStudents>;
  groupAdvisor: {id: string; name: string};
}

interface IGroupFormProps {
  groupData: any;
  groupType: 'Proficiency' | 'Partner';
  onCancel: () => void;
  open: boolean;
  postMutation: (data: any) => void;
  roomData: any;
}

const GroupFormComponent = ({
  groupData,
  groupType,
  onCancel,
  open,
  postMutation,
  roomData
}: IGroupFormProps) => {
  const [isMounted, setIsMounted] = useState(false);

  const cancelButtonRef = useRef<any>(null);
  const {advisorOptions = []} = roomData || {};
  const {clientKey, userLanguage} = useGlobalContext();
  const themeColor = getAsset(clientKey, 'themeClassName');

  const {BUTTONS, GroupFormDict} = useDictionary();

  const [saving, setSaving] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<IGroupFields>({
    groupName: '',
    groupAdvisor: {id: '', name: ''},
    groupLocation: '',
    classroomGroupsStudents: []
  });
  const [errors, setErrors] = useState({
    groupName: '',
    groupAdvisor: ''
  });
  const [classStudents, setClassStudents] = useState<any>([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (roomData.class?.id) {
      fetchClassStudents(roomData.class?.id);
    }
  }, [roomData.class?.id]);

  useEffect(() => {
    if (groupData?.id) {
      setFormValues({
        groupId: groupData?.id,
        groupName: groupData.groupName,
        groupAdvisor: {
          id: groupData.groupAdvisor?.id,
          name: `${groupData.groupAdvisor?.firstName} ${groupData.groupAdvisor?.lastName}`
        },
        groupLocation: groupData.groupLocation,
        classroomGroupsStudents: groupData?.classroomGroupsStudents.items?.map(
          (student: any) => ({
            id: student.id,
            checked: true,
            studentAuthId: student.studentAuthId,
            studentEmail: student.studentEmail
          })
        )
      });
    } else {
      setFormValues({
        groupName: '',
        groupAdvisor: {id: '', name: ''},
        groupLocation: '',
        classroomGroupsStudents: []
      });
    }
  }, [groupData]);

  const fetchClassStudents = async (id: string) => {
    try {
      const result: any = await API.graphql(
        graphqlOperation(customQueries.getClassDetails, {id})
      );
      const students = result.data.getClass?.students?.items;
      setClassStudents(students);
    } catch (error) {}
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name: string = (event.target as HTMLInputElement).name;
    const value: string = (event.target as HTMLInputElement).value;

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
  };

  const handleAdvisorChange = (name: string, option: any) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      groupAdvisor: {name, id: option.id}
    }));
  };

  const handleStudentSelectionDeselection = (
    event: React.ChangeEvent<HTMLInputElement>,
    data: IClassroomStudents
  ) => {
    const checked: boolean = (event.target as HTMLInputElement).checked;
    setFormValues((prevValues) => ({
      ...prevValues,
      classroomGroupsStudents: checked
        ? [...prevValues.classroomGroupsStudents, {...data, checked}]
        : prevValues.classroomGroupsStudents.map((student) =>
            student.studentAuthId === data.studentAuthId ? {...student, checked} : student
          )
    }));
  };

  const validateForm = () => {
    const errorMessages: any = {};
    let isValid: boolean = true;
    if (!formValues.groupName) {
      errorMessages.groupName = GroupFormDict[userLanguage]['MESSAGES']['GROUP_NAME'];
      isValid = false;
    }
    if (!formValues.groupAdvisor?.id) {
      errorMessages.groupAdvisor =
        GroupFormDict[userLanguage]['MESSAGES']['GROUP_ADVISOR'];
      isValid = false;
    }
    setErrors(errorMessages);
    return isValid;
  };

  const handleSubmit = async () => {
    const iSValid = validateForm();
    try {
      if (iSValid) {
        setSaving(true);
        const advisorData = advisorOptions.find(
          (teacher: any) => teacher.id === formValues.groupAdvisor?.id
        );
        if (formValues.groupId) {
          const result: any = await API.graphql(
            graphqlOperation(customMutations.updateClassroomGroups, {
              input: {
                id: formValues.groupId,
                classRoomID: roomData.id,
                groupName: formValues.groupName,
                groupType,
                advisorEmail: advisorData?.email,
                advisorAuthId: advisorData?.authId,
                groupLocation: formValues.groupLocation
              }
            })
          );
          const classRoomGroupStudents = await updateGroupStudents(formValues.groupId);
          postMutation({
            ...result.data?.updateClassroomGroups,
            classroomGroupsStudents: classRoomGroupStudents
          });
        } else {
          const result: any = await API.graphql(
            graphqlOperation(customMutations.createClassroomGroups, {
              input: {
                classRoomID: roomData.id,
                groupName: formValues.groupName,
                groupType,
                advisorEmail: advisorData?.email,
                advisorAuthId: advisorData?.authId,
                groupLocation: formValues.groupLocation
              }
            })
          );
          const classRoomGroupStudents = await updateGroupStudents(
            result?.data?.createClassroomGroups.id
          );
          postMutation({
            ...result.data?.createClassroomGroups,
            classroomGroupsStudents: classRoomGroupStudents
          });
        }
        setSaving(false);
      }
    } catch (error) {
      setSaving(false);
    }
  };

  const updateGroupStudents = async (groupId: string) => {
    let classRoomGroupStudents: any[] = [];
    if (formValues.classroomGroupsStudents?.length) {
      await Promise.all(
        formValues.classroomGroupsStudents?.map(async (student: any) => {
          if (student.checked) {
            if (!student.id) {
              const result: any = await API.graphql(
                graphqlOperation(customMutations.createClassroomGroupStudents, {
                  input: {
                    classRoomGroupID: groupId,
                    studentEmail: student.studentEmail,
                    studentAuthId: student.studentAuthId
                    // studentType: string | null,
                    // studentNote: string | null,
                  }
                })
              );
              classRoomGroupStudents =
                result?.data?.createClassroomGroupStudents?.classRoomGroup
                  .classroomGroupsStudents;
            }
          } else {
            const result: any = await API.graphql(
              graphqlOperation(customMutations.deleteClassroomGroupStudents, {
                input: {
                  id: student.id // Database generated unique id
                }
              })
            );
            classRoomGroupStudents =
              result?.data?.deleteClassroomGroupStudents?.classRoomGroup
                .classroomGroupsStudents;
          }
        })
      );
      return classRoomGroupStudents;
    }
    return null;
  };

  if (!isMounted) {
    return null;
  }

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
                      <Dialog.Title className="text-lg font-medium text-gray-900">
                        {GroupFormDict[userLanguage]['HEADING']}
                      </Dialog.Title>
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
                <div style={{minHeight: 'calc(100vh - 170px)'}}>
                  <div className="py-6 space-y-6 sm:py-0 sm:space-y-0 sm:divide-y sm:divide-gray-200">
                    <div
                      className={
                        'space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-4 sm:px-6 sm:py-5'
                      }>
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2">
                          {GroupFormDict[userLanguage]['LABELS']['GROUP_NAME']}{' '}
                          <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <div className="sm:col-span-3">
                        <FormInput
                          name="groupName"
                          placeHolder={
                            GroupFormDict[userLanguage]['PLACEHOLDERS']['GROUP_NAME']
                          }
                          value={formValues.groupName}
                          onChange={handleInputChange}
                          id="name"
                          error={errors?.groupName}
                        />
                      </div>
                    </div>
                    <div className="space-y-1 px-6 sm:space-y-0 sm:grid sm:grid-cols-4 sm:px-10 sm:py-5">
                      <div>
                        <label
                          htmlFor="project-name"
                          className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2">
                          {GroupFormDict[userLanguage]['LABELS']['ADVISOR']}{' '}
                          <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <div className="sm:col-span-3">
                        <Selector
                          onChange={handleAdvisorChange}
                          selectedItem={formValues.groupAdvisor?.name}
                          list={advisorOptions}
                          placeholder={
                            GroupFormDict[userLanguage]['PLACEHOLDERS']['ADVISOR']
                          }
                          error={errors?.groupAdvisor}
                        />
                      </div>
                    </div>

                    <div
                      className={
                        'space-y-1 px-6 sm:space-y-0 sm:grid sm:grid-cols-4 sm:px-10 sm:py-5'
                      }>
                      <div>
                        <label
                          htmlFor="location"
                          className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2">
                          {GroupFormDict[userLanguage]['LABELS']['LOCATION']}
                        </label>
                      </div>
                      <div className="sm:col-span-3">
                        <FormInput
                          name="groupLocation"
                          placeHolder={
                            GroupFormDict[userLanguage]['PLACEHOLDERS']['LOCATION']
                          }
                          value={formValues.groupLocation}
                          onChange={handleInputChange}
                          id="location"
                        />
                      </div>
                    </div>
                  </div>
                  <div className={'space-y-1 px-6 sm:space-y-0 sm:px-10 mt-6'}>
                    <div
                      className={`text-lg font-medium mb-1 border-b-0 border-${
                        themeColor === 'iconoclastIndigo' ? 'indigo' : 'blue'
                      }-500`}>
                      {GroupFormDict[userLanguage]['LABELS']['STUDENTS']}
                    </div>
                    <div className="mt-6">
                      <ul className="">
                        {classStudents?.length ? (
                          <>
                            {classStudents.map((student: any) => (
                              <li
                                className="flex justify-between items-center truncate"
                                key={student.id}>
                                <span className="pr-2 text-lg truncate">
                                  {`${student.student?.lastName}, ${
                                    student.student?.preferredName
                                      ? student.student?.preferredName
                                      : student.student?.firstName
                                  }`}
                                </span>
                                <span className="w-auto">
                                  <CheckBox
                                    value={Boolean(
                                      formValues.classroomGroupsStudents.find(
                                        (item) =>
                                          item.studentAuthId === student.studentAuthID
                                      )?.checked
                                    )}
                                    onChange={(event) =>
                                      handleStudentSelectionDeselection(event, {
                                        studentAuthId: student.studentAuthID,
                                        studentEmail: student.studentEmail
                                      })
                                    }
                                    name="studentId"
                                  />
                                </span>
                              </li>
                            ))}
                          </>
                        ) : (
                          <div className="text-sm">No Student in the class</div>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
                <hr className="my-2 text-gray-500" />

                {/* Action buttons */}
                <div className="flex-shrink-0 px-4 border-t border-gray-200 py-5 sm:px-6">
                  <div className="space-x-3 flex justify-end">
                    <button
                      type="button"
                      className="w-auto bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={onCancel}>
                      {BUTTONS[userLanguage]['CANCEL']}
                    </button>
                    <button
                      disabled={saving}
                      onClick={handleSubmit}
                      className="w-auto inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      {saving
                        ? BUTTONS[userLanguage]['SAVING']
                        : BUTTONS[userLanguage]['SAVE']}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default memo(GroupFormComponent);
