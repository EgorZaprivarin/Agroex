import * as Yup from 'yup';

const validationSchemaForUserAccount = () => {
  let EMAIL_REGX = /^(([^<>()\[\]\\.,;:\s@"]+(.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/;

  return Yup.object().shape({
    first_name: Yup.string()
      .matches(/^[^0-9]+$/, 'Field should not contain numbers')
      .required('First name is required'),
    last_name: Yup.string()
      .matches(/^[^0-9]+$/, 'Field should not contain numbers')
      .required('Last name is required'),
    email: Yup.string()
      .matches(EMAIL_REGX, 'Invalid email')
      .required('Email is required'),
  });
};

export default validationSchemaForUserAccount;
