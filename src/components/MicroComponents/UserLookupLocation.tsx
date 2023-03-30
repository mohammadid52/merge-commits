import Loader from '@components/Atoms/Loader';
import {formatPageName} from '@utilities/functions';
import {Descriptions, Popover as AntdPopover} from 'antd';
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

const LocationInfo = ({
  authId,
  createdAt,

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
      <AntdPopover
        content={
          showLocationInfo && (
            <>
              {!isStaff && inLesson && isLoading && (
                <div className="flex items-center justify-center h-full">
                  <Loader />
                </div>
              )}
              {!isLoading && (
                <Descriptions column={1} rootClassName="w-56">
                  <Descriptions.Item label="Status">
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
                  </Descriptions.Item>

                  <Descriptions.Item label="Lesson">
                    {liveLessonData?.lesson?.title || '-'}
                  </Descriptions.Item>

                  <Descriptions.Item label="Room">
                    {liveLessonData?.room?.name || '-'}
                  </Descriptions.Item>
                </Descriptions>
              )}
            </>
          )
        }>
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
      </AntdPopover>

      {_lastPageStateUpdate !== null && !loggedOut && (
        <span className="text-gray-600 text-xs">
          (since {moment(lastPageStateUpdate).format('ll')})
        </span>
      )}
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
        if (item.role === 'ST' && item.pageState === 'LESSON') {
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
            <span className="">
              Created On {moment(item?.createdAt || item?.createAt).format('ll')}
            </span>
          )}
        </span>
      )}
    </div>
  );
};

export default UserLookupLocation;
