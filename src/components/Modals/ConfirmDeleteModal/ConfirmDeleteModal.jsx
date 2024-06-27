import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

const ConfirmDeleteModal = ({ open, onClose, action, message }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ textAlign: 'center' }}>
        Confirm the operation
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ margin: '0 auto' }}>
        <Button onClick={onClose} sx={{ textAlign: 'center' }} variant="text">
          Cancel
        </Button>
        <Button
          onClick={action}
          sx={{ color: '#38999B', textAlign: 'center' }}
          variant="text"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteModal;
