import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { Services } from '../../../services/Services';
import { Context } from '../../../context/context';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextareaAutosize from '@mui/material/TextareaAutosize';

import styles from './RejectLotModal.module.scss';

const RejectLotModal = ({ open, onClose, currentLot }) => {
  const { setSuccessMessage } = useContext(Context);
  const navigate = useNavigate();
  const [reason, setReason] = useState('');

  const { editLot } = Services();

  const handleChange = (event) => {
    setReason(event.target.value);
  };

  const onCloseModal = () => {
    onClose();
    setReason('');
  };

  const onRejectLot = () => {
    editLot({
      ...currentLot,
      status: 'REJECTED',
      rejectionReason: reason,
    }).then((res) => {
      console.log(res);
      navigate(-1);
      onClose();
      setSuccessMessage('Lot has been successfully rejected');
    });
  };

  const isButtonDisabled = reason.replace(/\s/g, '').length < 40;

  return (
    <Dialog
      className={styles.modal}
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle sx={{ textAlign: 'center' }}>
        Specify reason for rejection:
      </DialogTitle>
      <DialogContent>
        <TextareaAutosize
          maxRows={4}
          maxLength={200}
          placeholder="The descrition of reason must contain at least 40 characters"
          value={reason}
          onChange={handleChange}
          style={{ width: '100%', height: '100px', resize: 'none' }}
          name="reason"
        />
      </DialogContent>
      <DialogActions sx={{ margin: '0 auto' }}>
        <Button variant="text" onClick={onCloseModal}>
          Cancel
        </Button>
        <Button
          disabled={isButtonDisabled}
          onClick={onRejectLot}
          sx={{
            color: '#51ACAE',
          }}
          variant="text"
        >
          Reject lot
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RejectLotModal;
