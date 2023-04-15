import Placeholder from '@components/Atoms/Placeholder';
import {useQuery} from '@tanstack/react-query';
import {getImageFromS3} from '@utilities/services';
import {Card, Descriptions, List, Tooltip} from 'antd';
import {RoomStatus} from 'API';
import AddButton from 'atoms/Buttons/AddButton';
import SearchInput from 'atoms/Form/SearchInput';
import {API, graphqlOperation} from 'aws-amplify';
import Filters, {SortType} from 'components/Atoms/Filters';
import Highlighted from 'components/Atoms/Highlighted';

import CourseUnits from 'components/MicroComponents/CourseUnits';
import ModalPopUp from 'components/Molecules/ModalPopUp';
import Table, {ITableProps} from 'components/Molecules/Table';
import {useGlobalContext} from 'contexts/GlobalContext';
import {
  listCurriculumsForSuperAdmin,
  listRoomCurriculaOnlyRoomID,
  listRoomsOnlyName
} from 'customGraphql/customQueries';
import useDictionary from 'customHooks/dictionary';
import useAuth from 'customHooks/useAuth';
import usePagination from 'customHooks/usePagination';
import useSearch from 'customHooks/useSearch';
import {InstitueRomms} from 'dictionary/dictionary.iconoclast';
import {logError} from 'graphql-functions/functions';
import {deleteCurriculum} from 'graphql/mutations';
import PageLayout from 'layout/PageLayout';
import {map, orderBy} from 'lodash';
import moment from 'moment';
import {useEffect, useState} from 'react';
import {useHistory, useRouteMatch} from 'react-router';
import InsitutionSelector from '../../InsitutionSelector';
import {Status} from '../../UserManagement/UserStatus';

