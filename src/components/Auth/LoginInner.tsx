import Buttons from '@components/Atoms/Buttons';
import FormInput from '@components/Atoms/Form/FormInput';
import {useGlobalContext} from '@contexts/GlobalContext';
import useAuth from '@customHooks/useAuth';
import {getInstInfo, getPerson, signIn, updateLoginTime} from '@graphql/functions';
import {getSignInError, getUserInfo, setCredCookies} from '@utilities/functions';
import {createUserUrl} from '@utilities/urls';
import {Auth} from 'aws-amplify';
import axios from 'axios';
import RememberMe from 'components/Auth/RememberMe';
import {useFormik} from 'formik';
import React, {useEffect, useState} from 'react';
import {useCookies} from 'react-cookie';
import {AiOutlineLock, AiOutlineUser} from 'react-icons/ai';
import {LoginSchema} from 'Schema';

const LoginInner = ({
  setCreatePassword,
  setMessage,
  setIsLoginSuccess,
  setEmail,
  setNewUser,
  setSubtitle
}: {
  setCreatePassword: any;
  setSubtitle: any;
  setNewUser: any;
  setIsLoginSuccess: any;
  setEmail: any;

  setMessage: any;
}) => {
  const {updateAuthState} = useGlobalContext();
  const [cookies, setCookie, removeCookie] = useCookies();

  const [isToggled, setIsToggled] = useState<boolean>(false);

  const toggleLoading = (state: boolean) => {
    setIsToggled(state);
  };

  const {
    values,
    errors,
    handleSubmit,
    setFieldError,
    handleChange,
    setFieldValue,
    setValues,
    getFieldMeta,
    validateForm
  } = useFormik({
    initialValues: {
      email: '',
      password: '',
      checked: false
    },
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      const {email, password, checked} = values;

      await onShowPassword(email, password, checked);
    }
  });

  const checkLoginCred = () => {
    const auth = cookies.cred;

    if (auth?.checked) {
      setSubtitle(`Welcome Back ${auth?.name || ''} !`);
      setValues({
        email: auth.email,
        password: auth.password,
        checked: Boolean(auth?.checked)
      });
    }
  };

  useEffect(() => {
    checkLoginCred();
  }, []);

  const {setUser, authenticate} = useAuth();

  const handleError = (error: any, onlyEmail?: boolean) => {
    setMessage(() => {
      switch (error.code) {
        case 'UserNotFoundException':
          setFieldError('email', 'The email you entered was not found');
          return {
            show: true,
            type: 'error',
            message: 'The email you entered was not found'
          };
        case 'NotAuthorizedException':
          if (!onlyEmail) {
            console.log('The email or password you entered was not correct');
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

  const getUser = async () => {
    const user = await Auth.signIn(values.email, 'xIconoclast.5x');
    return user;
  };

  const onSetPassword = async () => {
    validateForm(values);

    if (!getFieldMeta('email').error) {
      try {
        toggleLoading(true);
        const user = await Auth.signIn(values.email, 'xIconoclast.5x');

        if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
          setNewUser(user);
          setCreatePassword(true);
          setEmail(values.email);
          setMessage({
            show: false,
            type: '',
            message: ''
          });
        } else {
          setFieldError('password', 'You already have setup password');
        }
        toggleLoading(false);
      } catch (error) {
        if (error.code === 'NotAuthorizedException') {
          toggleLoading(false);
          setFieldError('password', 'You already have setup password');
        } else {
          handleError(error);
        }
        console.error(error);
      }
    } else {
      setFieldError('email', getFieldMeta('email').error);
    }
  };

  const onShowPassword = async (username: string, password: string, checked: boolean) => {
    try {
      toggleLoading(true);

      const user: any = await signIn(
        username,
        password,
        {setCookie, removeCookie},
        checked
      );

      if (user) {
        setIsLoginSuccess(true);
        const authId = user.username;
        const userInfo = await getPerson(username, authId);
        let instInfo: any = userInfo.role !== 'ST' ? await getInstInfo(authId) : {};
        setCredCookies(
          checked,
          {setCookie, removeCookie},
          {
            email: username,
            password,
            name: `${userInfo?.firstName || ''} ${userInfo?.lastName || ''}`
          }
        );

        setUser({
          email,
          authId,

          associateInstitute:
            instInfo?.data?.listStaff?.items.filter((item: any) => item.institution) ||
            [],
          ...getUserInfo(userInfo)
        });

        authenticate();
        await updateLoginTime(userInfo.id, user.username, username);

        updateAuthState(true);
      }
    } catch (error) {
      console.error(error);

      if (error.code === 'NotAuthorizedException') {
        if (error.message === 'Incorrect username or password.') {
          const user = await getUser();

          if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
            setNewUser(user);
            setCreatePassword(true);
            setEmail(values.email);
          } else {
            setMessage({
              show: true,
              type: 'error',
              message: error.message
            });
          }
        } else if (
          error.message ===
          'Temporary password has expired and must be reset by an administrator.'
        ) {
          try {
            await axios.post(createUserUrl, {email: username, status: 'temporary'});
            setMessage({
              show: true,
              type: 'success',
              message:
                'Your account has been activated by the admin. Please click on enter or login and create you password to continue.'
            });
          } catch (err) {
            console.error('Error temporary password could not be reset');
          }
        }
      } else if (error.code === 'UserNotConfirmedException') {
        try {
          await axios.post(createUserUrl, {email: username, status: 'unconfirmed'});
          setMessage({
            show: true,
            type: 'success',
            message:
              'Your account has been activated by the admin. Please click on enter or login and create you password to continue.'
          });
          // confirm user, set password, and sign in which should ask them to create a new password.
        } catch (err) {
          console.error('Error in resetting unconfirmed user.');
        }
      } else {
        getSignInError(error, true);
      }
    } finally {
      toggleLoading(false);
    }
  };

  const {email, password, checked} = values;

  return (
    <form
      onSubmit={handleSubmit}
      className="h-auto flex-grow flex flex-col justify-center">
      <FormInput
        dataCy="email"
        Icon={AiOutlineUser}
        label="Email"
        onChange={(e) => {
          setSubtitle(`Welcome Back!`);
          handleChange(e);
        }}
        error={errors.email}
        wrapperClass="mb-4"
        placeHolder="Enter your email"
        autocomplete="chrome-off"
        type="email"
        value={email}
        id="email"
        name="email"
      />

      <>
        <FormInput
          dataCy="password"
          error={errors.password}
          autocomplete="chrome-off"
          label="Password"
          onChange={handleChange}
          Icon={AiOutlineLock}
          placeHolder="Enter your password"
          type="password"
          id="password"
          name="password"
          value={password}
        />

        <div className="my-4">
          <RememberMe
            dataCy="remember"
            isChecked={checked}
            toggleCheckBox={() => setFieldValue('checked', !checked)}
          />
        </div>
      </>

      <div className="relative flex flex-col justify-center items-center">
        <Buttons
          disabled={isToggled}
          dataCy="login-button"
          btnClass="w-full"
          type="submit"
          loading={isToggled}
          label={'Login'}
        />
      </div>
      <p
        onClick={onSetPassword}
        className="w-auto text-gray-600 hover:underline cursor-pointer text-right mt-2">
        set password
      </p>
    </form>
  );
};

export default LoginInner;
