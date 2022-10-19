import React, {useState, Fragment, useEffect, useContext} from 'react';
import API, {graphqlOperation} from '@aws-amplify/api';
import {useHistory, useParams} from 'react-router';
import {
  IoArrowUndoCircleOutline,
  IoCaretDownCircleOutline,
  IoCaretUpCircleOutline
} from 'react-icons/io5';
import {IconContext} from 'react-icons/lib/esm/iconContext';

import SectionTitle from 'atoms/SectionTitle';
import PageWrapper from 'atoms/PageWrapper';
import BreadCrums from 'atoms/BreadCrums';
import Buttons from 'atoms/Buttons';
import SearchInput from 'atoms/Form/SearchInput';
import CheckBox from 'atoms/Form/CheckBox';

import * as customQueries from 'customGraphql/customQueries';
import * as customMutations from 'customGraphql/customMutations';
import {getLanguageString} from 'utilities/strings';
import CheckpointQueTable from '../../../../LessonsBuilder/StepActionComponent/CheckPointSteps/CheckpointQueTable';
import {GlobalContext} from 'contexts/GlobalContext';
import {getAsset} from 'assets';
import useDictionary from 'customHooks/dictionary';
import {goBackBreadCrumb} from 'utilities/functions';
import {BsArrowLeft} from 'react-icons/bs';
import {v4 as uuidv4} from 'uuid';

interface ProfileCheckpointlookupProps {
  instId?: string;
}

