import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {Auth} from '@aws-amplify/auth';
import {Error} from '@components/Atoms/Alerts/Info';
import {UserPageState} from 'API';
import Buttons from 'atoms/Buttons';
import FormInput from 'atoms/Form/FormInput';
import {useGlobalContext} from 'contexts/GlobalContext';
import {updatePerson} from 'customGraphql/customMutations';
import useDictionary from 'customHooks/dictionary';
import {useState} from 'react';
import {useHistory} from 'react-router-dom';
import SuccessMessage from '../Admin/UserManagement/SuccessMessage';

interface ChangePasscodeProps {
  fromWhere?: string;
  handleForgotPasscode?: (success?: boolean) => void;
}

const ChangePasscode = ({fromWhere, handleForgotPasscode}: ChangePasscodeProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const history = useHistory();

  const {userLanguage, state} = useGlobalContext();
  const {dashboardProfileDict} = useDictionary();

  const [message, setMessage] = useState<{
    show: boolean;
    type: string;
    message: string;
  }>({
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
      await API.graphql(graphqlOperation(updatePerson, {input: input}));

      if (fromWhere === 'notebook') {
        setMessage({
          show: true,
          type: 'success',
          message: 'Passcode changed successfully!'
        });
        setTimeout(() => {
          handleForgotPasscode?.(true);
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
      await Auth.signIn(username, password);
      await UpdatePersonPasscode(input.newPasscode);
    } catch (error) {
      console.log('error', error);
      const errMsg = {show: true, type: 'error'};
      if (!username) {
        setMessage({...errMsg, message: 'Please enter your email'});
      } else if (!username.includes('@' && '.')) {
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

  const handleSubmit = () => {
    setLoading(true);
    validation();
  };

  return (
    <div className={`h-full w-full ${fromWhere !== 'notebook' ? 'md:px-4 pt-4' : ''}`}>
      <div
        className={`h-auto  mb-4 ${
          fromWhere !== 'notebook' ? ' border-l-0 border-lightest bg-white' : ''
        }`}>
        {fromWhere !== 'notebook' && (
          <div className="px-4 py-5 border-b-0 border-lightest sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-darkest">
              {dashboardProfileDict[userLanguage]['CHANGE_PASSCODE']['TITLE']}
            </h3>
          </div>
        )}

        <div
          className={`h-full  text-darkest    ${
            fromWhere !== 'notebook' ? 'px-4 py-5 sm:px-6' : ''
          }`}>
          <div className="text-center text-medium  text-sm">
            {dashboardProfileDict[userLanguage]['CHANGE_PASSCODE']['INFO']}
          </div>
          <div className="w-full gap-4 h-auto flex flex-col justify-between items-center my-4">
            <div className={`w-full m-1 ${fromWhere !== 'notebook' ? 'md:w-1/2' : ''}`}>
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
                  className={`w-full`}
                  value={input.oldPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={`w-full m-1 ${fromWhere !== 'notebook' ? 'md:w-1/2' : ''}`}>
              <div className="relative">
                <FormInput
                  label={
                    dashboardProfileDict[userLanguage]['CHANGE_PASSCODE']['NEW_PASS']
                  }
                  placeHolder={
                    dashboardProfileDict[userLanguage]['CHANGE_PASSCODE']['NEW_PASS']
                  }
                  type={'password'}
                  className={`w-full`}
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
            <Error message={message?.message} />
          </div>
        ) : null}
        {message?.show && message?.type === 'success' ? (
          <div>
            <SuccessMessage note={message?.message} />
          </div>
        ) : null}
      </div>

      <div className="pt-4 w-full  flex justify-center flex-col-reverse md:flex-row gap-4">
        <Buttons
          label={dashboardProfileDict[userLanguage]['CHANGE_PASSCODE']['CANCEL']}
          size="middle"
          onClick={
            fromWhere !== 'notebook'
              ? () => history.goBack()
              : () => handleForgotPasscode?.()
          }
          transparent
        />
        <Buttons
          size="middle"
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
