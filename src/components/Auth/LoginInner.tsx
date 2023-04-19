import Buttons from '@components/Atoms/Buttons';
import FormInput from '@components/Atoms/Form/FormInput';
import {useGlobalContext} from '@contexts/GlobalContext';
import useAuth from '@customHooks/useAuth';
import {
  getInstInfo,
  getPerson,
  signIn,
  updateLoginTime
} from 'graphql-functions/functions';
import {getSignInError, getUserInfo, setCredCookies} from '@utilities/functions';
import {createUserUrl} from '@utilities/urls';
import {Checkbox} from 'antd';
import {Auth} from 'aws-amplify';
import axios from 'axios';
import {useFormik} from 'formik';
import {useEffect, useState} from 'react';
import {useCookies} from 'react-cookie';
import {AiOutlineLock, AiOutlineUser} from 'react-icons/ai';
import {useHistory} from 'react-router';
import {LoginSchema} from 'Schema';
import AuthCard from './AuthCard';

const LoginInner = ({
  setCreatePassword,
  setMessage,
  setIsLoginSuccess,
  setEmail,
  setNewUser,

  isLoginSuccess,
  message
}: {
  setCreatePassword: any;

  setNewUser: any;
  setIsLoginSuccess: any;
  setEmail: any;
  isLoginSuccess: boolean;
  message: any;

  setMessage: any;
}) => {
  const {updateAuthState} = useGlobalContext();
  const [cookies, setCookie, removeCookie] = useCookies();

  const [isToggled, setIsToggled] = useState<boolean>(false);
  const [subtitle, setSubtitle] = useState('Welcome to our app');
  const toggleLoading = (state: boolean) => {
    setIsToggled(state);
  };

  const {
    values,
    errors,
    handleSubmit,

    handleChange,
    setFieldValue,
    setValues,
    setFieldError
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
      if (auth?.name) {
        setSubtitle(`Welcome Back, ${auth?.name || ''}`);
      } else {
        setSubtitle(`Welcome to our app`);
      }
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

  const getUser = async () => {
    const user = await Auth.signIn(values.email, 'xIconoclast.5x');
    return user;
  };

  const onShowPassword = async (username: string, password: string, checked: boolean) => {
    try {
      toggleLoading(true);

      const user: any = await signIn(username, password, {
        setCookie,
        removeCookie
      });

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
            name: `${userInfo?.preferredName || userInfo?.firstName || ''} `
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
        if (error.message?.toLowerCase().includes('incorrect username or password')) {
          try {
            const user = await getUser();

            if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
              setNewUser(user);
              setCreatePassword(true);
              setEmail(values.email);
            }
          } catch (error) {
            setFieldError('password', 'Incorrect username or password');
          }
        } else if (
          error.message ===
          'Temporary password has expired and must be reset by an administrator.'
        ) {
          try {
            createUserUrl &&
              (await axios.post(createUserUrl, {
                email: username,
                status: 'temporary'
              }));
            setMessage({
              show: true,
              type: 'success',
              message:
                'Your account has been activated by the admin. Please click on enter or login and create you password to continue.'
            });
          } catch (err) {
            console.error(err, 'Error temporary password could not be reset');
          }
        }
      } else if (error.code === 'UserNotConfirmedException') {
        try {
          createUserUrl &&
            (await axios.post(createUserUrl, {
              email: username,
              status: 'unconfirmed'
            }));
          setMessage({
            show: true,
            type: 'success',
            message:
              'Your account has been activated by the admin. Please click on enter or login and create you password to continue.'
          });
          // confirm user, set password, and sign in which should ask them to create a new password.
        } catch (err) {
          console.error(err, 'Error in resetting unconfirmed user.');
        }
      } else {
        setMessage(getSignInError(error, true));
      }
    } finally {
      toggleLoading(false);
    }
  };

  const history = useHistory();

  const onSetPassword = async () => {
    history.push(`/forgot-password?email=${values.email}`);
  };

  const {email, password, checked} = values;

  return (
    <AuthCard
      subtitle={subtitle}
      message={message}
      isSuccess={isLoginSuccess}
      setPasswordComponent={
        <div className="mb-2">
          <Buttons
            disabled={isToggled}
            size="small"
            onClick={onSetPassword}
            variant="link"
            className="mt-2 self-end underline"
            label={'set password'}
          />
        </div>
      }>
      <form
        onSubmit={handleSubmit}
        className="h-auto flex-grow flex flex-col justify-center">
        <div className="gap-2 flex flex-col">
          <FormInput
            Icon={AiOutlineUser}
            label="Email"
            onChange={(e) => {
              setSubtitle(`Welcome Back!`);
              handleChange(e);
            }}
            error={errors.email}
            placeHolder="Enter your email"
            type="email"
            value={email}
            id="email"
            name="email"
          />

          <FormInput
            error={errors.password}
            label="Password"
            onChange={handleChange}
            Icon={AiOutlineLock}
            placeHolder="Enter your password"
            type="password"
            id="password"
            name="password"
            value={password}
          />
        </div>

        <div className="my-4">
          <Checkbox checked={checked} onChange={() => setFieldValue('checked', !checked)}>
            Remember me
          </Checkbox>
        </div>

        <Buttons type="submit" loading={isToggled} label={'Login'} className="w-full" />
      </form>
    </AuthCard>
  );
};

export default LoginInner;
