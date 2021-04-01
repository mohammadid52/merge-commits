import React, { useState, Fragment, useEffect, useContext } from 'react';
import API, { graphqlOperation } from '@aws-amplify/api';
import { useHistory, useParams } from 'react-router';
import { IoArrowUndoCircleOutline, IoCaretDownCircleOutline, IoCaretUpCircleOutline } from 'react-icons/io5';
import { IconContext } from 'react-icons/lib/esm/iconContext';

import SectionTitle from '../../../../../../Atoms/SectionTitle';
import PageWrapper from '../../../../../../Atoms/PageWrapper';
import BreadCrums from '../../../../../../Atoms/BreadCrums';
import Buttons from '../../../../../../Atoms/Buttons';
import SearchInput from '../../../../../../Atoms/Form/SearchInput';
import CheckBox from '../../../../../../Atoms/Form/CheckBox';

import * as customQueries from '../../../../../../../customGraphql/customQueries';
import * as customMutations from '../../../../../../../customGraphql/customMutations';
import { getLanguageString } from '../../../../../../../utilities/strings';
import CheckpointQueTable from '../../../../LessonsBuilder/StepActionComponent/CheckPointSteps/CheckpointQueTable';
import { GlobalContext } from '../../../../../../../contexts/GlobalContext';
import { getAsset } from '../../../../../../../assets';

interface ProfileCheckpointlookupProps {

}

