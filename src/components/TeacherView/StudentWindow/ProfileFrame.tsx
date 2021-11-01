import React, {useContext, useEffect, useRef, useState} from 'react';

import axios from 'axios';
import {requestResetPassword} from '@utilities/urls';
import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import * as customMutations from '@customGraphql/customMutations';
import {GlobalContext} from '@contexts/GlobalContext';
import useDictionary from '@customHooks/dictionary';
import useTailwindBreakpoint from '@customHooks/tailwindBreakpoint';
import ProfileFrameInfo from './ProfileFrame/ProfileInfo';
import ProfileFrameEdit from './ProfileFrame/ProfileFrameEdit';
import Buttons from '@components/Atoms/Buttons';
import {FaEdit} from 'react-icons/fa';
import Modal from '@components/Atoms/Modal';

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
  setRightView,
}: IProfileFrame) => {
  // ~~~~~~~~~~~~~~~ CONTEXT ~~~~~~~~~~~~~~~ //
  const {theme, userLanguage, clientKey} = useContext(GlobalContext);
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
    message: '',
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
        message: UserInformationDict[userLanguage]['MESSAGE']['RESET_PASSWORD_SUCCESS'],
      });
      setLoading(false);
    } catch (err) {
      console.log('error', err);
      setResetPasswordServerResponse({
        show: true,
        message: UserInformationDict[userLanguage]['MESSAGE']['RESET_PASSWORD_FAILURE'],
      });
      setLoading(false);
    }
  };
  const onAlertClose = () => {
    setResetPasswordServerResponse({
      show: false,
      message: '',
    });
  };

  // ##################################################################### //
  // ############################ PROFILE EDIT ########################### //
  // ##################################################################### //
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [userLoading, setUserLoading] = useState<boolean>(false);

  const [editUser, setEditUser] = useState(user);

  const gobackToPreviousStep = () => {
    // history.push('/dashboard/profile');
  };

  async function updatePerson() {
    const input = {
      id: editUser.id,
      authId: editUser.authId,
      firstName: editUser.firstName,
      grade: editUser.grade,
      image: editUser.image,
      language: editUser.language,
      lastName: editUser.lastName,
      preferredName: editUser.preferredName,
      role: editUser.role,
      status: editUser.status,
      phone: editUser.phone,
      birthdate: editUser.birthdate,
      email: editUser.email,
    };

    try {
      const update: any = await API.graphql(
        graphqlOperation(customMutations.updatePerson, {input: input})
      );
      setEditUser(update.data.updatePerson);

      gobackToPreviousStep();
    } catch (error) {
      console.error(error);
    }
  }

  async function saveProfileInformation() {
    const updateUser = await updatePerson();
    // const get = await getUser();
  }

  const onChange = (e: any) => {
    const {id, value} = e.target;
    setEditUser(() => {
      return {
        ...editUser,
        [id]: value,
      };
    });
  };

  const handleChangeLanguage = (lang: {name: string; code: string}) => {
    setEditUser(() => {
      return {
        ...editUser,
        language: lang.code,
      };
    });
  };

  const language = [
    {
      code: 'EN',
      name: 'English',
    },
    {
      code: 'ES',
      name: 'Spanish',
    },
  ];

  // Code for Other Field
  const hasOther = (val: string | string[], other: string) => {
    try {
      return val ? val.toString().includes(other) : false;
    } catch (err) {
      console.log('errrr', err);
      return false;
    }
  };

  const isOther = (val: any) => {
    if (hasOther(val, 'Other')) {
      return true;
    } else return false;
  };
  // ⬆️ Ends here ⬆️

  // ##################################################################### //
  // ############################## OTHER UI ############################# //
  // ##################################################################### //
  const customTitle = () => {
    return (
      <div className="w-full flex flex-row justify-between items-center">
        {!isEditing
          ? dashboardProfileDict[userLanguage]['PERSONAL_INFO']['TITLE']
          : dashboardProfileDict[userLanguage]['EDIT_PROFILE']['TITLE']}
        {!isEditing ? (
          // <Buttons label="Edit" onClick={() => setIsEditing(true)} Icon={FaEdit} />
          <Buttons label="Edit" disabled Icon={FaEdit} />
        ) : null}
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
        width: breakpoint === 'xl' || breakpoint === '2xl' ? '75%' : 'calc(100% - 36px)',
      }}
      className={`absolute mr-0 top-0 right-0 h-full flex flex-col items-center z-50`}>
      {rightView.view === 'profile' && (
        <>
          <div
            onClick={() => setRightView({view: 'lesson', option: ''})}
            className="absolute cursor-pointer w-full h-full bg-gray-800 bg-opacity-50 z-40"></div>

          <Modal
            customTitle={customTitle()}
            showHeader={true}
            showHeaderBorder={false}
            showFooter={false}
            scrollHidden={true}
            closeAction={() => setRightView({view: 'lesson', option: ''})}>
            {!isEditing ? (
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
            )}
          </Modal>
        </>
      )}
    </div>
  );
};
export default ProfileFrame;
