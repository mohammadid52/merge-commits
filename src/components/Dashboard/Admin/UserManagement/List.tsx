import Highlighted from '@components/Atoms/Highlighted';
import Placeholder from '@components/Atoms/Placeholder';
import {LocationInfo} from '@components/MicroComponents/UserLookupLocation';
import {PersonStatus, UserPageState} from 'API';
import Buttons from 'atoms/Buttons';
import Modal from 'atoms/Modal';
import axios from 'axios';
import {useGlobalContext} from 'contexts/GlobalContext';
import moment from 'moment';
import {useEffect, useState} from 'react';
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

const List = (props: ListProps) => {
  const {item, idx = 0, searchTerm, isStudentRoster} = props;

  const match = useRouteMatch();
  const history = useHistory();
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetPasswordServerResponse, setResetPasswordServerResponse] = useState({
    show: false,
    message: ''
  });
  const {state} = useGlobalContext();

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
              createdAt={item?.createdAt}
              lastPageStateUpdate={item?.lastPageStateUpdate || item?.lastLoggedOut}
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

      <Modal
        open={resetPasswordServerResponse.show}
        showHeader={false}
        showFooter={false}
        closeAction={onAlertClose}>
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
    </>
  );
};

export default List;
