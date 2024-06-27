import { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';

import { Services } from '../../services/Services.js';

import getSorting from '../../helpers/sortList.js';

import styles from './SwitcherNumberOfLotsPerPage.module.scss';

const SwitcherNumberOfLotsPerPage = ({
  lotsPerPage,
  setLotsPerPage,
  setCurrentPage,
  setLotList,
  currentSorting,
  encodedFilters,
}) => {
  const { getLotsBySubcategory } = Services();

  const [showOptionMenu, setShowOptionMenu] = useState(false);

  const { product } = useParams();

  const optionList = [10, 15, 20];

  const handleChangeOption = async (e) => {
    const indexOF = product.indexOf('=');
    const id = product.substring(indexOF + 1);
    const lots = await getLotsBySubcategory(
      id,
      encodedFilters,
      0,
      +e.target.innerText,
      getSorting(currentSorting),
    );

    setLotList(lots);
    setLotsPerPage(+e.target.innerText);
    setCurrentPage(0);
  };

  const handleShowOptionMenu = () => {
    setShowOptionMenu(!showOptionMenu);
  };

  const renderOptionMenu = optionList.map((option, index) => {
    return (
      <li
        key={index}
        className={option === lotsPerPage ? styles.currentOption : null}
        onClick={handleChangeOption}
      >
        {option}
      </li>
    );
  });

  return (
    <div className={styles.switcher}>
      <p className={styles.title}>Lots per page:</p>
      <div
        className={styles.numberOfLotsWrapper}
        onClick={handleShowOptionMenu}
      >
        <p className={styles.numberOfLots}>{lotsPerPage}</p>
        <div
          className={
            showOptionMenu
              ? `${styles.arrowUp} ${styles.arrowWrapper}`
              : styles.arrowWrapper
          }
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 14L8 10H16L12 14Z" fill="#131314" />
          </svg>
        </div>
        <ul
          className={
            showOptionMenu
              ? `${styles.numberOfLotsMenu} ${styles.visibleOptionMenu}`
              : styles.numberOfLotsMenu
          }
        >
          {renderOptionMenu}
        </ul>
      </div>
    </div>
  );
};

export default SwitcherNumberOfLotsPerPage;
