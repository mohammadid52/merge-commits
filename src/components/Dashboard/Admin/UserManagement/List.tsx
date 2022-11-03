import React, {useContext, useEffect, useState} from 'react';
import {useHistory, useRouteMatch} from 'react-router-dom';
import UserRole from './UserRole';
import UserStatus from './UserStatus';
import UserLocation from './UserLocation';
import {getImageFromS3} from 'utilities/services';
import {getAsset} from 'assets';
import {GlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import axios from 'axios';
import {requestResetPassword} from 'utilities/urls';
import Modal from 'atoms/Modal';
import {FiAlertCircle} from 'react-icons/fi';
import Buttons from 'atoms/Buttons';
import Highlighted from '@components/Atoms/Highlighted';
import {useQuery} from '@customHooks/urlParam';

interface ListProps {
  item: any;
  searchTerm?: string;
}

const List = (props: ListProps) => {
  const {item, searchTerm} = props;

  const match = useRouteMatch();
  const history = useHistory();
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetPasswordServerResponse, setResetPasswordServerResponse] = useState({
    show: false,
    message: ''
  });
  const {state, theme, clientKey, userLanguage} = useContext(GlobalContext);
  const {BUTTONS} = useDictionary(clientKey);
  const themeColor = getAsset(clientKey, 'themeClassName');

  const initials = (firstName: string, lastName: string) => {
    let firstInitial = firstName.charAt(0).toUpperCase();
    let lastInitial = lastName.charAt(0).toUpperCase();
    return firstInitial + lastInitial;
  };

  const handleLink = (id: string) => {
    const url = match.url.endsWith('/') ? match.url : match.url + '/';
    history.push(`${url}${id}`);
  };

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

  const stringToHslColor = (str: string) => {
    let hash = 0;
    let i;
    for (i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    let h = hash % 360;
    return 'hsl(' + h + ', 70%, 72%)';
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
        <div
          className="w-2/10 flex justify-center items-center pr-4 py-4 cursor-pointer whitespace-nowrap text-right text-sm leading-5 font-medium"
          onClick={() => resetPassword(item)}>
          <div
            id={item.id}
            className={`flex justify-center ${theme.textColor[themeColor]}`}>
            {loading ? 'Resetting' : 'Reset Password'}
          </div>
        </div>
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

  return (
    ///change INFO, MARGIN and WIDTH if needed
    <>
      <div
        id={item.id}
        className="flex justify-between bg-white w-full border-b-0 border-gray-200">
        <div className="w-4/10 px-8 py-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10">
              {item.image ? (
                <img src={imageUrl} className="h-8 w-8 rounded-full" />
              ) : (
                <div
                  className="h-8 w-8 rounded-full flex justify-center items-center text-white text-sm text-bold"
                  style={{
                    background: `${stringToHslColor(
                      item.firstName + ' ' + item.lastName
                    )}`,
                    textShadow: '0.1rem 0.1rem 2px #423939b3'
                  }}>
                  {initials(
                    item.preferredName ? item.preferredName : item.firstName,
                    item.lastName
                  )}
                </div>
              )}
            </div>
            <div className="ml-2">
              <div
                data-cy={`${item.lastName}, ${
                  item.preferredName ? item.preferredName : item.firstName
                }`}
                id={item.id}
                className="hover:text-gray-600 cursor-pointer text-sm leading-5 font-medium text-gray-900"
                onClick={() => handleLink(item.id)}>
                <Highlighted text={item.name} highlight={searchTerm} />
              </div>
              <div id={item.id} className="text-sm leading-5 text-gray-500 break-all">
                {item.email}
              </div>
            </div>
          </div>
        </div>
        <div className="w-2/10 flex justify-center items-center px-8 py-4 whitespace-nowrap">
          <span id={item.id} className="w-auto text-sm leading-5 text-gray-500">
            <UserLocation role={item.role} onDemand={item?.onDemand} />
          </span>
        </div>
        <div className="w-2/10 flex justify-center items-center px-8 py-4 whitespace-nowrap">
          <span id={item.id} className="w-auto text-sm leading-5 text-gray-500">
            <UserRole role={item.role ? item.role : '--'} />
          </span>
        </div>
        <div className="w-2/10 flex justify-center items-center px-8 py-4 whitespace-nowrap">
          <div className="w-16 flex justify-center">
            <UserStatus status={item.status ? item.status : '--'} />
          </div>
        </div>
        <div
          className="w-2/10 flex justify-center items-center pr-4 py-4 cursor-pointer whitespace-nowrap text-right text-sm leading-5 font-medium"
          onClick={() => handleLink(item.id)}>
          <div
            id={item.id}
            className={`flex justify-center ${theme.textColor[themeColor]}`}>
            {BUTTONS[userLanguage]['EDIT']}
          </div>
        </div>
        {state.user.role !== 'ST' && state.user.role !== 'BLD'
          ? showResetPasswordOption(state.user.role, item.role)
          : null}
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
