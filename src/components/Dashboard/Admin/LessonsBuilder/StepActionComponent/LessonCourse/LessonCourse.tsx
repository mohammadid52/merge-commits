import React, {useContext, useEffect, useState} from 'react';
import {API, graphqlOperation} from 'aws-amplify';

import {GlobalContext} from '../../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../../customHooks/dictionary';

import * as customQueries from '@customGraphql/customQueries';
import * as customMutations from '@customGraphql/customMutations';
import * as mutations from '@graphql/mutations';

import Buttons from '@atoms/Buttons';
import {DeleteActionBtn} from '@atoms/Buttons/DeleteActionBtn';
import Loader from '@atoms/Loader';
import Modal from '@atoms/Modal';
import PageWrapper from '@atoms/PageWrapper';
import Selector from '@atoms/Form/Selector';

import DetailTable from './DetailTable';
import AddCourse from './AddCourse';
import CourseCard from './CourseCard';
import AddButton from '@components/Atoms/Buttons/AddButton';
import UnitFormComponent from '@components/Dashboard/Admin/Institutons/EditBuilders/CurricularsView/TabsActions/Unit/UnitFormComponent';
import UnitListRow from '@components/Dashboard/Admin/Institutons/EditBuilders/CurricularsView/TabsActions/Unit/UnitListRow';
import {useHistory, useRouteMatch} from 'react-router';
import ModalPopUp from '@components/Molecules/ModalPopUp';

interface ILessonCourseProps {
  curriculumList: any[];
  fetchCurriculum: () => void;
  institution: any;
  lessonId: string;
  lessonType: string;
  lessonPlans: any[];
  loading: boolean;
  selectedCurriculums: any[];
  institutionCollection: any[];
  addedSyllabus: any[];
  setAddedSyllabus: React.Dispatch<React.SetStateAction<any>>;
}

