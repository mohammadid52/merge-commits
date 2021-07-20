import {API, graphqlOperation} from 'aws-amplify';
import React, {useContext, useEffect, useState} from 'react';
import {useHistory} from 'react-router';

import Selector from '../../../../../Atoms/Form/Selector';
import Buttons from '../../../../../Atoms/Buttons';
import ModalPopUp from '../../../../../Molecules/ModalPopUp';

import {getAsset} from '../../../../../../assets';
import useDictionary from '../../../../../../customHooks/dictionary';

import * as mutations from '../../../../../../graphql/mutations';
import * as customQueries from '../../../../../../customGraphql/customQueries';
import * as customMutations from '../../../../../../customGraphql/customMutations';

import {GlobalContext} from '../../../../../../contexts/GlobalContext';

interface IAddCourse {
  curriculumList: any[];
  institutionID: string;
  lessonId: string;
  lessonType?: string;
  lessonPlans: any[];
  selectedCurriculumList: any[];
}

const AddCourse = (props: IAddCourse) => {
  const {
    curriculumList,
    selectedCurriculumList,
    lessonId,
    institutionID,
    lessonType,
    lessonPlans,
  } = props;

  const {clientKey, theme, userLanguage} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const {BUTTONS, UnitLookupDict} = useDictionary(clientKey);
  const history = useHistory();

  const initialData: any = {
    curriculum: {name: '', value: '', id: ''},
    unit: {name: '', value: '', id: ''},
  };

  const [formState, setFormState] = useState<any>(initialData);

  const [curriculaList, setCurriculaList] = useState([]);
  const [unitsList, setUnitsList] = useState([]);
  const [selectedUnitsList, setSelectedUnitsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editState, setEditState] = useState<{id: string; action?: string}>({
    id: '',
    action: '',
  });
  const [message, setMessage] = useState({
    msg: '',
    isError: false,
  });
  const [warnModal, setWarnModal] = useState({
    show: false,
    goBack: false,
    message: 'Do you want to save changes before moving forward?',
  });

  const gotoCurricularUnit = (syllabusId: string, curricularId: string) => {
    history.push(
      `/dashboard/manage-institutions/${institutionID}/curricular/${curricularId}/syllabus/edit?id=${syllabusId}`
    );
  };

  const onSelectorChange = (val: string, name: string, id: string, field: string) => {
    setFormState({
      ...formState,
      [field]: {id, name, value: val},
    });
  };
  const editCurrentUnit = (id: string) => {
    setEditState({id});
  };

  const cancelEdit = () => {
    setEditState({id: '', action: ''});
  };
  const updateStatusOnTable = (uniqId: string, status: string) => {
    let updatedList = [...selectedUnitsList];
    updatedList.find((item) => item.id === uniqId).status = status;
    setSelectedUnitsList(updatedList);
  };
  const onStatusChange = async (
    val: string,
    name: string,
    id: string,
    uniqId: string
  ) => {
    try {
      setEditState({...editState, action: 'updating...'});
      const input = {
        id: uniqId,
        status: val,
      };
      const result: any = await API.graphql(
        graphqlOperation(customMutations.updateSyllabusLesson, {input: input})
      );
      const newLesson = result.data.updateSyllabusLesson;
      setEditState({id: ''});
      updateStatusOnTable(newLesson.id, newLesson.status);
    } catch {
      setMessage({
        msg: 'Error while updating unit status please try later.',
        isError: true,
      });
      setEditState({id: '', action: ''});
    }
  };

  const addLessonToSyllabusLesson = async () => {
    try {
      const lessonComponentPlan: any =
        lessonPlans &&
        lessonPlans.map((item: any) => {
          return {
            disabled: false,
            open: lessonType !== 'lesson' ? true : false,
            active: lessonType !== 'lesson' ? true : false,
            stage: `checkpoint?id=${item.LessonComponentID}`,
            type: 'survey',
            displayMode: 'SELF',
          };
        });
      const input = {
        syllabusID: formState.unit.id,
        lessonID: lessonId,
        displayData: {
          breakdownComponent: lessonType,
        },
        lessonPlan: lessonComponentPlan?.length > 0 ? lessonComponentPlan : [],
        status: 'Active',
      };
      setSaving(true);
      const result: any = await API.graphql(
        graphqlOperation(mutations.createUniversalSyllabusLesson, {input: input})
      );
      console.log(result, 'result after api called');

      const newLesson = result.data?.createUniversalSyllabusLesson;
      if (newLesson?.id) {
        const newItem: any = {
          ...newLesson,
          curricularName: formState?.curriculum?.name,
          curricularId: formState?.curriculum?.id,
          syllabusName: formState?.unit?.name,
        };
        const updatedList: any = curriculaList.map((curricular: any) => {
          if (curricular?.curricularId === formState?.curriculum?.id) {
            const updatedUnitList: any = curricular?.unitList?.filter(
              (item: any) => item.id !== formState.unit.id
            );
            return {
              ...curricular,
              unitList: updatedUnitList,
            };
          } else {
            return curricular;
          }
        });
        setCurriculaList([...updatedList]);
        setSelectedUnitsList([...selectedUnitsList, newItem]);
        setFormState({
          ...formState,
          curriculum: {name: '', value: '', id: ''},
          unit: {name: '', value: '', id: ''},
        });
        setUnitsList([]);
        setMessage({
          ...message,
          isError: false,
          msg: UnitLookupDict[userLanguage]['MESSAGES']['ADDED'],
        });
        setSaving(false);
      }
    } catch (error) {
      console.log(error, 'error');
      setMessage({
        ...message,
        isError: true,
        msg: UnitLookupDict[userLanguage]['MESSAGES']['ADDERR'],
      });
    }
  };

  const setRequiredData = async () => {
    const curricularsList: any = curriculumList;

    let selectedSyllabusId: string[] = [];
    selectedCurriculumList.map(
      (curriculum: any) =>
        (selectedSyllabusId = [...selectedSyllabusId, ...curriculum.assignedSyllabusId])
    );
    const filteredList: any = curricularsList.map((item: any) => {
      const result: any = item?.universalSyllabus?.items.filter(
        (unit: any) => !selectedSyllabusId.includes(unit?.id)
      );
      return {
        id: item?.id,
        curricularId: item?.id,
        name: item?.name,
        value: item?.name,
        unitList: result?.length ? [...result] : [],
      };
    });
    // setSelectedUnitsList([...selectedList]);
    setCurriculaList([...filteredList]);
    setLoading(false);
  };

  useEffect(() => {
    if (formState?.curriculum?.id) {
      const selectedItem = curriculaList?.find(
        (curricular: any) => curricular.curricularId === formState?.curriculum?.id
      );
      if (selectedItem) {
        const syllabusList: any = selectedItem?.unitList?.map((item: any) => ({
          id: item.id,
          name: item.name,
          value: item.name,
        }));
        setUnitsList([...syllabusList]);
      }
      setFormState({
        ...formState,
        unit: {id: '', name: '', value: ''},
      });
    }
  }, [formState?.curriculum?.id]);

  useEffect(() => {
    if (institutionID) {
      setRequiredData();
    }
  }, [institutionID, selectedCurriculumList]);

  const onCancel = () => {
    setWarnModal({
      show: true,
      goBack: true,
      message: 'Do you want to save changes before going back?',
    });
  }

  const onDiscard = () => {
    setWarnModal(prevValues => ({
      ...prevValues,
      show: false
    }));
  }

  const {curriculum, unit} = formState;

  return (
    <>
      <div className="px-4 py-4 grid gap-x-6 grid-cols-5">
        <div className="col-span-2 flex items-center">
          <Selector
            selectedItem={curriculum.name}
            list={curriculaList}
            placeholder="Select Curriculumn"
            onChange={(val, name, id) => onSelectorChange(val, name, id, 'curriculum')}
          />
        </div>
        <div className="col-span-2 flex items-center">
          <Selector
            selectedItem={unit.name}
            list={unitsList}
            placeholder="Select Unit"
            onChange={(val, name, id) => onSelectorChange(val, name, id, 'unit')}
            noOptionMessage={
              curriculum.name ? 'No Results' : 'Please select curricular first'
            }
          />
        </div>
        <div className="col-span-1 flex items-end">
          <Buttons
            btnClass="py-3 px-6"
            label="Add Unit"
            onClick={addLessonToSyllabusLesson}
            disabled={saving || !formState.unit.id ? true : false}
          />
        </div>
      </div>
      <div className="px-4">
        <div className="flex justify-between w-full m-auto px-8 py-4 whitespace-nowrap border-b-0 border-gray-200">
          <div className="w-.5/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
            <span>{UnitLookupDict[userLanguage]['NO']}</span>
          </div>
          <div className="w-4/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
            <span>{UnitLookupDict[userLanguage]['CURRICULUMNAME']}</span>
          </div>
          <div className="w-4/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
            <span>{UnitLookupDict[userLanguage]['UNITNAME']}</span>
          </div>
        </div>
        <div className="mb-8 w-full m-auto max-h-88 overflow-y-auto">
          {loading ? (
            <div className="mt-4">{/* <Loader /> */}</div>
          ) : selectedUnitsList.length ? (
            selectedUnitsList?.map((item: any, index: number) => (
              <div
                key={index}
                className="flex justify-between items-center w-full px-8 py-4 whitespace-nowrap border-b-0 border-gray-200 cursor-pointer">
                <div className="flex w-.5/10 items-center px-8 py-3 text-left text-s leading-4">
                  {index + 1}.
                </div>
                <div
                  className="flex w-4/10 items-center px-8 py-3 text-left text-s leading-4 font-medium whitespace-normal cursor-pointer"
                  // onClick={() => gotoCurricularUnit(item.syllabusID, item.curricularId)}
                >
                  {item.curricularName ? item.curricularName : ''}
                </div>
                <div
                  className="flex w-4/10 items-center px-8 py-3 text-left text-s leading-4 font-medium whitespace-normal cursor-pointer"
                  // onClick={() => gotoCurricularUnit(item.syllabusID, item.curricularId)}
                >
                  {item.syllabusName ? item.syllabusName : ''}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-16 mt-4">
              <p className="text-gray-600 font-medium">
                {UnitLookupDict[userLanguage]['NOTADDED']}
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="flex mt-8 justify-center px-6 pb-4">
        <div className="flex justify-end">
          <Buttons
            btnClass="py-1 px-4 text-xs mr-2"
            label={BUTTONS[userLanguage]['CANCEL']}
            onClick={onCancel}
            transparent
          />
          <Buttons
            btnClass="py-1 px-8 text-xs ml-2"
            label={
              loading ? BUTTONS[userLanguage]['SAVING'] : BUTTONS[userLanguage]['SAVE']
            }
            type="submit"
            // onClick={onSave}
            disabled={loading}
          />
        </div>
        {warnModal.show && (
          <ModalPopUp
            closeAction={onDiscard}
            saveAction={() => console.log('save')}
            saveLabel="SAVE"
            cancelLabel="DISCARD"
            message={warnModal.message}
          />
        )}
      </div>
    </>
  );
};

export default AddCourse;
