import { useState } from 'react';

import { resetPassword } from 'aws-amplify/auth';

import Dialog from '@mui/material/Dialog';

import styles from './ResetPasswordModal.module.scss';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import styled from '@emotion/styled';

const CustomTextField = styled(TextField)({
  width: '100%',
  outline: 'none',
  marginBottom: '4px',
  '& .MuiInputBase-root': {
    height: '44px',
  },
});
const ResetPasswordModal = ({
  open,
  close,
  showPassword,
  setShowPassword,
  setOpenConfirmationModal,
  userEmail,
  setTimeLeft,
  setChangingAttribute,
  newPassword,
  setNewPassword
}) => {
  const passwordRegExp = /^(?=.*\d)(?=.*[^\w\s])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  const isDisabled = !passwordRegExp.test(newPassword);

  const handleResetPassword = async () => {
    try {
      await resetPassword({ username: userEmail });
      setChangingAttribute('password');
      setTimeLeft(60);
      close(false);
      setOpenConfirmationModal(true);
    } catch (error) {
      console.log(error);
    }
  };
  const handleCancelBtn = () => {
    setNewPassword('');
    close(false);
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword)
  };

  return (
    <Dialog
      open={open}
      onClose={close}>
      <div className={styles.modal}>
        <h3 className={styles.title}>Reset password</h3>
        <div className={styles.row}>
          <label
            htmlFor="password"
            className={styles.inputTitle}>
            Enter new password</label>
          <CustomTextField
            type={showPassword ? 'text' : 'password'}
            name='password'
            id='password'
            onChange={(e) => setNewPassword(e.target.value)}
            value={newPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleShowPassword}
                    onMouseDown={handleShowPassword}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className={styles.requirementsWrapper}>
          <ul className={styles.requirementsList}>
            <li>Must be at least 8 characters</li>
            <li>Should have at least 1 uppercase letter</li>
            <li>Should have at least 1 lowercase letter</li>
            <li>Should have at least 1 number</li>
            <li>Should have at least 1 special character</li>
          </ul>
        </div>
        <div className={styles.buttons}>
          <button
            className={styles.cancelBtn}
            onClick={handleCancelBtn}>
            cancel
          </button>
          <button
            disabled={isDisabled}
            className={styles.nextBtn}
            onClick={handleResetPassword} >
            next
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default ResetPasswordModal;