const ProfileCheckpointlookup = (props: ProfileCheckpointlookupProps) => {
  const { } = props;
  const { theme, clientKey } = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const history = useHistory();
  const urlParams: any = useParams()
  const curricularId = urlParams.curricularId;
  const [selectedCheckpointIds, setSelectedCheckpointIds] = useState([]);
  const [expandId, setExpandedId] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filteredList, setFilteredList] = useState([]);
  const [allCheckpointList, setAllCheckpointList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const breadCrumsList = [
    { title: 'Home', url: '/dashboard', last: false },
    { title: 'Add Existing Checkpoint', url: `/dashboard/curricular/${curricularId}/checkpoint/addNew`, last: true }
  ];

  const selectItem = (checkpointId: string) => {
    const selectedItem = selectedCheckpointIds.find(id => id === checkpointId);
    let updatedList;
    if (!selectedItem) {
      updatedList = [...selectedCheckpointIds, checkpointId];
    } else {
      updatedList = selectedCheckpointIds.filter(id => id !== checkpointId);
    }
    setSelectedCheckpointIds(updatedList);
  }

  const viewCheckpoint = (checkId: string) => {
    if (expandId === checkId) {
      setExpandedId('')
    } else {
      setExpandedId(checkId)
    }
  }

  const searchFromList = () => {
    const currentCheckList = [...allCheckpointList];
    const newList = currentCheckList.filter(item => {
      // Search on title for match.
      return (
        (item.title?.toLowerCase().includes(searchInput))
      )
    });
    setFilteredList(newList);
  }

  const removeSearchAction = () => {
    setFilteredList([...allCheckpointList]);
    setSearchInput('')
  }
  const saveCommonCurricular = async (checkpointID: string) => {
    let profileCheckpointInput = {
      type: 'curricular',
      typeID: curricularId,
      checkpointID: checkpointID,
    }
    await API.graphql(graphqlOperation(customMutations.createCommonCheckpoint, {
      input: profileCheckpointInput
    }))
  }

  const saveCurricularCheckpoints = async () => {
    setLoading(true);
    let newCheckpoints: any = await Promise.all(
      selectedCheckpointIds.map(async (selectedId: string) => saveCommonCurricular(selectedId))
    )
    history.goBack();
    setLoading(false);

  }

  const fetchCheckpointLists = async () => {
    try {
      setLoading(true);
      const [allCheckpointList, curricularCheckp]: any = await Promise.all([
        await API.graphql(
          graphqlOperation(customQueries.listCheckpoints, {
            filter: { type: { eq: 'profile' } },
          })),
        await API.graphql(
          graphqlOperation(customQueries.getCurriculumCheckpoints, {
            id: curricularId
          })),
      ]);
      if (!allCheckpointList) {
        throw new Error('fail!');
      } else {
        const checkpointList = allCheckpointList.data?.listCheckpoints?.items;
        const savedCheckpointId = curricularCheckp.data?.getCurriculum?.checkpoints?.items.map((item: { checkpointID: string }) => item.checkpointID)
        const sortedList = checkpointList
          .filter((chechpoint: any) => !savedCheckpointId.includes(chechpoint.id))
          .sort((a: any, b: any) => a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1);
        setAllCheckpointList(sortedList);
        setFilteredList(sortedList)
      }
      setLoading(false);
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCheckpointLists();
  }, [])

  return (
    <div className="w-9/10 h-full px-4 pb-4">

      {/* Section Header */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle title="Select Checkpoint" subtitle="Select checkpoint for curricular." />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons label="Go Back" btnClass="mr-4" onClick={history.goBack} Icon={IoArrowUndoCircleOutline} />
        </div>
      </div>

      {/* Body section */}
      <PageWrapper>
        <div className="w-8/10 m-auto">
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">CHECKPOINT LISTS</h3>
        </div>
        <div className="flex justify-between my-4">
          <p className="text-sm font-medium text-gray-600 flex items-center w-2/4 px-14"> {selectedCheckpointIds?.length} Checkpoints Selected</p>
          <SearchInput value={searchInput} onChange={(val: string) => setSearchInput(val)} onKeyDown={searchFromList} closeAction={removeSearchAction} style="w-2/4" />
        </div>
        <div>
          <Fragment>
            <div className="flex justify-between w-full px-8 py-4 whitespace-nowrap border-b-0 border-gray-200">
              <div className="w-1.5/10 px-6 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                <span>Selection</span>
              </div>
              <div className="w-5/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Checkpoint Title
              </div>
              <div className="w-2/10 px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Language
              </div>
              <div className="w-1.5/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                <span></span>
              </div>
            </div>

            <div className="w-full m-auto max-h-136 overflow-y-auto">
              {!loading ? (
                <Fragment>
                  {!error ? (
                    <Fragment>

                      {allCheckpointList?.length ? filteredList.map(item => (
                        <Fragment key={item.id}>
                          {/* Table row */}
                          <div key={item.id} className={`flex justify-between w-full px-8 py-4 whitespace-nowrap border-b-0 border-gray-200 ${expandId === item.id ? 'border border-indigo-400 rounded-lg' : ''}`}>
                            <div className="flex w-1.5/10 items-center px-8 py-3 text-left text-s leading-4">
                              <span>
                                <CheckBox value={selectedCheckpointIds?.includes(item.id)} onChange={() => selectItem(item.id)} name='selectcheckpoint' />
                              </span>
                            </div>
                            <div className="flex w-5/10 px-8 py-3 items-center text-left text-s leading-4 font-medium whitespace-normal">
                              <div>
                                <span>{item.title}</span><br />
                                <span className="text-sm leading-6 text-gray-500">{item.subtitle ? item.subtitle : ''}</span>
                              </div>
                            </div>
                            <div className="flex w-2/10 px-8 py-3 text-left text-s leading-4 items-center whitespace-normal">{item.language ? getLanguageString(item.language) : '--'}</div>
                            <div className="flex w-1.5/10 px-8 py-3 text-left text-s leading-4 items-center whitespace-normal">
                              <span className={`w-6 h-6 cursor-pointer ${theme.textColor[themeColor]}`} onClick={() => viewCheckpoint(item.id)}>
                                <IconContext.Provider value={{ size: '1.5rem', color: theme.iconColor[themeColor] }}>
                                  {expandId === item.id ? <IoCaretUpCircleOutline /> : <IoCaretDownCircleOutline />}
                                </IconContext.Provider>
                              </span>
                            </div>
                          </div>

                          {/* Details for selected row */}
                          {(expandId === item.id) && (
                            <div className="my-6">
                              <CheckpointQueTable checkpointId={item.id} />
                            </div>
                          )}
                        </Fragment>
                      ))
                        : (
                          <div className="py-12 my-6 text-center">
                            <p> Other checkpoint list is empty, please create a new checkpoint.</p>
                          </div>
                        )
                      }
                    </Fragment>
                  ) : <div className="py-12 my-6 text-center">
                      <p> Error while fetching Checkpoint list Please try again later. </p>
                    </div>}
                </Fragment>
              ) : (<div className="py-12 my-6 text-center">
                <p> {selectedCheckpointIds.length > 0 ? 'Updating checkpoints please wait...' : 'Fetching Checkpoint list Please wait...'} </p>
              </div>)}
            </div>
          </Fragment>
        </div>
        <div className="flex mt-8 justify-center px-6 pb-4">
          <div className="flex justify-center my-6">
            <Buttons btnClass="py-1 px-4 text-xs mr-2" label="Cancel" onClick={history.goBack} transparent />
            {
              allCheckpointList.length > 0 && <Buttons btnClass="py-1 px-8 text-xs ml-2" label={loading ? 'Saving...' : 'Save'} onClick={saveCurricularCheckpoints} disabled={(loading || selectedCheckpointIds.length === 0) ? true : false} />
            }
          </div>
        </div>
      </PageWrapper>

    </div>
  )
}

export default ProfileCheckpointlookup
