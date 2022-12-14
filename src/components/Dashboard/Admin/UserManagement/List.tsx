import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import Highlighted from '@components/Atoms/Highlighted';
import Loader from '@components/Atoms/Loader';
import Placeholder from '@components/Atoms/Placeholder';
import Popover from '@components/Atoms/Popover';
import {GetPersonLocationQueryVariables, PersonStatus, UserPageState} from 'API';
import Buttons from 'atoms/Buttons';
import Modal from 'atoms/Modal';
import axios from 'axios';
import {GlobalContext} from 'contexts/GlobalContext';
import * as customQueries from 'customGraphql/customQueries';
import * as customSubscriptions from 'customGraphql/customSubscriptions';
import moment from 'moment';
import React, {useContext, useEffect, useState} from 'react';
import {FiAlertCircle} from 'react-icons/fi';
import {useHistory, useRouteMatch} from 'react-router-dom';
import {getImageFromS3} from 'utilities/services';
import {requestResetPassword} from 'utilities/urls';
import UserLocation from './UserLocation';
import UserRole from './UserRole';
import UserStatus from './UserStatus';

interface ListProps {
  item: any;
  searchTerm?: string;
  isStudentRoster?: boolean;
  idx?: number;
}

type LocationInfoType = {
  idx: number;
  authId: string;
  showLocationInfo: boolean;

  pageState: UserPageState;
  email: string;
  setShowLocationInfo: React.Dispatch<React.SetStateAction<boolean>>;
};

export const formatPageName = (pageState: UserPageState) => {
  switch (pageState) {
    case UserPageState.GAME_CHANGERS:
      return 'Game Changers';
    case UserPageState.NOT_LOGGED_IN:
      return 'Logged Out';
    case UserPageState.LOGGED_IN:
      return 'Logged In';
    case UserPageState.CLASS:
      return 'Classroom';
    case UserPageState.LESSON:
      return 'Lesson';
    case UserPageState.DASHBOARD:
      return 'Dashboard';
    case UserPageState.COMMUNITY:
      return 'Community';
    case UserPageState.NOTEBOOK:
      return 'Notebook';
    default:
      return pageState;
  }
};

