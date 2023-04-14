import {API, graphqlOperation} from 'aws-amplify';
import React, {useEffect, useState} from 'react';

import Buttons from 'atoms/Buttons';
import FormInput from 'atoms/Form/FormInput';
import MultipleSelector from 'atoms/Form/MultipleSelector';

import Label from '@components/Atoms/Form/Label';
import Selector from '@components/Atoms/Form/Selector';
import ModalPopUp from '@components/Molecules/ModalPopUp';
import {RoomStatus} from 'API';
import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import {
  updateUniversalSyllabus,
  createUniversalSyllabus,
  deleteUniversalSyllabus
} from 'graphql/mutations';
import {languageList} from 'utilities/staticData';
import {RoomStatusList} from '../CourseBuilder/CourseFormComponent';
import AttachedCourses from './AttachedCourses';
import {Popconfirm, Space} from 'antd';
import {logError} from 'graphql-functions/functions';
import useAuth from '@customHooks/useAuth';
import {listUniversalLessonsOptions} from '@customGraphql/customQueries';
import {getUniversalSyllabus} from '@customGraphql/customQueries';
import {orderBy} from 'lodash';

interface AddSyllabusProps {
  syllabusDetails?: any;
  postAddSyllabus: (syllabusId: string) => void;
  onCancel: () => void;
  instId: string;
  isInModal?: boolean;
  curricular?: any;
  setSyllabusDataParent?: React.Dispatch<React.SetStateAction<any>>;
}
interface InitialData {
  name: string;
  description: string;
  methodology: string;
  policies: string;
  purpose: string;
  priorities: string;
  objectives: string;
  secondary: string;
  status: RoomStatus;

  languages: {id: string; name: string; value: string}[];
}

