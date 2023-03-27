import LocationBadge from '@components/Dashboard/Admin/Institutons/EditBuilders/LocationBadge';
import useDictionary from '@customHooks/dictionary';
import {getUserRoleString} from '@utilities/strings';
import {Descriptions} from 'antd';
import Buttons from 'atoms/Buttons';
import Modal from 'atoms/Modal';
import Status from 'atoms/Status';
import {FiAlertCircle} from 'react-icons/fi';

interface IProfileFrameInfo {
  user: any;
  room?: {name: string};
  created: () => string;
  loading: boolean;
  resetPasswordServerResponse: {
    show: boolean;
    message: string;
  };
  resetPassword: () => Promise<void>;
  onAlertClose: () => void;
  setIsEditing: any;
}

const ProfileFrameInfo = ({
  user,
  created,
  loading,
  resetPasswordServerResponse,
  resetPassword,
  onAlertClose,
  room
}: IProfileFrameInfo) => {
  // ~~~~~~~~~~~~~~~ CONTEXT ~~~~~~~~~~~~~~~ //

  // ~~~~~~~~~~~~~~ DICTIONARY ~~~~~~~~~~~~~ //

  const {UserInformationDict, userLanguage} = useDictionary();
  const dict = UserInformationDict[userLanguage];

  return (
    <div className="m-auto p-2 bg-white shadow-5 rounded z-50">
      {/* USER INFO FIRST TAB */}

      {user && (
        <Descriptions
          extra={
            <div className="flex gap-4 items-center justify-center">
              <Buttons
                label={loading ? dict['RESETTING_PASSWORD'] : dict['RESET_PASSWORD']}
                onClick={resetPassword}
                disabled={loading}
              />
            </div>
          }
          title={'User Information'}>
          <Descriptions.Item label={dict['fullname']}>
            {user?.firstName} {user?.lastName}
          </Descriptions.Item>

          <Descriptions.Item label={dict['nickname']}>
            {user?.preferredName || 'n/a'}
          </Descriptions.Item>

          <Descriptions.Item label={dict['role']}>
            {getUserRoleString(user?.role)}
          </Descriptions.Item>
          <Descriptions.Item span={3} label={dict['email']}>
            {user.email}
          </Descriptions.Item>
          <Descriptions.Item span={2} label={dict['account']}>
            {created()}
          </Descriptions.Item>
          <Descriptions.Item label={dict['LOCATION']}>
            <LocationBadge onDemand={user?.onDemand} />
          </Descriptions.Item>
          <Descriptions.Item span={2} label={dict['CLASSROOM_LOCATION']}>
            {room && room?.name ? `In ${room.name}` : `Not in classroom`}
          </Descriptions.Item>
          <Descriptions.Item label={dict['status']}>
            <Status status={user && user.status} />
          </Descriptions.Item>
        </Descriptions>
      )}

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
            <Buttons label={'Ok'} onClick={onAlertClose} />
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default ProfileFrameInfo;
