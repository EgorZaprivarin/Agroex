import { Outlet } from 'react-router-dom';
import { NavBar } from '../NavBar/NavBar.jsx';

import styles from './LayoutMainPage.module.scss';

const LayoutMainPage = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.main}>
                <NavBar />
                <Outlet />
            </div>
        </div>
    );
};

export default LayoutMainPage;