import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../../context/context.js';

import { Services } from '../../../services/Services.js';

import { updateUserAttributes, deleteUser } from 'aws-amplify/auth';
import { currentSession } from '../../../helpers/cognito/currentSession.js';
import { refreshCurrentSession } from '../../../helpers/cognito/refreshCurrentSession.js';

import TextField from '@mui/material/TextField';
import { Avatar } from '@mui/material';
import { grey } from '@mui/material/colors';
import { IconButton } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Edit } from '@mui/icons-material';

import {
  ChangePasswordModal,
  ConfirmDeleteModal,
  SuccessSnackBar,
  ConfirmationCodeModal,
  ResetPasswordModal,
} from '../../../components/Modals';
import validationSchemaForUserAccount from '../../../helpers/validationSchemaForUserAccount.js';

import capitalizeFirstLetter from '../../../helpers/capitalizeFirstLetter.js';

import GeneralButton from '../../../partials/GeneralButton/GeneralButton';
import PencilSvg from '../../../components/SVGComponents/PencilSvg';
import LockSvg from '../../../components/SVGComponents/LockSvg';
import CheckMarkSvg from '../../../components/SVGComponents/CheckMarkSvg';

import styles from './MyAccountPage.module.scss';

const MyAccountPage = () => {
  const { getUserById, addUserImage } = Services();

  const { userData, setUserData, userAvatar, setUserAvatar, setAuth } =
    useContext(Context);

  const [newUserAvatarPreview, setNewUserAvatarPreview] = useState(null);
  const [newUserAvatar, setNewUserAvatar] = useState(null);
  const [initialValue, setInitialValue] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });
  const [values, setValues] = useState({
    first_name: userData.given_name || '',
    last_name: userData.family_name || '',
    email: userData.email || '',
  });
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openChangePassModal, setOpenChangePassModal] = useState(false);
  const [openSuccessBar, setOpenSuccessBar] = useState(false);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [openResetPasswordModal, setOpenResetPasswordModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [incorrectPassword, setIncorrectPassword] = useState(false);
  const [changingAttribute, setChangingAttribute] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  const isDisabledSaveBtn =
    Object.values(validationErrors).length ||
    (initialValue.first_name === values.first_name &&
      initialValue.last_name === values.last_name &&
      initialValue.email === values.email &&
      !newUserAvatar);

  const userDataFromCognitoIsChanged =
    initialValue.first_name !== values.first_name ||
    initialValue.last_name !== values.last_name ||
    initialValue.email !== values.email;

  const userDataFromCognitoExceptEmailIsChanged =
    initialValue.first_name !== values.first_name ||
    initialValue.last_name !== values.last_name;

  useEffect(() => {
    setValues({
      first_name: userData.given_name || '',
      last_name: userData.family_name || '',
      email: userData.email || '',
    });
  }, [userData]);

  useEffect(() => {
    if (isEditing) {
      try {
        validationSchemaForUserAccount().validateSync(values, {
          abortEarly: false,
        });
        setValidationErrors({});
      } catch (validationError) {
        const errors = validationError.inner.reduce((acc, error) => {
          acc[error.path] = error.message;

          return acc;
        }, {});
        setValidationErrors(errors);
      }
    }
  }, [values]);

  const getUserData = async () => {
    const userData = await currentSession();

    setUserData(userData);
  };

  const getUserAvatar = async (userId) => {
    const res = await getUserById(userId);

    setUserAvatar(res.avatarUrl);
  };

  const handleUpdateUserAttributes = async (
    updatedEmail,
    updatedFirstName,
    updatedLastName,
  ) => {
    try {
      await updateUserAttributes({
        userAttributes: {
          email: updatedEmail,
          given_name: updatedFirstName,
          family_name: updatedLastName,
        },
      });
      // handle next steps
      setIsEditing(false);

      if (initialValue.email !== values.email) {
        if (userDataFromCognitoExceptEmailIsChanged) {
          createSuccessfulMessage();
          setOpenSuccessBar(true);
        }
        setChangingAttribute('email');
        setTimeLeft(60);
        setOpenConfirmationModal(true);
      } else {
        await refreshCurrentSession();
        await getUserData();
        createSuccessfulMessage();
        setOpenSuccessBar(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateUserImage = () => {
    const formData = new FormData();
    formData.append('file', newUserAvatar);

    addUserImage(formData, userData.sub)
      .then(async () => {
        setIsEditing(false);
        setSuccessMessage('User avatar has been successfully updated');
        setOpenSuccessBar(true);

        await getUserAvatar(userData.sub);

        setNewUserAvatarPreview(null);
        setNewUserAvatar(null);
      })
      .catch((e) => console.log(e));
  };

  const handleEdit = () => {
    if (isEditing) {
      if (userDataFromCognitoIsChanged) {
        handleUpdateUserAttributes(
          values.email,
          values.first_name,
          values.last_name,
        );
      }
      if (newUserAvatar) {
        handleUpdateUserImage();
      }
    } else {
      setIsEditing(true);
      setInitialValue({
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
      });
    }
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUser();
      setAuth(null);
      setOpenDeleteModal(false);
      navigate('/login');
    } catch (error) {
      console.log(error);
    }
  };

  const onClickCancel = () => {
    setIsEditing(false);
    setValidationErrors({});
    setValues({
      first_name: initialValue.first_name,
      last_name: initialValue.last_name,
      email: initialValue.email,
    });
    setNewUserAvatarPreview(null);
    setNewUserAvatar(null);
  };

  const handleInputsChange = (event) => {
    const { name, value } = event.target;
    setValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setNewUserAvatarPreview(reader.result);
      setNewUserAvatar(file);
    };
    reader.readAsDataURL(file);

    e.target.value = '';
  };

  const handleClearPasswordFields = () => {
    setPasswords({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    });
  };

  const createSuccessfulMessage = () => {
    let successMessage = '';
    let counter = 0;

    for (let key in values) {
      if (key !== 'email' && values[key] !== initialValue[key]) {
        const changedFieldName = key.replace('_', ' ');

        if (counter > 0) {
          successMessage += `, ${changedFieldName}`;
        } else {
          successMessage += changedFieldName;
        }

        counter++;
      }
    }

    counter > 1
      ? (successMessage += ' have been successfully updated')
      : (successMessage += ' has been successfully updated');

    successMessage = capitalizeFirstLetter(successMessage);

    setSuccessMessage(successMessage);
  };

  return (
    <div className={styles.content}>
      <div className={styles.personalData}>
        <h2 className={styles.sectionTitle}>Personal data</h2>
        <div className={styles.info}>
          <div className={styles.avatar}>
            <input
              accept="image/*"
              id="icon-button-file"
              type="file"
              style={{ display: 'none' }}
              onChange={handleAvatarChange}
            />
            {isEditing && (
              <label className={styles.badge} htmlFor="icon-button-file">
                <IconButton
                  sx={{
                    width: '24px',
                    height: '24px',
                    border: '1px solid gray',
                  }}
                  aria-label="upload picture"
                  component="span"
                >
                  <Edit sx={{ color: '#183C48', width: '1rem' }} />
                </IconButton>
              </label>
            )}
            <Avatar
              alt="Avatar"
              src={newUserAvatarPreview || userAvatar}
              sx={{
                bgcolor: grey,
                width: '100%',
                height: '100%',
              }}
            />
          </div>
          <div className={styles.fields}>
            <TextField
              sx={{ width: '100%', height: '42px', marginBottom: '30px' }}
              name="first_name"
              disabled={!isEditing}
              size="small"
              label="First Name"
              value={values.first_name}
              onChange={handleInputsChange}
              error={!!validationErrors.first_name}
              helperText={validationErrors.first_name}
            />
            <TextField
              sx={{ width: '100%', height: '42px', marginBottom: '30px' }}
              name="last_name"
              disabled={!isEditing}
              size="small"
              label="Last Name"
              value={values.last_name}
              onChange={handleInputsChange}
              error={!!validationErrors.last_name}
              helperText={validationErrors.last_name}
            />
            <TextField
              sx={{ width: '100%', height: '42px', marginBottom: '30px' }}
              name="email"
              disabled={!isEditing}
              size="small"
              label="email"
              type="email"
              value={values.email}
              onChange={handleInputsChange}
              error={!!validationErrors.email}
              helperText={validationErrors.email}
            />
            <div className={styles.buttonsBlock}>
              {isEditing ? (
                <>
                  <GeneralButton text="Cancel" action={onClickCancel} />
                  <GeneralButton
                    className={styles.btnSave}
                    svg={<CheckMarkSvg disabled={isDisabledSaveBtn} />}
                    color={isDisabledSaveBtn ? 'gray' : 'green'}
                    text={'Save changes'}
                    action={handleEdit}
                    disabled={isDisabledSaveBtn}
                  />
                </>
              ) : (
                <GeneralButton
                  className={styles.btnSave}
                  svg={<PencilSvg />}
                  color={'white'}
                  text={'Edit data'}
                  action={handleEdit}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.security}>
        <h2 className={styles.sectionTitle}>Security</h2>
        <GeneralButton
          svg={<LockSvg />}
          text="Change password"
          action={() => {
            handleClearPasswordFields();
            setShowPassword(false);
            setIncorrectPassword(false);
            setOpenChangePassModal(true);
          }}
        />
        <GeneralButton
          svg={<DeleteForeverIcon color="error" />}
          text="Delete account"
          action={() => {
            setOpenDeleteModal(true);
          }}
        />
      </div>
      <ConfirmDeleteModal
        message="Are you sure you want to delete your account?"
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        action={handleDeleteUser}
      />
      <SuccessSnackBar
        open={openSuccessBar}
        setOpen={setOpenSuccessBar}
        message={successMessage}
      />
      <ChangePasswordModal
        open={openChangePassModal}
        onClose={() => setOpenChangePassModal(false)}
        values={passwords}
        setValues={setPasswords}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        setOpenSuccessBar={setOpenSuccessBar}
        incorrectPassword={incorrectPassword}
        setIncorrectPassword={setIncorrectPassword}
        setOpenResetPasswordModal={setOpenResetPasswordModal}
        setSuccessMessage={setSuccessMessage}
      />
      <ConfirmationCodeModal
        open={openConfirmationModal}
        close={setOpenConfirmationModal}
        setOpenSuccessBar={setOpenSuccessBar}
        getUserData={getUserData}
        setIsEditing={setIsEditing}
        timeLeft={timeLeft}
        setTimeLeft={setTimeLeft}
        email={values.email}
        changingAttribute={changingAttribute}
        setChangingAttribute={setChangingAttribute}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        setOpenResetPasswordModal={setOpenResetPasswordModal}
        setSuccessMessage={setSuccessMessage}
        userDataFromCognitoExceptEmailIsChanged={
          userDataFromCognitoExceptEmailIsChanged
        }
      />
      <ResetPasswordModal
        open={openResetPasswordModal}
        close={setOpenResetPasswordModal}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        setOpenConfirmationModal={setOpenConfirmationModal}
        userEmail={values.email}
        setTimeLeft={setTimeLeft}
        setChangingAttribute={setChangingAttribute}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
      />
    </div>
  );
};

export default MyAccountPage;
