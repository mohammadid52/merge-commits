import {API, graphqlOperation} from 'aws-amplify';
import {useEffect, useState} from 'react';
import {useHistory} from 'react-router';

import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';

import * as customMutations from 'customGraphql/customMutations';
import * as customQueries from 'customGraphql/customQueries';
import * as mutations from 'graphql/mutations';

import Buttons from '@components/Atoms/Buttons';
import AnimatedContainer from '@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import Table, {ITableProps} from '@components/Molecules/Table';

import {RoomStatus} from 'API';
import {message} from 'antd';
import AddButton from 'atoms/Buttons/AddButton';
import Selector from 'atoms/Form/Selector';
import PageLayout from 'layout/PageLayout';
import {map} from 'lodash';
import ModalPopUp from 'molecules/ModalPopUp';

const UnitManager = ({
  courseId,
  courseData,
  institutionId,
  savedSyllabusList,
  setSavedSyllabusList,
  syllabusIds,
  setSyllabusIds
}: any) => {
  const history = useHistory();

  const {userLanguage} = useGlobalContext();
  const {CourseBuilderDict, BUTTONS} = useDictionary();

  // ~~~~~~~~~~~~~~~~ STATE ~~~~~~~~~~~~~~~~ //
  const [loading, setLoading] = useState(false);
  const [_, setAddingSyllabus] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [allSyllabusList, setAllSyllabusList] = useState<any[]>([]);

  const [selectedSyllabusList, setSelectedSyllabusList] = useState<any[]>([]);
  const [selectedSyllabus, setSelectedSyllabus] = useState({
    id: '',
    name: '',
    value: ''
  });

  const [unsavedChanges] = useState(false);
  const [warnModal, setWarnModal] = useState({
    show: false,
    lessonPlan: false,
    lessonEdit: false,
    message: ''
  });
  const [warnModal2, setWarnModal2] = useState({
    show: false,
    message: '',
    action: () => {}
  });

  useEffect(() => {
    if (savedSyllabusList?.length && !syllabusIds.length) {
      const syllabusSeq = savedSyllabusList.map((item: any) => item.unitId);
      updateSyllabusSequence(syllabusSeq);
    }
  }, [savedSyllabusList]);

  // ~~~~~~~~~~~~ FUnCTIONALITY ~~~~~~~~~~~~ //
  const createNewUnit = () => {
    if (unsavedChanges) {
      setWarnModal({
        ...warnModal,
        lessonPlan: true,
        show: !warnModal.show,
        lessonEdit: false
      });
      return;
    }
    history.push(`/dashboard/manage-institutions/institution/${institutionId}/units/add`);
  };

  const handleSelectSyllabus = (value: string, option: any) => {
    setSelectedSyllabus({id: option.id, name: value, value: option.value});
  };

  const [messageApi, contextHolder] = message.useMessage();

  const addNewSyllabusToCourse = async () => {
    try {
      setAddingSyllabus(true);

      const input = {
        unitId: selectedSyllabus.id,
        curriculumId: courseId
      };

      const result: any = await API.graphql(
        graphqlOperation(mutations.createCurriculumUnits, {input})
      );

      const newSyllabus = result.data.createCurriculumUnits;

      if (!syllabusIds.length) {
        await updateSyllabusSequence([newSyllabus.unitId]);
      } else {
        await updateSyllabusSequence([...syllabusIds, newSyllabus.unitId]);
      }
      setSelectedSyllabus({id: '', name: '', value: ''});
      setSavedSyllabusList([...savedSyllabusList, newSyllabus]);
      setAddingSyllabus(false);
      messageApi.success('Unit added successfully');
    } catch {
      setAddingSyllabus(false);

      messageApi.error(
        CourseBuilderDict[userLanguage]['MESSAGES']['ERROR']['UPDATE_ERROR']
      );
    }
  };

  const updateListAndDropdown = async () => {
    // To update table list and dropdown as per selected items.
    const savedSyllabusIds = [...savedSyllabusList];
    let filteredList = savedSyllabusIds.map((assignedSyllabus) => ({
      ...assignedSyllabus.unit,
      id: assignedSyllabus.id,
      unitId: assignedSyllabus.unitId
    }));

    filteredList = filteredList

      .map((t: any) => {
        let index = syllabusIds?.indexOf(t.unitId);
        return {...t, index};
      })
      .sort((a: any, b: any) => (a.index > b.index ? 1 : -1));

    setSelectedSyllabusList(filteredList);
  };

  useEffect(() => {
    if (savedSyllabusList?.length && !syllabusIds.length) {
      const lessonSeq = savedSyllabusList.map((item: any) => item.id);
      updateSyllabusSequence(lessonSeq);
    }
  }, [savedSyllabusList]);

  useEffect(() => {
    if (Array.isArray(savedSyllabusList) && savedSyllabusList.length) {
      updateListAndDropdown();
    }
  }, [savedSyllabusList]);

  useEffect(() => {
    fetchSyllabusList();
  }, [institutionId]);

  const fetchSyllabusList = async () => {
    try {
      setLoading(true);
      const result: any = await API.graphql(
        graphqlOperation(customQueries.listUniversalSyllabusOptions, {
          filter: {institutionID: {eq: institutionId}},
          status: {eq: courseData.status || RoomStatus.ACTIVE}
        })
      );
      const savedData = result.data.listUniversalSyllabi;
      const sortedList = savedData?.items
        ?.sort((a: any, b: any) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1))
        .map((item: any) => ({label: item.name, value: item.name, id: item.id}));

      setAllSyllabusList([...sortedList]);
      setLoading(false);
    } catch {
      messageApi.error(CourseBuilderDict[userLanguage]['MESSAGES']['ERROR']['fetchlist']);
    }
  };

  const updateSyllabusSequence = async (syllabusIDs: string[]) => {
    setSyllabusIds(syllabusIDs);
    await API.graphql(
      graphqlOperation(customMutations.updateCurriculumSyllabusSequence, {
        input: {
          id: courseId,
          universalSyllabusSeq: syllabusIDs
        }
      })
    );
  };

  // ~~~~~ CHECK IF UNIT CAN BE DELETED ~~~~ //

  /********************************************************
   * BASICALLY CHECK IF THIS UNIT HAS EVER BEEN ACTIVATED *
   *       IN THE PARENT CURRICULUM, AND IF IT HAS,       *
   *          THIS UNIT SHOULD NOT BE REMOVABLE           *
   ********************************************************/
  const [deleteModal, setDeleteModal] = useState<any>({
    show: false,
    message: '',
    action: () => {}
  });

  const handleToggleDelete = (targetString?: string, itemObj?: any) => {
    if (!deleteModal.show) {
      setDeleteModal({
        show: true,
        message: `Are you sure you want to remove "${targetString}" from course?`,
        action: () => handleDelete(itemObj)
      });
    } else {
      setDeleteModal({show: false, message: '', action: () => {}});
    }
  };

  const handleDelete = async (item: any) => {
    try {
      setDeleting(true);
      await API.graphql(
        graphqlOperation(customMutations.deleteCurriculumUnits, {
          input: {id: item.id}
        })
      );
      await updateSyllabusSequence(
        syllabusIds.filter((unitId: any) => unitId !== item.unitId)
      );
      setSelectedSyllabusList((list: any) =>
        list.filter((_item: any) => _item.id !== item.id)
      );
      setSavedSyllabusList((prevList: any) =>
        prevList.filter((syllabus: any) => syllabus.id !== item.id)
      );
      setDeleting(false);
      closeLessonAction();
    } catch (e) {
      console.error('Problem deleting Unit from UnitManager - ', e);
    } finally {
      setDeleteModal({show: false, message: '', action: () => {}});
    }
  };

  const closeLessonAction = () => {
    setWarnModal2({...warnModal2, show: false});
  };

  const goToUnitBuilder = (id: string, _: string) => {
    if (unsavedChanges) {
      setWarnModal({
        ...warnModal,
        lessonPlan: false,
        show: !warnModal.show,
        lessonEdit: true
      });
    } else {
      history.push(
        `/dashboard/manage-institutions/institution/${institutionId}/units/${id}/edit`
      );
    }
  };

  //
  const dict = CourseBuilderDict[userLanguage]['TABLE_HEADS'];

  const dataList = map(selectedSyllabusList, (item, idx) => ({
    no: idx + 1,
    id: item.id,
    onClick: () => goToUnitBuilder(item.unitId, item.type),
    unitName: item?.name
    // actions: (
    //   <CommonActionsBtns
    //     button1Label="View"
    //     isDeletable={checkIfRemovable(item, courseData)}
    //     button1Action={() => goToUnitBuilder(item.unitId, item.type)}
    //     button2Action={() => handleToggleDelete(item.name, item)}
    //   />
    // )
  }));

  const tableConfig: ITableProps = {
    headers: [dict['NUMBER'], dict['UNIT_NAME']],
    dataList,
    config: {
      dataList: {
        loading
      }
    }
  };

  const isInactive = courseData?.status === RoomStatus.INACTIVE;

  return (
    <PageLayout
      title={'Unit List'}
      warning={
        isInactive
          ? 'This course is inactive. Adding units to this course has been disabled'
          : ''
      }
      type="inner"
      extra={
        <div className=" w-full flex gap-x-4 justify-end items-center">
          <Selector
            selectedItem={isInactive ? 'Course inactive' : selectedSyllabus.value}
            list={allSyllabusList}
            placeholder={CourseBuilderDict[userLanguage]['SELECT_UNIT']}
            onChange={handleSelectSyllabus}
            width={300}
            showSearch
            size="middle"
            disabled={isInactive}
          />

          <AnimatedContainer className="w-auto" show={Boolean(selectedSyllabus.id)}>
            {Boolean(selectedSyllabus.id) && (
              <Buttons
                label={BUTTONS[userLanguage]['ADD']}
                onClick={addNewSyllabusToCourse}
              />
            )}
          </AnimatedContainer>

          <AddButton
            disabled={isInactive}
            label={CourseBuilderDict[userLanguage]['ADD_NEW_UNIT']}
            onClick={createNewUnit}
          />
        </div>
      }>
      {contextHolder}
      <div className="">
        {/* *************** SECTION HEADER ************ */}

        {/* *************** ADD LESSON TO SYLLABUS SECTION ************ */}
        <div className="w-full m-auto">
          {/* *************** SYLLABUS LIST ************ */}
          <Table {...tableConfig} />
        </div>

        <ModalPopUp
          open={deleteModal.show}
          closeAction={handleToggleDelete}
          saveAction={deleting ? () => {} : deleteModal.action}
          saveLabel={deleting ? 'DELETING...' : 'CONFIRM'}
          cancelLabel="CANCEL"
          message={deleteModal.message}
        />

        <ModalPopUp
          open={warnModal2.show}
          closeAction={closeLessonAction}
          saveAction={warnModal2.action}
          saveLabel="Yes"
          message={warnModal2.message}
          loading={deleting}
        />
      </div>
    </PageLayout>
  );
};

export default UnitManager;
