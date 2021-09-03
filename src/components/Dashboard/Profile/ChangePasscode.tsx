import React, {useContext, useState} from 'react';
import {useCookies} from 'react-cookie';
import API, {graphqlOperation} from '@aws-amplify/api';
import {Auth} from '@aws-amplify/auth';
import {validate} from 'json-schema';
import {FaKey} from 'react-icons/fa';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {AiOutlineEye, AiOutlineEyeInvisible} from 'react-icons/ai';
import {useHistory, NavLink} from 'react-router-dom';

import ErrorNote from '../Admin/UserManagement/ErrorNote';
import {GlobalContext} from '../../../contexts/GlobalContext';
import useDictionary from '../../../customHooks/dictionary';
import Buttons from '../../Atoms/Buttons';
import ModalPopUp from '../../Molecules/ModalPopUp';

import * as customMutations from '../../../customGraphql/customMutations';
import FormInput from '../../Atoms/Form/FormInput';

interface ChangePasscodeProps {
  updateAuthState?: Function;
}

const ChangePasscode = (props: ChangePasscodeProps) => {
  const {updateAuthState} = props;
  const [oldPassToggle, setOldPassToggle] = useState(false);
  const [passToggle, setPassToggle] = useState(false);
  const [passMatchToggle, setPassMatchToggle] = useState(false);
  const [cookies, , removeCookie] = useCookies();
  const [loading, setLoading] = useState<boolean>(false);
  const history = useHistory();

  const {userLanguage, clientKey, state, dispatch} = useContext(GlobalContext);
  const {dashboardProfileDict} = useDictionary(clientKey);

  const [warningModal, setWarningModal] = useState({
    show: false,
    message: dashboardProfileDict[userLanguage]['CHANGE_PASSCODE']['WARN_MSG'],
  });

  const [message, setMessage] = useState<{show: boolean; type: string; message: string}>({
    show: false,
    type: '',
    message: '',
  });
  const [input, setInput] = useState({
    oldPassword: '',
    newPasscode: '',
    match: '',
  });

  async function UpdatePersonPasscode(inputPasscode: string) {
    const input = {
      id: state.user.id,
      authId: state.user.authId,
      firstName: state.user.firstName,
      email: state.user.email,
      passcode: inputPasscode,
    };
    try {
      const update: any = await API.graphql(
        graphqlOperation(customMutations.updatePerson, {input: input})
      );
      history.goBack();
    } catch (e) {
      console.error('Error updating passcode - ', e);
    }
  }

  async function AuthenticateLoginPassword() {
    let username = state.user.email;
    let password = input.oldPassword;

    try {
      const user = await Auth.signIn(username, password);
      const update = await UpdatePersonPasscode(input.newPasscode);
    } catch (error) {
      console.log('error', error);
      const errMsg = {show: true, type: 'error'};
      if (!username) {
        setMessage({...errMsg, message: 'Please enter your email'});
      } else if (!username.includes('@')) {
        setMessage({
          ...errMsg,
          message: 'Your email is not in the expected email address format',
        });
      } else if (!password) {
        setMessage({...errMsg, message: 'Please enter your password'});
      } else {
        manageAuthenticationError(error, false);
      }
      setLoading(false);
    }
  }

  const manageAuthenticationError = (error: any, onlyEmail: any) => {
    setMessage(() => {
      switch (error.code) {
        case 'UserNotFoundException':
          return {
            show: true,
            type: 'error',
            message: 'The email you entered was not found',
          };
        case 'NotAuthorizedException':
          if (!onlyEmail) {
            return {
              show: true,
              type: 'error',
              message: 'The email or password you entered was not correct',
            };
          }
        case 'UserNotConfirmedException':
          return {
            show: true,
            type: 'error',
            message: 'You need to confirm registered email id, Please check your email.',
          };
        // shows valid error message for confirmation error instead of redirecting to confirm-code rout.

        default:
          return {
            show: true,
            type: 'error',
            message: error.message,
          };
      }
    });
  };

  const validation = () => {
    let validated = false;
    setLoading(true);

    let oldPassword = input.oldPassword;
    let newPasscode = input.newPasscode;
    if (!oldPassword) {
      setLoading(false);
      setMessage({
        show: true,
        type: 'error',
        message:
          dashboardProfileDict[userLanguage]['CHANGE_PASSCODE']['ERRORS']['NO_OLD_PASS'],
      });
    } else if (!newPasscode) {
      setLoading(false);
      setMessage({
        show: true,
        type: 'error',
        message:
          dashboardProfileDict[userLanguage]['CHANGE_PASSCODE']['ERRORS']['NO_NEW_PASS'],
      });
    } else if (
      !(input.newPasscode.length >= 4) &&
      !/[A-Za-z0-9]+/g.test(input.newPasscode)
    ) {
      setLoading(false);
      setMessage({
        show: true,
        type: 'error',
        message: 'Passcode must be at least 4 alphanumeric characters',
      });
    } else {
      validated = true;
      if (validated) {
        AuthenticateLoginPassword();
      }
    }
  };

  const handleChange = (e: {target: {id: any; value: any}}) => {
    const {id, value} = e.target;
    setInput((input) => {
      return {
        ...input,
        [id]: value,
      };
    });
  };

  const handleEnter = (e: any) => {
    if (e.key === 'Enter') {
      setLoading(true);
      AuthenticateLoginPassword();
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    validation();
  };

  return (
    <div className="h-full w-full md:px-4 pt-4">
      <div className="h-auto bg-white border-l-0 border-gray-200 mb-4">
        <div className="px-4 py-5 border-b-0 border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {dashboardProfileDict[userLanguage]['CHANGE_PASSCODE']['TITLE']}
          </h3>
        </div>

        <div className="h-full px-4 py-5 sm:px-6 text-gray-800">
          <div className="text-center text-sm">
            {dashboardProfileDict[userLanguage]['CHANGE_PASSCODE']['INFO']}
          </div>
          <div className="w-full h-auto flex flex-col justify-between items-center my-4">
            <div className="w-full md:w-1/2 m-1">
              <div className="relative">
                <div className="absolute right-1 w-auto mr-2">
                  <div
                    onClick={() => setOldPassToggle(!oldPassToggle)}
                    className="text-gray-500 cursor-pointer hover:text-grayscale transform translate-y-1/2 mt-1">
                    {oldPassToggle ? (
                      <IconContext.Provider
                        value={{size: '1rem', style: {width: 'auto'}}}>
                        <AiOutlineEye />
                      </IconContext.Provider>
                    ) : (
                      <IconContext.Provider
                        value={{size: '1rem', style: {width: 'auto'}}}>
                        <AiOutlineEyeInvisible />
                      </IconContext.Provider>
                    )}
                  </div>
                </div>
                <div className="absolute left-1 w-auto mr-2">
                  <div className="text-gray-500 transform translate-y-1/2 mt-1">
                    <IconContext.Provider
                      value={{size: '0.8rem', style: {width: 'auto'}}}>
                      <FaKey />
                    </IconContext.Provider>
                  </div>
                </div>
                <label className="hidden" htmlFor="oldPassword">
                  {dashboardProfileDict[userLanguage]['CHANGE_PASSCODE']['OLD_PASS']}
                </label>
                <FormInput
                  className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5 pl-10 mb-1"
                  placeHolder={
                    dashboardProfileDict[userLanguage]['CHANGE_PASSCODE']['OLD_PASS']
                  }
                  type={oldPassToggle ? 'text' : 'password'}
                  id="oldPassword"
                  name="password"
                  value={input.oldPassword}
                  onChange={handleChange}
                  onKeyDown={handleEnter}
                />
              </div>
            </div>

            <div className="w-full md:w-1/2 m-1">
              <div className="relative">
                <div className="absolute right-1 w-auto mr-2">
                  <div
                    onClick={() => setPassToggle(!passToggle)}
                    className="text-gray-500 cursor-pointer hover:text-grayscale transform translate-y-1/2 mt-1">
                    {passToggle ? (
                      <IconContext.Provider
                        value={{size: '1rem', style: {width: 'auto'}}}>
                        <AiOutlineEye />
                      </IconContext.Provider>
                    ) : (
                      <IconContext.Provider
                        value={{size: '1rem', style: {width: 'auto'}}}>
                        <AiOutlineEyeInvisible />
                      </IconContext.Provider>
                    )}
                  </div>
                </div>
                <div className="w-auto absolute left-1 mr-2">
                  <div className="text-gray-500 transform translate-y-1/2 mt-1">
                    <IconContext.Provider
                      value={{size: '0.8rem', style: {width: 'auto'}}}>
                      <FaKey />
                    </IconContext.Provider>
                  </div>
                </div>
                <label className="hidden" htmlFor="password">
                  {dashboardProfileDict[userLanguage]['CHANGE_PASSCODE']['NEW_PASS']}
                </label>
                <FormInput
                  className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5 pl-10 mb-1"
                  placeHolder={
                    dashboardProfileDict[userLanguage]['CHANGE_PASSCODE']['NEW_PASS']
                  }
                  type={'text'}
                  id="newPasscode"
                  name="passcode"
                  value={input.newPasscode}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center items-center">
        {message?.show ? (
          <div>
            <ErrorNote note={message?.message} />
          </div>
        ) : null}
      </div>

      <div className="px-4 pt-4 w-full flex justify-center">
        <Buttons
          btnClass="py-2 w-auto md:w-2.5/10 px-4 text-xs mr-2"
          label={dashboardProfileDict[userLanguage]['CHANGE_PASSCODE']['CANCEL']}
          onClick={() => history.goBack()}
          transparent
        />
        <Buttons
          btnClass="py-2 w-auto px-4 text-xs ml-2"
          label={
            loading
              ? 'Verifying...'
              : dashboardProfileDict[userLanguage]['CHANGE_PASSCODE']['SAVE']
          }
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
};

export default ChangePasscode;
