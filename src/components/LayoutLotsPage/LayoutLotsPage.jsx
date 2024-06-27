import { Outlet } from 'react-router-dom';
import { LotsBreadcrumbs } from '../Breadcrumbs/LotsBreadcrumbs.jsx';

import styles from './LayoutLotsPage.module.scss';
const LayoutLotsPage = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <LotsBreadcrumbs />
        <Outlet />
      </div>
    </div>
  );
};

export default LayoutLotsPage;
