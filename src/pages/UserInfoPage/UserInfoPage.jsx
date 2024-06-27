import { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ArrowBack } from '@mui/icons-material';
import { deepOrange } from '@mui/material/colors';
import { Avatar } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/system';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { ConfirmDeleteModal, SuccessSnackBar } from '../../components/Modals';
import { Context } from '../../context/context';
import { Services } from '../../services/Services.js';
import styles from './UserInfoPage.module.scss';
import GeneralButton from '../../partials/GeneralButton/GeneralButton.jsx';

const theme = createTheme({
  components: {
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: '0.75rem',
        },
      },
    },
  },
});

const UserInfoPage = () => {
  const { rows, setRows } = useContext(Context);
  const { id } = useParams();
  const navigate = useNavigate();
  const { deleteUser, editUser } = Services();

  const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  const [inputs, setInputs] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'USER',
  });

  console.log(inputs);

  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    const currentUser = rows.find((user) => user.id === id);
    if (currentUser) {
      setInputs(currentUser);
      setAvatarUrl(currentUser.avatarUrl);
    }
  }, []);

  useEffect(() => {
    if (successMessage.length) {
      setOpenSuccessAlert(true);
    }
  }, [successMessage]);

  const goBack = () => {
    navigate(-1);
  };

  const openDeleteModal = () => {
    setIsOpenModal(true);
  };

  const closeDeleteModal = () => {
    setIsOpenModal(false);
  };

  const removeUser = (id) => {
    deleteUser(id).then(() => {
      const newArray = rows.filter((item) => item.id !== id);
      setRows(newArray);
      setSuccessMessage('User has been successfully deleted');
      const showSnackbarID = setTimeout(() => {
        goBack();
        clearTimeout(showSnackbarID);
      }, 1500);
      closeDeleteModal();
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={styles.wrapper}>
        <div className={styles.main}>
          <div className={styles.user__header}>
            <button className={styles.backBtn} onClick={goBack}>
              <ArrowBack />
            </button>
            <h1 className={styles.title}>
              {inputs.firstName} {inputs.lastName}
            </h1>
          </div>

          <div className={styles.user__info}>
            <p className={styles.user__subHeader}>User Details</p>
            <div className={styles.user__data}>
              <Avatar
                src={avatarUrl || ''}
                className={styles.user__avatar}
                sx={{
                  bgcolor: deepOrange[500],
                  width: 160,
                  height: 160,
                  fontSize: 64,
                }}
              >
                {inputs.firstName &&
                  inputs.lastName &&
                  `${inputs.firstName[0]}${inputs.lastName[0]}`}
              </Avatar>
              <div className={styles.user__inputs}>
                <TextField
                  className={styles.formHelperText}
                  size="small"
                  disabled
                  id="outlined-disabled"
                  name="firstName"
                  label="First name"
                  value={inputs.firstName || ''}
                />
                <TextField
                  size="small"
                  disabled
                  id="outlined-disabled"
                  name="lastName"
                  label="Last name"
                  value={inputs.lastName || ''}
                />
                <TextField
                  size="small"
                  disabled
                  id="outlined-disabled"
                  name="email"
                  label="Email"
                  value={inputs.email}
                />
                <TextField
                  size="small"
                  disabled
                  id="outlined-disabled"
                  name="role"
                  label="Role"
                  value={inputs.role}
                />
                <div className={styles.user__buttons}>
                  <GeneralButton
                    action={() => openDeleteModal()}
                    svg={<DeleteForeverIcon color="error" />}
                    text="Delete account"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <ConfirmDeleteModal
          open={isOpenModal}
          onClose={closeDeleteModal}
          action={() => removeUser(id)}
          message={'Are you sure you want to delete the user?'}
        />
        <SuccessSnackBar
          open={openSuccessAlert}
          setOpen={setOpenSuccessAlert}
          message={successMessage}
        />
      </div>
    </ThemeProvider>
  );
};

export default UserInfoPage;
