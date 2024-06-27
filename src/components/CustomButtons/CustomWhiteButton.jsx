import styles from './CustomWhiteButton.module.scss';

export const CustomWhiteButton = ({ content, img, disabled = false, hint }) => {
  return (
    <button className={styles.button} disabled={disabled}>
      {img && <img src={img} alt='icon' />}
      {content}
      { hint && <p className={styles.disabledButtonHint}>{hint}</p>}
    </button>
  );
};