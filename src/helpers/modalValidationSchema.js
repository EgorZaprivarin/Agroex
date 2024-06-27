import * as Yup from 'yup';

const modalValidationSchema = (gridType) => {
  if (gridType === 'Users') {
    return Yup.object().shape({
      firstName: Yup.string()
        .matches(/^[^0-9]+$/, 'Field should not contain numbers')
        .required('Firstname is required'),
      lastName: Yup.string()
        .matches(/^[^0-9]+$/, 'Field should not contain numbers')
        .required('Lastname is required'),
      email: Yup.string()
        .required('Email is required')
        .email('Invalid email format'),
      role: Yup.string().oneOf(['ADMIN', 'USER']).required('Role is required'),
    });
  } else {
    return Yup.object().shape({
      parentCategory: Yup.string()
        .matches(/^[^0-9]+$/, 'Field should not contain numbers')
        .required('Subcategory is required'),
      categoryName: Yup.string()
        .matches(/^[^0-9]+$/, 'Field should not contain numbers')
        .required('Subcategory is required'),
    });
  }
};

export default modalValidationSchema;
