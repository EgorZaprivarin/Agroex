import { Field, ErrorMessage, useField } from 'formik';
import TextField from '@mui/material/TextField';

import styles from './CustomTextField.module.scss';

export const CustomTextField = ({
  label,
  rows = 1,
  multiline,
  handleKeyPress = null,
  ...props
}) => {
  const [field, meta] = useField(props);

  return (
    <>
      {label ? <label htmlFor={props.name}>{label}</label> : null}
      <Field
        as={TextField}
        rows={rows}
        multiline={multiline}
        onKeyPress={handleKeyPress}
        {...props}
        {...field}
      />
      {meta.touched && meta.error ? (
        <div className={styles.error}>{meta.error}</div>
      ) : null}
    </>
  );
};