const LocationInfo = ({
  idx,
  authId,
  setShowLocationInfo,
  showLocationInfo,
  email,
  pageState
}: LocationInfoType) => {
  let subscribe: any;

  const [localPageState, setLocalPageState] = useState({
    pageState: pageState || UserPageState.NOT_LOGGED_IN,
    lastPageStateUpdate: new Date().toISOString()
  });

  const inLesson = localPageState.pageState === UserPageState.LESSON;

  const [isLoading, setIsLoading] = useState(false);
  const [isPersonLocationFetched, setIsPersonLocationFetched] = useState(false);
  const [liveLessonData, setLiveLessonData] = useState(null);

  const fetchPersonLocation = async () => {
    try {
      setIsLoading(true);
      const personLocation: any = await API.graphql(
        graphqlOperation(customQueries.getPersonLocation, {
          personAuthID: authId,
          personEmail: email
        } as GetPersonLocationQueryVariables)
      );

      setLiveLessonData(personLocation?.data?.getPersonLocation);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setIsPersonLocationFetched(true);
    }
  };

  useEffect(() => {
    if (inLesson && !isPersonLocationFetched && showLocationInfo) {
      fetchPersonLocation();
    }
  }, [inLesson, isPersonLocationFetched, showLocationInfo]);

  const subscribeToLocation = () => {
    const personLocationSub = API.graphql(
      graphqlOperation(customSubscriptions.onUpdatePerson, {
        authId: authId
      })
      //@ts-ignore
    ).subscribe({
      next: (locationData: any) => {
        const updatedStudent = locationData.value.data.onUpdatePerson;
        if (updatedStudent) {
          setLocalPageState({
            pageState: updatedStudent.pageState,
            lastPageStateUpdate: updatedStudent.lastPageStateUpdate
          });
        }
      }
    });
    return personLocationSub;
  };

  useEffect(() => {
    if (authId) {
      subscribe = subscribeToLocation();
    }
    return () => {
      subscribe.unsubscribe();
    };
  }, []);

  const loggedOut = localPageState.pageState === UserPageState.NOT_LOGGED_IN;
  const loggedIn = localPageState.pageState === UserPageState.LOGGED_IN;

  const lastPageStateUpdate = localPageState.lastPageStateUpdate
    ? moment(localPageState.lastPageStateUpdate).format('lll')
    : null;

  return (
    <>
      <Popover
        bottom={idx < 2 ? -3 : 1.5}
        minHeight="null"
        minWidth={inLesson ? 96 : 52}
        className="w-auto"
        show={showLocationInfo}
        content={
          <div className="w-auto">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-1">
              <div className="flex w-auto items-end justify-between">
                <dt className="w-auto text-sm font-medium text-gray-500">Page:</dt>
                <dd className="w-auto mt-1 text-sm break-all text-gray-700 font-medium">
                  {loggedIn && !loggedOut ? (
                    <span className="capitalize">
                      {inLesson
                        ? `in Lesson`
                        : `on ${localPageState.pageState?.toLowerCase()}`}
                    </span>
                  ) : (
                    formatPageName(localPageState.pageState)
                  )}
                </dd>
              </div>

              {inLesson && isLoading && (
                <div className="flex items-center justify-center h-full">
                  <Loader className="theme-text text-xs" />
                </div>
              )}

              {inLesson && !isLoading && isPersonLocationFetched && liveLessonData && (
                <>
                  <div className="flex w-auto items-end justify-between">
                    <dt className="w-auto text-sm font-medium text-gray-500">Lesson:</dt>
                    <dd className="w-auto mt-1 flex items-center justify-between  text-sm text-gray-700 font-medium">
                      {liveLessonData?.lesson?.title || '-'}
                    </dd>
                  </div>

                  <div className="flex w-auto items-end justify-between">
                    <dt className="w-auto text-sm font-medium text-gray-500">Room:</dt>
                    <dd className="w-auto mt-1 flex items-center justify-between  text-sm text-gray-700 font-medium">
                      {liveLessonData?.room?.name || '-'}
                    </dd>
                  </div>
                </>
              )}

              {lastPageStateUpdate !== null && (
                <span className="border-t-0 theme-border-200 text-gray-600 pt-1 mt-1 text-xs text-center">
                  Since {lastPageStateUpdate}
                </span>
              )}
            </dl>
          </div>
        }
        setShow={setShowLocationInfo}>
        {formatPageName(localPageState.pageState) || '--'}
      </Popover>
    </>
  );
};

