import Buttons from '@components/Atoms/Buttons';
import Modal from '@components/Atoms/Modal';
import {useGlobalContext} from '@contexts/GlobalContext';
import {requestResetPassword} from '@utilities/urls';
import {Popconfirm, Result} from 'antd';
import axios from 'axios';
import {useState} from 'react';

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
    <>
      <div>
        <Popconfirm
          onConfirm={(e) => {
            e?.stopPropagation();
            resetPassword(item);
          }}
          okText="Yes"
          onCancel={(e) => e?.stopPropagation()}
          title="Are you sure you want to reset password?">
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-start">
            {showResetPasswordOption(state.user.role, item.role)}
          </div>
        </Popconfirm>
      </div>

      <div onClick={(e) => e.stopPropagation()}>
        <Modal
          open={resetPasswordServerResponse.show}
          showHeader={false}
          showFooter={false}
          closeAction={onAlertClose}>
          <Result title={resetPasswordServerResponse.message} />
        </Modal>
      </div>
    </>
  );
};

export default UserLookupAction;
