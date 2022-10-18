import React, {useContext, useState} from 'react';
import {GlobalContext} from 'contexts/GlobalContext';
import {useHistory, NavLink} from 'react-router-dom';
import Auth from '@aws-amplify/auth';
import {useCookies} from 'react-cookie';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {FaKey} from 'react-icons/fa';
import {AiOutlineEye, AiOutlineEyeInvisible} from 'react-icons/ai';
import {getAsset} from 'assets';

const NewPassword = () => {
  const {state, dispatch, clientKey} = useContext(GlobalContext);
  const history = useHistory();
  const [input, setInput] = useState({
    password: '',
    match: ''
  });
  const [message, setMessage] = useState<{show: boolean; type: string; message: string}>({
    show: false,
    type: '',
    message: ''
  });
  const [cookies, setCookie] = useCookies(['confirm_user']);
  const [passToggle, setPassToggle] = useState(false);
  const [passMatchToggle, setPassMatchToggle] = useState(false);

  async function changePassword() {
    if (cookies.confirm_user) {
      let username = cookies.confirm_user;
      let password = 'xIconoclast.5x';

      try {
        const user = await Auth.signIn(username, password);
        const res = await Auth.changePassword(user, password, input.password);
        console.log(res);
        dispatch({type: 'LOG_IN', payload: {email: username, authId: user.username}});
        setCookie(
          // @ts-ignore
          'auth',
          {email: username, authId: user.username},
          {secure: false, path: '/'}
        );
        history.push('/dashboard');
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
            default:
              return {
                show: true,
                type: 'error',
                message: error.message
              };
          }
        });
      }
    }
  }

  const validation = () => {
    let validated = false;

    setMessage(() => {
      if (!input.password) {
        return {
          show: true,
          type: 'error',
          message: 'Please enter your new password'
        };
      }
      if (!input.match) {
        return {
          show: true,
          type: 'error',
          message: 'Please confirm your new password'
        };
      }
      if (input.password !== input.match) {
        return {
          show: true,
          type: 'error',
          message: 'Your new password and confirmation password do not match'
        };
      }
      validated = true;
      if (validated) {
        changePassword();
      }
      return {
        show: false,
        type: 'success',
        message: 'success'
      };
    });
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
      validation();
    }
  };

  const handleSubmit = () => {
    validation();
  };

  return (
    <div className="w-full h-screen flex flex-row items-center justify-center bg-opacity-10 text-sm">
      <div className="w-auto h-auto flex flex-row rounded-xl shadow-2xl">
        <div className="login w-140 min-w-sm max-w-sm bg-white rounded-l-xl pt-0">
          <div className="h-.7/10  w-full rounded-tl-xl"></div>
          <div className="relative h-9.5/10 flex flex-col items-center p-8">
            <div className="absolute text-center text-xs mb-4" style={{bottom: '0'}}>
              <p>© Copyright {new Date().getFullYear()}</p>
              <p>
                <NavLink
                  className="underline text-sm hover:text-blue-500"
                  to="/privacy-policy">
                  Privacy Policy
                </NavLink>
              </p>
            </div>
            <div className="h-24 w-56">
              <img src={getAsset(clientKey, 'login_page_logo')} alt="Logo" />
            </div>

            <div className="h-1/10 text-center text-sm mt-2 text-gray-700">
              Password must be at least 8 characters and include uppercase and lowercase
            </div>

            <div className="h-4.5/10 flex-grow flex flex-col justify-center">
              <div className="w-full h-1/10 flex justify-center items-center">
                {message.show ? (
                  <p
                    className={`text-sm text-center ${
                      message.type === 'success'
                        ? 'text-green-500'
                        : message.type === 'error'
                        ? 'text-red-500'
                        : null
                    }`}>
                    {message.message}
                  </p>
                ) : null}
              </div>

              <div className="input relative w-full">
                <div style={{right: 0}} className="absolute w-6">
                  <div
                    onClick={() => setPassToggle(!passToggle)}
                    className="text-gray-500 cursor-pointer hover:text-grayscale">
                    {passToggle ? (
                      <IconContext.Provider value={{size: '1.5rem'}}>
                        <AiOutlineEye />
                      </IconContext.Provider>
                    ) : (
                      <IconContext.Provider value={{size: '1.5rem'}}>
                        <AiOutlineEyeInvisible />
                      </IconContext.Provider>
                    )}
                  </div>
                </div>

                <div className="icon">
                  <IconContext.Provider value={{size: '1.2rem'}}>
                    <FaKey />
                  </IconContext.Provider>
                </div>
                <label className="hidden" htmlFor="password">
                  New Password
                </label>
                <input
                  className="w-full bg-off-white px-2 py-1 ml-2"
                  placeholder="New Password"
                  type={passToggle ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={input.password}
                  onChange={handleChange}
                  onKeyDown={handleEnter}
                />
              </div>
              <div className="input relative w-full">
                <div style={{right: 0}} className="absolute w-6">
                  <div
                    onClick={() => setPassMatchToggle(!passMatchToggle)}
                    className="text-gray-500 cursor-pointer hover:text-grayscale">
                    {passMatchToggle ? (
                      <IconContext.Provider value={{size: '1.5rem'}}>
                        <AiOutlineEye />
                      </IconContext.Provider>
                    ) : (
                      <IconContext.Provider value={{size: '1.5rem'}}>
                        <AiOutlineEyeInvisible />
                      </IconContext.Provider>
                    )}
                  </div>
                </div>
                <div className="icon">
                  <IconContext.Provider value={{size: '1.2rem'}}>
                    <FaKey />
                  </IconContext.Provider>
                </div>
                <label className="hidden" htmlFor="match">
                  Confirm Password
                </label>
                <input
                  className="w-full bg-off-white px-2 py-1 ml-2"
                  placeholder="Confirm Password"
                  type={passMatchToggle ? 'text' : 'password'}
                  id="match"
                  name="match"
                  value={input.match}
                  onChange={handleChange}
                  onKeyDown={handleEnter}
                />
              </div>
            </div>

            <div className="h-3/10 flex flex-col justify-center items-center">
              <button
                className={`${getAsset(
                  clientKey,
                  'authButtonColor'
                )} text-gray-200 rounded-lg mb-4`}
                onKeyPress={handleEnter}
                onClick={handleSubmit}>
                Set New Password
              </button>
            </div>
          </div>
        </div>
        <div
          className={`login w-140 min-w-sm max-w-sm bg-gray-200 rounded-r-xl pr-0 ${getAsset(
            clientKey,
            'authBackground'
          )} bg-cover bg-center`}></div>
      </div>
    </div>
  );
};

export default NewPassword;
