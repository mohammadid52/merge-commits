import {formatPageName} from '@components/Dashboard/Admin/UserManagement/List';

import {UserPageState, GetPersonLocationQueryVariables, PersonStatus} from 'API';
import {API, graphqlOperation} from 'aws-amplify';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import * as customQueries from 'customGraphql/customQueries';
import * as customSubscriptions from 'customGraphql/customSubscriptions';
import Popover from '@components/Atoms/Popover';
import Loader from '@components/Atoms/Loader';

type LocationInfoType = {
  idx: number;
  authId: string;
  showLocationInfo: boolean;

  pageState: UserPageState;
  email: string;
  setShowLocationInfo: React.Dispatch<React.SetStateAction<boolean>>;
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

const UserLookupLocation = ({item, idx}: {item: any; idx: number}) => {
  const [showLocationInfo, setShowLocationInfo] = useState(false);

  return (
    <div
      onMouseEnter={() => {
        if (item.role === 'ST' && item.pageState !== null) {
          setShowLocationInfo(true);
        }
      }}
      onMouseLeave={() => {
        setShowLocationInfo(false);
      }}>
      {item.role === 'ST' && item.status !== PersonStatus.INACTIVE && item.pageState ? (
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
  );
};

export default UserLookupLocation;