const LessonCourse = ({
  curriculumList,
  fetchCurriculum,
  institution,
  lessonId,
  lessonType,
  lessonPlans,
  loading,
  selectedCurriculums,
  institutionCollection,
  addedSyllabus,
  setAddedSyllabus,
}: ILessonCourseProps) => {
  const history = useHistory();
  const match = useRouteMatch();
  const {
    clientKey,
    state: {
      user: {isSuperAdmin},
    },
    userLanguage,
  } = useContext(GlobalContext);
  const {BUTTONS: ButtonDict, UnitLookupDict} = useDictionary(clientKey);
  const [saving, setSaving] = useState(false);
  const [addModalShow, setAddModalShow] = useState(false);
  const [roomLoading, setRoomLoading] = useState(false);
  const [selectedCurriculumList, setSelectedCurriculumList] = useState([]);
  const [showAddSection, setShowAddSection] = useState(false);
  const [allUnits, setAllUnits] = useState<any>([]);
  const [units, setUnits] = useState<any>([]);
  const [unitInput, setUnitInput] = useState<any>({});
  const [assignedUnits, setAssignedUnits] = useState<any>([]);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<any>({
    show: false,
    message: '',
    action: () => {},
  });

  useEffect(() => {
    if (institution?.id) {
      fetchSyllabusList();
    }
  }, [institution]);

  useEffect(() => {
    if (selectedCurriculums?.length) {
      setSelectedCurriculumList(selectedCurriculums);
    }
  }, [selectedCurriculums]);

  const fetchSyllabusList = async () => {
    try {
      const result: any = await API.graphql(
        graphqlOperation(customQueries.listUniversalSyllabuss, {
          filter: isSuperAdmin
            ? undefined
            : {
                institutionID: {eq: institution?.id},
              },
        })
      );
      let selectedSyllabus: any = [];
      addedSyllabus.map((item) => {
        selectedSyllabus.push({
          ...result.data?.listUniversalSyllabuss.items.find(
            (unit: any) => item.syllabusID === unit.id
          ),
          id: item.id,
          syllabusId: item.syllabusID,
        });
      });
      const addedSyllabusIds = addedSyllabus.map((item) => item.syllabusID);
      setUnits(
        result.data?.listUniversalSyllabuss.items.filter(
          (unit: any) => !addedSyllabusIds.includes(unit.id)
        )
      );
      setAssignedUnits(selectedSyllabus);
      setAllUnits(result.data?.listUniversalSyllabuss.items);
    } catch (error) {}
  };

  // useEffect(() => {
  //   console.log(curriculumList, 'curriculumList inside useeffect');
  //   if (curriculumList.length) {
  //     fetchClassRoomDetails();
  //   }
  // }, [curriculumList]);

  const fetchClassRoomDetails = async () => {
    setRoomLoading(true);
    const classroomsResult: any = await API.graphql(
      graphqlOperation(customQueries.getInstClassRooms, {id: institution?.id})
    );
    const classRooms = classroomsResult?.data.getInstitution?.rooms.items;
    setSelectedCurriculumList((prevSelectedCurriculums) =>
      prevSelectedCurriculums.map((selectedCurriculum) => {
        const associatedClassRoomData = classRooms.filter(
          (classRoom: any) =>
            classRoom.curricula.items.filter(
              (e: any) => e.curriculumID === selectedCurriculum.id
            ).length
        );
        selectedCurriculum.associatedClassRoomData = associatedClassRoomData;
        return selectedCurriculum;
      })
    );
    setRoomLoading(false);
  };

  const handleToggleDelete = (targetString?: string, uniqueId?: string) => {
    if (!deleteModal.show) {
      setDeleteModal({
        show: true,
        message: `Are you sure you want to remove lesson from "${targetString}"`,
        action: () => deleteUniversalSyllabusLesson(uniqueId),
      });
    } else {
      setDeleteModal({show: false, message: '', action: () => {}});
    }
  };

  const deleteUniversalSyllabusLesson = async (id: string) => {
    try {
      setDeleting(true);
      const input = {
        id,
      };
      const result: any = await API.graphql(
        graphqlOperation(customMutations.deleteUniversalSyllabusLesson, {input: input})
      );
      const selectedItem = allUnits?.find(
        (unit: any) => unit.id === result.data.deleteUniversalSyllabusLesson?.syllabusID
      );
      await API.graphql(
        graphqlOperation(customMutations.updateUniversalSyllabusLessonSequence, {
          input: {
            id: result.data.deleteUniversalSyllabusLesson?.syllabusID,
            universalLessonsSeq: selectedItem?.universalLessonsSeq.filter(
              (item: any) => item !== lessonId
            ),
          },
        })
      );
      setAssignedUnits((prevList: any) => prevList.filter((item: any) => item.id !== id));
      setDeleting(false);
      setDeleteModal({show: false, message: '', action: () => {}});
    } catch (error) {
      setDeleting(false);
    }
  };

  const onAddModalClose = () => {
    setAddModalShow(false);
    fetchCurriculum();
  };

  const postDeletion = () => {
    fetchCurriculum();
  };

  const renderTableView = (curriculum: any) => {
    return (
      <DetailTable
        curriculum={curriculum}
        lessonId={lessonId}
        loading={roomLoading}
        postDeletion={postDeletion}
      />
    );
  };

  const addLessonToSyllabusLesson = async (unitId: string = unitInput.id) => {
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
        syllabusID: unitId,
        lessonID: lessonId,
        displayData: {
          breakdownComponent: lessonType,
        },
        lessonPlan: lessonComponentPlan?.length > 0 ? lessonComponentPlan : [],
        status: 'Active',
      };
      setSaving(true);
      const result: any = await API.graphql(
        graphqlOperation(customMutations.createUniversalSyllabusLesson, {input: input})
      );
      const newLesson = result.data?.createUniversalSyllabusLesson;
      if (newLesson?.id) {
        updateLessonSequence(unitId);
        setAddedSyllabus((prevValue: any) => [
          ...prevValue,
          {
            id: newLesson.id,
            syllabusID: input.syllabusID,
            lessonID: lessonId,
          },
        ]);
        setUnits((prevUnits: any) =>
          prevUnits.filter((unit: any) => unit.id !== input.syllabusID)
        );
        const selectedUnitData: any =
          allUnits.find((unit: any) => unit.id === input.syllabusID) || {};
        setAssignedUnits((prevList: any) => [
          ...prevList,
          {
            ...selectedUnitData,
            id: newLesson.id,
            syllabusId: input.syllabusID,
            lessons: {
              items: [
                ...(selectedUnitData.lessons.items || []),
                {
                  id: newLesson.id,
                  lesson: newLesson.lesson,
                },
              ],
            },
          },
        ]);
        // const newItem: any = {
        //   ...newLesson,
        //   curricularName: formState?.curriculum?.name,
        //   curricularId: formState?.curriculum?.id,
        //   syllabusName: formState?.unit?.name,
        // };
        // const updatedList: any = curriculaList.map((curricular: any) => {
        //   if (curricular?.curricularId === formState?.curriculum?.id) {
        //     const updatedUnitList: any = curricular?.unitList?.filter(
        //       (item: any) => item.id !== formState.unit.id
        //     );
        //     return {
        //       ...curricular,
        //       unitList: updatedUnitList,
        //     };
        //   } else {
        //     return curricular;
        //   }
        // });
        // setCurriculaList([...updatedList]);
        // setSelectedUnitsList([...selectedUnitsList, newItem]);
        setUnitInput({
          id: '',
          name: '',
        });
        // setUnitsList([]);
        // setMessage({
        //   ...message,
        //   isError: false,
        //   msg: UnitLookupDict[userLanguage]['MESSAGES']['ADDED'],
        // });
        setSaving(false);
      }
    } catch (error) {
      console.log(error, 'error');
      // setMessage({
      //   ...message,
      //   isError: true,
      //   msg: UnitLookupDict[userLanguage]['MESSAGES']['ADDERR'],
      // });
    }
  };

  const updateLessonSequence = async (unitId: string) => {
    const selectedItem = allUnits?.find((unit: any) => unit.id === unitId);
    const existingLessonSeq = selectedItem?.universalLessonsSeq || [];
    setUnits((prevUnits: any) => [...prevUnits, selectedItem]);
    await API.graphql(
      graphqlOperation(customMutations.updateUniversalSyllabusLessonSequence, {
        input: {
          id: unitId,
          universalLessonsSeq: [...existingLessonSeq, lessonId],
        },
      })
    );
  };

  const postAddSyllabus = async (unitId: string) => {
    await addLessonToSyllabusLesson(unitId);
    setAddModalShow(false);
  };

  const redirectToLesson = (institutionId: string, lessonId: string) => {
    const baseUrl = '/dashboard/manage-institutions';
    history.push(
      isSuperAdmin
        ? `${baseUrl}/lessons/${lessonId}`
        : `${baseUrl}/institution/${institutionId}/lessons/${lessonId}`
    );
  };

  const redirectionToUnitPage = (unitId: string) => {
    const baseUrl = '/dashboard/manage-institutions';
    history.push(
      isSuperAdmin
        ? `${baseUrl}/units/${lessonId}/edit`
        : `${baseUrl}/institution/${institution.id}/units/${unitId}/edit`
    );
  };

  const titleList = selectedCurriculumList.map((curriculum, index) => ({
    id: index,
    title: curriculum.name,
    content: renderTableView(curriculum),
    uniqueId: curriculum.id,
  }));

  return (
    <div className="flex m-auto justify-center">
      <div className="">
        <PageWrapper defaultClass="px-8 border-0 border-gray-200">
          {!showAddSection
            ? !isSuperAdmin && (
                <div className="flex justify-end">
                  <div className="w-auto">
                    <Buttons
                      btnClass=""
                      label={'Add Lesson to Unit'}
                      onClick={() => setShowAddSection(true)}
                    />
                    <div
                      className="text-sm text-right text-gray-400 cursor-pointer mt-1"
                      onClick={() => setAddModalShow(true)}>
                      + Create Unit
                    </div>
                  </div>
                </div>
              )
            : null}
          {showAddSection ? (
            <div className="flex items-center w-full md:w-6/10 m-auto px-2 mb-8">
              <Selector
                selectedItem={unitInput.name}
                list={units}
                placeholder="Select Unit"
                onChange={(val, name, id) => setUnitInput({name, id})}
              />
              <Buttons
                btnClass="ml-4 py-1"
                label={ButtonDict[userLanguage]['ADD']}
                disabled={saving || !unitInput.id}
                onClick={() => addLessonToSyllabusLesson(unitInput.id)}
              />
              <Buttons
                btnClass="ml-4 py-1"
                label={ButtonDict[userLanguage]['CANCEL']}
                onClick={() => setShowAddSection(false)}
              />
            </div>
          ) : null}
          {loading ? (
            <div className="mt-4">
              <Loader />
            </div>
          ) : (
            <>
              <div className="w-full pt-8 m-auto border-b-0 border-gray-200">
                <div className="flex justify-between bg-gray-50 px-8 whitespace-nowrap">
                  <div className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span>{UnitLookupDict[userLanguage]['NO']}</span>
                  </div>
                  <div
                    className={`w-4/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider`}>
                    <span>{UnitLookupDict[userLanguage]['NAME']}</span>
                  </div>
                  <div
                    className={`w-4/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider`}>
                    <span>{UnitLookupDict[userLanguage]['LESSONS']}</span>
                  </div>
                  <div className="w-1/10 m-auto py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span className="w-auto">
                      {UnitLookupDict[userLanguage]['ACTION']}
                    </span>
                  </div>
                </div>
              </div>
              {assignedUnits?.length ? (
                assignedUnits.map((unit: any, index: number) => (
                  <div
                    key={index}
                    className={`flex justify-between items-center w-full px-8 py-4 whitespace-nowrap border-b-0 border-gray-200 ${
                      index % 2 !== 0 ? 'bg-gray-50' : ''
                    }`}>
                    <div className="flex w-1/10 items-center px-8 py-3 text-left text-s leading-4">
                      {index + 1}.
                    </div>
                    <div
                      onClick={() => redirectionToUnitPage(unit.syllabusId)}
                      className={`cursor-pointer flex w-4/10 items-center px-8 py-3 text-left text-s leading-4 font-medium whitespace-normal`}>
                      {unit.name ? unit.name : ''}
                    </div>
                    <div
                      className={`w-4/10 items-center px-8 py-3 text-left text-sm leading-4 whitespace-normal cursor-pointer`}>
                      {unit.lessons?.items?.map(
                        ({
                          id,
                          lesson: {id: lessonId, title},
                        }: {
                          id: string;
                          lesson: {id: string; title: string};
                        }) => (
                          <li
                            key={id}
                            onClick={() =>
                              redirectToLesson(unit.institution?.id, lessonId)
                            }>
                            {title}
                          </li>
                        )
                      )}
                    </div>
                    <div
                      className="flex w-1/10 items-center px-8 py-3 text-left text-s leading-4"
                      onClick={() => handleToggleDelete(unit.name, unit.id)}>
                      <DeleteActionBtn />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center p-16">
                  {UnitLookupDict[userLanguage].NO_UNIT_ADDED}
                </p>
              )}
            </>
          )}
          {/* <div className="grid gap-5 lg:grid-cols-2 grid-cols-1 xl:grid-cols-2 lg:max-w-none mt-8">
            {selectedCurriculumList.map((curriculum) => (
                <CourseCard
                  institutionCollection={institutionCollection}
                  curriculum={curriculum}
                  lessonId={lessonId}
                  loading={roomLoading}
                  postDeletion={postDeletion}
                  key={curriculum.id}
                />
              ))}
            </div> */}
          {/* ) : (
            // <div className="w-full flex justify-between border-b-0 border-gray-200 mt-8">
            //   <Accordion
            //     titleList={titleList}
            //     actionOnAccordionClick={fetchClassRoomDetails}
            //   />
            // </div>
            <div className="text-center p-16 mt-4">
              <p className="text-gray-600 font-medium">
                {UnitLookupDict[userLanguage]['NOTADDED']}
              </p>
            </div>
          )} */}
        </PageWrapper>
        {/* {addModalShow && (
          <Modal
            showHeader
            showFooter={false}
            showHeaderBorder
            title={'Add Lesson to Syllabus'}
            closeOnBackdrop
            closeAction={onAddModalClose}>
            <div className="min-w-180 lg:min-w-256">
              <AddCourse
                curriculumList={curriculumList}
                institutionID={institution?.id}
                lessonId={lessonId}
                lessonType={lessonType}
                lessonPlans={lessonPlans}
                selectedCurriculumList={selectedCurriculumList}
              />
            </div>
          </Modal>
        )} */}
        {addModalShow && (
          <Modal
            showHeader
            showFooter={false}
            showHeaderBorder
            title={'Add Lesson to Syllabus'}
            closeOnBackdrop
            closeAction={onAddModalClose}>
            <div
              className="min-w-180 lg:min-w-256"
              style={{
                height: 'calc(100vh - 150px)',
              }}>
              <UnitFormComponent
                instId={institution?.id}
                postAddSyllabus={postAddSyllabus}
                onCancel={() => setAddModalShow(false)}
              />
            </div>
          </Modal>
        )}
        {deleteModal.show && (
          <ModalPopUp
            closeAction={handleToggleDelete}
            saveAction={deleting ? () => {} : deleteModal.action}
            saveLabel={deleting ? 'DELETING...' : 'CONFIRM'}
            loading={deleting}
            cancelLabel="CANCEL"
            message={deleteModal.message}
          />
        )}
      </div>
    </div>
  );
};

export default LessonCourse;
