import React, {useEffect, useRef, useState} from 'react';

import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import Buttons from 'atoms/Buttons';
import Modal from 'atoms/Modal';
import axios from 'axios';

import {Tabs, TabsProps} from 'antd';
import {useGlobalContext} from 'contexts/GlobalContext';
import {} from 'customGraphql/customMutations';
import useDictionary from 'customHooks/dictionary';
import useTailwindBreakpoint from 'customHooks/tailwindBreakpoint';
import {FaEdit} from 'react-icons/fa';
import {requestResetPassword} from 'utilities/urls';
import ProfileFrameDemographics from './ProfileFrame/ProfileFrameDemographics';
import ProfileFrameEdit from './ProfileFrame/ProfileFrameEdit';
import ProfileFrameInfo from './ProfileFrame/ProfileInfo';
import {updatePerson} from '@graphql/mutations';
import moment from 'moment';

interface IProfileFrame {
  personAuthID?: string;
  roster: any[];
  children?: React.ReactNode;
  fullscreen?: boolean;
  theme?: any;
  clientKey?: string;
  visible?: boolean;
  rightView?: {view: string; option?: string};
  setRightView?: any;
}

const ProfileFrame = ({
  personAuthID,
  roster,
  visible,
  rightView,
  setRightView
}: IProfileFrame) => {
  // ~~~~~~~~~~~~~~~ CONTEXT ~~~~~~~~~~~~~~~ //
  const gContext = useGlobalContext();
  const {userLanguage} = gContext;

  const {UserInformationDict} = useDictionary();

  // ~~~~~~~~~~~~~~~~ THEME ~~~~~~~~~~~~~~~~ //

  // ~~~~~~~~~~ LOADING AND STATUS ~~~~~~~~~ //
  const [user, setUser] = useState<any>();
  useEffect(() => {
    if (visible && personAuthID && roster) {
      const findPersonInRoster = roster.find(
        (person: any) => person.personAuthID === personAuthID
      );
      if (findPersonInRoster?.person) {
        setUser(findPersonInRoster.person);
      }
    }
  }, [visible, personAuthID, roster]);

  // ##################################################################### //
  // ############################ PROFILE INFO ########################### //
  // ##################################################################### //
  const [loading, setLoading] = useState(false);
  const [resetPasswordServerResponse, setResetPasswordServerResponse] = useState({
    show: false,
    message: ''
  });

  const created = () => {
    if (user.createdAt === undefined) return 'n/a';
    return moment(user.createdAt).format('MM/DD/YYYY');
  };

  const resetPassword = async () => {
    try {
      setLoading(true);
      await axios.post(requestResetPassword, {email: user && user.email});
      setResetPasswordServerResponse({
        show: true,
        message: UserInformationDict[userLanguage]['MESSAGE']['RESET_PASSWORD_SUCCESS']
      });
      setLoading(false);
    } catch (err) {
      console.log('error', err);
      setResetPasswordServerResponse({
        show: true,
        message: UserInformationDict[userLanguage]['MESSAGE']['RESET_PASSWORD_FAILURE']
      });
      setLoading(false);
    }
  };
  const onAlertClose = () => {
    setResetPasswordServerResponse({
      show: false,
      message: ''
    });
  };

  // ##################################################################### //
  // ############################ PROFILE EDIT ########################### //
  // ##################################################################### //
  const [isEditing, setIsEditing] = useState<boolean>(false);

  async function updatePersonFn() {
    const input = {
      id: user.id,
      authId: user.authId,
      firstName: user.firstName,

      image: user.image,
      language: user.language,
      lastName: user.lastName,
      preferredName: user.preferredName,
      role: user.role,
      status: user.status,

      email: user.email
    };

    try {
      const update: any = await API.graphql(
        graphqlOperation(updatePerson, {input: input})
      );
      setUser(update.data.updatePerson);

      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  }

  async function saveProfileInformation() {
    await updatePersonFn();
  }

  const onChange = (e: any) => {
    const {id, value} = e.target;
    setUser(() => {
      return {
        ...user,
        [id]: value
      };
    });
  };

  const handleChangeLanguage = (lang: {label: string; value: string}) => {
    setUser(() => {
      return {
        ...user,
        language: lang.value
      };
    });
  };

  // ⬆️ Ends here ⬆️

  // ##################################################################### //
  // ############################## OTHER UI ############################# //
  // ##################################################################### //

  const getTitle = (preferredName: string, editing: boolean) => {
    let part1 = preferredName ? `Profile for ${user.preferredName}` : 'Profile';
    let part2 = !editing ? (
      <Buttons label="Edit" onClick={() => setIsEditing(true)} Icon={FaEdit} />
    ) : null;
    return (
      <div className="w-full flex flex-row items-center justify-between">
        {part1}
        {part2}
      </div>
    );
  };

  // ##################################################################### //
  // ########################### ANIMATION REF ########################### //
  // ##################################################################### //
  const frameRef = useRef<any>(null);

  // ##################################################################### //
  // ############################# RESPONSIVE ############################ //
  // ##################################################################### //
  const {breakpoint} = useTailwindBreakpoint();

  const [activeKey, setActiveKey] = useState('1');

  const items: TabsProps['items'] = [
    {
      label: 'Personal Information',
      key: '1',
      children: !isEditing ? (
        <ProfileFrameInfo
          user={user}
          created={created}
          loading={loading}
          resetPasswordServerResponse={resetPasswordServerResponse}
          resetPassword={resetPassword}
          onAlertClose={onAlertClose}
          setIsEditing={setIsEditing}
        />
      ) : (
        <ProfileFrameEdit
          user={user}
          loading={loading}
          onChange={onChange}
          handleChangeLanguage={handleChangeLanguage}
          gobackToPreviousStep={() => setIsEditing(false)}
          saveProfileInformation={saveProfileInformation}
        />
      )
    },
    {
      label: 'Demographics',
      key: '2',
      children: <ProfileFrameDemographics studentID={user.id} currentTab={activeKey} />
    },
    {
      label: 'Private',
      key: '3',
      children: <ProfileFrameDemographics studentID={user.id} currentTab={activeKey} />
    }
  ];

  const getTabsData = () => {
    if (items && Boolean(user?.role)) {
      if (user?.role === 'TR' || user?.role === 'FLW') {
        return items.filter((tabObj: any) => tabObj.label !== 'Notebook');
      } else if (user?.role === 'ADM' || user?.role === 'SUP') {
        return items.filter((tabObj: any) => tabObj.label === 'User Information');
      } else {
        return items;
      }
    }
    return [];
  };

  return (
    <div
      ref={frameRef}
      style={{
        width: breakpoint === 'xl' || breakpoint === '2xl' ? '75%' : 'calc(100% - 36px)'
      }}
      className={`absolute mr-0 top-0 right-0 h-full flex flex-col items-center z-50`}>
      {rightView?.view === 'profile' && (
        <>
          <Modal
            open={rightView?.view === 'profile'}
            customTitle={user ? getTitle(user.preferredName, isEditing) : ''}
            showHeader={true}
            showHeaderBorder={false}
            showFooter={false}
            scrollHidden={true}
            closeAction={() => setRightView({view: 'lesson', option: ''})}>
            <div>
              <Tabs
                items={getTabsData()}
                animated
                onChange={(key: string) => {
                  setActiveKey(key);
                }}
                defaultActiveKey={activeKey}
              />
            </div>
          </Modal>
        </>
      )}
    </div>
  );
};
export default ProfileFrame;
