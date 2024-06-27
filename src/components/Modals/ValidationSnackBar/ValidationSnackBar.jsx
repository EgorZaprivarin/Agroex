import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';

const ValidationSnackbar = ({ open, setOpenValidateAlert, message }) => {
  const handleClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenValidateAlert(false);
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {Array.isArray(message) ? message.join(', ') : message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ValidationSnackbar;
