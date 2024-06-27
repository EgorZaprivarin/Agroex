import Dialog from '@mui/material/Dialog';

import styles from './CustomModal.module.scss';

export const CustomModal = ({ open, close }) => {
  return (
    <Dialog open={open} onClose={close}>
      <div className={styles.modal}>
        <h3>Discard edits?</h3>
        <p>If you go back now, you’ll lose all of your edits you’ve made.</p>
        <button
          name="discard"
          className={styles.discard}
          onClick={(e) => close(e)}
        >
          Discard
        </button>
        <button
          name="cancel"
          className={styles.cancel}
          onClick={(e) => close(e)}
        >
          Cancel
        </button>
      </div>
    </Dialog>
  );
};
