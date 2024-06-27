import { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';

import { Services } from '../../services/Services.js';

import getSorting, { sortList } from '../../helpers/sortList.js';

import styles from './Sorting.module.scss';

import arrow from '../../assets/icons/lotsPage/ShowSortingMenu.svg';

const Sorting = ({
  currentSorting,
  setCurrentSorting,
  setCurrentPage,
  lotsPerPage,
  setLotList,
  encodedFilters,
}) => {
  const { getLotsBySubcategory } = Services();

  const [showSortingMenu, setShowSortingMenu] = useState(false);

  const { product } = useParams();

  const handleShowSortingMenu = () => {
    setShowSortingMenu(!showSortingMenu);
  };

  const handleChangeSort = async (e) => {
    const indexOF = product.indexOf('=');
    const id = product.substring(indexOF + 1);
    const lots = await getLotsBySubcategory(
      id,
      encodedFilters,
      0,
      lotsPerPage,
      getSorting(e.target.innerText),
    );

    setLotList(lots);
    setCurrentSorting(e.target.innerText);
    setCurrentPage(0);
  };

  const renderSortingList = sortList.map((item, index) => {
    const text = Object.keys(item);

    return (
      <p
        key={index}
        className={text[0] === currentSorting ? styles.activeSort : null}
        onClick={handleChangeSort}
      >
        {text}
      </p>
    );
  });

  return (
    <div className={styles.sortFilters} onClick={handleShowSortingMenu}>
      <p>{currentSorting}</p>
      <img
        className={showSortingMenu ? styles.arrowUp : null}
        src={arrow}
        alt="arrow"
      />
      <div
        className={
          showSortingMenu
            ? `${styles.sortingMenu} ${styles.visibleSortingMenu}`
            : styles.sortingMenu
        }
      >
        {renderSortingList}
      </div>
    </div>
  );
};

export default Sorting;
