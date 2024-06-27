import { useContext } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

import { Context } from '../../context/context.js';

import { signOut } from '@aws-amplify/auth';

import FlowerSvg from '../../components/SVGComponents/FlowerSvg';
import HammerSvg from '../../components/SVGComponents/HammerSvg';
import AccountSvg from '../../components/SVGComponents/AccountSvg';
import LogOutSvg from '../../components/SVGComponents/LogOutSvg';

import styles from './AccountSidePanel.module.scss';

const AccountSidePanel = ({ userId }) => {
  const { setAuth } = useContext(Context);

  const navigate = useNavigate();
  const location = useLocation().pathname;

  const changeActiveTab = ({ isActive }) =>
    isActive ? styles.activeSideTab : '';

  const handleSignOut = () => {
    signOut();
    setAuth(null);

    navigate('/login');
  };

  return (
    <div className={styles.sidePannel}>
      <ul className={styles.sideTabs}>
        <NavLink to={`/account/my_advertisement/${userId}/Active`}
                 className={location.startsWith(`/account/my_advertisement/${userId}`) ? styles.activeSideTab : ''}>
          {({ isActive }) => (
            <li className={styles.sideTab}>
              <FlowerSvg active={isActive} />
              <div className={styles.title}>My advertisements</div>
            </li>
          )}
        </NavLink>
        <NavLink to={`/account/betting/${userId}`} className={changeActiveTab}>
          {({ isActive }) => (
            <li className={styles.sideTab}>
              <HammerSvg active={isActive} />
              <div className={styles.title}>Betting</div>
            </li>
          )}
        </NavLink>
        <NavLink to={`/account/profile/${userId}`} className={changeActiveTab}>
          {({ isActive }) => (
            <li className={styles.sideTab}>
              <AccountSvg active={isActive} />
              <div className={styles.title}>My account</div>
            </li>
          )}
        </NavLink>
      </ul>
      <div className={styles.logOut} onClick={handleSignOut}>
        <LogOutSvg />
        <div className={styles.title}>Log out</div>
      </div>
    </div>
  );
};

export default AccountSidePanel;
