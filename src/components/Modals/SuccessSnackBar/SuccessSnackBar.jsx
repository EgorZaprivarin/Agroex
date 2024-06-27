import { useContext } from 'react';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import { Context } from '../../../context/context';

const SuccessSnackBar = ({ open, setOpen, message }) => {
  const { setSuccessMessage } = useContext(Context);

  const handleClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    setSuccessMessage('');
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={open}
      autoHideDuration={2500}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        severity="success"
        variant="filled"
        sx={{ width: '100%', backgroundColor: '#38999B' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SuccessSnackBar;
