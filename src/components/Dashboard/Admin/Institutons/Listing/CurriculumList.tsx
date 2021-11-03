import React, {Fragment, useContext, useEffect, useState} from 'react';
import {useHistory, useRouteMatch} from 'react-router';
import * as customQueries from '@customGraphql/customQueries';
import * as mutations from '@graphql/mutations';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../customHooks/dictionary';
import AddButton from '../../../../Atoms/Buttons/AddButton';
import CurriculumListRow from './CurriculumListRow';
import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import ModalPopUp from '@components/Molecules/ModalPopUp';
import Loader from '@components/Atoms/Loader';
import SearchInput from '@components/Atoms/Form/SearchInput';
import Selector from '@components/Atoms/Form/Selector';

interface CurriculumListProps {
  curricular?: {items: {name?: string; id: string}[]};
  updateCurricularList?: any;
  instId: string;
  instName: string;
}

const CurriculumList = ({
  curricular,
  updateCurricularList,
  instId,
}: CurriculumListProps) => {
  const match = useRouteMatch();
  const history = useHistory();
  // ~~~~~~~~~~ CONTEXT_SPLITTING ~~~~~~~~~~ //
  const gContext = useContext(GlobalContext);
  const clientKey = gContext.clientKey;
  const userLanguage = gContext.userLanguage;
  const {InstitueCurriculum} = useDictionary(clientKey);
  const isSuperAdmin: boolean = gContext.state.user.isSuperAdmin;
  const [courseList, setCourseList] = useState<Array<{name?: string; id: string}>>();
  const [allCourses, setAllCourses] = useState<Array<{name?: string; id: string}>>();
  const [institutionList, setInstitutionList] = useState<any>([]);
  const [loading, setLoading] = useState(isSuperAdmin);
  const [searchInput, setSearchInput] = useState('');
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
    action: () => {},
  });

  useEffect(() => {
    if (isSuperAdmin) {
      fetchCurriculums();
      fetchInstitutions();
    }
  }, []);

  const instituteChange = (_: string, name: string, value: string) => {
    setSelectedInstitution({name, id: value});
    onSearch(searchInput, value);
  };

  useEffect(() => {
    if (curricular?.items?.length) {
      setCourseList(curricular.items);
      setAllCourses(curricular.items);
    }
  }, [curricular?.items?.length]);

  const fetchCurriculums = async () => {
    try {
      const list: any = await API.graphql(
        graphqlOperation(customQueries.listCurriculumsForSuperAdmin)
      );
      setCourseList(list.data?.listCurriculums?.items);
      setAllCourses(list.data?.listCurriculums?.items);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const onSearch = (searchValue: string, institutionId?: string) => {
    if (searchValue && institutionId) {
      setCourseList(
        [...allCourses].filter(
          (item: any) =>
            item.name?.toLowerCase().includes(searchValue.toLowerCase()) &&
            item.institution?.id === institutionId
        )
      );
    } else if (institutionId) {
      setCourseList(
        [...allCourses].filter((item: any) => item.institution?.id === institutionId)
      );
    } else if (searchValue) {
      setCourseList(
        [...allCourses].filter((item: any) =>
          item.name?.toLowerCase().includes(searchValue.toLowerCase())
        )
      );
    } else {
      setCourseList(allCourses);
    }
  };

  const removeSearchAction = () => {
    setSearchInput('');
    onSearch('', selectedInstitution?.id);
  };

  const onInstitutionSelectionRemove = () => {
    setSelectedInstitution({});
    onSearch(searchInput, '');
  };

  const fetchInstitutions = async () => {
    try {
      const list: any = await API.graphql(
        graphqlOperation(customQueries.listInstitutionOptions)
      );
      setInstitutionList(
        list.data?.listInstitutions?.items?.sort((a: any, b: any) =>
          a.name?.toLowerCase() > b.name?.toLowerCase() ? 1 : -1
        )
      );
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const checkIfRemovable = (curriculumObj: any) => {
    if (
      curriculumObj.syllabi?.length > 0 ||
      (curriculumObj.syllabiHistory && curriculumObj.syllabiHistory?.length > 0)
    ) {
      return false;
    } else {
      return true;
    }
  };

  const handleToggleDelete = (targetString?: string, itemObj?: any) => {
    if (!deleteModal.show) {
      setDeleteModal({
        show: true,
        message: `Are you sure you want to delete the course "${targetString}"?`,
        action: () => handleDelete(itemObj),
      });
    } else {
      setDeleteModal({show: false, message: '', action: () => {}});
    }
  };

  const handleDelete = async (item: any) => {
    setDeleting(true);
    try {
      console.log('deleting...');
      await API.graphql(
        graphqlOperation(mutations.deleteCurriculum, {
          input: {id: item.id},
        })
      );
      updateCurricularList(item);
    } catch (e) {
      console.error('error deleting...', e);
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

  // ##################################################################### //
  // ############################### OUTPUT ############################## //
  // ##################################################################### //
  return (
    <div className="pt-0 flex m-auto justify-center h-full p-8">
      <div className="flex flex-col">
        <div className="flex justify-between items-center w-full m-auto">
          <h3 className="text-lg leading-6 uppercase text-gray-600 w-auto">
            {InstitueCurriculum[userLanguage]['TITLE']}
          </h3>
          <div className={`flex justify-end`}>
            <div
              className={`flex justify-between w-auto ${
                isSuperAdmin ? 'lg:w-96' : 'lg:w-48 mr-4'
              }`}>
              <SearchInput
                value={searchInput}
                onChange={(value) => setSearchInput(value)}
                onKeyDown={() => onSearch(searchInput, selectedInstitution?.id)}
                closeAction={removeSearchAction}
                style={`mr-4 w-auto lg:w-48`}
              />
              {isSuperAdmin && (
                <Selector
                  placeholder={InstitueCurriculum[userLanguage]['SELECT_INSTITUTION']}
                  list={institutionList}
                  selectedItem={selectedInstitution?.name}
                  onChange={instituteChange}
                  arrowHidden={true}
                  additionalClass={'w-auto lg:w-48'}
                  isClearable
                  onClear={onInstitutionSelectionRemove}
                />
              )}
            </div>
            {!isSuperAdmin && (
              <AddButton
                label={InstitueCurriculum[userLanguage]['BUTTON']['ADD']}
                onClick={createNewCurricular}
              />
            )}
          </div>
        </div>
        {loading ? (
          <div className="py-20 text-center mx-auto flex justify-center items-center w-full h-48">
            <div className="w-5/10">
              <Loader color="rgba(107, 114, 128, 1)" />
              <p className="mt-2 text-center text-lg text-gray-500">
                {InstitueCurriculum[userLanguage]['LOADING']}
              </p>
            </div>
          </div>
        ) : courseList?.length ? (
          <>
            <div className="w-full pt-8 m-auto border-b-0 border-gray-200">
              <div className="flex justify-between bg-gray-50 px-8 whitespace-nowrap">
                <div className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>{InstitueCurriculum[userLanguage]['NO']}</span>
                </div>
                <div
                  className={`${
                    isSuperAdmin ? 'w-4/10' : 'w-8/10'
                  } px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider truncate`}>
                  <span>{InstitueCurriculum[userLanguage]['NAME']}</span>
                </div>
                {isSuperAdmin && (
                  <div className="w-4/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider whitespace-normal">
                    <span>{InstitueCurriculum[userLanguage]['INSTITUTION_NAME']}</span>
                  </div>
                )}
                <div className="w-1/10 m-auto py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span className="w-auto">
                    {InstitueCurriculum[userLanguage]['ACTION']}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-8 w-full m-auto flex-1 overflow-y-auto">
              {courseList.map((item, index) => (
                <CurriculumListRow
                  key={`curr_list_row_${index}`}
                  index={index}
                  isSuperAdmin={isSuperAdmin}
                  item={item}
                  checkIfRemovable={checkIfRemovable}
                  handleToggleDelete={handleToggleDelete}
                  editCurrentCurricular={editCurrentCurricular}
                />
              ))}
            </div>
            {deleteModal.show && (
              <ModalPopUp
                closeAction={handleToggleDelete}
                saveAction={deleting ? () => {} : deleteModal.action}
                saveLabel={deleting ? 'DELETING...' : 'CONFIRM'}
                cancelLabel="CANCEL"
                message={deleteModal.message}
              />
            )}
          </>
        ) : (
          <Fragment>
            {!isSuperAdmin && (
              <div className="flex justify-center mt-8">
                <AddButton
                  className="mx-4"
                  label={InstitueCurriculum[userLanguage]['BUTTON']['ADD']}
                  onClick={createNewCurricular}
                />
              </div>
            )}
            <p className="text-center p-16">
              {' '}
              {InstitueCurriculum[userLanguage]['INFO']}
            </p>
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default CurriculumList;
