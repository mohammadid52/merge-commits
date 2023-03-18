import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';

import Buttons from 'atoms/Buttons';
import Selector from 'atoms/Form/Selector';
import Loader from 'atoms/Loader';

import {useGlobalContext} from 'contexts/GlobalContext';
import * as customMutations from 'customGraphql/customMutations';
import * as customQueries from 'customGraphql/customQueries';
import useDictionary from 'customHooks/dictionary';
import {statusList} from 'utilities/staticData';

import {getAsset} from 'assets';

interface UnitLookupProps {
  lessonName: string;
  lessonId: string;
  institution: {id: string; name: string; value: string};
  lessonType: string;
  lessonPlans: any;
}

const UnitLookup = (props: UnitLookupProps) => {
  const {lessonId, institution, lessonType, lessonPlans} = props;

  const {clientKey, theme, userLanguage} = useGlobalContext();
  const themeColor = getAsset(clientKey, 'themeClassName');
  const {UnitLookupDict} = useDictionary();
  const history = useHistory();

  const initialData: any = {
    curriculum: {name: '', value: '', id: ''},
    unit: {name: '', value: '', id: ''}
  };

  const [formState, setFormState] = useState<any>(initialData);

  const [curriculaList, setCurriclaList] = useState<any[]>([]);
  const [unitsList, setUnitsList] = useState<any[]>([]);
  const [selectedUnitsList, setSelectedUnitsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editState, setEditState] = useState<{id: string; action?: string}>({
    id: '',
    action: ''
  });
  const [message, setMessage] = useState({
    msg: '',
    isError: false
  });

  const gotoCurricularUnit = (syllabusId: string, curricularId: string) => {
    history.push(
      `/dashboard/manage-institutions/${institution.id}/curricular/${curricularId}/syllabus/edit?id=${syllabusId}`
    );
  };

  const onSelectorChange = (val: string, name: string, id: string, field: string) => {
    setFormState({
      ...formState,
      [field]: {id, name, value: val}
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
  const onStatusChange = async (val: string, _: string, __: string, uniqId: string) => {
    try {
      setEditState({...editState, action: 'updating...'});
      const input = {
        id: uniqId,
        status: val
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
        isError: true
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
            displayMode: 'SELF'
          };
        });
      const input = {
        syllabusID: formState.unit.id,
        lessonID: lessonId,

        lessonPlan: lessonComponentPlan?.length > 0 ? lessonComponentPlan : [],
        status: 'Active'
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
          syllabusName: formState?.unit?.name
        };
        const updatedList: any = curriculaList.map((curricular: any) => {
          if (curricular?.curricularId === formState?.curriculum?.id) {
            const updatedUnitList: any = curricular?.unitList?.filter(
              (item: any) => item.id !== formState.unit.id
            );
            return {
              ...curricular,
              unitList: updatedUnitList
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
          unit: {name: '', value: '', id: ''}
        });
        setUnitsList([]);
        setMessage({
          ...message,
          isError: false,
          msg: UnitLookupDict[userLanguage]['MESSAGES']['ADDED']
        });
        setSaving(false);
      }
    } catch {
      setMessage({
        ...message,
        isError: true,
        msg: UnitLookupDict[userLanguage]['MESSAGES']['ADDERR']
      });
    }
  };

  const fetchUnitsList = async () => {
    setLoading(true);
    Promise.all([
      await API.graphql(
        graphqlOperation(customQueries.getInstitutionCurriculars, {
          id: institution?.id
        })
      ),
      await API.graphql(
        graphqlOperation(customQueries.listFilteredSyllabusLessons, {
          filter: {lessonID: {eq: lessonId}}
        })
      )
    ])
      .then(([res1, res2]: any) => {
        const previouslySelectedUnits: any =
          res2?.data?.listUniversalSyllabusLessons?.items;
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
            syllabusName: syllabusName
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
            unitList: result?.length ? [...result] : []
          };
        });
        setSelectedUnitsList([...selectedList]);
        setCurriclaList([...filteredList]);
        setLoading(false);
      })
      .catch(() => {
        setMessage({
          ...message,
          isError: true,
          msg: UnitLookupDict[userLanguage]['MESSAGES']['FETCHERR']
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
          value: item.name
        }));
        setUnitsList([...syllabusList]);
      }
      setFormState({
        ...formState,
        unit: {id: '', name: '', value: ''}
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
    <div className="bg-white shadow-5 overflow-hidden sm:rounded-lg mb-4">
      {/* <div className="px-4 py-5 border-b-0 border-gray-200 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {UnitLookupDict[userLanguage]['HEADING']} - {lessonName}
        </h3>
      </div> */}

      <div className="p-4">
        <div className="px-4 py-4 grid gap-x-6 grid-cols-5">
          <div className="col-span-2 flex items-center">
            <Selector
              selectedItem={curriculum.name}
              list={curriculaList}
              placeholder="Select Curriculumn"
              onChange={(val, option: any) =>
                onSelectorChange(val, val, option.id, 'curriculum')
              }
            />
          </div>
          <div className="col-span-2 flex items-center">
            <Selector
              selectedItem={unit.name}
              list={unitsList}
              placeholder="Select Unit"
              onChange={(val, option: any) =>
                onSelectorChange(val, val, option.id, 'unit')
              }
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

        {/* <p className="text-sm p-8 text-gray-700">
          {UnitLookupDict[userLanguage]['NOTE']}
        </p> */}

        <div className="px-4">
          <div className="flex justify-between w-full m-auto px-8 py-4 whitespace-nowrap border-b-0 border-gray-200">
            <div className="w-.5/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              <span>{UnitLookupDict[userLanguage]['NO']}</span>
            </div>
            <div className="w-3/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              <span>{UnitLookupDict[userLanguage]['CURRICULUMNAME']}</span>
            </div>
            <div className="w-2.5/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              <span>{UnitLookupDict[userLanguage]['UNITNAME']}</span>
            </div>
            <div className="w-3/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              <span>{UnitLookupDict[userLanguage]['STATUS']}</span>
            </div>
            <div className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              <span>{UnitLookupDict[userLanguage]['ACTION']}</span>
            </div>
          </div>
          <div className="mb-8 w-full m-auto max-h-88 overflow-y-auto">
            {loading ? (
              <div className="mt-4">
                <Loader animation />
              </div>
            ) : selectedUnitsList.length ? (
              selectedUnitsList?.map((item: any, index: number) => (
                <div
                  key={item.curricularId}
                  className="flex justify-between items-center w-full px-8 py-4 whitespace-nowrap border-b-0 border-gray-200 cursor-pointer">
                  <div className="flex w-.5/10 items-center px-8 py-3 text-left text-s leading-4">
                    {index + 1}.
                  </div>
                  <div
                    className="flex w-3/10 items-center px-8 py-3 text-left text-s leading-4 font-medium whitespace-normal cursor-pointer"
                    onClick={() =>
                      gotoCurricularUnit(item.syllabusID, item.curricularId)
                    }>
                    {item.curricularName ? item.curricularName : ''}
                  </div>
                  <div
                    className="flex w-2.5/10 items-center px-8 py-3 text-left text-s leading-4 font-medium whitespace-normal cursor-pointer"
                    onClick={() =>
                      gotoCurricularUnit(item.syllabusID, item.curricularId)
                    }>
                    {item.syllabusName ? item.syllabusName : ''}
                  </div>
                  <div className="flex w-3/10 items-center px-8 py-3 text-left text-s leading-4 font-medium ">
                    {editState.id !== item.id ? (
                      item.status ? (
                        item.status
                      ) : (
                        '--'
                      )
                    ) : (
                      <div className="text-gray-900">
                        <Selector
                          selectedItem={item.status}
                          placeholder="Select Status"
                          list={statusList}
                          onChange={(val, option: any) =>
                            onStatusChange(val, val, option.id, item.id)
                          }
                        />
                      </div>
                    )}
                  </div>
                  {editState.id !== item.id ? (
                    <span
                      className={`w-1/10 flex items-center text-left cursor-pointer px-8 py-3 ${theme.textColor[themeColor]}`}
                      onClick={() => editCurrentUnit(item.id)}>
                      Edit
                    </span>
                  ) : (
                    <span
                      className={`w-1/10 flex items-center text-left px-8 py-3 ${theme.textColor[themeColor]}`}
                      onClick={cancelEdit}>
                      {editState.action ? editState.action : 'Cancel'}
                    </span>
                  )}
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
      </div>
    </div>
  );
};

export default UnitLookup;
