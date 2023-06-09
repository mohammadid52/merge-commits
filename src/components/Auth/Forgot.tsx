import {Auth} from 'aws-amplify';

import Buttons from '@components/Atoms/Buttons';
import FormInput from 'atoms/Form/FormInput';
import AuthCard from 'components/Auth/AuthCard';
import {useFormik} from 'formik';
import React, {useEffect, useState} from 'react';
import {NavLink, useHistory} from 'react-router-dom';
import {ForgotSchema} from 'Schema';
import {useQuery} from '@customHooks/urlParam';

const Forgot = () => {
  const [message, setMessage] = useState<{show: boolean; type: string; message: string}>({
    show: false,
    type: '',
    message: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const history = useHistory();

  async function forgotPassword(email: string) {
    setIsLoading(true);
    try {
      const user = await Auth.signIn(email, 'xIconoclast.5x');
      if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
        try {
          const newPasswordUser = await Auth.completeNewPassword(user, values.password);
          if (newPasswordUser) {
            setMessage({
              show: true,
              type: 'success',
              message: 'Your password was successfully updated.'
            });
            setTimeout(() => {
              history.push('/login');
            }, 3000);
          }
        } catch (error) {
          console.error('error setting password', error);
        }
      }
    } catch (error) {
      console.error('error signing in', error);
      setMessage(() => {
        switch (error.code) {
          case 'NotAuthorizedException':
            return {
              show: true,
              type: 'error',
              message:
                'Your password was not updated.  Contact our team to reset your default settings before continuing.'
            };
          case 'UserNotFoundException':
            return {
              show: true,
              type: 'error',
              message: 'The email you entered was not found.'
            };

          default:
            return {
              show: true,
              type: 'error',
              message: error.message
            };
        }
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    populateCodeAndEmail();
  }, []);

  const params = useQuery(location.search);

  const populateCodeAndEmail = () => {
    const emailId = params.get('email'); // Find an email from params.

    setFieldValue('email', emailId);
  };

  const {values, handleChange, handleSubmit, setFieldValue} = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: ForgotSchema,
    onSubmit: async (values) => {
      const {email} = values;
      await forgotPassword(email);
    }
  });

  return (
    <AuthCard
      message={message}
      subtitle="Only new users and users who have asked our team to reset their password can update their password without logging into the app. If you forgot your existing password, contact our team to reset your security settings so you can set a new password.">
      <form onSubmit={handleSubmit}>
        <div className="">
          <FormInput
            label="Email"
            className="mb-4"
            placeHolder="Enter your email"
            type="email"
            value={values.email}
            id="email"
            onChange={handleChange}
          />
        </div>
        <div className="">
          <FormInput
            label="Set Password"
            className="mb-4"
            placeHolder="Set your password"
            type="password"
            name="password"
            value={values.password}
            id="password"
            onChange={handleChange}
          />
        </div>

        <div className="">
          <Buttons
            disabled={isLoading}
            type="submit"
            loading={isLoading}
            label={'Submit'}
          />
          <NavLink to="/login">
            <p className="w-auto text-medium  hover:underline cursor-pointer text-right mt-2">
              return to login
            </p>
          </NavLink>
        </div>
      </form>
    </AuthCard>
  );
};

export default Forgot;
