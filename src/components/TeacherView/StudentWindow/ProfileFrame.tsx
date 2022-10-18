import React, {useContext, useEffect, useRef, useState} from 'react';

import axios from 'axios';
import {requestResetPassword} from 'utilities/urls';
import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import * as customMutations from 'customGraphql/customMutations';
import {GlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import useTailwindBreakpoint from 'customHooks/tailwindBreakpoint';
import ProfileFrameInfo from './ProfileFrame/ProfileInfo';
import ProfileFrameEdit from './ProfileFrame/ProfileFrameEdit';
import Buttons from 'components/Atoms/Buttons';
import {FaEdit} from 'react-icons/fa';
import Modal from 'components/Atoms/Modal';
import UserTabs from 'components/Dashboard/Admin/UserManagement/User/UserTabs';
import ProfileFrameDemographics from './ProfileFrame/ProfileFrameDemographics';

interface IProfileFrame {
  personAuthID: string;
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
  const gContext = useContext(GlobalContext);
  const {state, theme, userLanguage, clientKey} = gContext;
  const stateUser = state.user;
  const {dashboardProfileDict, BreadcrumsTitles} = useDictionary(clientKey);
  const {UserInformationDict} = useDictionary(clientKey);

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
    let date = new Date(user && user.createdAt);
    return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
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

  async function updatePerson() {
    const input = {
      id: user.id,
      authId: user.authId,
      firstName: user.firstName,
      grade: user.grade,
      image: user.image,
      language: user.language,
      lastName: user.lastName,
      preferredName: user.preferredName,
      role: user.role,
      status: user.status,
      phone: user.phone,
      birthdate: user.birthdate,
      email: user.email
    };

    try {
      const update: any = await API.graphql(
        graphqlOperation(customMutations.updatePerson, {input: input})
      );
      setUser(update.data.updatePerson);

      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  }

  async function saveProfileInformation() {
    await updatePerson();
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

  const handleChangeLanguage = (lang: {name: string; code: string}) => {
    setUser(() => {
      return {
        ...user,
        language: lang.code
      };
    });
  };

  const language = [
    {
      code: 'EN',
      name: 'English'
    },
    {
      code: 'ES',
      name: 'Spanish'
    }
  ];

  // ⬆️ Ends here ⬆️

  // ##################################################################### //
  // ############################## OTHER UI ############################# //
  // ##################################################################### //

  const [tabs, setTabs] = useState([
    {name: 'Personal Information', current: true},
    {name: 'Demographics', current: false},
    {name: 'Private', current: false}
  ]);

  const openTab = tabs.find((tabObj: any) => tabObj.current);

  const handleSetCurrentTab = (tabName: string) => {
    let updatedTabs = tabs.map((tabObj: any, idx: number) => {
      if (tabObj.name === tabName) {
        return {
          ...tabObj,
          current: true
        };
      } else {
        return {
          ...tabObj,
          current: false
        };
      }
    });
    setTabs(updatedTabs);
  };

  const isTeacher =
    stateUser.role === 'TR' ||
    stateUser.role === 'FLW' ||
    stateUser.role === 'ADM' ||
    stateUser.role === 'SUP';

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
  const frameRef = useRef();

  // ##################################################################### //
  // ############################# RESPONSIVE ############################ //
  // ##################################################################### //
  const {breakpoint} = useTailwindBreakpoint();

  return (
    <div
      ref={frameRef}
      style={{
        width: breakpoint === 'xl' || breakpoint === '2xl' ? '75%' : 'calc(100% - 36px)'
      }}
      className={`absolute mr-0 top-0 right-0 h-full flex flex-col items-center z-50`}>
      {rightView.view === 'profile' && (
        <>
          <div
            onClick={() => setRightView({view: 'lesson', option: ''})}
            className="absolute cursor-pointer w-full h-full bg-gray-800 bg-opacity-50 z-40"></div>

          <Modal
            customTitle={user ? getTitle(user.preferredName, isEditing) : ''}
            showHeader={true}
            showHeaderBorder={false}
            showFooter={false}
            scrollHidden={true}
            closeAction={() => setRightView({view: 'lesson', option: ''})}
            position={'absolute'}>
            <div
              className={`${
                breakpoint === '2xl'
                  ? 'h-96 w-192'
                  : breakpoint === 'xl'
                  ? 'h-88 w-176'
                  : breakpoint === 'lg'
                  ? 'h-80 w-160'
                  : 'h-64 w-128'
              }`}>
              <UserTabs
                tabs={tabs}
                currentTab={openTab?.name}
                viewedUser={user}
                setCurrentTab={handleSetCurrentTab}
                isTeacher={isTeacher}
                theme={theme}
              />
              {openTab?.name === 'Personal Information' ? (
                !isEditing ? (
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
                    language={language}
                  />
                )
              ) : null}
              {openTab?.name === 'Demographics' || openTab?.name === 'Private' ? (
                <ProfileFrameDemographics studentID={user.id} currentTab={openTab.name} />
              ) : null}
            </div>
          </Modal>
        </>
      )}
    </div>
  );
};
export default ProfileFrame;
