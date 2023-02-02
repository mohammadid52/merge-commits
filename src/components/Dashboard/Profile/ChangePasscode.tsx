import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {Auth} from '@aws-amplify/auth';
import React, {useContext, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {GlobalContext} from 'contexts/GlobalContext';
import * as customMutations from 'customGraphql/customMutations';
import useDictionary from 'customHooks/dictionary';
import Buttons from 'atoms/Buttons';
import FormInput from 'atoms/Form/FormInput';
import ErrorNote from '../Admin/UserManagement/ErrorNote';
import SuccessMessage from '../Admin/UserManagement/SuccessMessage';
import {UserPageState} from 'API';

interface ChangePasscodeProps {
  fromWhere?: string;
  handleForgotPasscode?: (success?: boolean) => void;
}

const ChangePasscode = ({fromWhere, handleForgotPasscode}: ChangePasscodeProps) => {
  const [passToggle, setPassToggle] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const history = useHistory();

  const {userLanguage, clientKey, state, dispatch} = useContext(GlobalContext);
  const {dashboardProfileDict} = useDictionary(clientKey);

  const [message, setMessage] = useState<{show: boolean; type: string; message: string}>({
    show: false,
    type: '',
    message: ''
  });
  const [input, setInput] = useState({
    oldPassword: '',
    newPasscode: '',
    match: ''
  });

  async function UpdatePersonPasscode(inputPasscode: string) {
    const time = new Date().toISOString();

    const input = {
      id: state.user.id,
      authId: state.user.authId,
      firstName: state.user.firstName,
      email: state.user.email,
      passcode: inputPasscode,
      lastLoggedIn: time,
      pageState: UserPageState.LOGGED_IN,
      lastPageStateUpdate: time
    };
    try {
      const update: any = await API.graphql(
        graphqlOperation(customMutations.updatePerson, {input: input})
      );

      if (fromWhere === 'notebook') {
        setMessage({
          show: true,
          type: 'success',
          message: 'Passcode changed successfully!'
        });
        setTimeout(() => {
          handleForgotPasscode(true);
        }, 1000);
      } else {
        history.goBack();
      }
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
          message: 'Your email is not in the expected email address format'
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
            message: 'The email you entered was not found'
          };
        case 'NotAuthorizedException':
          if (!onlyEmail) {
            return {
              show: true,
              type: 'error',
              message: 'The email or password you entered was not correct'
            };
          }
        case 'UserNotConfirmedException':
          return {
            show: true,
            type: 'error',
            message: 'You need to confirm registered email id, Please check your email.'
          };
        // shows valid error message for confirmation error instead of redirecting to confirm-code rout.

        default:
          return {
            show: true,
            type: 'error',
            message: error.message
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
          dashboardProfileDict[userLanguage]['CHANGE_PASSCODE']['ERRORS']['NO_OLD_PASS']
      });
    } else if (!newPasscode) {
      setLoading(false);
      setMessage({
        show: true,
        type: 'error',
        message:
          dashboardProfileDict[userLanguage]['CHANGE_PASSCODE']['ERRORS']['NO_NEW_PASS']
      });
    } else if (
      !(input.newPasscode.length >= 4) &&
      !/[A-Za-z0-9]+/g.test(input.newPasscode)
    ) {
      setLoading(false);
      setMessage({
        show: true,
        type: 'error',
        message: 'Passcode must be at least 4 alphanumeric characters'
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
        [id]: value
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
    <div className={`h-full w-full ${fromWhere !== 'notebook' ? 'md:px-4 pt-4' : ''}`}>
      <div
        className={`h-auto bg-white mb-4 ${
          fromWhere !== 'notebook' ? ' border-l-0 border-gray-200' : ''
        }`}>
        {fromWhere !== 'notebook' && (
          <div className="px-4 py-5 border-b-0 border-gray-200 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {dashboardProfileDict[userLanguage]['CHANGE_PASSCODE']['TITLE']}
            </h3>
          </div>
        )}

        <div
          className={`h-full  text-gray-800 ${
            fromWhere !== 'notebook' ? 'px-4 py-5 sm:px-6' : ''
          }`}>
          <div className="text-center text-gray-600 text-sm">
            {dashboardProfileDict[userLanguage]['CHANGE_PASSCODE']['INFO']}
          </div>
          <div className="w-full gap-4 h-auto flex flex-col justify-between items-center my-4">
            <div
              className={`w-full m-1 ${
                fromWhere !== 'notebook' ? 'md:w-1/2' : 'md:w-8/12'
              }`}>
              <div className="relative">
                <FormInput
                  label={
                    dashboardProfileDict[userLanguage]['CHANGE_PASSCODE']['OLD_PASS']
                  }
                  placeHolder={
                    dashboardProfileDict[userLanguage]['CHANGE_PASSCODE']['OLD_PASS']
                  }
                  id="oldPassword"
                  type={'password'}
                  name="password"
                  value={input.oldPassword}
                  onChange={handleChange}
                  onKeyDown={handleEnter}
                />
              </div>
            </div>

            <div
              className={`w-full m-1 ${
                fromWhere !== 'notebook' ? 'md:w-1/2' : 'md:w-8/12'
              }`}>
              <div className="relative">
                <FormInput
                  label={
                    dashboardProfileDict[userLanguage]['CHANGE_PASSCODE']['NEW_PASS']
                  }
                  placeHolder={
                    dashboardProfileDict[userLanguage]['CHANGE_PASSCODE']['NEW_PASS']
                  }
                  type={'password'}
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
        {message?.show && message?.type === 'error' ? (
          <div>
            <ErrorNote note={message?.message} />
          </div>
        ) : null}
        {message?.show && message?.type === 'success' ? (
          <div>
            <SuccessMessage note={message?.message} />
          </div>
        ) : null}
      </div>

      <div className="pt-4 w-full flex justify-center flex-col-reverse md:flex-row gap-2">
        <Buttons
          label={dashboardProfileDict[userLanguage]['CHANGE_PASSCODE']['CANCEL']}
          onClick={
            fromWhere !== 'notebook'
              ? () => history.goBack()
              : () => handleForgotPasscode()
          }
          transparent
        />
        <Buttons
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
