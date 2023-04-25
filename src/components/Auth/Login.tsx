import {useState} from 'react';

import CreatePassword from 'components/Auth/CreatePassword';
import LoginInner from 'components/Auth/LoginInner';

const Login = () => {
  const [message, setMessage] = useState<{show: boolean; type: string; message: string}>({
    show: false,
    type: '',
    message: ''
  });
  const [createPassword, setCreatePassword] = useState(false);
  const [isLoginSuccess, setIsLoginSuccess] = useState(false);

  const [email, setEmail] = useState('');
  const [newUser, setNewUser] = useState(false);

  return (
    <>
      {!createPassword ? (
        <>
          <LoginInner
            setEmail={setEmail}
            setMessage={setMessage}
            setNewUser={setNewUser}
            message={message}
            isLoginSuccess={isLoginSuccess}
            setIsLoginSuccess={setIsLoginSuccess}
            setCreatePassword={setCreatePassword}
          />
        </>
      ) : (
        <>
          <CreatePassword
            message={message}
            isLoginSuccess={isLoginSuccess}
            setIsLoginSuccess={setIsLoginSuccess}
            newUser={newUser}
            email={email}
            setMessage={setMessage}
          />
        </>
      )}
    </>
  );
};

export default Login;
