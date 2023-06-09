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
import {getUserInfo} from '@utilities/functions';
import {Auth} from 'aws-amplify';
import {useFormik} from 'formik';
import React, {useState} from 'react';
import {useCookies} from 'react-cookie';
import {AiOutlineLock} from 'react-icons/ai';
import {CreatePasswordSchema} from 'Schema';
import AuthCard from './AuthCard';

const CreatePassword = ({
  setIsLoginSuccess,
  setMessage,
  email,
  newUser,
  isLoginSuccess,
  message
}: {
  email: any;
  newUser: any;
  setIsLoginSuccess: any;
  setMessage: any;
  isLoginSuccess: boolean;
  message: any;
}) => {
  const [isToggled, setIsToggled] = useState<boolean>(false);
  const {updateAuthState} = useGlobalContext();
  const [_, setCookie, removeCookie] = useCookies();

  const toggleLoading = (state: boolean) => {
    setIsToggled(state);
  };

  const {setUser, authenticate} = useAuth();

  const {values, errors, handleChange, handleSubmit} = useFormik({
    initialValues: {
      password: ''
    },
    validationSchema: CreatePasswordSchema,
    onSubmit: async (values) => {
      toggleLoading(true);

      let password = values.password;
      try {
        await Auth.completeNewPassword(newUser, password);

        const user: any = await signIn(email, password, {
          setCookie,
          removeCookie
        });

        if (user) {
          setIsLoginSuccess(true);
          const authId = user.username;
          const userInfo = await getPerson(email, authId);
          let instInfo: any = userInfo.role !== 'ST' ? await getInstInfo(authId) : {};

          setUser({
            email,
            authId,
            associateInstitute:
              instInfo?.data?.listStaff?.items.filter((item: any) => item.institution) ||
              [],
            ...getUserInfo(userInfo)
          });
          authenticate();
          await updateLoginTime(userInfo.id, user.username, email);

          updateAuthState(true);
        }
      } catch (error) {
        setMessage({
          show: true,
          type: 'error',
          message: error.message
        });
        toggleLoading(false);
      }
    }
  });

  return (
    <AuthCard subtitle="" isSuccess={isLoginSuccess} message={message}>
      <form onSubmit={handleSubmit} className="">
        <FormInput
          name="password"
          Icon={AiOutlineLock}
          className="mb-4"
          placeHolder="Enter new password"
          type="password"
          onChange={handleChange}
          error={errors.password}
          value={values.password}
          id="password"
        />

        <div className="relative flex mt-2 flex-col justify-center items-center">
          <Buttons
            disabled={isToggled}
            type="submit"
            loading={isToggled}
            label={isToggled ? 'Loading' : 'Set Password'}
          />
        </div>
      </form>
    </AuthCard>
  );
};

export default CreatePassword;
