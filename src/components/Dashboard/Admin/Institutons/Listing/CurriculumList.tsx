import Filters, {SortType} from 'components/Atoms/Filters';
import Highlighted from 'components/Atoms/Highlighted';
import SectionTitleV3 from 'components/Atoms/SectionTitleV3';
import CommonActionsBtns from 'components/MicroComponents/CommonActionsBtns';
import CourseName from 'components/MicroComponents/CourseName';
import CourseUnits from 'components/MicroComponents/CourseUnits';
import ModalPopUp from 'components/Molecules/ModalPopUp';
import Table from 'components/Molecules/Table';
import {useGlobalContext} from 'contexts/GlobalContext';
import useAuth from 'customHooks/useAuth';
import usePagination from 'customHooks/usePagination';
import useSearch from 'customHooks/useSearch';
import {InstitueRomms} from 'dictionary/dictionary.iconoclast';
import {logError} from 'graphql/functions';
import {withZoiqFilter} from 'utilities/functions';
import {RoomStatus} from 'API';
import AddButton from 'atoms/Buttons/AddButton';
import SearchInput from 'atoms/Form/SearchInput';
import Selector from 'atoms/Form/Selector';
import {API, graphqlOperation} from 'aws-amplify';
import * as customQueries from 'customGraphql/customQueries';
import useDictionary from 'customHooks/dictionary';
import * as mutations from 'graphql/mutations';
import {isEmpty, map, orderBy} from 'lodash';
import {useEffect, useState} from 'react';
import {useHistory, useRouteMatch} from 'react-router';
import {Status} from '../../UserManagement/UserStatus';
import {Descriptions} from 'antd';
import moment from 'moment';

interface CurriculumListProps {
  curricular?: {items: ICurricular[]};
  updateCurricularList?: any;
  instId: string;
  instName: string;
}

interface ICurricular {
  name?: string;
  status?: string;
  summary?: string;
  description?: string;
  id: string;
  institutionID: string;
  institution?: {name?: string; id: string};
  universalSyllabusSeq: Array<string>;
  universalSyllabus: {items: Array<any>};
}