const List = (props: ListProps) => {
  const {item, idx, searchTerm, isStudentRoster} = props;

  const match = useRouteMatch();
  const history = useHistory();
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetPasswordServerResponse, setResetPasswordServerResponse] = useState({
    show: false,
    message: ''
  });
  const {state} = useContext(GlobalContext);

  const handleLink = (id: string) => {
    const {user} = state;

    if (isStudentRoster) {
      history.push(
        `/dashboard/manage-institutions/institution/${user.associateInstitute[0].institution.id}/manage-users/${id}?from=dashboard`
      );
    } else {
      const url = match.url.endsWith('/') ? match.url : match.url + '/';
      history.push(`${url}${id}`);
    }
  };

  // test
  const resetPassword = async (user: any) => {
    try {
      setLoading(true);
      await axios.post(requestResetPassword, {email: user.email});
      setResetPasswordServerResponse({
        show: true,
        message: 'Password was reset'
      });
    } catch (err) {
      setResetPasswordServerResponse({
        show: true,
        message: 'Error in resetting password'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function getUrl() {
      const imageUrl: any = await getImageFromS3(item.image);
      setImageUrl(imageUrl);
    }
    getUrl();
  }, [item.image]);

  const showResetPasswordOption = (loggedUserRole: any, userRole: any) => {
    let show = true;
    if (loggedUserRole === 'ADM' || loggedUserRole === 'SUP') {
      show = true;
    }
    if (loggedUserRole === 'TR' && userRole === 'ST') {
      show = true;
    }
    if (loggedUserRole === 'FLW' && userRole === 'ST') {
      show = true;
    }

    if (show) {
      return (
        <Buttons
          size="small"
          transparent
          label={loading ? 'Resetting' : 'Reset Password'}
          disabled={loading}
          onClick={() => resetPassword(item)}
        />
      );
    }

    return <div className="w-2/10" />;
  };

  const onAlertClose = () => {
    setResetPasswordServerResponse({
      show: false,
      message: ''
    });
  };

  const [showLocationInfo, setShowLocationInfo] = useState(false);

  return (
    ///change INFO, MARGIN and WIDTH if needed
    <>
      <div
        id={item.id}
        onClick={() => handleLink(item.id)}
        className="flex hover:bg-gray-200 justify-between bg-white w-full border-b-0 border-gray-200">
        <div className="w-4/10 px-8 py-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10">
              {item.image ? (
                <img src={imageUrl} className="h-8 w-8 rounded-full" />
              ) : (
                <Placeholder
                  lastName={item.lastName}
                  firstName={item.firstName}
                  size="h-8 w-8"
                />
              )}
            </div>
            <div className="ml-2">
              <div
                data-cy={`${item.id}`}
                className="hover:text-gray-600 cursor-pointer text-sm leading-5 font-medium text-gray-900"
                onClick={() => handleLink(item.id)}>
                <Highlighted text={`${idx + 1}) ${item.name}`} highlight={searchTerm} />
              </div>
              <div className="text-sm leading-5 text-gray-500 break-all">
                <Highlighted text={item.email} highlight={searchTerm} />
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/10 flex justify-center items-center px-8 py-4 whitespace-nowrap">
          <span className="w-auto text-sm leading-5 text-gray-500">
            <UserLocation role={item.role} onDemand={item?.onDemand} />
          </span>
        </div>
        <div className="w-1/10 flex justify-center items-center px-8 py-4 whitespace-nowrap">
          <span className="w-auto text-sm leading-5 text-gray-500">
            <UserRole role={item.role ? item.role : '--'} />
          </span>
        </div>
        <div className="w-1/10 flex justify-center items-center px-8 py-4 whitespace-nowrap">
          <div className="w-16 flex justify-center flex-col">
            <UserStatus status={item.status ? item.status : '--'} />
            {item.status === PersonStatus.INACTIVE &&
              item.inactiveStatusDate !== null && (
                <span className=" text-gray-600 pt-1 text-xs text-left -ml-4">
                  Since {moment(item.inactiveStatusDate).format('ll')}
                </span>
              )}
          </div>
        </div>

        <div
          className="w-2/10 flex justify-center items-center pr-4 py-4 cursor-pointer whitespace-nowrap text-right text-sm text-gray-500 leading-5 font-medium"
          onMouseEnter={() => {
            if (item.role === 'ST' && item.pageState !== null) {
              setShowLocationInfo(true);
            }
          }}
          onMouseLeave={() => {
            setShowLocationInfo(false);
          }}>
          {item.role === 'ST' &&
          item.status !== PersonStatus.INACTIVE &&
          item.pageState ? (
            <LocationInfo
              idx={idx}
              authId={item.authId}
              email={item.email}
              setShowLocationInfo={setShowLocationInfo}
              showLocationInfo={showLocationInfo}
              pageState={item.pageState}
            />
          ) : (
            '--'
          )}
        </div>

        {state.user.role !== 'ST' && state.user.role !== 'BLD' ? (
          <div className="w-2/10 flex items-center justify-center">
            {showResetPasswordOption(state.user.role, item.role)}
          </div>
        ) : null}
      </div>
      {resetPasswordServerResponse.show && (
        <Modal showHeader={false} showFooter={false} closeAction={onAlertClose}>
          <div className="py-8 px-16">
            <div className="mx-auto flex items-center justify-center rounded-full">
              <FiAlertCircle className="w-8 h-8" />
            </div>
            <div className="mt-4">{resetPasswordServerResponse.message}</div>
            <div className="flex justify-center mt-4">
              <Buttons
                btnClass={'abc'}
                label={'Ok'}
                labelClass={'leading-6'}
                onClick={onAlertClose}
              />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default List;
