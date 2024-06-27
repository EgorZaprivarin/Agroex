import * as yup from 'yup';

const validationSchema = yup.object({
  title: yup
    .string()
    .min(3, 'must be at least 3 characters')
    .max(40, 'must be less than 40 characters')
    .required('required'),
  description: yup
    .string()
    .min(10, 'must be at least 10 characters')
    .max(150, 'must be less than 150 characters'),
  country: yup.string().required('required'),
  region: yup.string().required('required'),
  category: yup.string().required('required'),
  product: yup.string().required('required'),
  variety: yup.string().required('required'),
  sizeFrom: yup
    .number()
    .typeError('must be a number')
    .moreThan(0, 'must be more than 0')
    .lessThan(1001, 'max value 1000')
    .integer('must be an integer')
    .required('required'),
  sizeTo: yup
    .number()
    .typeError('must be a number')
    .lessThan(1001, 'max value 1000')
    .moreThan(yup.ref('sizeFrom'), 'must be more than lower size')
    .integer('must be an integer')
    .required('required'),
  sizeUnit: yup.string().required('required'),
  packaging: yup.string().required('required'),
  quantity: yup
    .number()
    .typeError('must be a number')
    .min(1, 'must be more than 0')
    .max(1000, 'max value is 1000')
    .integer('must be an integer')
    .required('required'),
  quantityUnit: yup.string().required('required'),
  minPrice: yup
    .number(),
  price: yup
    .number()
    .typeError('must be a number')
    .moreThan(0, 'must be more than 0')
    .max(100000, 'max value 100000')
    .required('required'),
  currency: yup.string().required('required'),
  lotType: yup.string().required('required'),
  days: yup
    .number()
    .typeError('must be a number')
    .max(7, 'max days 7'),
  hours: yup
    .number()
    .typeError('must be a number')
    .max(24, 'max hours 24'),
  minutes: yup
    .number()
    .typeError('must be a number')
    .max(60, 'max minutes 60'),
});

export default validationSchema;