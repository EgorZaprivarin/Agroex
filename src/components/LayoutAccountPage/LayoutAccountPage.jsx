import { useContext, useEffect, useState } from 'react';
import { Context } from '../../context/context.js';

import { Outlet } from 'react-router-dom';

import { currentSession } from '../../helpers/cognito/currentSession.js';

import AccountSidePanel from '../AccountSidePanel/AccountSidePanel';

import styles from './LayoutAccountPage.module.scss';

const LayoutAccountPage = () => {
  const { userData } = useContext(Context);

  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <div className={styles.accountHeader}>
          <h1 className={styles.title}>{`${userData.given_name} ${userData.family_name}`}</h1>
        </div>
        <div className={styles.container}>
          <AccountSidePanel userId={userData.sub} />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default LayoutAccountPage;