const CurriculumList = ({updateCurricularList, instId}: CurriculumListProps) => {
  const match = useRouteMatch();
  const history = useHistory();
  // ~~~~~~~~~~ CONTEXT_SPLITTING ~~~~~~~~~~ //
  const gContext = useGlobalContext();
  const userLanguage = gContext.userLanguage;
  const {CommonlyUsedDict, InstitueCurriculum} = useDictionary();

  const [courseList, setCourseList] = useState<Array<ICurricular>>([]);

  const [institutionList, setInstitutionList] = useState<any>([]);

  const {isSuperAdmin} = useAuth();

  const [loading, setLoading] = useState(false);

  const {authId, email} = useAuth();

  const [selectedInstitution, setSelectedInstitution] = useState<any>({});

  //  CHECK TO SEE IF CURRICULUM CAN BE DELETED  //

  /**********************************************************
   *   IF CURRICULUM HAS ANY AMOUNT OF SYLLABI ATTACHED,    *
   * OR IF THIS CURRICULUM HAS EVER HAD ANY ACTIVE SYLLABI, *
   *               THEN DO NOT ALLOW A DELETE               *
   **********************************************************/
  const [deleting, setDeleting] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<any>({
    show: false,
    message: '',
    action: () => {}
  });

  useEffect(() => {
    fetchCurriculums();
    if (isSuperAdmin) {
      fetchInstitutions();
    }
  }, [isSuperAdmin]);

  const instituteChange = (value: string) => {
    setSelectedInstitution({name: value, id: value});

    updateRoomList(value);
  };

  const updateRoomList = (institutionId: string) => {
    const filteredByInstitution = filterBySearchQuery(institutionId, ['institutionId']);

    if (Boolean(filteredByInstitution)) {
      setFilteredList(filteredByInstitution);
      setSearchInput({...searchInput, isActive: true});
    } else {
      removeSearchAction();
    }
  };

  const [totalNum, setTotalNum] = useState(0);

  const fetchCurriculums = async () => {
    try {
      setLoading(true);
      const list: any = await API.graphql(
        graphqlOperation(customQueries.listCurriculumsForSuperAdmin)
      );

      const updatedList: ICurricular[] = list.data?.listCurricula?.items
        ?.map((item: ICurricular) => {
          if (item) {
            return {
              ...item,
              institutionName: item?.institution?.name,
              status: item?.status || RoomStatus.ACTIVE,
              institutionId: item?.institution?.id,
              universalSyllabus: {
                ...(item.universalSyllabus || {}),
                items: item?.universalSyllabus?.items
                  ?.map((syllabus) => ({
                    ...syllabus,
                    index: item?.universalSyllabusSeq?.indexOf(syllabus?.unit?.id)
                  }))
                  .sort((a: any, b: any) => (a.index > b.index ? 1 : -1))
              }
            };
          }
          return {};
        })
        .filter(Boolean);

      const totalListPages = Math.floor(updatedList.length / pageCount);
      setTotalPages(
        totalListPages * pageCount === updatedList.length
          ? totalListPages
          : totalListPages + 1
      );

      setTotalNum(updatedList.length);

      setCurrentList(updatedList);

      setFirstPage(true);
      setLastPage(!(updatedList.length > pageCount));
      setCourseList(updatedList);
    } catch (error) {
      logError(error, {authId, email}, 'CurriculumList @fetchCurriculums');
    } finally {
      setLoading(false);
    }
  };

  const fetchInstitutions = async () => {
    try {
      setLoading(true);
      const list: any = await API.graphql(
        graphqlOperation(customQueries.listInstitutionOptions, {
          filter: withZoiqFilter({})
        })
      );
      setInstitutionList(
        list.data?.listInstitutions?.items?.sort((a: any, b: any) =>
          a.name?.toLowerCase() > b.name?.toLowerCase() ? 1 : -1
        )
      );
    } catch (error) {
      logError(error, {authId, email}, 'CurriculumList @fetchInstitutions');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDelete = (targetString?: string, itemObj?: any) => {
    if (!deleteModal.show) {
      setDeleteModal({
        show: true,
        message: `Are you sure you want to delete the course "${targetString}"?`,
        action: () => handleDelete(itemObj)
      });
    } else {
      setDeleteModal({show: false, message: '', action: () => {}});
    }
  };

  const handleDelete = async (item: any) => {
    setDeleting(true);
    try {
      await API.graphql(
        graphqlOperation(mutations.deleteCurriculum, {
          input: {id: item.id}
        })
      );
      updateCurricularList(item);
    } catch (e) {
      logError(e, {authId, email}, 'CurriculumList @handleDelete');
    } finally {
      setDeleting(false);
      setDeleteModal({show: false, message: '', action: () => {}});
    }
  };

  // ~~~~~~~~~~~~ FUNCTIONALITY ~~~~~~~~~~~~ //

  const createNewCurricular = () => {
    history.push(
      isSuperAdmin
        ? `/dashboard/manage-institutions/course-builder`
        : `/dashboard/manage-institutions/institution/${instId}/course-builder`
    );
  };

  const editCurrentCurricular = (id: string) => {
    history.push(
      isSuperAdmin
        ? `/dashboard/manage-institutions/course-builder/${id}`
        : `/dashboard/manage-institutions/institution/${instId}/course-builder/${id}`
    );
  };

  const redirectToInstitution = (institutionId: string) => {
    history.push(
      `/dashboard/manage-institutions/institution/${institutionId}/edit?back=${match.url}`
    );
  };

  const redirectToUnit = (
    institutionId: string,
    unitId: string,
    courseId: string,
    courseName: string
  ) => {
    const baseUrl = '/dashboard/manage-institutions';
    const suffix = `/units/${unitId}/edit?courseId=${courseId}&courseName=${courseName}`;

    history.push(
      isSuperAdmin
        ? `${baseUrl}${suffix}`
        : `${baseUrl}/institution/${institutionId}${suffix}`
    );
  };

  const {
    pageCount,
    setFirstPage,
    setLastPage,
    setTotalPages,
    currentList,
    allAsProps,
    setCurrentList
  } = usePagination(courseList, loading ? 0 : totalNum);

  const {
    searchInput,
    setSearch,
    checkSearchQueryFromUrl,
    filterBySearchQuery,
    removeSearchAction,
    searchAndFilter,
    setSearchInput
  } = useSearch([...(courseList || [])], ['name', 'institutionName']);

  const [filteredList, setFilteredList] = useState([...courseList]);

  useEffect(() => {
    if (!loading && currentList?.length > 0) {
      const query = checkSearchQueryFromUrl();
      if (query) {
        const items = filterBySearchQuery(query);
        if (Boolean(items)) {
          setFilteredList(items);
        }
      }
    }
  }, [loading]);

  const searchRoom = () => {
    const searched = searchAndFilter(searchInput.value);
    if (Boolean(searched)) {
      setFilteredList(searched);
    } else {
      removeSearchAction();
    }
  };

  const finalList = orderBy(
    searchInput.isActive ? filteredList : currentList,
    ['name', 'institutionName'],
    ['asc']
  );

  const [filters, setFilters] = useState<SortType | null>(null);

  const updateFilter = (filterName: SortType) => {
    if (filterName === filters) {
      setSearchInput({...searchInput, isActive: false});
      setFilters(null);
      setFilteredList([]);
    } else {
      setSearchInput({...searchInput, isActive: true});
      const filtered = courseList.filter((_d: any) => filterName === _d.status);
      setFilteredList(filtered);
      setFilters(filterName);
      setSelectedInstitution({});
    }
  };

  const checkIfRemovable = (curriculumObj: any) => {
    if (
      curriculumObj.syllabi?.length > 0 ||
      (curriculumObj.syllabiHistory && curriculumObj.syllabiHistory?.length > 0) ||
      curriculumObj?.isUsed
    ) {
      return false;
    } else {
      return true;
    }
  };

  const currentSelectedItem = (id: string) => courseList?.find((_c: any) => _c.id === id);

  const dataList = map(finalList, (item: any, index: number) => ({
    no: index + 1,
    // onClick: () => editCurrentCurricular(item.id),
    content: (
      <Descriptions title="Course Details">
        <Descriptions.Item label="Status">
          <Status status={currentSelectedItem(item.id)?.status} useDefault />
        </Descriptions.Item>
        <Descriptions.Item label="Created date">
          {moment(item.createdAt).format('ll')}
        </Descriptions.Item>
        <Descriptions.Item label="Last update">
          {moment(item.updatedAt).format('ll')}
        </Descriptions.Item>
        <Descriptions.Item span={2} label="Summary">
          {currentSelectedItem(item.id)?.summary || 'n/a'}
        </Descriptions.Item>
        <Descriptions.Item span={2} label="Description">
          {currentSelectedItem(item.id)?.description || 'n/a'}
        </Descriptions.Item>
      </Descriptions>
    ),
    courseName: (
      <CourseName
        searchTerm={searchInput.value}
        item={item}
        editCurrentCurricular={editCurrentCurricular}
      />
    ),
    institutionName: isSuperAdmin && (
      <div onClick={() => redirectToInstitution(item.institution.id)} className="w-auto">
        <Highlighted text={item.institution.name} highlight={searchInput.value} />
      </div>
    ),
    courseType: item.type || '-',
    courseUnits: (
      <CourseUnits
        courseName={item.name}
        courseId={item.id}
        item={item}
        redirectToUnit={redirectToUnit}
      />
    ),
    status: <Status useDefault status={item.status} />,
    actions: (
      <CommonActionsBtns
        button1Label="View"
        isDeletable={checkIfRemovable(item)}
        button1Action={() => editCurrentCurricular(item.id)}
        button2Action={() => handleToggleDelete(item.name, item)}
      />
    )
  }));

  const tableConfig = {
    headers: [
      InstitueCurriculum[userLanguage]['NO'],
      InstitueCurriculum[userLanguage]['NAME'],
      isSuperAdmin && InstitueCurriculum[userLanguage]['INSTITUTION_NAME'],
      InstitueCurriculum[userLanguage]['COURSE_TYPE'],
      InstitueCurriculum[userLanguage]['UNITS'],
      InstitueRomms[userLanguage]['STATUS'],
      InstitueCurriculum[userLanguage]['ACTION']
    ],
    dataList,
    config: {
      dark: false,

      isLastAction: true,
      isFirstIndex: true,
      headers: {textColor: 'text-white'},
      dataList: {
        loading,
        expandable: true,
        pagination: {
          showPagination: !searchInput.isActive && totalNum > 0 && isEmpty(filters),
          config: {
            allAsProps
          }
        },
        emptyText:
          searchInput || selectedInstitution?.id
            ? CommonlyUsedDict[userLanguage]['NO_SEARCH_RESULT']
            : InstitueCurriculum[userLanguage]['INFO'],
        customWidth: {
          no: 'w-12',
          courseType: 'w-72',
          courseName: 'w-72',
          courseUnits: 'w-96',
          actions: '-'
        },
        maxHeight: 'max-h-196',
        pattern: 'striped',
        patternConfig: {
          firstColor: 'bg-gray-100',
          secondColor: 'bg-gray-200'
        }
      }
    }
  };

  // ##################################################################### //
  // ############################### OUTPUT ############################## //
  // ##################################################################### //
  return (
    <div className="pt-0 flex m-auto justify-center h-full p-4">
      <div className="flex flex-col w-full">
        <SectionTitleV3
          title={InstitueCurriculum[userLanguage]['TITLE']}
          fontSize="xl"
          fontStyle="semibold"
          extraClass="leading-6 text-gray-900"
          borderBottom
          shadowOff
          withButton={
            <div className={`w-auto flex gap-x-4 justify-end items-center flex-wrap`}>
              {isSuperAdmin && (
                <Selector
                  placeholder={InstitueCurriculum[userLanguage]['SELECT_INSTITUTION']}
                  list={institutionList}
                  selectedItem={selectedInstitution?.name}
                  onChange={instituteChange}
                />
              )}
              <SearchInput
                dataCy="curriculum-search-input"
                value={searchInput.value}
                onChange={setSearch}
                disabled={loading}
                onKeyDown={searchRoom}
                closeAction={removeSearchAction}
              />

              {!isSuperAdmin && (
                <AddButton
                  label={InstitueCurriculum[userLanguage]['BUTTON']['ADD']}
                  onClick={createNewCurricular}
                />
              )}
            </div>
          }
        />

        <Filters
          loading={loading}
          list={courseList}
          updateFilter={updateFilter}
          filters={filters}
          showingCount={{
            currentPage: allAsProps.currentPage,
            lastPage: allAsProps.lastPage,
            totalResults: allAsProps.totalResults,
            pageCount: allAsProps.pageCount
          }}
        />

        <Table {...tableConfig} />

        <ModalPopUp
          open={deleteModal.show}
          closeAction={handleToggleDelete}
          saveAction={deleting ? () => {} : deleteModal.action}
          saveLabel={deleting ? 'DELETING...' : 'CONFIRM'}
          cancelLabel="CANCEL"
          message={deleteModal.message}
        />
      </div>
    </div>
  );
};

export default CurriculumList;
