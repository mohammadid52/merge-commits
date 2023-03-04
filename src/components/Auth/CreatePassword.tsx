import Buttons from '@components/Atoms/Buttons';
import FormInput from '@components/Atoms/Form/FormInput';
import {useGlobalContext} from '@contexts/GlobalContext';
import useAuth from '@customHooks/useAuth';
import {getInstInfo, getPerson, signIn, updateLoginTime} from '@graphql/functions';
import {Auth} from 'aws-amplify';
import {useFormik} from 'formik';
import React, {useState} from 'react';
import {useCookies} from 'react-cookie';
import {AiOutlineLock} from 'react-icons/ai';

const CreatePassword = ({
  setIsLoginSuccess,
  setMessage,
  email,
  newUser
}: {
  email: any;
  newUser: any;
  setIsLoginSuccess: any;
  setMessage: any;
}) => {
  const [isToggled, setIsToggled] = useState<boolean>(false);
  const {updateAuthState} = useGlobalContext();
  const [cookies, setCookie, removeCookie] = useCookies();

  const toggleLoading = (state: boolean) => {
    setIsToggled(state);
  };

  const {setUser} = useAuth();

  const {values, handleChange, handleSubmit} = useFormik({
    initialValues: {
      password: ''
    },
    onSubmit: async (values) => {
      toggleLoading(true);

      let password = values.password;
      try {
        await Auth.completeNewPassword(newUser, password);

        const user: any = await signIn(email, password, {setCookie, removeCookie});

        if (user) {
          setIsLoginSuccess(true);
          const authId = user.username;
          const userInfo = await getPerson(email, authId);
          let instInfo: any = userInfo.role !== 'ST' ? getInstInfo(authId) : {};

          setUser({
            ...userInfo,
            associateInstitute:
              instInfo?.data?.listStaff?.items.filter((item: any) => item.institution) ||
              []
          });

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
    <form onSubmit={handleSubmit} className="">
      <FormInput
        dataCy="password"
        Icon={AiOutlineLock}
        className="mb-4"
        placeHolder="Enter new password"
        type="password"
        onChange={handleChange}
        value={values.password}
        id="password"
      />

      <div className="relative flex flex-col justify-center items-center">
        <Buttons
          dataCy="set-password"
          disabled={isToggled}
          type="submit"
          btnClass="w-full py-3"
          loading={isToggled}
          label={isToggled ? 'Loading' : 'Set Password'}
        />
      </div>
    </form>
  );
};

export default CreatePassword;
