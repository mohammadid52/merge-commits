import Loader from '@components/Atoms/Loader';
import Popover from '@components/Atoms/Popover';
import {formatPageName} from '@utilities/functions';
import {GetPersonLocationQueryVariables, PersonStatus, UserPageState} from 'API';
import {API, graphqlOperation} from 'aws-amplify';
import * as customQueries from 'customGraphql/customQueries';
import * as customSubscriptions from 'customGraphql/customSubscriptions';
import moment from 'moment';
import React, {useEffect, useState} from 'react';

type LocationInfoType = {
  idx: number;
  authId: string;
  showLocationInfo: boolean;

  pageState: UserPageState;
  lastPageStateUpdate: string;
  isStaff?: boolean;
  createdAt: string;
  email: string;
  setShowLocationInfo: React.Dispatch<React.SetStateAction<boolean>>;
};

export const LocationInfo = ({
  idx,
  authId,
  createdAt,
  setShowLocationInfo,
  showLocationInfo,
  email,
  pageState,
  lastPageStateUpdate,
  isStaff
}: LocationInfoType) => {
  let subscribe: any;

  const [localPageState, setLocalPageState] = useState({
    pageState: pageState || UserPageState.NOT_LOGGED_IN,
    lastPageStateUpdate: lastPageStateUpdate || new Date().toISOString()
  });

  const inLesson = localPageState.pageState === UserPageState.LESSON;

  const [isLoading, setIsLoading] = useState(false);
  const [isPersonLocationFetched, setIsPersonLocationFetched] = useState(false);
  const [liveLessonData, setLiveLessonData] = useState<null | any>(null);

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
    if (inLesson && !isStaff && !isPersonLocationFetched && showLocationInfo) {
      fetchPersonLocation();
    }
  }, [inLesson, isStaff, isPersonLocationFetched, showLocationInfo]);

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

  const _lastPageStateUpdate = localPageState.lastPageStateUpdate
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
                <dt className="w-auto text-sm font-medium text-gray-500">Status:</dt>
                <dd className="w-auto mt-1 text-sm break-all text-gray-700 font-medium">
                  {loggedIn && !loggedOut ? (
                    <span className="capitalize">
                      {localPageState.pageState === UserPageState.LOGGED_IN
                        ? 'Logged In'
                        : inLesson
                        ? `in Lesson`
                        : `on ${localPageState.pageState?.toLowerCase()}`}
                    </span>
                  ) : (
                    formatPageName(localPageState.pageState)
                  )}
                </dd>
              </div>

              {!isStaff && inLesson && isLoading && (
                <div className="flex items-center justify-center h-full">
                  <Loader className="theme-text text-xs" />
                </div>
              )}

              {!isStaff &&
                inLesson &&
                !isLoading &&
                isPersonLocationFetched &&
                liveLessonData && (
                  <>
                    <div className="flex w-auto items-end justify-between">
                      <dt className="w-auto text-sm font-medium text-gray-500">
                        Lesson:
                      </dt>
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

              {_lastPageStateUpdate !== null && (
                <span className="border-t-0 theme-border-200 text-gray-600 pt-1 mt-1 text-xs text-center">
                  Since {_lastPageStateUpdate}
                </span>
              )}
            </dl>
          </div>
        }
        setShow={setShowLocationInfo}>
        {loggedOut ? (
          <span className="flex flex-col">
            <span>Logged Out</span>
            <span className="text-gray-600 text-xs">
              (since {moment(lastPageStateUpdate).format('ll')})
            </span>
          </span>
        ) : (
          formatPageName(localPageState.pageState) ||
          `Created on ${moment(createdAt).format('lll')}`
        )}
      </Popover>
    </>
  );
};

const UserLookupLocation = ({
  item,
  idx,
  show,
  isStaff
}: {
  item: any;
  idx: number;
  isStaff?: boolean;
  show?: boolean;
}) => {
  const [showLocationInfo, setShowLocationInfo] = useState(false);

  const shouldShow =
    show || (item.role === 'ST' && item.status !== PersonStatus.INACTIVE);

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
      {shouldShow && item.pageState ? (
        <LocationInfo
          idx={idx}
          isStaff={isStaff}
          authId={item.authId}
          email={item.email}
          createdAt={item?.createdAt}
          lastPageStateUpdate={item?.lastPageStateUpdate || item?.lastLoggedOut}
          setShowLocationInfo={setShowLocationInfo}
          showLocationInfo={showLocationInfo}
          pageState={item.pageState}
        />
      ) : (
        <span className="flex flex-col">
          {item.lastLoggedOut || item.lastLoggedIn ? (
            <>
              <span>Logged Out</span>
              <span className="text-gray-600 text-xs">
                (since {moment(item?.lastLoggedOut || item?.lastLoggedIn).format('ll')})
              </span>
            </>
          ) : (
            <span className="">Created On {moment(item?.createdAt).format('ll')}</span>
          )}
        </span>
      )}
    </div>
  );
};

export default UserLookupLocation;
