import {Auth} from 'aws-amplify';

import Buttons from '@components/Atoms/Buttons';
import FormInput from 'atoms/Form/FormInput';
import AuthCard from 'components/Auth/AuthCard';
import {useFormik} from 'formik';
import React, {useState} from 'react';
import {NavLink} from 'react-router-dom';
import {ForgotSchema} from 'Schema';

const Forgot = () => {
  const [message, setMessage] = useState<{show: boolean; type: string; message: string}>({
    show: false,
    type: '',
    message: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  async function forgotPassword(email: string) {
    setIsLoading(true);
    try {
      await Auth.forgotPassword(email);
      setMessage(() => {
        return {
          show: true,
          type: 'success',
          message: 'Please check your email for further instructions.'
        };
      });
    } catch (error) {
      console.error('error signing in', error);
      setMessage(() => {
        switch (error.code) {
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

  const {values, handleChange} = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: ForgotSchema,
    onSubmit: async (values) => {
      const {email} = values;
      await forgotPassword(email);
    }
  });

  return (
    <AuthCard message={message} title="Forgot Password">
      <form>
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
          <Buttons
            disabled={isLoading}
            dataCy="forgot-button"
            btnClass="w-full"
            type="submit"
            loading={isLoading}
            label={'Submit'}
          />
          <NavLink to="/login">
            <div className="text-center text-sm text-blueberry hover:text-blue-500">
              Go back to login!
            </div>
          </NavLink>
        </div>
      </form>
    </AuthCard>
  );
};

export default Forgot;
