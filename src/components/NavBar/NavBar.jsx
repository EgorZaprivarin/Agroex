import { NavLink } from 'react-router-dom';

import LeafSVG from '../SVGComponents/LeafSVG';
import styles from './NavBar.module.scss';

export const NavBar = () => {
  const changeActiveTab = ({ isActive }) => (isActive ? styles.active : '');

  const linkArray = ['/vegetables', '/fruits', '/crops', '/dry_fruits'];

  return (
    <ul className={styles.list}>
      {linkArray.map((link, index) => (
        <NavLink key={index} end to={link} className={changeActiveTab}>
          {({ isActive }) => (
            <>
              <LeafSVG active={isActive} />
              <div className={styles.link__text}>
                {link
                  .replace(/^\/|_/g, ' ')
                  .replace(/\b\w/g, (char) => char.toUpperCase())}
              </div>
            </>
          )}
        </NavLink>
      ))}
    </ul>
  );
};
