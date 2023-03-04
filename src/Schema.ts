import * as Yup from 'yup';

export const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(4, 'Too Short!').max(15, 'Too Long!').required('Required')
});

export const CreatePasswordSchema = Yup.object().shape({
  password: LoginSchema.fields.password
});

export const ConfirmCodeSchema = Yup.object().shape({
  password: LoginSchema.fields.password
});

export const ForgotSchema = Yup.object().shape({
  email: LoginSchema.fields.email
});