const Rooms = ({curriculumID}: {curriculumID: string}) => {
  const [roomList, setRoomList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAttachedRooms = async () => {
      setLoading(true);

      // fetch room curriculum list
      const roomList: any = await API.graphql(
        graphqlOperation(listRoomCurriculaOnlyRoomID, {
          filter: {
            curriculumID: {
              eq: curriculumID
            }
          }
        })
      );

      const roomIds = roomList?.data?.listRoomCurricula?.items?.map(
        (item: {roomID: any}) => item?.roomID
      );

      // filter unique room ids
      const uniqueRoomIds = roomIds?.filter((id: any, index: number) => {
        return roomIds?.indexOf(id) === index;
      });

      // fetch room list
      const roomListData: any = await API.graphql(
        graphqlOperation(listRoomsOnlyName, {
          filter: {
            or: uniqueRoomIds?.map((id: any) => {
              return {
                id: {
                  eq: id
                }
              };
            })
          }
        })
      );

      // sort list by a-z
      const sorted = orderBy(roomListData?.data?.listRooms?.items, ['name'], ['asc']);

      setRoomList(sorted);

      setLoading(false);
    };
    fetchAttachedRooms();
  }, []);

  const history = useHistory();
  const redirectToRoom = (room: any) => {
    console.log('ddfndkfnnd');

    history.push(
      `/dashboard/manage-institutions/institution/${room?.institutionID}/room-edit/${room.id}`
    );
  };

  return (
    <List
      size="small"
      loading={loading}
      className="table-list"
      dataSource={roomList?.filter(Boolean)}
      renderItem={(room: any, index: number) => (
        <Tooltip key={room.id} title={`Go to ${room.name}`} placement="left">
          <a
            href="#"
            onMouseUp={(e) => {
              e.stopPropagation();
              redirectToRoom(room);
            }}>
            <List.Item className="cursor-pointer hover:underline hover:theme-text:400">
              {index + 1}. {room.name}
            </List.Item>
          </a>
        </Tooltip>
      )}
    />
  );
};

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
  const {InstitueCurriculum} = useDictionary();

  const [courseList, setCourseList] = useState<Array<ICurricular>>([]);

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

  useQuery({
    queryKey: ['curriculumList'],
    queryFn: () => fetchCurriculums(),
    onSuccess: (data) => {
      const updatedList: ICurricular[] = data
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
    }
  });

  const fetchCurriculums = async () => {
    try {
      setLoading(true);
      const list: any = await API.graphql(graphqlOperation(listCurriculumsForSuperAdmin));

      return list.data?.listCurricula?.items;
    } catch (error) {
      logError(error, {authId, email}, 'CurriculumList @fetchCurriculums');
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
        graphqlOperation(deleteCurriculum, {
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
    searchInput,
    setSearch,
    checkSearchQueryFromUrl,
    filterBySearchQuery,
    removeSearchAction,
    searchAndFilter,
    setSearchInput
  } = useSearch([...(courseList || [])], ['name', 'institutionName']);

  const [filteredList, setFilteredList] = useState([...courseList]);

  const {
    pageCount,
    setFirstPage,
    setLastPage,
    setTotalPages,
    currentList,
    allAsProps,
    resetPagination,
    setCurrentList
  } = usePagination(courseList, searchInput.isActive ? filteredList.length : totalNum);

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
  }, [loading, currentList?.length]);

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
    if (courseList.length === 0) return;

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

  const currentSelectedItem = (id: string) => courseList?.find((_c: any) => _c.id === id);

  const {Meta} = Card;

  const dataList = map(finalList, (item: any, index: number) => ({
    no: index + 1,
    onClick: () => editCurrentCurricular(item.id),

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
      <Meta
        title={item.name}
        className="flex items-center"
        avatar={
          <Placeholder
            // @ts-ignore
            image={getImageFromS3(item.image)}
            size="h-6 w-6 mr-2"
            name={item.name}
          />
        }
      />
    ),
    institutionName: isSuperAdmin && (
      <div onClick={() => redirectToInstitution(item.institution.id)} className="w-auto">
        <Highlighted text={item.institution.name} highlight={searchInput.value} />
      </div>
    ),
    courseType: item.type || '-',
    rooms: <Rooms curriculumID={item.id} />,
    courseUnits: (
      <CourseUnits
        courseName={item.name}
        courseId={item.id}
        item={item}
        redirectToUnit={redirectToUnit}
      />
    ),
    status: <Status useDefault status={item.status} />
    // actions: (
    //   <CommonActionsBtns
    //     button1Label="View"
    //     isDeletable={checkIfRemovable(item)}
    //     button1Action={() => editCurrentCurricular(item.id)}
    //     button2Action={() => handleToggleDelete(item.name, item)}
    //   />
    // )
  }));

  const tableConfig: ITableProps = {
    headers: [
      InstitueCurriculum[userLanguage]['NO'],
      InstitueCurriculum[userLanguage]['NAME'],
      isSuperAdmin && InstitueCurriculum[userLanguage]['INSTITUTION_NAME'],
      InstitueCurriculum[userLanguage]['COURSE_TYPE'],
      InstitueCurriculum[userLanguage]['ROOMS'],
      InstitueCurriculum[userLanguage]['UNITS'],
      InstitueRomms[userLanguage]['STATUS']
      // InstitueCurriculum[userLanguage]['ACTION']
    ],
    dataList,
    config: {
      dataList: {
        loading,
        expandable: true
      }
    }
  };

  // ##################################################################### //
  // ############################### OUTPUT ############################## //
  // ##################################################################### //
  return (
    <>
      <PageLayout
        extra={
          <div className={`w-auto flex gap-x-4 justify-end items-center flex-wrap`}>
            {isSuperAdmin && (
              <InsitutionSelector
                selectedInstitution={selectedInstitution?.label}
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
        title={InstitueCurriculum[userLanguage]['TITLE']}>
        <Filters
          loading={loading}
          resetPagination={resetPagination}
          updateFilter={updateFilter}
          filters={filters}
          list={courseList}
        />

        <Table {...tableConfig} />
      </PageLayout>

      <ModalPopUp
        open={deleteModal.show}
        closeAction={handleToggleDelete}
        saveAction={deleting ? () => {} : deleteModal.action}
        saveLabel={deleting ? 'DELETING...' : 'CONFIRM'}
        cancelLabel="CANCEL"
        message={deleteModal.message}
      />
    </>
  );
};

export default CurriculumList;
