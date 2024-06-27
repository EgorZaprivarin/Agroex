import { useNavigate } from 'react-router-dom';

import { CustomGreenButton } from '../CustomButtons/CustomGreenButton.jsx';

import styles from './AccessDenial.module.scss';

const AccessDenial = ({ errorCode, errorText, title, text}) => {
  const navigate = useNavigate()

  const toPrevPage = () => {
    navigate(-1);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <div>
          <div className={styles.errorStatus}>
            <h2 className={styles.statusCode}>{errorCode}</h2>
            <p className={styles.statusText}>{errorText}</p>
          </div>
          <div className={styles.errorInfo}>
            <h4 className={styles.title}>{title}</h4>
            <p className={styles.text}>{text}</p>
            <CustomGreenButton content='Back to previous page' action={toPrevPage}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessDenial;