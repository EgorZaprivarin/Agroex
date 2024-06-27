import styles from './CustomGreenButton.module.scss';

export const CustomGreenButton = ({
  action,
  content,
  img,
  disabled = false,
  type = 'button',
  hint,
}) => {
  return (
    <button
      onClick={action}
      className={styles.button}
      disabled={disabled}
      type={type}
    >
      {img && <img src={img} alt="icon" />}
      {content}
      {hint && <p className={styles.disabledButtonHint}>{hint}</p>}
    </button>
  );
};
