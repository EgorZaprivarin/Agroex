import { Field, ErrorMessage, useField } from 'formik';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import styles from './CustomSelect.module.scss';

export const CustomSelect = ({
  list,
  placeholder = '',
  disabled = false,
  ...props
}) => {
  const [meta] = useField(props);

  return (
    <>
      <Field as={Select} displayEmpty disabled={disabled} {...props}>
        <MenuItem disabled value="">
          <em>{placeholder}</em>
        </MenuItem>
        {list.map((item) => (
          <MenuItem key={item.id} value={item.name}>
            {item.name}
          </MenuItem>
        ))}
      </Field>
      {meta.touched && meta.error ? (
        <div className={styles.error}>{meta.error}</div>
      ) : null}
    </>
  );
};
