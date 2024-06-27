import styles from './GeneralButton.module.scss';

const GeneralButton = ({ svg, text, action, color, disabled }) => {
  const colorClasses = {
    green: 'btnGreen',
    gray: 'btnGray',
    red: 'btnRed',
    default: 'btnWhite',
  };

  const btnClass = `${styles.btn} ${styles[colorClasses[color] || colorClasses.default]}`;

  return (
    <button disabled={disabled} className={btnClass} onClick={action}>
      {svg}
      {text}
    </button>
  );
};

export default GeneralButton;
