import { useState, useEffect } from 'react';

import {
  updateUserAttribute,
  confirmUserAttribute,
  confirmResetPassword,
  resetPassword,
} from 'aws-amplify/auth';
import { refreshCurrentSession } from '../../../helpers/cognito/refreshCurrentSession.js';

import Dialog from '@mui/material/Dialog';

import './ConfirmationCodeModal.scss';

const ConfirmationCodeModal = ({
  open,
  close,
  setOpenSuccessBar,
  getUserData,
  setIsEditing,
  timeLeft,
  setTimeLeft,
  email,
  changingAttribute,
  setChangingAttribute,
  newPassword,
  setNewPassword,
  setOpenResetPasswordModal,
  setSuccessMessage,
}) => {
  const [code, setCode] = useState('');
  const [invalidCode, setInvalidCode] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 1);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleChangeCode = (e) => {
    setCode(e.target.value);
  };

  const handleCancel = async () => {
    setCode('');
    setChangingAttribute('');
    setInvalidCode(false);
    setTimeLeft(0);
    close(false);

    if (changingAttribute === 'password') {
      setOpenResetPasswordModal(true);
    } else if (changingAttribute === 'email') {
      await refreshCurrentSession();
      await getUserData();
    }
  };

  const handleSendCode = () => {
    setInvalidCode(false);

    switch (changingAttribute) {
      case 'email':
        confirmUserAttribute({
          userAttributeKey: changingAttribute,
          confirmationCode: code,
        })
          .then(async () => {
            await refreshCurrentSession();
            await getUserData();

            setCode('');
            setChangingAttribute('');
            setIsEditing(false);
            close(false);
            setSuccessMessage('Email has been successfully updated');
            setOpenSuccessBar(true);
          })
          .catch(() => setInvalidCode(true));
        break;
      case 'password':
        confirmResetPassword({
          username: email,
          confirmationCode: code,
          newPassword: newPassword,
        })
          .then(async () => {
            await refreshCurrentSession();

            setCode('');
            setNewPassword('');
            setChangingAttribute('');
            close(false);
            setSuccessMessage('Password has been successfully updated');
            setOpenSuccessBar(true);
          })
          .catch(() => setInvalidCode(true));
        break;
      default:
        return;
    }
  };

  const handleResendCode = () => {
    switch (changingAttribute) {
      case 'email':
        handleUpdateUserAttribute('email', email);
        break;
      case 'password':
        handleResetPassword(email);
        break;
      default:
        return;
    }
  };

  const handleResetPassword = async (email) => {
    setTimeLeft(60);
    try {
      await resetPassword({ username: email });
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateUserAttribute = async (attributeKey, value) => {
    setTimeLeft(60);
    try {
      await updateUserAttribute({
        userAttribute: {
          attributeKey,
          value,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open} onClose={close} className={open ? 'visible' : 'hidden'}>
      <div className="modal">
        <h3>Enter the code from the email</h3>
        <input
          className={invalidCode ? 'invalidInput' : ''}
          type="text"
          value={code}
          onChange={handleChangeCode}
        />
        {invalidCode && <p className="invalid">incorrect code</p>}
        {timeLeft > 0 && (
          <p className="resendTimerText">
            you can resend the code in {timeLeft} sec...
          </p>
        )}
        {timeLeft === 0 && (
          <button className="resendBtn" onClick={handleResendCode}>
            Resend code
          </button>
        )}
        <div className="controlPanel">
          <button className="cancelBtn" onClick={handleCancel}>
            cancel
          </button>
          <button className="sendBtn" onClick={handleSendCode}>
            send
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default ConfirmationCodeModal;
