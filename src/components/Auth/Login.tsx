import React, {useState} from 'react';

import AuthCard from 'components/Auth/AuthCard';
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

  const [subtitle, setSubtitle] = useState('Welcome to our app');

  return (
    <AuthCard
      isSuccess={isLoginSuccess}
      message={message}
      subtitle={createPassword ? '' : subtitle}>
      {!createPassword ? (
        <>
          <LoginInner
            setEmail={setEmail}
            setMessage={setMessage}
            setNewUser={setNewUser}
            setSubtitle={setSubtitle}
            setIsLoginSuccess={setIsLoginSuccess}
            setCreatePassword={setCreatePassword}
          />
        </>
      ) : (
        <>
          <CreatePassword
            setIsLoginSuccess={setIsLoginSuccess}
            newUser={newUser}
            email={email}
            setMessage={setMessage}
          />
        </>
      )}
    </AuthCard>
  );
};

export default Login;