const ProfileCheckpointlookup = (props: ProfileCheckpointlookupProps) => {
  const {instId} = props;
  const {theme, clientKey, userLanguage} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const history = useHistory();
  const urlParams: any = useParams();
  const {courseId} = urlParams;
  const institutionId = urlParams.institutionId || instId;
  const [selectedCheckpointIds, setSelectedCheckpointIds] = useState([]);
  const [expandId, setExpandedId] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filteredList, setFilteredList] = useState([]);
  const [allCheckpointList, setAllCheckpointList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const {ProfileCheckpointlookupDict, BreadcrumsTitles} = useDictionary(clientKey);

  const breadCrumsList = [
    {title: BreadcrumsTitles[userLanguage]['HOME'], url: '/dashboard', last: false},
    {
      title: BreadcrumsTitles[userLanguage]['INSTITUTION_MANAGEMENT'],
      url: '/dashboard/manage-institutions',
      last: false
    },
    {
      title: BreadcrumsTitles[userLanguage]['INSTITUTION_INFO'],
      url: `/dashboard/manage-institutions/institution/${institutionId}/staff`,
      last: false
    },
    {
      title: BreadcrumsTitles[userLanguage]['CURRICULUMBUILDER'],
      url: `/dashboard/manage-institutions/${institutionId}/curricular?id=${courseId}`,
      last: false
    },
    {
      title: BreadcrumsTitles[userLanguage]['AddExistingCheckpoint'],
      url: `/dashboard/curricular/${courseId}/checkpoint/addNew`,
      last: true
    }
  ];

  const selectItem = (checkpointId: string) => {
    const selectedItem = selectedCheckpointIds.find((id) => id === checkpointId);
    let updatedList;
    if (!selectedItem) {
      updatedList = [...selectedCheckpointIds, checkpointId];
    } else {
      updatedList = selectedCheckpointIds.filter((id) => id !== checkpointId);
    }
    setSelectedCheckpointIds(updatedList);
  };

  const viewCheckpoint = (checkId: string) => {
    if (expandId === checkId) {
      setExpandedId('');
    } else {
      setExpandedId(checkId);
    }
  };

  const searchFromList = () => {
    const currentCheckList = [...allCheckpointList];
    const newList = currentCheckList.filter((item) => {
      // Search on title for match.
      return item.title?.toLowerCase().includes(searchInput.toLowerCase());
    });
    setFilteredList(newList);
  };

  const removeSearchAction = () => {
    setFilteredList([...allCheckpointList]);
    setSearchInput('');
  };
  const saveCommonCurricular = async (checkpointID: string) => {
    let profileCheckpointInput = {
      id: uuidv4(),
      type: 'curricular',
      typeID: courseId,
      checkpointID: checkpointID
    };

    await API.graphql(
      graphqlOperation(customMutations.createCommonCheckpoint, {
        input: profileCheckpointInput
      })
    );
  };

  const saveCurricularCheckpoints = async () => {
    setLoading(true);
    let newCheckpoints: any = await Promise.all(
      selectedCheckpointIds.map(async (selectedId: string) =>
        saveCommonCurricular(selectedId)
      )
    );
    history.goBack();
    setLoading(false);
  };

  const fetchCheckpointLists = async () => {
    try {
      setLoading(true);
      const [allCheckpointList, curricularCheckp]: any = await Promise.all([
        await API.graphql(
          graphqlOperation(customQueries.listCheckpoints, {
            filter: {type: {eq: 'profile'}}
          })
        ),
        await API.graphql(
          graphqlOperation(customQueries.getCurriculumCheckpoints, {
            id: courseId
          })
        )
      ]);
      if (!allCheckpointList) {
        throw new Error('fail!');
      } else {
        const checkpointList = allCheckpointList.data?.listCheckpoints?.items;
        const savedCheckpointId = curricularCheckp.data?.getCurriculum?.checkpoints?.items.map(
          (item: {checkpointID: string}) => item.checkpointID
        );
        const sortedList = checkpointList
          .filter((chechpoint: any) => !savedCheckpointId.includes(chechpoint.id))
          .sort((a: any, b: any) =>
            a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1
          );
        setAllCheckpointList(sortedList);
        setFilteredList(sortedList);
      }
      setLoading(false);
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCheckpointLists();
  }, []);

  return (
    <div>
      {/* Section Header */}
      {/* <BreadCrums items={breadCrumsList} /> */}
      {/* <div className="flex justify-between">
        <SectionTitle
          title={ProfileCheckpointlookupDict[userLanguage]['title']}
          subtitle={ProfileCheckpointlookupDict[userLanguage]['subtitle']}
        />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons
            label="Go Back"
            btnClass="mr-4"
            onClick={() => goBackBreadCrumb(breadCrumsList, history)}
            Icon={IoArrowUndoCircleOutline}
          />
        </div>
      </div> */}
      <div className="px-8 py-4">
        <h3 className="text-lg leading-6 font-medium text-gray-900 w-auto capitalize">
          {ProfileCheckpointlookupDict[userLanguage]['subtitle']}
        </h3>
        <div
          className="flex items-center mt-1 cursor-pointer text-gray-500 hover:text-gray-700"
          // onClick={() =>
          //   history.push(
          //     isSuperAdmin
          //       ? `/dashboard/manage-institutions/courses`
          //       : `/dashboard/manage-institutions/institution/${instId}/courses`
          //   )
          // }
        >
          <span className="w-auto mr-2">
            <BsArrowLeft />
          </span>
          <div className="text-sm">{'Back to Course'}</div>
        </div>
      </div>

      {/* Body section */}
      {/* <PageWrapper> */}
      {/* <div className="w-8/10 m-auto">
        <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">
          {ProfileCheckpointlookupDict[userLanguage]['heading']}
        </h3>
      </div> */}
      <div className="flex justify-between my-4 px-8">
        <p className="text-sm font-medium text-gray-600 flex items-center w-2/4">
          {' '}
          {selectedCheckpointIds?.length}{' '}
          {ProfileCheckpointlookupDict[userLanguage]['selectcheckpoint']}
        </p>
        <SearchInput
          value={searchInput}
          onChange={(val: string) => setSearchInput(val)}
          onKeyDown={searchFromList}
          closeAction={removeSearchAction}
          style="w-2/4"
        />
      </div>
      <div className="px-8">
        <Fragment>
          <div className="flex justify-between w-full py-4 whitespace-nowrap border-b-0 border-gray-200">
            <div className="w-1.5/10 px-6 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              <span>{ProfileCheckpointlookupDict[userLanguage]['selection']}</span>
            </div>
            <div className="w-5/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              {ProfileCheckpointlookupDict[userLanguage]['checkpoint']}
            </div>
            <div className="w-2/10 px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              {ProfileCheckpointlookupDict[userLanguage]['language']}
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
                    {allCheckpointList?.length ? (
                      filteredList.map((item) => (
                        <Fragment key={item.id}>
                          {/* Table row */}
                          <div
                            key={item.id}
                            className={`flex justify-between w-full px-8 py-4 whitespace-nowrap border-b-0 border-gray-200 ${
                              expandId === item.id
                                ? 'border-0 border-indigo-400 rounded-lg'
                                : ''
                            }`}>
                            <div className="flex w-1.5/10 items-center px-8 py-3 text-left text-s leading-4">
                              <span>
                                <CheckBox
                                  value={selectedCheckpointIds?.includes(item.id)}
                                  onChange={() => selectItem(item.id)}
                                  name="selectcheckpoint"
                                />
                              </span>
                            </div>
                            <div className="flex w-5/10 px-8 py-3 items-center text-left text-s leading-4 font-medium whitespace-normal">
                              <div>
                                <span>{item.title}</span>
                                <br />
                                <span className="text-sm leading-6 text-gray-500">
                                  {item.subtitle ? item.subtitle : ''}
                                </span>
                              </div>
                            </div>
                            <div className="flex w-2/10 px-8 py-3 text-left text-s leading-4 items-center whitespace-normal">
                              {item.language ? getLanguageString(item.language) : '--'}
                            </div>
                            <div className="flex w-1.5/10 px-8 py-3 text-left text-s leading-4 items-center whitespace-normal">
                              <span
                                className={`w-6 h-6 cursor-pointer ${theme.textColor[themeColor]}`}
                                onClick={() => viewCheckpoint(item.id)}>
                                <IconContext.Provider
                                  value={{
                                    size: '1.5rem',
                                    color: theme.iconColor[themeColor]
                                  }}>
                                  {expandId === item.id ? (
                                    <IoCaretUpCircleOutline />
                                  ) : (
                                    <IoCaretDownCircleOutline />
                                  )}
                                </IconContext.Provider>
                              </span>
                            </div>
                          </div>

                          {/* Details for selected row */}
                          {expandId === item.id && (
                            <div className="my-6">
                              <CheckpointQueTable checkpointId={item.id} />
                            </div>
                          )}
                        </Fragment>
                      ))
                    ) : (
                      <div className="py-12 my-6 text-center">
                        <p> {ProfileCheckpointlookupDict[userLanguage]['listempty']}</p>
                      </div>
                    )}
                  </Fragment>
                ) : (
                  <div className="py-12 my-6 text-center">
                    <p>{ProfileCheckpointlookupDict[userLanguage]['errfetch']} </p>
                  </div>
                )}
              </Fragment>
            ) : (
              <div className="py-12 my-6 text-center">
                <p>
                  {' '}
                  {selectedCheckpointIds.length > 0
                    ? ProfileCheckpointlookupDict[userLanguage]['updating']
                    : ProfileCheckpointlookupDict[userLanguage]['fetching']}{' '}
                </p>
              </div>
            )}
          </div>
        </Fragment>
      </div>
      <div className="flex mt-8 justify-center px-8 pb-4">
        <div className="flex justify-center my-6">
          <Buttons
            btnClass="py-1 px-4 text-xs mr-2"
            label={ProfileCheckpointlookupDict[userLanguage]['button']['cancel']}
            onClick={history.goBack}
            transparent
          />
          {allCheckpointList.length > 0 && (
            <Buttons
              btnClass="py-1 px-8 text-xs ml-2"
              label={
                loading
                  ? ProfileCheckpointlookupDict[userLanguage]['button']['saving']
                  : ProfileCheckpointlookupDict[userLanguage]['button']['save']
              }
              onClick={saveCurricularCheckpoints}
              disabled={loading || selectedCheckpointIds.length === 0 ? true : false}
            />
          )}
        </div>
      </div>
      {/* </PageWrapper> */}
    </div>
  );
};

export default ProfileCheckpointlookup;
