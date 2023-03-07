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
              message: 'Password set successfully'
            });
            setTimeout(() => {
              history.push('/login');
            }, 3000);
          }
        } catch (error) {
          console.error('error setting password', error);
        }
      } else {
        await Auth.forgotPassword(email);

        setMessage(() => {
          return {
            show: true,
            type: 'success',
            message: 'Please check your email for further instructions.'
          };
        });
      }
    } catch (error) {
      console.error('error signing in', error);
      setMessage(() => {
        switch (error.code) {
          case 'NotAuthorizedException':
            return {
              show: true,
              type: 'error',
              message: 'Your password has not be reset by the team...'
            };
          case 'UserNotFoundException':
            return {
              show: true,
              type: 'error',
              message: 'The email you entered was not found'
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

  const populateCodeAndEmail = () => {
    const params = useQuery(location.search);

    const emailId = params.get('email'); // Find an email from params.

    const isValidEmail =
      emailId && /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi.test(emailId); // validate email id.

    if (isValidEmail) {
      setFieldValue('email', emailId);
    } else {
      setMessage({
        show: true,
        type: 'error',
        message: 'Invalid account confirmation URL. Please check your email'
      });
    }
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
      subtitle="Because our users comes from various walks of life, passwords can only be set if your account has default settings in the system. If you are new user or need to set your password again, please contact our team if account is not at the default settings.">
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
            dataCy="forgot-button"
            btnClass="w-full"
            type="submit"
            loading={isLoading}
            label={'Submit'}
          />
          <NavLink to="/login">
            <p className="w-auto text-gray-600 hover:underline cursor-pointer text-right mt-2">
              return to login
            </p>
          </NavLink>
        </div>
      </form>
    </AuthCard>
  );
};

export default Forgot;
