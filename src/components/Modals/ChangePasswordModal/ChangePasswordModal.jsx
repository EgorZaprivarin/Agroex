import { updatePassword } from 'aws-amplify/auth';

import { Link } from 'react-router-dom';
import styled from '@emotion/styled';

import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  IconButton,
} from '@mui/material';

import { Visibility, VisibilityOff } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';

import styles from './ChangePasswordModal.module.scss';

const CustomTextField = styled(TextField)({
  width: '100%',
  marginTop: '24px',
  '& .MuiInputLabel-root': {
    top: '-5px',
  },
  '& .MuiInputBase-root': {
    height: '44px',
  },
});

const ChangePasswordModal = ({
   open,
   onClose,
   values,
   setValues,
   showPassword,
   setShowPassword,
   setOpenSuccessBar,
   incorrectPassword,
   setIncorrectPassword,
   setOpenResetPasswordModal,
   setSuccessMessage
}) => {
  const passwordRegExp = /^(?=.*\d)(?=.*[^\w\s])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  const disablingSendBtn = !passwordRegExp.test(values.currentPassword)
    || !passwordRegExp.test(values.newPassword)
    || !passwordRegExp.test(values.confirmNewPassword)
    || values.currentPassword === values.newPassword
    || values.newPassword !== values.confirmNewPassword;

  const handleUpdatePassword = async (oldPassword, newPassword) => {
    try {
      setIncorrectPassword(false);
      await updatePassword({ oldPassword, newPassword });

      onClose(true);
      setSuccessMessage('Password has been successfully updated')
      setOpenSuccessBar(true);
    } catch (err) {
      setIncorrectPassword(true);
    }
  };

  const handleSendPasswords = () => {
    handleUpdatePassword(values.currentPassword, values.newPassword)
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleInputsChange = (event) => {
    const { name, value } = event.target;
    setValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCLickResetPassword = () => {
    setShowPassword(false);
    onClose(true);
    setOpenResetPasswordModal(true)
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: { width: '408px', padding: '30px' },
      }}
    >
      <div className={styles.modalTitle}>
        <h2>Change Password</h2>
        <CloseIcon
          onClick={onClose}
          sx={{ fill: '#798787', cursor: 'pointer' }}
        />
      </div>
      <DialogContent sx={{ padding: '0', overflow: 'hidden' }}>
        <form>
          <CustomTextField
            className={incorrectPassword ? styles.incorrectField : null}
            type={showPassword ? 'text' : 'password'}
            name='currentPassword'
            label="Current password"
            onChange={handleInputsChange}
            value={values.currentPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {incorrectPassword && <p className={styles.incorrect}>incorrect password</p>}
          <p
            className={styles.forgotLink}
            onClick={handleCLickResetPassword}>
            Forgot your password?
          </p>
          <CustomTextField
            type="password"
            label="New password"
            name='newPassword'
            onChange={handleInputsChange}
            value={values.newPassword}
          />
          <div className={styles.requirementsWrapper}>
            <ul className={styles.requirementsList}>
              <li>Must be at least 8 characters</li>
              <li>Should have at least 1 uppercase letter</li>
              <li>Should have at least 1 lowercase letter</li>
              <li>Should have at least 1 number</li>
              <li>Should have at least 1 special character</li>
            </ul>
          </div>
          <CustomTextField
            style={{ marginTop: '15px' }}
            type="password"
            name='confirmNewPassword'
            label="Confirm new password"
            onChange={handleInputsChange}
            value={values.confirmNewPassword}
          />
        </form>
      </DialogContent>
      <DialogActions className={styles.setPassword}>
        <Button
          onClick={handleSendPasswords}
          disabled={disablingSendBtn}
          sx={{
            boxSizing: 'border-box',
            width: '100%',
            height: '40px',
            marginTop: '20px',
            backgroundColor: '#74d2c9',
            color: '#ffffff',
            fontFamily: 'IBMPlexSansMedium',
            fontSize: '1rem',
            lineHeight: '1.5rem',
            letterSpacing: '0.3px',
            textAlign: 'center',
            textTransform: 'none',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: '#38999B',
              color: '#fff',
            },
            '&:disabled': {
              backgroundColor: '#adadad',
              color: '#fff',
            },
          }}
        >
          Set new password
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangePasswordModal;
