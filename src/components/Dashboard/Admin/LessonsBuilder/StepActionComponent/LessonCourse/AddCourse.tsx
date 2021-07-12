import { API, graphqlOperation } from 'aws-amplify';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import Selector from '../../../../../Atoms/Form/Selector';
import Buttons from '../../../../../Atoms/Buttons';
import { getAsset } from '../../../../../../assets';
import useDictionary from '../../../../../../customHooks/dictionary';
import * as customQueries from '../../../../../../customGraphql/customQueries';
import * as customMutations from '../../../../../../customGraphql/customMutations';
import { GlobalContext } from '../../../../../../contexts/GlobalContext';

const AddCourse = (props: any) => {
    const {lessonName, lessonId, institution, lessonType, lessonPlans} = props;

    const {clientKey, theme, userLanguage} = useContext(GlobalContext);
    const themeColor = getAsset(clientKey, 'themeClassName');
    const {BUTTONS, UnitLookupDict} = useDictionary(clientKey);
    const history = useHistory();

    const initialData: any = {
      curriculum: {name: '', value: '', id: ''},
      unit: {name: '', value: '', id: ''},
    };

    const [formState, setFormState] = useState<any>(initialData);

    const [curriculaList, setCurriclaList] = useState([]);
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

    const gotoCurricularUnit = (syllabusId: string, curricularId: string) => {
      history.push(
        `/dashboard/manage-institutions/${institution.id}/curricular/${curricularId}/syllabus/edit?id=${syllabusId}`
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
          graphqlOperation(customMutations.createSyllabusLesson, {input: input})
        );
        const newLesson = result.data?.createSyllabusLesson;
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
          setCurriclaList([...updatedList]);
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
      } catch {
        setMessage({
          ...message,
          isError: true,
          msg: UnitLookupDict[userLanguage]['MESSAGES']['ADDERR'],
        });
      }
    };

    const fetchUnitsList = async () => {
      setLoading(true);
      Promise.all([
        await API.graphql(
          graphqlOperation(customQueries.getInstitutionCurriculars, {
            id: institution?.id,
          })
        ),
        await API.graphql(
          graphqlOperation(customQueries.listFilteredSyllabusLessons, {
            filter: {lessonID: {eq: lessonId}},
          })
        ),
      ])
        .then(([res1, res2]: any) => {
          const previouslySelectedUnits: any = res2?.data?.listSyllabusLessons?.items;
          const curricularsList: any = res1?.data?.getInstitution?.curricula?.items;

          const selectedSyllabusId: any = previouslySelectedUnits?.map(
            (item: any) => item.syllabusID
          );
          const selectedList: any = previouslySelectedUnits.map((item: any) => {
            let syllabusName = '-';
            const relatedCurricular: any = curricularsList.find((curricular: any) =>
              curricular?.syllabi?.items.find((unit: any) => {
                if (item.syllabusID === unit?.id) {
                  syllabusName = unit.name;
                  return true;
                } else {
                  return false;
                }
              })
            );
            return {
              ...item,
              curricularName: relatedCurricular?.name || '-',
              curricularId: relatedCurricular?.id || null,
              syllabusName: syllabusName,
            };
          });
          const filteredList: any = curricularsList.map((item: any) => {
            const result: any = item?.syllabi?.items.filter(
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
          setSelectedUnitsList([...selectedList]);
          setCurriclaList([...filteredList]);
          setLoading(false);
        })
        .catch((err) => {
          setMessage({
            ...message,
            isError: true,
            msg: UnitLookupDict[userLanguage]['MESSAGES']['FETCHERR'],
          });
          setLoading(false);
        });
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
      if (institution?.id) {
        fetchUnitsList();
      }
    }, [institution?.id]);

    const {curriculum, unit} = formState;
  return (
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
  )
}

export default AddCourse;