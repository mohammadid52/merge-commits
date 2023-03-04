import {Auth} from '@aws-amplify/auth';
import Buttons from '@components/Atoms/Buttons';
import {useQuery} from '@customHooks/urlParam';
import {signIn} from '@graphql/functions';
import FormInput from 'atoms/Form/FormInput';
import AuthCard from 'components/Auth/AuthCard';
import RememberMe from 'components/Auth/RememberMe';
import {useFormik} from 'formik';
import React, {useEffect, useState} from 'react';
import {useCookies} from 'react-cookie';
import {useHistory, useLocation} from 'react-router-dom';
import {ConfirmCodeSchema} from 'Schema';

const ConfirmCode = () => {
  const history = useHistory();
  const location = useLocation();

  const [cookies, setCookie, removeCookie] = useCookies();
  const [message, setMessage] = useState<{show: boolean; type: string; message: string}>({
    show: false,
    type: '',
    message: ''
  });
  const [confirmInput, setConfirmInput] = useState({
    email: '',
    code: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const [expiredLink, setExpiredLink] = useState(false);

  const checkLoginCred = () => {
    const auth = cookies.cred;
    if (auth?.checked) {
      setFieldValue('checked', auth.checked);
    }
  };

  useEffect(() => {
    populateCodeAndEmail();
    checkLoginCred();
  }, []);

  const populateCodeAndEmail = () => {
    const params = useQuery(location.search);
    const confirmCode = params.get('code'); // Find a code from params.
    const emailId = params.get('email'); // Find an email from params.
    const isValidCode = confirmCode && /^\d{6}$/gm.test(confirmCode); // validate element to have 6 digit number. e.g. 234567
    const isValidEmail =
      emailId && /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi.test(emailId); // validate email id.

    if (isValidCode && isValidEmail) {
      setConfirmInput({
        ...confirmInput,
        code: confirmCode,
        email: emailId
      });
    } else {
      setMessage({
        show: true,
        type: 'error',
        message: 'Invalid account confirmation URL. Please check your email'
      });
    }
  };

  const resetPassword = async (password: string) => {
    let username = confirmInput.email;

    let code = confirmInput.code;
    toggleLoading(true);

    try {
      await Auth.forgotPasswordSubmit(username, code, password);
      history.push('/login');
    } catch (error) {
      console.error('error signing in', error);
      setMessage(() => {
        switch (error.code) {
          case 'InvalidPasswordException':
            return {
              show: true,
              type: 'error',
              message:
                'Password must be at least 8 characters, include uppercase, lowercase and numbers'
            };
          case 'InvalidParameterException':
            return {
              show: true,
              type: 'error',
              message:
                'Password must be at least 8 characters, include uppercase, lowercase and numbers'
            };
          case 'UserNotFoundException':
            return {
              show: true,
              type: 'error',
              message:
                'Invalid account confirmation URL. Please check your email or Register first'
            };
          case 'CodeMismatchException':
            return {
              show: true,
              type: 'error',
              message: 'Invalid account confirmation URL. Please check your email'
            };
          case 'ExpiredCodeException': {
            setExpiredLink(true);
            sendNewCode(username);
            return {
              show: true,
              type: 'error',
              message: 'The link has expired. A new link is sent to your email.'
            };
          }
          default:
            return {
              show: true,
              type: 'error',
              message: error.message
            };
        }
      });
    } finally {
      toggleLoading(false);
    }
  };

  const sendNewCode = async (username: string, isSignupError?: boolean) => {
    try {
      if (isSignupError) {
        await Auth.resendSignUp(username);
      } else {
        await Auth.forgotPassword(username);
      }
    } catch (error) {
      setMessage(() => {
        return {
          show: true,
          type: 'error',
          message: error.message
        };
      });
    }
  };

  const confirmAndLogin = async () => {
    let username = confirmInput.email;
    let tempPassword = 'xIconoclast.5x';
    let password = values.password;
    let code = confirmInput.code;
    toggleLoading(true);
    try {
      await Auth.confirmSignUp(username, code);
      const user = await signIn(
        username,
        tempPassword,
        {setCookie, removeCookie},
        values.checked
      );
      await Auth.changePassword(user, tempPassword, password);

      history.push('/dashboard');
    } catch (error) {
      // Handle code mismatch and code expiration errors.

      if (error.code === 'NotAuthorizedException') {
        validation();
        resetPassword(values.password);
      } else {
        setMessage(() => {
          switch (error.code) {
            case 'CodeMismatchException':
              return {
                show: true,
                type: 'error',
                message:
                  'Invalid account confirmation URL. Please check your email or try again.'
              };
            case 'UserNotFoundException':
              return {
                show: true,
                type: 'error',
                message:
                  'Invalid account confirmation URL. Please check your email or Register first'
              };
            case 'ExpiredCodeException':
              setExpiredLink(true);
              sendNewCode(username, true);
              return {
                show: true,
                type: 'error',
                message: 'The link has expired. A new link is sent to your email.'
              };
          }
        });
        toggleLoading(false);
      }
    }
  };

  const validation = () => {
    let validated = false;

    setMessage(() => {
      if (!values.password) {
        return {
          show: true,
          type: 'error',
          message: 'Please enter your new password'
        };
      }
      validated = true;
      if (validated) {
        confirmAndLogin();
      }
      return {
        show: false,
        type: 'success',
        message: 'success'
      };
    });
  };

  // Added loading state.
  const toggleLoading = (state: boolean) => {
    setIsLoading(state);
  };

  const {values, errors, handleSubmit, handleChange, setFieldValue} = useFormik({
    initialValues: {
      password: '',
      checked: false
    },
    validationSchema: ConfirmCodeSchema,
    onSubmit: async (values) => {
      validation();
      resetPassword(values.password);
    }
  });

  return (
    <AuthCard title="Set New Password" message={message}>
      <form onSubmit={handleSubmit}>
        <div className=" ">
          <FormInput
            label="New Password"
            placeHolder="Enter new password"
            type="password"
            id="password"
            name="password"
            value={values.password}
            error={errors.password}
            onChange={handleChange}
          />

          <div className="my-3">
            <RememberMe
              isChecked={values.checked}
              toggleCheckBox={() => setFieldValue('checked', !values.checked)}
            />
          </div>
        </div>

        <div className="relative flex flex-col justify-center items-center">
          <Buttons
            disabled={isLoading}
            dataCy="confirm-button"
            btnClass="w-full"
            type="submit"
            loading={isLoading}
            label={'Login'}
          />
        </div>
      </form>
    </AuthCard>
  );
};

export default ConfirmCode;
