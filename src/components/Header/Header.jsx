import { useState, useEffect, useRef, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Context } from '../../context/context.js';

import AvatarWithDropDown from '../AvatarWithDropDown/AvatarWithDropDown';
import LanguageSelection from '../LanguageSelection/LanguageSelection.jsx';
import SearchBar from '../SearchBar/SearchBar.jsx';

import logo from '../../assets/icons/header/logo.svg';
import notifications from '../../assets/icons/header/notifications.svg';
import LoginIcon from '@mui/icons-material/Login';

import styles from './Header.module.scss';

export const Header = () => {
  const { auth, setAuth, setFiles, userData, setEditMode, setUpdatedLot } =
    useContext(Context);

  const [width, setWidth] = useState(window.innerWidth);

  const ref = useRef();

  const location = useLocation();
  const navigate = useNavigate();

  const isAdmin =
    auth &&
    userData['cognito:groups'] &&
    userData['cognito:groups'].some((item) => item === 'ADMIN');

  useEffect(() => {
    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  const createNewLot = () => {
    setFiles([]);
    setEditMode(false);
    navigate('/new_lot', { state: location.pathname });
    setUpdatedLot({});
  };

  const resizeHandler = () => {
    const { clientWidth } = ref.current || {};
    setWidth(clientWidth);
  };

  const newAdBtn = location.pathname !== '/new_lot' &&
    location.pathname !== '/new_lot_preview' &&
    location.pathname !== '/update_lot' && (
      <button onClick={createNewLot}>
        <span>+</span>
        {width > 992 ? 'Advertisement' : 'Ad'}
      </button>
    );

  const authorizedUserPanel = () => {
    if (
      auth &&
      userData['cognito:groups'] &&
      userData['cognito:groups'].some((item) => item === 'ADMIN')
    ) {
      return (
        <div className={`${styles.item} ${styles.avatar}`}>
          Admin
          <AvatarWithDropDown />
        </div>
      );
    }

    if (auth) {
      return (
        <>
          <LanguageSelection />
          {newAdBtn}
          <div className={`${styles.item} ${styles.notifications}`}>
            <img src={notifications} alt="notifications" />
          </div>
          <div className={`${styles.item} ${styles.avatar}`}>
            <AvatarWithDropDown role="user" />
          </div>
        </>
      );
    }

    return (
      <Link to="/login">
        <div className={styles.item}>
          Log in
          <LoginIcon />
        </div>
      </Link>
    );
  };

  const renderSearch = () => {
    return (
      auth &&
      userData['cognito:groups'] &&
      !userData['cognito:groups'].includes('ADMIN') && <SearchBar />
    );
  };

  return (
    <div className={styles.wrapper} ref={ref}>
      <header className={styles.header}>
        <div className={styles.leftSide}>
          <Link to={isAdmin ? '/admin' : '/'}>
            <h1 className={styles.logo}>
              <img src={logo} alt="logo" />
              AGROEX
            </h1>
          </Link>
          {renderSearch()}
        </div>
        <div className={styles.rightSide}>{authorizedUserPanel()}</div>
      </header>
    </div>
  );
};
