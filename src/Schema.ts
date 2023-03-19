import * as Yup from 'yup';
import YupPassword from 'yup-password';
YupPassword(Yup);

export const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email cannot be empty'),
  password: Yup.string().min(4, 'Too Short!').max(15, 'Too Long!')
});

const helper = {
  min: (field: string, minValue?: number) =>
    field + ` must be atleast ${minValue || 4} characters`,
  max: (field: string, maxValue?: number) =>
    field + ` cannot be more than ${maxValue || 20} characters`
};

export const UserRegisterSchema = Yup.object().shape({
  email: LoginSchema.fields.email,
  firstName: Yup.string()
    .min(4, helper.min('First Name'))
    .max(20, helper.max('First Name'))
    .required('Required'),
  lastName: Yup.string()
    .min(4, helper.min('Last Name'))
    .max(20, helper.max('Last Name'))
    .required('Required'),
  role: Yup.string().required('Role cannot be empty'),
  phone: Yup.string().matches(
    /^([0]{1}|\+?[234]{3})([7-9]{1})([0|1]{1})([\d]{1})([\d]{7})$/g,
    'Invalid phone number'
  )
});
export const CreatePasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required()
    .min(
      8,
      'password must contain 8 or more characters with at least one of each: uppercase, lowercase, number and special'
    )
    .max(20, helper.max('Password'))
    .minLowercase(1, 'password must contain at least 1 lower case letter')
    .minUppercase(1, 'password must contain at least 1 upper case letter')
    .minNumbers(1, 'password must contain at least 1 number')
    .minSymbols(1, 'password must contain at least 1 special character')
});
export const ConfirmCodeSchema = Yup.object().shape({
  password: LoginSchema.fields.password
});

export const ForgotSchema = Yup.object().shape({
  email: LoginSchema.fields.email
});
