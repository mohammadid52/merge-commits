import Buttons from '@components/Atoms/Buttons';
import Modal from '@components/Atoms/Modal';
import {useGlobalContext} from '@contexts/GlobalContext';
import {requestResetPassword} from '@utilities/urls';
import axios from 'axios';
import React, {useState} from 'react';
import {FiAlertCircle} from 'react-icons/fi';

const UserLookupAction = ({item}: {item: any}) => {
  const {state} = useGlobalContext();

  const [loading, setLoading] = useState(false);

  const [resetPasswordServerResponse, setResetPasswordServerResponse] = useState({
    show: false,
    message: ''
  });

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

  return (
    <div>
      <div className="flex items-center justify-start">
        {showResetPasswordOption(state.user.role, item.role)}
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
    </div>
  );
};

export default UserLookupAction;
