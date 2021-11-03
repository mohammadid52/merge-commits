import React, {Fragment, useContext, useEffect, useState} from 'react';
import {useHistory, useRouteMatch} from 'react-router';
import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import * as mutations from '@graphql/mutations';
import AddButton from '@atoms/Buttons/AddButton';
import useDictionary from '@customHooks/dictionary';
import {GlobalContext} from '@contexts/GlobalContext';

import * as customQueries from '@customGraphql/customQueries';
import Loader from '@components/Atoms/Loader';
import {getAsset} from 'assets';
import UnitListRow from './UnitListRow';
import ModalPopUp from '@components/Molecules/ModalPopUp';
import SearchInput from '@components/Atoms/Form/SearchInput';
import Selector from '@components/Atoms/Form/Selector';

export const UnitList = ({instId}: any) => {
  const history = useHistory();
  const match = useRouteMatch();
  const {
    clientKey,
    state: {
      user: {isSuperAdmin},
    },
    theme,
    userLanguage,
  } = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const {UnitLookupDict} = useDictionary(clientKey);

  // ~~~~~~~~~~~~~~ UNIT LIST ~~~~~~~~~~~~~~ //
  const [loading, setLoading] = useState(true);
  const [institutionList, setInstitutionList] = useState<any>([]);
  const [allUnits, setAllUnits] = useState<any>([]);
  const [units, setUnits] = useState<any>([]);
  const [searchInput, setSearchInput] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState<any>({});

  useEffect(() => {
    fetchSyllabusList();
    fetchInstitutions();
  }, []);

  const fetchSyllabusList = async () => {
    try {
      const result: any = await API.graphql(
        graphqlOperation(customQueries.listUniversalSyllabuss, {
          filter: isSuperAdmin
            ? undefined
            : {
                institutionID: {eq: instId},
              },
        })
      );
      setUnits(result.data?.listUniversalSyllabuss.items);
      setAllUnits(result.data?.listUniversalSyllabuss.items);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const updateUnitList = (inputObj: any) => {
    setUnits(units.filter((unitObj: any) => unitObj.id !== inputObj.id));
  };

  // ~ CHECK TO SEE IF UNIT CAN BE DELETED ~ //

  /****************************************************
   *   IF UNIT HAS ANY AMOUNT OF SYLLABI ATTACHED,    *
   * OR IF THIS UNIT HAS EVER HAD ANY ACTIVE LESSONS, *
   *            THEN DO NOT ALLOW A DELETE            *
   ****************************************************/
  const [deleting, setDeleting] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<any>({
    show: false,
    message: '',
    action: () => {},
  });

  const checkIfRemovable = (unitObj: any) => {
    if (
      unitObj.lessons?.items?.length > 0 ||
      (unitObj.lessonHistory && unitObj.lessonHistory?.length > 0) ||
      unitObj?.isUsed
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
        message: `Are you sure you want to delete the unit "${targetString}"?`,
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
        graphqlOperation(mutations.deleteUniversalSyllabus, {
          input: {id: item.id},
        })
      );
      updateUnitList(item);
    } catch (e) {
      console.error('error deleting...', e);
    } finally {
      setDeleting(false);
      setDeleteModal({show: false, message: '', action: () => {}});
    }
  };

  // ~~~~~~~~~~~~ FUNCTIONALITY ~~~~~~~~~~~~ //

  const handleAdd = () => {
    history.push(`${match.url}/add`);
  };
  const handleView = (unitId: string) => {
    history.push(`${match.url}/${unitId}/edit`);
  };

  const fetchInstitutions = async () => {
    try {
      const list: any = await API.graphql(
        graphqlOperation(customQueries.listInstitutionOptions)
      );
      setInstitutionList(
        list.data?.listInstitutions?.items.sort((a: any, b: any) =>
          a.name?.toLowerCase() > b.name?.toLowerCase() ? 1 : -1
        )
      );
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const instituteChange = (_: string, name: string, value: string) => {
    setSelectedInstitution({name, id: value});
    onSearch(searchInput, value);
  };

  const onSearch = (searchValue: string, institutionId?: string) => {
    if (searchValue && institutionId) {
      setUnits(
        allUnits.filter(
          (item: any) =>
            item.name?.toLowerCase().includes(searchValue.toLowerCase()) &&
            item.institution?.id === institutionId
        )
      );
    } else if (institutionId) {
      setUnits(allUnits.filter((item: any) => item.institution?.id === institutionId));
    } else if (searchValue) {
      setUnits(
        allUnits.filter((item: any) =>
          item.name?.toLowerCase().includes(searchValue.toLowerCase())
        )
      );
    } else {
      setUnits(allUnits);
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

  // ##################################################################### //
  // ############################### OUTPUT ############################## //
  // ##################################################################### //

  return (
    <div className="pt-0 flex m-auto justify-center h-full p-8">
      <div className="flex flex-col">
        {loading ? (
          <div className="py-20 text-center mx-auto flex justify-center items-center w-full h-48">
            <div className="w-5/10">
              <Loader />
            </div>
          </div>
        ) : units.length ? (
          <Fragment>
            <div className="flex justify-between items-center w-full m-auto">
              <h3 className="text-lg leading-6 uppercase text-gray-600 w-auto">Units</h3>
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
                      placeholder={UnitLookupDict[userLanguage]['SELECT_INSTITUTION']}
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
                    label={UnitLookupDict[userLanguage]['NEW_UNIT']}
                    onClick={handleAdd}
                  />
                )}
              </div>
            </div>
            <div className="w-full pt-8 m-auto border-b-0 border-gray-200">
              <div className="flex justify-between bg-gray-50 px-8 whitespace-nowrap">
                <div className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>{UnitLookupDict[userLanguage]['NO']}</span>
                </div>
                <div
                  className={`${
                    isSuperAdmin ? 'w-4/10' : 'w-8/10'
                  } px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider`}>
                  <span>{UnitLookupDict[userLanguage]['NAME']}</span>
                </div>
                {isSuperAdmin && (
                  <div className="w-4/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider truncate">
                    <span>{UnitLookupDict[userLanguage]['INSTITUTION_NAME']}</span>
                  </div>
                )}
                <div className="w-1/10 m-auto py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span className="w-auto">{UnitLookupDict[userLanguage]['ACTION']}</span>
                </div>
              </div>
            </div>

            <div className="mb-8 w-full m-auto flex-1 overflow-y-auto">
              {units.map((unit: any, index: number) => (
                <UnitListRow
                  key={`unit_list_row_${index}`}
                  index={index}
                  item={unit}
                  checkIfRemovable={checkIfRemovable}
                  handleToggleDelete={handleToggleDelete}
                  editCurrentUnit={handleView}
                  isSuperAdmin
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
          </Fragment>
        ) : (
          <>
            {!isSuperAdmin && (
              <div className="flex justify-center mt-8">
                <AddButton
                  className="mx-4"
                  label={UnitLookupDict[userLanguage]['NEW_UNIT']}
                  onClick={handleAdd}
                />
              </div>
            )}
            <p className="text-center p-16"> {UnitLookupDict[userLanguage]['INFO']}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default UnitList;
