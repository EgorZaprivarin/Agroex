import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { FormHelperText } from '@mui/material';
import { randomId } from '@mui/x-data-grid-generator';

import { Context } from '../../../context/context';

const CreateUserModal = ({ open, onClose }) => {
  const { rows, setRows } = useContext(Context);
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .matches(/^[^0-9]+$/, 'Field should not contain numbers')
      .required('Name is required'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    role: Yup.string().oneOf(['Admin', 'User']).required('Role is required'),
  });

  const [userData, setUserData] = useState({
    id: randomId(),
    name: '',
    email: '',
    role: 'User',
  });

  const [errors, setErrors] = useState({});

  const redirectToUserDetails = (route) => {
    navigate(route);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const createNewUser = () => {
    validationSchema
      .validate(userData, { abortEarly: false })
      .then(() => {
        const newArray = [...rows, userData];
        setRows(newArray);
        redirectToUserDetails(`/users/${userData.id}`);
      })
      .catch((validationErrors) => {
        const newErrors = {};
        validationErrors.inner.forEach((error) => {
          if (!newErrors[error.path]) {
            newErrors[error.path] = error.message;
          }
        });
        setErrors(newErrors);
      });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add User</DialogTitle>
      <DialogContent>
        <TextField
          sx={{ marginTop: '24px' }}
          name="name"
          label="Name"
          value={userData.name}
          onChange={handleInputChange}
          fullWidth
          error={!!errors.name}
          helperText={errors.name ? errors.name : null}
        />
        <TextField
          sx={{ marginTop: '24px' }}
          name="email"
          label="Email"
          type="email"
          value={userData.email}
          onChange={handleInputChange}
          fullWidth
          error={!!errors.email}
          helperText={errors.email ? errors.email : null}
        />
        <FormControl sx={{ marginTop: '24px' }} fullWidth error={!!errors.role}>
          <Select
            name="role"
            value={userData.role}
            onChange={handleInputChange}
            fullWidth
          >
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="User">User</MenuItem>
          </Select>
          {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button
          sx={{ color: '#51ACAE', borderColor: '#51ACAE' }}
          variant="outlined"
          onClick={createNewUser}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateUserModal;
