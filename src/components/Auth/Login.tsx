import React, { useContext, useState, useEffect } from 'react';
import API, { graphqlOperation } from '@aws-amplify/api';
import { GlobalContext } from '../../contexts/GlobalContext';
import { useCookies } from 'react-cookie';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaKey } from 'react-icons/fa';
import { AiOutlineEye } from 'react-icons/ai';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { AiOutlineEyeInvisible } from 'react-icons/ai';
import { MdEmail } from 'react-icons/md';
import { useHistory, Link, NavLink } from 'react-router-dom';
import Auth from '@aws-amplify/auth';
import * as queries from '../../graphql/queries';
import * as customMutations from '../../customGraphql/customMutations';
import { getAsset } from '../../assets';

interface LoginProps {
  updateAuthState: Function;
}

const Login = ({ updateAuthState }: LoginProps) => {
  const [isToggled, setIsToggled] = useState<boolean>(false);
  const [cookies, setCookie, removeCookie] = useCookies();
  const history = useHistory();
  const { theme, state, clientKey, dispatch } = useContext(GlobalContext);
  let [message, setMessage] = useState<{ show: boolean; type: string; message: string }>({
    show: false,
    type: '',
    message: '',
  });
  const [input, setInput] = useState({
    email: '',
    password: '',
  });
  const [passToggle, setPassToggle] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  async function SignIn() {
    let username = input.email;
    let password = input.password;

    try {
      const user = await Auth.signIn(username, password);
      dispatch({ type: 'LOG_IN', payload: { email: username, authId: user.username } });
      if (isChecked) {
        setCookie('cred', { email: username, isChecked, password }, { path: '/' });
      } else {
        removeCookie('cred');
      }
      setCookie('auth', { email: username, authId: user.username }, { secure: false, path: '/' });
      sessionStorage.setItem('accessToken', user.signInUserSession.accessToken.jwtToken);
      let userInfo: any = await API.graphql(
        graphqlOperation(queries.getPerson, { email: username, authId: user.username })
      );
      userInfo = userInfo.data.getPerson;
      dispatch({
        type: 'SET_USER',
        payload: {
          id: userInfo.id,
          firstName: userInfo.preferredName || userInfo.firstName,
          lastName: userInfo.lastName,
          language: userInfo.language,
          onBoardSurvey: userInfo.onBoardSurvey ? userInfo.onBoardSurvey : false,
          role: userInfo.role,
          image: userInfo.image,
        },
      });
      const input = {
        id: userInfo.id,
        authId: user.username,
        email: username,
        lastLoggedIn: new Date().toISOString(),
      };
      const update: any = await API.graphql(graphqlOperation(customMutations.updatePersonLoginTime, { input }));
      updateAuthState(true);
    } catch (error) {
      console.error('error signing in', error);

      setMessage(() => {
        if (!username) {
          return {
            show: true,
            type: 'error',
            message: 'Please enter your email',
          };
        }
        if (!username.includes('@')) {
          return {
            show: true,
            type: 'error',
            message: 'Your email is not in the expected email address format',
          };
        }
        if (!password) {
          return {
            show: true,
            type: 'error',
            message: 'Please enter your password',
          };
        }
        switch (error.code) {
          case 'UserNotFoundException':
            return {
              show: true,
              type: 'error',
              message: 'The email you entered was not found',
            };
          case 'NotAuthorizedException':
            return {
              show: true,
              type: 'error',
              message: 'The email or password you entered was not correct',
            };
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
      toggleLoading(false);
    }
  }

  const toggleLoading = (state: boolean) => {
    setIsToggled(state);
  };

  const handleChange = (e: { target: { id: any; value: any } }) => {
    const { id, value } = e.target;
    setInput((input) => {
      if (id === 'email') {
        return {
          ...input,
          [id]: value.toLowerCase(),
        };
      } else {
        return {
          ...input,
          [id]: value,
        };
      }
    });
  };

  const handleEnter = (e: any) => {
    if (e.key === 'Enter') {
      handleSubmit();
      toggleLoading(true);
    }
  };

  const handleSubmit = () => {
    SignIn();
    toggleLoading(true);
  };
  const checkLoginCred = () => {
    const auth = cookies.cred;
    if (auth?.isChecked) {
      setIsChecked(auth.isChecked);
      setInput({
        ...input,
        email: auth.email,
        password: auth.password,
      });
    }
  };

  const toggleCheckBox = () => {
    setIsChecked(!isChecked);
  };

  useEffect(() => {
    checkLoginCred();
  }, []);

  return (
    <div className="w-full h-screen flex flex-row items-center justify-center bg-opacity-10 text-sm md:bg-none sm:bg-cover sm:bg-center">
      <div className="w-full md:max-w-160 sm:max-w-100 h-full max-h-160 flex flex-row rounded-xl shadow-2xl">
        <div className="min-w-sm max-w-sm bg-white md:rounded-l-xl sm:rounded-xl pt-0">
          <div className="h-.7/10  w-full rounded-tl-xl"></div>
          <div className="relative h-9.3/10 flex flex-col items-center p-8">
            <div className={`absolute bottom-0 text-center mb-4 leading-5 text-xs text-gray-600`}>
              <p>© Copyright {new Date().getFullYear()}</p>
              <p>
                <NavLink className="underline text-xs hover:text-blue-500" to="/privacy-policy">
                  Privacy Policy
                </NavLink>
              </p>
            </div>
            <div className="h-24 w-56">
              <img className="" src={getAsset(clientKey, 'login_page_logo')} alt="login_page_logo" />
            </div>

            <div className="h-3.5/10 flex-grow flex flex-col justify-center">
              <div className="w-full mb-2 flex flex-col justify-around items-center">
                {message.show ? (
                  <p
                    className={`text-xs text-center ${
                      message.type === 'success' ? 'text-green-500' : message.type === 'error' ? 'text-red-500' : null
                    }`}>
                    {message.message}
                  </p>
                ) : null}
              </div>

              <div className="input relative w-full mb-4">
                <label className="hidden" htmlFor="email">
                  Email
                </label>
                <input
                  className="w-full p-3  border-0 border-medium-gray border-opacity-20 rounded-lg bg-light-gray bg-opacity-10"
                  placeholder="Email"
                  type="text"
                  id="email"
                  name="email"
                  value={input.email}
                  onChange={handleChange}
                />
              </div>

              <div className="input relative w-full">
                <div className="absolute w-6 right-0 transform -translate-x-1">
                  <div
                    onClick={() => setPassToggle(!passToggle)}
                    className="mr-2 text-gray-500 cursor-pointer hover:text-grayscale transform translate-y-1/2">
                    {passToggle ? (
                      <IconContext.Provider value={{ className: 'w-auto '}}>
                        <AiOutlineEye size={24} />
                      </IconContext.Provider>
                    ) : (
                      <IconContext.Provider value={{ className: 'w-auto'}}>
                        <AiOutlineEyeInvisible size={24} />
                      </IconContext.Provider>
                    )}
                  </div>
                </div>


                <label className="hidden" htmlFor="password">
                  Password
                </label>
                <input
                  className="w-full p-3  border-0 border-medium-gray border-opacity-20 rounded-lg bg-light-gray bg-opacity-10"
                  placeholder="Password"
                  type={passToggle ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={input.password}
                  onChange={handleChange}
                  onKeyDown={handleEnter}
                />
              </div>

              <div className="my-3">
                <label className="flex items-center justify-end">
                  <input
                    type="checkbox"
                    className="form-checkbox w-4 h-10"
                    checked={isChecked}
                    onChange={toggleCheckBox}
                  />
                  <span className={`w-auto ml-2 leading-5 text-xs text-gray-600`}>Remember Me</span>
                </label>
              </div>
            </div>

            <div className="relative h-4.5/10 flex flex-col justify-center items-center">
              <button
                disabled={isToggled}
                className={`p-3 mb-4 ${getAsset(clientKey, 'authButtonColor')} text-gray-200 rounded-xl font-semibold`}
                onKeyPress={handleEnter}
                onClick={handleSubmit}>
                {isToggled ? (
                  <IconContext.Provider
                    value={{ size: '1.5rem', color: '#ffffff', className: 'relative animate-spin' }}>
                    <AiOutlineLoading3Quarters />
                  </IconContext.Provider>
                ) : (
                  'Login'
                )}
              </button>

              <NavLink to="/forgot-password">
                <div className="text-bold text-center text-blueberry hover:text-blue-500 mb-2">
                  Forgot your password?
                </div>
              </NavLink>
            </div>
          </div>
        </div>
        <div className={`md:inline-block sm:hidden xs:hidden min-w-sm max-w-sm bg-gray-200 rounded-r-xl pr-0 ${getAsset(clientKey, 'authBackground')} bg-cover bg-center`}></div>
      </div>
    </div>
  );
};

export default Login;