const UnitFormComponent = ({
  onCancel,
  postAddSyllabus,
  syllabusDetails,
  instId,
  setSyllabusDataParent,
  curricular
}: AddSyllabusProps) => {
  const initialData = {
    name: '',
    description: '',
    methodology: '',
    policies: '',
    purpose: '',
    objectives: '',
    priorities: '',
    secondary: '',
    status: RoomStatus.ACTIVE,
    languages: [{id: '1', name: 'English', value: 'EN'}]
  };
  const [syllabusData, setSyllabusData] = useState<InitialData>(initialData);

  const [loading, setIsLoading] = useState(false);
  const {userLanguage} = useGlobalContext();

  const {AddSyllabusDict, UserEditDict} = useDictionary();

  const [messages, setMessages] = useState({
    show: false,
    message: '',
    isError: false
  });

  useEffect(() => {
    if (syllabusDetails?.id) {
      setSyllabusData({
        ...syllabusDetails,
        name: syllabusDetails.name,
        languages: languageList.filter((item) =>
          syllabusDetails.languages.includes(item.value)
        ),
        description: syllabusDetails.description,
        objectives: syllabusDetails.objectives,
        purpose: syllabusDetails?.purpose,
        methodology: syllabusDetails?.methodology,
        policies: syllabusDetails?.policies,
        priorities: syllabusDetails?.priorities,
        status: syllabusDetails?.status || RoomStatus.ACTIVE
      });
    }
  }, [syllabusDetails]);

  const onInputChange = (e: any) => {
    setSyllabusData({
      ...syllabusData,
      [e.target.name]: e.target.value
    });
    if (messages.show) {
      setMessages({
        show: false,
        message: '',
        isError: false
      });
    }
  };

  const selectLanguage = (_: string[], option: any[]) => {
    setSyllabusData({
      ...syllabusData,
      languages: option
    });
  };

  const saveSyllabusDetails = async () => {
    const isValid = await validateForm();
    if (isValid) {
      try {
        setIsLoading(true);
        const languagesCode = syllabusData.languages.map(
          (item: {value: string}) => item.value
        );
        const input: any = {
          institutionID: instId,
          name: syllabusData.name,
          description: syllabusData.description,
          methodology: syllabusData.methodology,
          policies: syllabusData.policies,
          pupose: syllabusData.purpose,
          objectives: syllabusData.objectives,
          languages: languagesCode,
          universalLessonsSeq: [],
          priorities: syllabusData?.priorities,
          secondary: syllabusData?.secondary || '',

          status: syllabusData?.status || RoomStatus.ACTIVE
        };
        if (syllabusDetails?.id) {
          const res: any = await API.graphql(
            graphqlOperation(updateUniversalSyllabus, {
              input: {...input, id: syllabusDetails?.id}
            })
          );
          const savedData = res.data.updateUniversalSyllabus;
          setSyllabusDataParent &&
            setSyllabusDataParent({
              ...syllabusData,
              institutionID: savedData.institutionID,
              id: savedData.id,
              name: savedData.name,
              languages: languageList.filter((item) =>
                savedData.languages.includes(item.value)
              ),
              description: savedData.description,
              objectives: savedData.objectives,
              purpose: savedData.pupose,
              methodology: savedData.methodology,
              policies: savedData.policies,
              lessonHistory: savedData.lessonHistory,
              secondary: savedData.secondary || '',
              priorities: savedData.priorities,
              status: savedData.status || RoomStatus.ACTIVE
            });
          setMessages({
            show: true,
            message: AddSyllabusDict[userLanguage]['messages']['unitupdate'],
            isError: false
          });
          setIsLoading(false);
        } else {
          const newSyllabus: any = await API.graphql(
            graphqlOperation(createUniversalSyllabus, {input})
          );
          const newItem = newSyllabus.data.createUniversalSyllabus;

          if (newItem) {
            postAddSyllabus(newItem.id);
          } else {
            console.error('Could not add unit');
          }
        }
      } catch {
        setMessages({
          show: true,
          message: AddSyllabusDict[userLanguage]['messages']['unablesave'],
          isError: true
        });
      }
    }
  };

  const validateForm = async () => {
    if (syllabusData.name.trim() === '') {
      setMessages({
        show: true,
        message: AddSyllabusDict[userLanguage]['messages']['namerequired'],
        isError: true
      });
      return false;
    }
    // TODO: Need to confirm that syllabus name should be uniq or not?
    else {
      return true;
    }
  };

  const [warnModal, setWarnModal] = useState({
    show: false,
    message: 'message',
    onSaveAction: () => {}
  });

  const closeModal = () => {
    setWarnModal({show: false, message: '', onSaveAction: () => {}});
  };

  const selectStatus = (val: RoomStatus) => {
    setSyllabusData({...syllabusData, status: val});
    closeModal();
  };

  const beforeStatusChange = (name: RoomStatus) => {
    if (name === RoomStatus.INACTIVE) {
      setWarnModal({
        show: true,
        message:
          'By setting this unit to inactive, students will no longer see the unit lessons when they log in. Do you wish to continue?',
        onSaveAction: () => selectStatus(name)
      });
    } else {
      selectStatus(name);
    }
  };

  const {authId, email} = useAuth();

  const onUnitDelete = async () => {
    try {
      await API.graphql(
        graphqlOperation(deleteUniversalSyllabus, {
          input: {id: syllabusDetails?.id}
        })
      );
    } catch (error) {
      console.error(error);

      logError(
        error,
        {
          authId,
          email
        },
        'UnitFormComponent @onDeleteCourse'
      );
    }
  };

  const [unitDeletable, setUnitDeletable] = useState(false);

  // check if deletable or not
  // check connected lessons to this unit

  const checkDeletable = async () => {
    try {
      const res: any = await API.graphql(
        graphqlOperation(getUniversalSyllabus, {
          id: syllabusDetails?.id
        })
      );
      const lesson = res.data.getUniversalSyllabus;

      const lessonList = [...lesson.lessons?.items];

      const attachedCourses = curricular?.items?.filter((item: any) => {
        if (item?.universalSyllabus) {
          return item?.universalSyllabus?.items?.find(
            (item: any) => item?.unit?.id === syllabusDetails.id
          );
        }
      });

      if (lessonList.length > 0 || attachedCourses?.length > 0) {
        setUnitDeletable(false);
      } else {
        setUnitDeletable(true);
      }
    } catch (error) {
      console.error(error);
      logError(
        error,
        {
          authId,
          email
        },
        'UnitFormComponent @checkDeletable'
      );
    }
  };

  useEffect(() => {
    checkDeletable();
  }, [curricular, syllabusDetails?.id]);

  const {
    name,
    languages,
    description,
    purpose,
    status,
    priorities,
    objectives,
    secondary
  } = syllabusData;

  return (
    <>
      <div className={``}>
        <div className="m-auto">
          <div className="py-4  grid gap-8 grid-cols-2">
            <div className="col-span-2">
              <FormInput
                value={name}
                id="name"
                onChange={onInputChange}
                name="name"
                label={AddSyllabusDict[userLanguage]['unitname']}
                isRequired
              />
            </div>

            <div>
              <MultipleSelector
                label={AddSyllabusDict[userLanguage]['language']}
                selectedItems={languages}
                placeholder={AddSyllabusDict[userLanguage]['placeholderlanguage']}
                list={languageList}
                onChange={selectLanguage}
              />
            </div>

            <div className="">
              <Selector
                label={UserEditDict[userLanguage]['status']}
                placeholder={UserEditDict[userLanguage]['status']}
                list={RoomStatusList}
                // @ts-ignore
                onChange={(name: RoomStatus) => {
                  beforeStatusChange(name);
                }}
                selectedItem={status || UserEditDict[userLanguage]['status']}
              />
            </div>

            <div>
              <FormInput
                value={description}
                rows={5}
                textarea
                id="description"
                onChange={onInputChange}
                name="description"
                label={AddSyllabusDict[userLanguage]['description']}
              />
            </div>
            <div>
              <FormInput
                value={purpose}
                textarea
                rows={5}
                id="purpose"
                onChange={onInputChange}
                name="purpose"
                label={AddSyllabusDict[userLanguage]['purpose']}
              />
            </div>

            <div>
              <FormInput
                value={priorities}
                textarea
                rows={5}
                id="priorities"
                onChange={onInputChange}
                name="priorities"
                label={AddSyllabusDict[userLanguage]['priority']}
              />
            </div>
            <div>
              <FormInput
                value={secondary}
                textarea
                rows={5}
                id="secondary"
                onChange={onInputChange}
                name="secondary"
                label={AddSyllabusDict[userLanguage]['secondary']}
              />
            </div>
            <div>
              <FormInput
                value={objectives}
                textarea
                rows={5}
                id="objectives"
                onChange={onInputChange}
                name="objectives"
                label={AddSyllabusDict[userLanguage]['objective']}
              />
            </div>
            {curricular && (
              <div>
                <Label label="Attached courses" />
                <div className="mt-1">
                  <AttachedCourses curricular={curricular} unitId={syllabusDetails.id} />
                </div>
              </div>
            )}
          </div>
        </div>
        {messages.show ? (
          <div className="py-2 m-auto text-center">
            <p className={`${messages.isError ? 'text-red-600' : 'text-green-600'}`}>
              {messages.message ? messages.message : ''}
            </p>
          </div>
        ) : null}

        <div className="flex justify-between">
          <div className="">
            <Popconfirm
              onConfirm={() => {
                onUnitDelete();
              }}
              okText="Yes"
              cancelText="No"
              okType="danger"
              title="Are you sure you want to delete this unit?">
              <Buttons
                tooltip={
                  unitDeletable
                    ? ''
                    : 'Cannot delete unit with lessons or attached courses'
                }
                disabled={!unitDeletable}
                label="Delete unit"
                redBtn
              />
            </Popconfirm>
          </div>
          <Space>
            <Buttons label="Cancel" onClick={onCancel} transparent />
            <Buttons
              label={AddSyllabusDict[userLanguage][loading ? 'saving' : 'save']}
              onClick={saveSyllabusDetails}
              disabled={loading ? true : false}
            />
          </Space>
        </div>
      </div>

      <ModalPopUp
        open={warnModal.show}
        closeAction={closeModal}
        saveAction={warnModal.onSaveAction}
        saveLabel="Yes"
        message={warnModal.message}
      />
    </>
  );
};

export default UnitFormComponent;
